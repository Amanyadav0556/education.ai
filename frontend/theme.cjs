const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

const themeBlock = `
@theme {
    --color-primary: #4f46e5;
    --color-primary-hover: #4338ca;
    
    --color-bg-base: var(--background);
    --color-bg-surface: var(--surface);
    --color-bg-surface-hover: var(--surface-hover);
    
    --color-text-main: var(--text-primary);
    --color-text-sub: var(--text-secondary);
    --color-text-muted: var(--text-muted);
    
    --color-border-base: var(--border);
    --color-border-strong: var(--border-strong);
}

:root {
    --background: #fbf9f1;
    --surface: #ffffff;
    --surface-hover: #f8fafc;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #94a3b8;
    --border: #f1f5f9;
    --border-strong: #e2e8f0;
}

.dark {
    --background: #0f1117;
    --surface: #191c24;
    --surface-hover: #222631;
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

css = css.replace(/@theme[\s\S]*?body\s*{[^}]*}/, themeBlock);
fs.writeFileSync('src/index.css', css);
