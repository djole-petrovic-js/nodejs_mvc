const viewGlobalMethods = requireFromConfig('viewMethods');

class View {
  constructor(html) {
    this.html = html;
    this.re = /\|%([^%>]+)?%\|/g;
    this.reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
  }

  async loadViewGlobalMethods(data) {
    for ( const [name,fn] of Object.entries(viewGlobalMethods) ) {
      data[name] = fn;
    }
  }

  addLine(code,line,isJS = false) {
    if ( isJS ) {
      if ( line.match(this.reExp) ) {
        code += line + '\n;';
      } else {
        code += 'r.push(' + line + ');\n';
      }
    } else {
      code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '';
    }

    return code;
  }

  async compile(data) {
    await this.loadViewGlobalMethods(data);

    let  
      code = 'var r=[];\n;',
      match = null,
      cursor = 0;

    while ( match = this.re.exec(this.html) ) {
      code = this.addLine(code,this.html.slice(cursor,match.index));
      code = this.addLine(code,match[1],true);

      cursor = match.index + match[0].length;
    }

    code = this.addLine(code,this.html.slice(cursor));
    code += 'return r.join("")';

    const keys = Object.keys(data);
    const fn = Function(...keys,code.replace(/[\r\t\n]/g, ''));

    const args = keys.reduce((acc,key) => {
      acc.push(data[key]); return acc;
    },[]);
    
    return fn(...args);
  }
}

module.exports = View;