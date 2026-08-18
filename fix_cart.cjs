const fs = require('fs');

let cartCode = fs.readFileSync('src/components/storefront/CartDrawer.tsx', 'utf8');
cartCode = cartCode.replace(/bg-white/g, 'bg-canvas/90 backdrop-blur-xl border-l border-border/50');
cartCode = cartCode.replace(/bg-gray-50/g, 'bg-canvas border-t border-border/50');
cartCode = cartCode.replace(/rounded-md/g, 'rounded-2xl');
cartCode = cartCode.replace(/bg-gray-200/g, 'bg-canvas-secondary');
fs.writeFileSync('src/components/storefront/CartDrawer.tsx', cartCode);
