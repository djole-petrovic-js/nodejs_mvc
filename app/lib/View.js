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

  static sanitizeInput(str,...formats) {
    if ( formats.length > 0 ) {
      const formater = new Formater();

      for ( const format of formats ) {
        const [method,...params] = format.split(':');

        if ( typeof formater[method] !== 'function' ) {
          throw new Error(`Format ${ method } not found, check your view file!`);
        }

        str = formater[method](str,...params);
      }
    }

    str = Sanitize.escapeHTML(str);

    return str;
  }

  static injectWhitelistedMethods(data) {
    const methods = ['js','css','url','sanitizeInput'];

    for ( const method of methods ) {
      data[method] = View[method];
    }
  }

  addLine(code,line,isJS = false) {
    if ( isJS ) {
      if ( line.match(this.reExp) ) {
        code += line + '\n;';
      } else {
        // check if it it contains function call, if not , just sanitize input
        // maybe should add if it should escape returned html or not...?
        const [str,...format] = line.split('|');
        const fnRegex = /\((.*?)\)/;
        const finalFormat = format.length === 0 ? "" : format;

        if ( line.match(fnRegex) ) {
          code += 'try {r.push('+line+');} catch(e) {r.push(sanitizeInput(' + str + ','+ finalFormat +'));\n }';
        } else {
          code += 'r.push(sanitizeInput(' + str + ','+ finalFormat +'));\n';
        }
      }
    } else {
      code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '';
    }

    return code;
  }

  async compile(data) {
    let  
      code   = 'const r=[];\n;',
      match  = null,
      cursor = 0;

    code += 'const get = (x) => this[x];';

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
    
    return fn.bind(data)(...args);
  }
}

module.exports = View;