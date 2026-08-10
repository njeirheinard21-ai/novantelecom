const fs = require('fs');

let code = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

// Replace the styling
code = code.replace(/bg-blue-50 text-blue-700/g, 'bg-canvas-secondary text-accent font-semibold');
code = code.replace(/text-gray-700 hover:bg-gray-50/g, 'text-fg-muted hover:bg-canvas-secondary hover:text-fg');
code = code.replace(/rounded-md/g, 'rounded-xl');

fs.writeFileSync('src/components/admin/AdminLayout.tsx', code);
