const fs = require('fs');

const files = [
  'src/pages/admin/Inventory.tsx',
  'src/pages/admin/Settings.tsx',
  'src/pages/admin/Staff.tsx',
  'src/pages/Product.tsx',
  'src/pages/CheckoutWait.tsx',
  'src/pages/Category.tsx',
  'src/components/storefront/CartDrawer.tsx',
  'src/components/Header.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/bg-blue-600/g, 'bg-accent');
    code = code.replace(/bg-blue-700/g, 'bg-accent/90');
    code = code.replace(/text-blue-600/g, 'text-accent');
    code = code.replace(/border-blue-600/g, 'border-accent');
    code = code.replace(/bg-blue-50/g, 'bg-accent/10');
    code = code.replace(/ring-blue-500/g, 'ring-accent');
    code = code.replace(/text-gray-600/g, 'text-fg/80');
    code = code.replace(/text-gray-900/g, 'text-fg');
    code = code.replace(/bg-gray-100/g, 'bg-canvas-secondary');
    code = code.replace(/text-red-600/g, 'text-red-500');
    fs.writeFileSync(file, code);
  }
});
