const fs = require('fs');

const adminPages = [
  'src/pages/admin/Inventory.tsx',
  'src/pages/admin/Customers.tsx',
  'src/pages/admin/orders/AdminOrderDetail.tsx',
  'src/pages/admin/orders/AdminOrderList.tsx',
  'src/pages/admin/Settings.tsx',
  'src/pages/admin/Staff.tsx',
  'src/pages/admin/products/ProductForm.tsx',
  'src/pages/admin/products/ProductList.tsx',
  'src/pages/orders/OrderTracking.tsx',
  'src/pages/orders/OrderDetail.tsx'
];

adminPages.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/bg-white border rounded-lg p-8 shadow-sm/g, 'bg-canvas border border-border/50 rounded-[2rem] p-8 shadow-sm');
    code = code.replace(/bg-white rounded-lg border shadow-sm/g, 'bg-canvas rounded-[2rem] border border-border/50 shadow-sm');
    code = code.replace(/bg-white p-6 rounded-lg border shadow-sm/g, 'bg-canvas p-6 rounded-[2rem] border border-border/50 shadow-sm');
    code = code.replace(/bg-white/g, 'bg-canvas');
    code = code.replace(/bg-gray-50/g, 'bg-canvas-secondary');
    code = code.replace(/text-gray-500/g, 'text-fg-muted');
    code = code.replace(/text-gray-600/g, 'text-fg/80');
    code = code.replace(/border-border rounded-lg/g, 'border-border/50 rounded-2xl');
    code = code.replace(/rounded-lg/g, 'rounded-2xl');
    code = code.replace(/bg-blue-600/g, 'bg-accent');
    code = code.replace(/text-blue-600/g, 'text-accent');
    code = code.replace(/border-blue-200/g, 'border-accent/20');
    code = code.replace(/bg-blue-50/g, 'bg-accent/10');
    fs.writeFileSync(file, code);
  }
});

let categoryCode = fs.readFileSync('src/pages/Category.tsx', 'utf8');
categoryCode = categoryCode.replace(/bg-gray-50/g, 'bg-canvas-secondary');
categoryCode = categoryCode.replace(/bg-gray-200/g, 'bg-canvas-secondary');
categoryCode = categoryCode.replace(/text-gray-500/g, 'text-fg-muted');
categoryCode = categoryCode.replace(/rounded-lg/g, 'rounded-3xl');
categoryCode = categoryCode.replace(/text-3xl font-bold/g, 'text-4xl font-semibold tracking-tight');
fs.writeFileSync('src/pages/Category.tsx', categoryCode);
