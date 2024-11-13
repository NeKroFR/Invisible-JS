const fs = require('fs');
const path = require('path');
const U3164 = "\u3164"; 


function compress(code) {
    // remove multi-line comments
    let compressed = code.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // remove single-line comments
    compressed = compressed.replace(/^[\s]*\/\/.*$/gm, '') // comments at start of line
        .replace(/([^:])\/\/.*$/gm, '$1') // comments after code
        .replace(/\/\/.*$/gm, ''); // remaining comments
    
    // remove empty lines
    compressed = compressed.split('\n')
        .filter(line => line.trim().length > 0)
        .join('\n');
    
    // compress whitespace
    compressed = compressed
        .replace(/\s+/g, ' ') // multiple spaces -> single space
        .trim(); // leading/trailing whitespace
    
    return compressed;
}

function obfuscate(code) {
    // TODO: optimize maybe?
    //  - obfuscate the payload

    const code_bin = compress(code).split('').map(c => {
        const binary = c.charCodeAt(0).toString(2).padStart(8, '0');
        return binary.split('').map(bit => bit === '0' ? '\u0020' : '\u3164').join('');
    }).join('');

    const payload = `
        eval('${code_bin}'.split('').map(c => c === '\u3164' ? '1' : c === '\u0020' ? '0' : '').join('').match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join(''));
    `;
    return payload;
}


function save(content, filename) {
    fs.writeFileSync(filename, content, 'utf-8');
    console.log(`Success: The file has been successfully obfuscated`);
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 1 || args.length > 2) {
        console.error(`Usage: node invisible.js [input.js] [output.js]`);
        process.exit(1);
    }

    const inputFilename = args[0];
    const outputFilename = args[1] || path.join(path.dirname(inputFilename), path.basename(inputFilename, '.js') + "_invisible.js");

    try {
        const code = fs.readFileSync(inputFilename, 'utf-8');
        const obfuscatedCode = obfuscate(code);
        save(obfuscatedCode, outputFilename);
    } catch (err) {
        console.error(`Error: File doesn't exist or cannot be read!`);
        process.exit(1);
    }
}

main();
