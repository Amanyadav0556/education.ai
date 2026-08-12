const fs = require('fs');
const path = require('path');

let indexCSS = fs.readFileSync('src/index.css', 'utf8');

const themeVariables = `
@theme {
    --color-primary: #4f46e5;
    --color-primary-hover: #4338ca;
}

:root {
    --background: #fbf9f1;
    --surface: #ffffff;
    --surface-hover: #f8fafc;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --text-muted: #94a3b8;
    --border: #f1f5f9;
    --border-strong: #e2e8f0;
}

:root.dark, .dark {
    --background: #0f1117;
    --surface: #1a1d24;
    --surface-hover: #232730;
    --text-primary: #f8fafc;
    --text-secondary: #9ca3af;
    --text-muted: #6b7280;
    --border: #2a2f3a;
    --border-strong: #374151;
}

body {
    background-color: var(--background);
    color: var(--text-primary);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    margin: 0;
    min-height: 100vh;
    font-weight: 500;
}
`;

indexCSS = indexCSS.replace(/@theme[\s\S]*?body\s*{[^}]*}/, themeVariables);
fs.writeFileSync('src/index.css', indexCSS);

// Now walk the directories and do massive find-and-replace
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

    // Completely remove old manual dark mode mapping for colors, texts, and borders to avoid weird artifacts
    content = content.replace(/dark:bg-[a-zA-Z0-9\-\/]+/g, '');
    content = content.replace(/dark:text-[a-zA-Z0-9\-\/]+/g, '');
    content = content.replace(/dark:border-[a-zA-Z0-9\-\/]+/g, '');

    // Replace with semantic variables using Tailwind's arbitrary values
    content = content.replace(/bg-white/g, 'bg-[var(--surface)]');
    content = content.replace(/bg-\[#fbf9f1\]/g, 'bg-[var(--background)]');
    content = content.replace(/bg-gray-50/g, 'bg-[var(--surface-hover)]');
    content = content.replace(/bg-gray-100/g, 'bg-[var(--surface-hover)]');

    content = content.replace(/text-gray-900/g, 'text-[var(--text-primary)]');
    content = content.replace(/text-gray-800/g, 'text-[var(--text-primary)]');
    content = content.replace(/text-gray-700/g, 'text-[var(--text-secondary)]');
    content = content.replace(/text-gray-600/g, 'text-[var(--text-secondary)]');
    content = content.replace(/text-gray-500/g, 'text-[var(--text-secondary)]');
    content = content.replace(/text-gray-400/g, 'text-[var(--text-muted)]');
    content = content.replace(/text-black/g, 'text-[var(--text-primary)]');

    content = content.replace(/border-gray-100/g, 'border-[var(--border)]');
    content = content.replace(/border-gray-200/g, 'border-[var(--border-strong)]');
    content = content.replace(/border-gray-300/g, 'border-[var(--border-strong)]');

    // Fix gradients
    content = content.replace(/from-indigo-50/g, 'from-[var(--surface-hover)]');
    content = content.replace(/to-purple-50/g, 'to-[var(--surface)]');

    // Strip double spaces created by removing dark tags
    content = content.replace(/\s{2,}/g, ' ');

    fs.writeFileSync(file, content);
});

console.log("Migration Complete");
