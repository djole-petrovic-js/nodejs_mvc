const connection = use('db/connection');
const bluebird = require('bluebird');

class Model {
  static createSelectStmt(tableName,data) {
    let columnsStr = '*';

    if ( data.columns && data.columns > 0 ) {
      columnsStr = data.columns.join('');
    }

    return `SELECT ${ columnsStr } FROM ${ tableName }`;
  }

  static createWhereStmt(data) {
    let whereStr = ' WHERE ';
    const values = [];

    for ( const [columnName,columnValue] of Object.entries(data) ) {
      whereStr += ` ${columnName} = ?`;
      values.push(columnValue);
    }

    return [whereStr,values]
  }

  static async all(data = {}) {
    const tableName = data.tableName ? data.tableName : this.name;
    
    let selectStmt = this.createSelectStmt(tableName,data);
    let whereStmt = '';
    let values = [];

    if ( data.where ) {
      [whereStmt,values] = this.createWhereStmt(data.where);
    }

    const sql = `
      ${ selectStmt }
      ${ whereStmt }
    `;

    return await this.executeQuery(sql,values);
  }

  static async insert(data) {
    const columns = Object.keys(data).map(x => `\`${x}\``).join(',');
    const values = [];

    const vals = Object.values(data).map(x => '?').join(',');

    const sql = `INSERT INTO ${ this.name } (${ columns }) VALUES (${ vals })`;

    return await this.executeQuery(sql,Object.values(data));
  }

  static async delete(data) {
    if ( !data ) {
      throw new Error('When deleting you have to provide arguments.');
    }

    if ( typeof data === 'object' && !data.where ) {
      throw new Error('When deleting and providing object, it needs to have where object');
    }

    const [whereSQL,values] = this.createWhereStmt(data.where);

    const sql = `DELETE FROM ${ data.tableName ? data.tableName : this.name } ${ whereSQL }`;

    return await this.executeQuery(sql,values);
  }

  static async executeQuery(sql,data = []) {
    try {
      const conn = await connection.getConnectionAsync();
      const query = bluebird.promisifyAll(conn);
      const result = await query.queryAsync(sql,data);

      query.release();

      return result;
    } catch(e) {
      throw e;
    }
  }
}

module.exports = Model;