const fs = require('fs');
let file = 'src/layouts/DashboardLayout.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard div with Link
content = content.replace(/<div className="p-3 hover:bg-bg-surface-hover dark:hover:bg-gray-700\/50 rounded-xl transition-colors cursor-pointer flex gap-3">/, '<Link to="/exam-info" className="p-3 hover:bg-bg-surface-hover rounded-xl cursor-pointer flex gap-3 transition-colors">');
content = content.replace(/<p className="text-\[10px\] font-bold text-text-muted mt-2">Just now<\/p>\s*<\/div>\s*<\/div>/, '<p className="text-[10px] font-bold text-text-muted mt-2">Just now</p></div></Link>');

// Double check just in case regex didn't perfectly match
if (!content.includes('to="/exam-info"')) {
    // simpler replacement
    content = content.replace(/<div className="p-3 hover:bg-bg-surface-hover/, '<Link to="/exam-info" className="p-3 hover:bg-bg-surface-hover');
    content = content.replace(/Just now<\/p><\/div><\/div>/, 'Just now</p></div></Link>');
}

fs.writeFileSync(file, content);
