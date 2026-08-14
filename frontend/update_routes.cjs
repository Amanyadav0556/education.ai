const fs = require('fs');
let file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Insert ExamInfo Route
if (!content.includes('path="/exam-info"')) {
    content = content.replace(/(<Route path="\/profile" element=\{<ProtectedRoute><Profile \/><\/ProtectedRoute>\} \/>)/, '$1 <Route path="/exam-info" element={<ProtectedRoute><ExamInfo /></ProtectedRoute>} />');
}

fs.writeFileSync(file, content);
