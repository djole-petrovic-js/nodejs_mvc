const Migration = use('lib/Migration');

class CreateSessionTable extends Migration {
  up() {
    this.table('Session',(table) => {
      table.create(
        table.increments('id_session'),
        table.field('sid','varchar'),
        table.field('data','varchar')
      );
    });
  }

  down() {
    this.table('Session',(table) => {
      table.dropIfExists();
    });
  }
}

module.exports = CreateSessionTable;