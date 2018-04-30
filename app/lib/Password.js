const bcrypt = requirePromisified('bcrypt');

class Password {
  static async compare(passwordText,passwordHash) {
    try {
      return await bcrypt.compareAsync(
        passwordText,passwordHash
      );

    } catch(e) {
      throw e;
    }
  }

  static async hash(passwordText) {
    try {
      const salt = await bcrypt.genSaltAsync(12);

      return await bcrypt.hashAsync(passwordText,salt,null);
      
    } catch(e) {
      throw e;
    }
  }
}

module.exports = Password;