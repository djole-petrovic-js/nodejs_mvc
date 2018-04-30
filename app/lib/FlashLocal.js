const flash = {};

class FlashLocal {
  get(key) {
    let value = flash[key];

    try {
      value = JSON.parse(value);
    } catch(e) { }

    delete flash[key];

    return value;
  }

  set(key,value) {
    try {
      val = JSON.stringify(val);
    } catch(e) {  }

    flash[key] = value;
  }
}

module.exports = FlashLocal;