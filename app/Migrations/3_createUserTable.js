const Migration = use('lib/Migration');

class CreateUserTable extends Migration {
  up() {
    this.table('User',(table) => {
      table.create(
        table.increments('id_user'),
        table.field('username','varchar',{
          unique:true,
          length:50,
          defaultValue:{
            value:'djole',
            isSimpleString:true
          }
        }),
        table.field('password','varchar'),
        table.field('email','varchar',{
          unique:true,
          length:30,
          defaultValue:{
            value:'nekimail@gmail.com',
            isSimpleString:true
          }
        }),
        table.timestamps()
      );
    });
  }

  down() {
    this.table('User',(table) => {
      table.dropIfExists();
    });
  }
}

module.exports = CreateUserTable;