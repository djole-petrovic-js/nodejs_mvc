class FlashDB {
  static loadFlash() {
    if ( FlashDB.isLoaded ) {
      return;
    }

    FlashDB.Flash = use('Models/Flash');
    FlashDB.isLoaded = true;
  }

  static async get(key) {
    const res = await FlashDB.Flash.all({
      where:{
        session_key:key
      }
    });

    if ( res.length === 0 ) return undefined;

    const value = res[0].session_value;

    await FlashDB.Flash.delete({
      where:{
        session_key:key
      }
    });

    try {
      return JSON.parse(value);
    } catch(e) {
      return value;
    }
  }

  static async set(key,value) {
    try {
      value = JSON.stringify(value);
    } catch(e) { }

    await FlashDB.Flash.insert({
      session_key:key,
      session_value:value
    });
  }
}

module.exports = FlashDB;