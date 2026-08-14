const fs = require('fs');
let file = 'src/main.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('GoogleOAuthProvider clientId')) {
    content = content.replace(/<AuthProvider>/, "<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here'}>\n      <AuthProvider>");
    content = content.replace(/<\/AuthProvider>/, "</AuthProvider>\n    </GoogleOAuthProvider>");
    fs.writeFileSync(file, content);
}
