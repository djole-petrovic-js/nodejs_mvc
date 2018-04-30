const connection = use('db/connection');
const FlashDB = use('lib/FlashDB');
const FlashLocal = use('lib/FlashLocal');

module.exports = {
  wantsJSON:(req) => () => {
    const header = req.headers['x-requested-with'] || '';
    
    if ( header.toLowerCase() === 'xmlhttprequest' ) return true;

    if ( req.headers.accept && req.headers.accept.indexOf('json') > -1 ) return true;

    return false;
  },
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