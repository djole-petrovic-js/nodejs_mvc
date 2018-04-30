const Migration = use('lib/Migration');

class CreateFlashTable extends Migration {
  up() {
    this.table('Flash',(table) => {
      table.create(
        table.increments('id_session'),
        table.field('session_key','varchar',{ length:30 }),
        table.field('session_value','varchar')
      );
    });
  }

  down() {
    this.table('Flash',(table) => {
      table.dropIfExists();
    });
  }
}

module.exports = CreateFlashTable;