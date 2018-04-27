module.exports = {
  wantsJSON:(req) => () => {
    const header = req.headers['x-requested-with'] || '';
    
    if ( header.toLowerCase() === 'xmlhttprequest' ) return true;

    if ( req.headers.accept && req.headers.accept.indexOf('json') > -1 ) return true;

    return false;
  }
};