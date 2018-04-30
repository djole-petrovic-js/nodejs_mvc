class Sanitize {
  static escapeHTML(str) {
    // for internaly generated script tags, css etc.
    if ( !String(str).match(/[&<>"'`=\/]/g) ) {
      return str;
    }

    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    return String(str).replace(/[&<>"'`=\/]/g, (s) => entityMap[s]);
  }
}

module.exports = Sanitize;