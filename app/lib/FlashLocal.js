class FlashLocal {
  static loadFlash() {
    FlashLocal.flash = {};
  }

  static async get(key) {
    console.log('pozvano');
    let value = FlashLocal.flash[key];

    try {
      value = JSON.parse(value);
    } catch(e) { }

    delete FlashLocal.flash[key];

    return value;
  }

  static async set(key,value) {
    try {
      val = JSON.stringify(val);
    } catch(e) {  }

    FlashLocal.flash[key] = value;
  }
}

module.exports = FlashLocal;