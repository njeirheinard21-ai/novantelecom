const fs = require('fs');

let checkoutCode = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');
checkoutCode = checkoutCode.replace(/py-12/g, 'py-24');
checkoutCode = checkoutCode.replace(/text-3xl font-bold/g, 'text-4xl font-semibold tracking-tight');
checkoutCode = checkoutCode.replace(/border rounded-lg p-6 bg-white shadow-sm/g, 'border border-border/50 rounded-[2rem] p-8 bg-canvas shadow-sm');
checkoutCode = checkoutCode.replace(/bg-gray-50/g, 'bg-canvas-secondary');
checkoutCode = checkoutCode.replace(/bg-blue-600/g, 'bg-accent');
checkoutCode = checkoutCode.replace(/hover:bg-blue-700/g, 'hover:bg-accent/90');
checkoutCode = checkoutCode.replace(/text-gray-500/g, 'text-fg-muted');
checkoutCode = checkoutCode.replace(/text-gray-700/g, 'text-fg');
fs.writeFileSync('src/pages/Checkout.tsx', checkoutCode);

let checkoutWaitCode = fs.readFileSync('src/pages/CheckoutWait.tsx', 'utf8');
checkoutWaitCode = checkoutWaitCode.replace(/py-12/g, 'py-24');
checkoutWaitCode = checkoutWaitCode.replace(/text-3xl font-bold/g, 'text-4xl font-semibold tracking-tight');
checkoutWaitCode = checkoutWaitCode.replace(/border p-8 rounded-lg text-center bg-white shadow-sm/g, 'border border-border/50 p-12 rounded-[2rem] text-center bg-canvas shadow-sm');
fs.writeFileSync('src/pages/CheckoutWait.tsx', checkoutWaitCode);

let productFormCode = fs.readFileSync('src/pages/admin/products/ProductForm.tsx', 'utf8');
productFormCode = productFormCode.replace(/text-3xl font-semibold/g, 'text-4xl font-semibold tracking-tight');
productFormCode = productFormCode.replace(/border rounded-lg p-6 bg-white shadow-sm/g, 'border border-border/50 rounded-[2rem] p-8 bg-canvas shadow-sm');
productFormCode = productFormCode.replace(/bg-gray-50/g, 'bg-canvas-secondary');
fs.writeFileSync('src/pages/admin/products/ProductForm.tsx', productFormCode);
