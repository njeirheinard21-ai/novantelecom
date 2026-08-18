const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/orders/AdminOrderList.tsx', 'utf8');

code = code.replace(/text-3xl font-bold/g, 'text-4xl font-semibold tracking-tight');
code = code.replace(/border rounded-md p-2/g, 'border border-border/50 bg-canvas rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-accent');
code = code.replace(/bg-white border rounded-lg shadow-sm/g, 'bg-canvas border border-border/50 rounded-[2rem] overflow-hidden');
code = code.replace(/bg-gray-50/g, 'bg-canvas-secondary');
code = code.replace(/border-b/g, 'border-b border-border/50');
code = code.replace(/text-gray-500/g, 'text-fg-muted');
code = code.replace(/text-gray-900/g, 'text-fg');
code = code.replace(/hover:bg-gray-50/g, 'hover:bg-canvas-secondary');
code = code.replace(/rounded-full px-2 py-1/g, 'rounded-full px-3 py-1 font-medium');

fs.writeFileSync('src/pages/admin/orders/AdminOrderList.tsx', code);
