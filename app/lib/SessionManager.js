const Session = use('Models/Session');
const Cookies = use('lib/Cookies');

class SessionManager {
  static generateSID() {
    const chars = [
      'a','b','c','d','e','f','g','h','y',
      'j','k','l','m','n','o','p','q','r',
      's','t','u','v','w','x','y','z','0',
      'A','B','C','D','E','F','G','H','Y',
      'J','K','L','M','N','O','P','Q','R',
      'S','T','U','V','W','X','Y','Z','$',
      '1','2','3','4','5','6','7','8','9'
    ];

    const sid = [];
    const max = chars.length;

    for ( let i = 0; i < 70; i++ ) {
      sid.push(chars[0 + Math.floor(Math.random() * (max - 0 + 1))]);
    }

    return sid.join('');
  }

  static async initSession() {
    const sid = SessionManager.generateSID();

    await Session.insert({
      sid,
      data:'{}'
    });

    return sid;
  }

  static async get(req) {
    const sid = Cookies.get(req,'sid');

    if ( !sid ) return {};

    const [session] = await Session.all({ where:{ sid } });

    if ( !session ) return {};

    try {
      session.data = JSON.parse(session.data);
    } catch(e) {  }

    return session.data;
  }

  // overwrite data field in session with new data
  static async overwrite(req,dataObj) {
    const sid = Cookies.get(req,'sid');
    
    return await Session.update({
      data:JSON.stringify(dataObj),
      where:{ sid }
    });
  }

  // append or overwrite of specific keys in data session
  static async set(req,dataObj) {
    const sid = Cookies.get(req,'sid');
    const [session] = await Session.all({ where:{ sid } });

    session.data = JSON.parse(session.data);

    Object.assign(session.data,dataObj);

    return await Session.update({
      data:JSON.stringify(session.data),
      where:{ sid }
    });
  }
}

module.exports = SessionManager;