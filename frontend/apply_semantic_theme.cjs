const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let files = [];
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            files = files.concat(walkDir(dirPath));
        } else {
            if (f.endsWith('.jsx')) files.push(dirPath);
        }
    });
    return files;
}

let allFiles = walkDir('src');

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Strip manual dark bindings first
    content = content.replace(/\bdark:bg-[a-zA-Z0-9\-\/\[\]#]+\b/g, '');
    content = content.replace(/\bdark:text-[a-zA-Z0-9\-\/\[\]#]+\b/g, '');
    content = content.replace(/\bdark:border-[a-zA-Z0-9\-\/\[\]#]+\b/g, '');
    content = content.replace(/\bdark:from-[a-zA-Z0-9\-\/\[\]#]+\b/g, '');
    content = content.replace(/\bdark:to-[a-zA-Z0-9\-\/\[\]#]+\b/g, '');

    // Semantic Mapping

    // Backgrounds
    content = content.replace(/\bbg-white\b/g, 'bg-bg-surface');
    content = content.replace(/bg-\[#fbf9f1\]/g, 'bg-bg-base');
    content = content.replace(/\bbg-gray-50\b/g, 'bg-bg-surface-hover');
    content = content.replace(/\bbg-gray-100\b/g, 'bg-bg-surface-hover');

    // Text
    content = content.replace(/\btext-gray-900\b/g, 'text-text-main');
    content = content.replace(/\btext-gray-800\b/g, 'text-text-main');
    content = content.replace(/\btext-gray-700\b/g, 'text-text-sub');
    content = content.replace(/\btext-gray-600\b/g, 'text-text-sub');
    content = content.replace(/\btext-gray-500\b/g, 'text-text-sub');
    content = content.replace(/\btext-gray-400\b/g, 'text-text-muted');
    content = content.replace(/\btext-black\b/g, 'text-text-main');

    // Borders
    content = content.replace(/\bborder-gray-100\b/g, 'border-border-base');
    content = content.replace(/\bborder-gray-200\b/g, 'border-border-strong');
    content = content.replace(/\bborder-gray-300\b/g, 'border-border-strong');

    // Gradients
    content = content.replace(/\bfrom-indigo-50\b/g, 'from-bg-surface-hover');
    content = content.replace(/\bto-purple-50\b/g, 'to-bg-surface');

    // Cleanup double spaces created by stripping dark mode modifiers
    content = content.replace(/className=(["'`])(.*?)(\1)/g, (match, quote, classes) => {
        return `className=${quote}${classes.replace(/\s+/g, ' ').trim()}${quote}`;
    });

    fs.writeFileSync(file, content);
});
console.log("Migration Complete");
