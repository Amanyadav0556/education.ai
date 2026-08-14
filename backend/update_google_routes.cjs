const fs = require('fs');
let file = 'src/routes/authRoutes.js';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/signup, login, getMe/, 'signup, login, googleLogin, getMe');
c = c.replace(/router.post\('\/login', login\);/, "router.post('/login', login);\nrouter.post('/google', googleLogin);");

fs.writeFileSync(file, c);
