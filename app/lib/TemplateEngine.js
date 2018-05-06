const fs = requirePromisified('fs');
const path = require('path');
const View = use('lib/View');
const includeRegex = /@include(.*?)(.*?)(?:\s|$)/g;
const extendsRegex = /@extends(.*?)(.*?)(?:\s|$)/;
const removeExtraYeildsRegex = /@yield\((.*?)\)/g;

const { PATHS:{ VIEWS } } = require('../../config');

class TemplateEngine {
  static getCaptureGroups(html,regex) {
    let match = regex.exec(html);
    const output = [];

    while (match !== null) {
      output.push(match[2].replace("'",'').replace("'",'').replace('(','').replace(')',''));
      match = regex.exec(html);
    }

    return output;
  }

  static async gatherIncludes(html) {
    const includes = TemplateEngine.getCaptureGroups(html,includeRegex);

    if ( includes.length === 0 ) return html;

    for ( const inc of includes ) {
      const content = await fs.readFileAsync(path.join(VIEWS,inc + '.html'),'utf-8');

      const regex = new RegExp(`@include\\('${ inc }'\\)`,'gi');
      
      html = html.replace(regex,content);
    }

    const nestedIncludes = TemplateEngine.getCaptureGroups(html,includeRegex);
    
    if ( includes.length !== 0 ) {
      html = await TemplateEngine.gatherIncludes(html);
    }

    return html;
  }

  static getExtend(html,extendsRegex) {
    return extendsRegex.exec(html);
  }

  static async extendTemplate(html,unmatchedYields = []) {
    let layout = TemplateEngine.getExtend(html,extendsRegex);

    if ( !layout ) return html;

    layout = layout[2].replace("'",'').replace("'",'').replace('(','').replace(')','');

    let layoutHTML = await fs.readFileAsync(path.join(VIEWS,layout + '.html'),'utf-8');
    let currentSectionIndex = 0;
    const unmatched = [];

    if ( unmatchedYields.length > 0 ) {
      layoutHTML = unmatchedYields.reduce((html,[regex,content]) => {
        html = html.replace(regex,content); return html;
      },layoutHTML);
    }

    while ( 1 ) {
      const [section,endSection] = [
        html.indexOf('@section',currentSectionIndex),
        html.indexOf('@endsection',currentSectionIndex)
      ];

      if ( section === -1 ) break;

      const sectionName = html.substring(
        html.indexOf('(',section) + 1,
        html.indexOf(')',section)
      ).replace("'",'').replace("'",'');

      const content = html.substring(
        html.indexOf(')',section) + 1,
        endSection
      ).trim();

      const regex = new RegExp(`@yield\\('${ sectionName }'\\)`,'gi');

      if ( layoutHTML.match(regex) ) {
        layoutHTML = layoutHTML.replace(regex,content)
      } else {
        unmatched.push([ regex,content ]);
      }
        
      currentSectionIndex = endSection + 1;
    }

    if ( TemplateEngine.getExtend(layoutHTML,extendsRegex) ) {
      layoutHTML = await TemplateEngine.extendTemplate(layoutHTML,unmatched);
    }

    return layoutHTML;
  }

  static async removeExtraYeildsRegex(html) {
    return html.replace(removeExtraYeildsRegex,'');
  }

  static async compileTemplateWithData(html,data) {
    if ( Object.keys(data) === 0 ) return;

    const compiledTemplate = await new View(html).compile(data);

    return compiledTemplate;
  }

  static async compile(view,data = {}) {
    let html = await fs.readFileAsync(view,'utf-8');

    html = await TemplateEngine.extendTemplate(html);
    html = await TemplateEngine.removeExtraYeildsRegex(html);
    html = await TemplateEngine.gatherIncludes(html);
    html = await TemplateEngine.compileTemplateWithData(html,data);

    return html;
  }
}

module.exports = TemplateEngine;