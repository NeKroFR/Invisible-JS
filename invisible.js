const fs = require('fs');
const path = require('path');
const U3164 = "\u3164"; 

function obfuscate(code) {
    // TODO:
    //  - compress
    //  - obfuscate the payload
    //  - optimize maybe?

    const binaryRepresentation = code.split('').map(c => {
        const binary = c.charCodeAt(0).toString(2).padStart(8, '0');
        return binary.split('').map(bit => bit === '0' ? '\u0020' : '\u3164').join('');
    }).join('');

    const payload = `
        eval('${binaryRepresentation}'.split('').map(c => c === '\u3164' ? '1' : c === '\u0020' ? '0' : '').join('').match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join(''));
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
        const obfuscatedCode = obfuscate(code); // Obfuscate the code
        save(obfuscatedCode, outputFilename); // Save the obfuscated code to file
    } catch (err) {
        console.error(`Error: File doesn't exist or cannot be read!`);
        process.exit(1);
    }
}

main();
