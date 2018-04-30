class Table {
  constructor(table) {
    this.table = table;
  }

  increments(columnName) {
    return `${ columnName } INT NOT NULL PRIMARY KEY AUTO_INCREMENT`;
  }

  _getDefaults() {
    return {
      length:255,
      notNull:true
    }
  }

  field(fieldName,fieldType,config = this._getDefaults()) {
    let fieldStr = `${ fieldName } ${ fieldType.toUpperCase() } ${ this._length(config.length) } `;

    delete config.length;

    for ( const [configKey,configValue] of Object.entries(config) ) {
      fieldStr += ` ${ this['_' + configKey](configValue) } `;
    }

    return fieldStr;
  }

  _notNull(notNull = true) {
    return notNull ? ' NOT NULL ' : '';
  }

  _unique(isUnique = false) {
    return isUnique ? ' UNIQUE ' : '';
  }

  _defaultValue(defConfig) {
    if ( defConfig.isSimpleString ) {
      return `DEFAULT '${ defConfig.value }'`;
    }
    return `DEFAULT ${ defConfig.value }`;
  }

  _length(len) {
    return `(${ len })`;
  }

  _gatherConfigValues(sql,config) {
    let result = '';

    for ( const [configKey,configValue] of Object.entries(config) ) {
      result += ` ${ this['_' + configKey](configValue) } `;
    }

    return result;
  }

  _updateConfigWithDefaultValues(config) {
    const defaultValues = this._getDefaults();

    for ( const [key,value] of Object.entries(defaultValues) ) {
      if ( !config[key] ) {
        config[key] = defaultValues[key];
      }
    }
  }

  timestamps() {
    return [
      'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
      'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP' 
    ].join(',');
  }

  create(...fields) {
    this.createTable = {
      columns:[]
    };

    fields.forEach(x => this.createTable.columns.push(x));
  }

  addColumn(columnName,columnType,config = this._getDefaults()) {
    this._updateConfigWithDefaultValues(config);

    if ( !this.addColumnToTable ) {
      this.addColumnToTable = { columns:[] }
    }

    let sql = `
      ALTER TABLE ${ this.table } 
      ADD ${ columnName } ${ columnType.toUpperCase() } ${ this._length(config.length) }
    `;

    delete config.length;

    sql += this._gatherConfigValues(sql,config);

    this.addColumnToTable.columns.push(sql);
  }

  dropColumn(columnName) {
    if ( !this.dropColumnTable ) {
      this.dropColumnTable = { columns:[] };
    }

    this.dropColumnTable.columns.push(`
      ALTER TABLE ${ this.table }
      DROP COLUMN ${ columnName }
    `);
  }

  dropIfExists() {
    this.dropIfExistsTable = `DROP TABLE  ${ this.table }`;
  }

  compileSQL() {
    if ( this.createTable ) {
      const columns = this.createTable.columns.join(',');

      return `
        CREATE TABLE IF NOT EXISTS ${ this.table } (
          ${ columns }
        )
      `;
    }

    if ( this.addColumnToTable ) {
      return this.addColumnToTable.columns;
    }

    if ( this.dropColumnTable ) {
      return this.dropColumnTable.columns;
    }

    if ( this.dropIfExistsTable ) {
      return this.dropIfExistsTable;
    }

    if ( this.compiledSQL ) {
      return this.compiledSQL;
    }

    throw new Error('Nothing was added to Table object, check your migration file!');
  }
}

module.exports = Table;