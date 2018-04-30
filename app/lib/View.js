const path = require('path');
const { PUBLIC } = requireConfig();
const app = require('../../server');
const Sanitize = use('lib/Sanitize');
const Formater = use('lib/Formater');

class View {
  constructor(html) {
    this.html = html;
    this.re = /\|%([^%>]+)?%\|/g;
    this.reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
  }

  static js(str) {
    return `<script src="${ path.join(PUBLIC,'js',str + '.js') }"></script>`;
  }

  static css(str) {
    return `<link rel="stylesheet" href="${ path.join(PUBLIC,'css',str + '.css') }"/>`;
  }

  static get(varStr) {
    try {
      return global.templateVars[varStr];
    } catch(e) {
      return undefined;
    }
  }

  static url(name) {
    const routes = app.getRoutes();

    const url = routes
      .filter(x => typeof x !== 'string')
      .find(x => x.name === name);

    if ( !url ) {
      throw new Error(`Url with name ${ name } doesnt exist!`);
    }

    return url.route;
  }

  static sanitizeInput(str,format) {
    str = Sanitize.escapeHTML(str);

    if ( format ) {
      let formater, params;

      if ( !format.includes(':') ) {
        formater = format.toLowerCase();
        params = [];
      } else {
        const indexOfFirstColon = format.indexOf(':');
        
        formater = format.slice(0,indexOfFirstColon).toLowerCase();
        params = format.slice(indexOfFirstColon + 1).split(':');
      }

      if ( typeof Formater[formater] !== 'function' ) {
        throw new Error(`Formater ${ formater } is undefined, check your view!`);
      }

      str = Formater[formater](str,...params);
    }

    return str;
  }

  static injectWhitelistedMethods(data) {
    const methods = ['js','css','url','get','sanitizeInput'];

    for ( const method of methods ) {
      data[method] = View[method];
    }
  }

  addLine(code,line,isJS = false) {
    if ( isJS ) {
      if ( line.match(this.reExp) ) {
        code += line + '\n;';
      } else {
        const [str,format] = line.split('|');
        const fnRegex = /\((.*?)\)/;
        // check if it it contains function call, if not , just sanitize input
        // maybe should add if it should escape returned html or not...?

        if ( line.match(fnRegex) ) {
          code += 'try { r.push(' + line + '); } catch(e) { r.push(sanitizeInput(' + str + ','+ format +'));\n }';
        } else {
          code += 'r.push(sanitizeInput(' + str + ','+ format +'));\n';
        }
      }
    } else {
      code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '';
    }

    return code;
  }

  async compile(data) {
    let  
      code   = 'var r=[];\n;',
      match  = null,
      cursor = 0;

    while ( match = this.re.exec(this.html) ) {
      code = this.addLine(code,this.html.slice(cursor,match.index));
      code = this.addLine(code,match[1],true);

      cursor = match.index + match[0].length;
    }

    code = this.addLine(code,this.html.slice(cursor));
    code += 'return r.join("")';

    View.injectWhitelistedMethods(data);

    const keys = Object.keys(data);
    const fn = Function(...keys,code.replace(/[\r\t\n]/g, ''));
    const args = keys.map(x => data[x]);
    
    return fn(...args);
  }
}

module.exports = View;