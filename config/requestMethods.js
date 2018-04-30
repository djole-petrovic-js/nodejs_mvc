const connection = use('db/connection');
const FlashDB = use('lib/FlashDB');
const FlashLocal = use('lib/FlashLocal');

module.exports = {
  flash:{
    get:async (req) => {
      let useDatabaseForStorage;

      try {
        const c = await connection.getConnectionAsync();
        c.release();

        useDatabaseForStorage = true;
      } catch(e) {
        useDatabaseForStorage = false;
      }

      if ( useDatabaseForStorage ) {
        FlashDB.loadFlash();

        return FlashDB.get;
      } else {
        return FlashLocal.get;
      }
    },
    set:async (req) => {
      let useDatabaseForStorage;

      try {
        const c = await connection.getConnectionAsync();
        c.release();

        useDatabaseForStorage = true;
      } catch(e) {
        console.log(e);
        useDatabaseForStorage = false;
      }

      if ( useDatabaseForStorage ) {
        return FlashDB.set;
      } else {
        return FlashLocal.set;
      }
    }
  }
};