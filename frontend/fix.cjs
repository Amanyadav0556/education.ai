const fs = require('fs');
let f = 'src/layouts/DashboardLayout.jsx';
let c = fs.readFileSync(f, 'utf8');

c = c.replace(/className="(.*?)w-10 h-10(.*?)bg-\[#836bb4\](.*?)text-white"(.*?)>/g, 'className="$1w-10 h-10$2bg-[#836bb4]$3text-white overflow-hidden"$4>');
c = c.replace(/\{user\?\.name\?\.charAt\(0\) \|\| 'S'\}/g, '{user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || "S")}');

fs.writeFileSync(f, c);
