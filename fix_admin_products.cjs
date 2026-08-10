const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/products/ProductList.tsx', 'utf8');

code = code.replace(/text-3xl font-semibold/g, 'text-4xl font-semibold tracking-tight');
code = code.replace(/w-full max-w-md rounded-lg border border-border bg-canvas px-4 py-2/g, 'w-full max-w-md rounded-full border border-border/50 bg-canvas px-5 py-2.5 outline-none focus:ring-2 focus:ring-accent');
code = code.replace(/bg-canvas rounded-lg border border-border overflow-hidden/g, 'bg-canvas border border-border/50 rounded-[2rem] overflow-hidden');
code = code.replace(/bg-canvas-secondary/g, 'bg-canvas-secondary/50');
code = code.replace(/text-fg-muted/g, 'text-fg-muted font-medium');

fs.writeFileSync('src/pages/admin/products/ProductList.tsx', code);
