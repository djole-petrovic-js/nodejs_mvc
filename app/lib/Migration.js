const connection = use('db/connection');
const fs = requirePromisified('fs');
const path = require('path');
const { PATHS:{ MIGRATIONS,MODELS } } = require('../../config');
const Table = use('lib/Table');
const Model = use('lib/Model');

class Migration {
  table(tableName,cb) {
    this.table = new Table(tableName);
    cb(this.table);
  }

  static async createMigrationsTable() {
    const sql = `
      CREATE TABLE migrations (
        id int not null primary key auto_increment,
        migration VARCHAR(100) not null
      )
    `;

    return Model.executeQuery(sql);
  }

  static async sortMigrations(files,reverse) {
    files.sort((a,b) => {
      const [orderNumA,orderNumB] = [
        Number(a.split('_')[0]),
        Number(b.split('_')[0])
      ];

      if ( Number.isNaN(a) || Number.isNaN(b) ) {
        throw new Error('When creating migraion files,it needs to start with number, folowed by _ eg. 20_mymigration.js');
      }

      return reverse  ? orderNumB - orderNumA : orderNumA - orderNumB;
    });
  }

  // check if any migrations or rollback needs to be aplied.
  static async checkMigrationStatus() {
    // if set to true, apply all migrations or rollbacks, otherwise just specified ones.
    if ( process.env.MIGRATIONS !== 'true' ) return;

    let migrate, rollback;
  
    if ( process.env.RUN && process.env.RUN !== 'false' ) {
      if ( process.env.RUN === 'true' ) {
        migrate = true;
      } else {
        migrate = process.env.RUN.split(',').map(x => x + '.js');
      }
    }
  
    if ( process.env.ROLLBACK && process.env.ROLLBACK !== 'false' ) {
      if ( process.env.ROLLBACK === 'true' ) {
        rollback = true;
      } else {
        rollback = process.env.ROLLBACK.split(',').map(x => x + '.js');
      }
    }
    
    // if migrations are set to true, either migrates or rollback needs to be aplied, not both
    if ( migrate && rollback ) {
      throw new Error('Both migrations and rollbacks are set to run. Set one or the other to black, or false');
    }
  
    if ( migrate ) {
      Migration.applyMigrations(migrate);
    } else {
      Migration.rollback(rollback);
    }
  }

  static async rollback(rollbackFiles) {
    const filesToRollback = typeof rollbackFiles === 'boolean'
      ? await fs.readdirAsync(path.join(MIGRATIONS))
      : rollbackFiles;

    if ( !filesToRollback || filesToRollback.length === 0 ) return;

    Migration.sortMigrations(filesToRollback,true);

    // check if migrations are applied, if not, rollback is not posible
    for ( const rollback of filesToRollback ) {
      const rollbackDB = await Model.all({
        tableName:'migrations',
        where:{
          migration:rollback
        }
      });

      if ( rollbackDB.length === 0 ) {
        throw new Error(`Migration ${ rollback } is not applied, exiting rollback`);
      }
    }

    for ( const rollback of filesToRollback ) {
      const rollbackFile = require(path.join(MIGRATIONS,rollback));
      const Rollback = new rollbackFile();
      
      Rollback.down();
      
      const sql = Rollback.table.compileSQL();

      if ( typeof sql === 'string' ) {
        await Model.executeQuery(sql);
      } else {
        for ( const query of sql ) {
          await Model.executeQuery(query);
        }
      }

      await Model.delete({ tableName:'migrations',where:{ migration:rollback } });
    }
  }

  static async applyMigrations(migrations) {
    try {
      const migrationFiles = typeof migrations === 'boolean'
        ? await fs.readdirAsync(MIGRATIONS)
        : migrations;

      if ( migrationFiles.length === 0 ) return;

      Migration.sortMigrations(migrationFiles);

      const tables = await Model.executeQuery('show tables');

      const migrationTable = tables.find(
        x => x[`Tables_in_${ process.env.DB_NAME }`] === 'migrations'
      );

      if ( !migrationTable ) {
        await Migration.createMigrationsTable();
      }

      let allMigrations = await Model.all({ tableName:'migrations' });

      allMigrations = allMigrations.map(x => x.migration);

      const migrationsToApply = migrationFiles.filter(x => !allMigrations.includes(x));

      if ( migrationsToApply.length === 0 ) return;

      await Migration.migrate(migrationsToApply);
    } catch(e) {
      throw e;
    }
  }

  static async migrate(migrations) {
    for ( const migrationStr of migrations ) {
      const MigrationClass = require(path.join(MIGRATIONS,migrationStr));
      const Migration = new MigrationClass();

      Migration.up();

      const sql = Migration.table.compileSQL();

      if ( Migration.table.createTable ) {
        let createModelStr = `const Model = use('lib/Model');\n\n`;

        createModelStr += `class ${ Migration.table.table } extends Model { \n`;
        createModelStr += '\n';
        createModelStr += '}\n\n';
        createModelStr += `module.exports = ${ Migration.table.table }`;
        
        fs.writeFileSync(path.join(MODELS,Migration.table.table + '.js'),createModelStr,{
          encoding:'utf-8'
        });
      }

      if ( typeof sql === 'string' ) {
        await Model.executeQuery(sql);
      } else {
        for ( const query of sql ) {
          await Model.executeQuery(query);
        }
      }
      
      await Model.executeQuery(`INSERT INTO migrations (migration) values('${ migrationStr }')`);
    }
  }
}

module.exports = Migration;