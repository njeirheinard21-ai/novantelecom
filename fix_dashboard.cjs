const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

// Replace standard tailwind with custom design variables
code = code.replace(/bg-white border rounded-lg shadow-sm/g, 'bg-canvas-secondary rounded-[2rem] border border-border/50 overflow-hidden');
code = code.replace(/text-gray-500/g, 'text-fg-muted');
code = code.replace(/text-gray-900/g, 'text-fg');
code = code.replace(/fill="#3b82f6"/g, 'fill="#0071E3"'); // Brand primary/accent color
code = code.replace(/text-3xl/g, 'text-4xl tracking-tight');
code = code.replace(/border-dashed/g, 'border-dashed border-border/50');
code = code.replace(/bg-gray-50/g, 'bg-canvas-secondary');
code = code.replace(/text-red-600/g, 'text-red-500'); // make slightly more subtle
code = code.replace(/text-green-600/g, 'text-emerald-500'); // nicer green

fs.writeFileSync('src/pages/admin/Dashboard.tsx', code);
