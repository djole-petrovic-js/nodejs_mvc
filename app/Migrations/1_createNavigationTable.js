const Migration = use('lib/Migration');

class CreateNavigationTable extends Migration {
  up() {
    this.table('Navigation',(table) => {
      table.create(
        table.increments('id_navigation'),
        table.field('href','varchar'),
        table.field('title','varchar')
      );
    });
  }

  down() {
    this.table('Navigation',(table) => {
      table.dropIfExists();
    });
  }
}

module.exports = CreateNavigationTable;