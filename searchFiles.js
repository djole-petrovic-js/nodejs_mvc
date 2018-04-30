const
  path     = require('path'),
  readline = require('readline');

const
fs = require('fs')
  //{ fs } = require('../utils/promisifiedModules');

const rl = readline.createInterface({
  input:process.stdin,
  output:process.stdout
});

rl.question('Enter search query\n',(q) => {
  rl.question('Case Sensitive (y/n) \n',async(caseSensitive) => {
    try {
      const 
        Root  = path.join(__dirname,'../'),
        flags = caseSensitive === 'y' ? 'g' : 'gi',
        regex = new RegExp(q,flags);

      rl.write('Search Regex :' + regex + ' \n');

      let files = await searchFiles({
        dirname:Root,
        ignore:[
          'node_modules',
          'public',
          'package-lock.json',
          'package.json'
        ],
        highlight:true,
        regex
      });

      files = files.map(({ line,lineContent,filePath }) => {
        return `Line : ${ line } : ${ lineContent } \n File Path : ${ filePath } \n\n`;
      });

      if ( files.length === 0 ) {
        rl.write('No match...\n');
      } else {
        files.forEach(f => {
          rl.write('---------------\n');
          rl.write(f);
          rl.write('---------------\n');
        });
      }
    } catch(e) {
      rl.write('Error occured, please try again...\n');
      rl.write(e + '\n');
    } finally {
      rl.close();
    }
  });
});

const searchFiles = async({ dirname,regex,ignore,highlight }) => {
  try {
    const matchedFiles = [];
    let files = fs.readdirSync(dirname);

    if ( ignore ) {
      files = files.filter(x => !ignore.includes(x));
    }

    for ( const file of files ) {
      const filePath = path.join(dirname,file);

      if ( fs.statSync(filePath).isFile() ) {
        fs
          .readFileSync(filePath,'utf-8')
          .split('\n')
          .map(line => line.trim())
          .forEach((line,index) => {
            if ( regex.test(line) ) {
              matchedFiles.push({
                line:index + 1,
                lineContent:line.replace(regex,(x) => highlight ? `>> ${x} <<` : x),
                filePath
              });
            }
          });
      } else {
        matchedFiles.push(...await searchFiles({
          dirname:filePath,
          ignore,
          regex,
          highlight
        }));
      }
    }

    return matchedFiles;
  } catch(e) {
    throw e;
  }
}
