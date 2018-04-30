const Migration = use('lib/Migration');

class AddVisibilityColumnToNav extends Migration {
  up() {
    this.table('Navigation',(table) => {
      table.addColumn('Visibility','varchar');
      table.addColumn('proba','int');
    });
  }

  down() {
    this.table('Navigation',(table) => {
      table.dropColumn('Visibility');
      table.dropColumn('proba');
    });
  }
}

module.exports = AddVisibilityColumnToNav;