const fs = require('fs');

let orderListCode = fs.readFileSync('src/pages/orders/OrderList.tsx', 'utf8');
orderListCode = orderListCode.replace(/py-12/g, 'py-24');
orderListCode = orderListCode.replace(/text-3xl font-bold/g, 'text-4xl font-semibold tracking-tight');
orderListCode = orderListCode.replace(/text-gray-500/g, 'text-fg-muted');
orderListCode = orderListCode.replace(/border rounded-lg p-6 bg-white shadow-sm/g, 'border border-border/50 rounded-[2rem] p-6 bg-canvas shadow-sm');
orderListCode = orderListCode.replace(/text-blue-600/g, 'text-accent');
orderListCode = orderListCode.replace(/text-red-600/g, 'text-red-500');
fs.writeFileSync('src/pages/orders/OrderList.tsx', orderListCode);

let orderDetailCode = fs.readFileSync('src/pages/orders/OrderDetail.tsx', 'utf8');
orderDetailCode = orderDetailCode.replace(/py-12/g, 'py-24');
orderDetailCode = orderDetailCode.replace(/text-3xl font-bold/g, 'text-4xl font-semibold tracking-tight');
orderDetailCode = orderDetailCode.replace(/bg-gray-50/g, 'bg-canvas-secondary');
orderDetailCode = orderDetailCode.replace(/bg-white/g, 'bg-canvas');
orderDetailCode = orderDetailCode.replace(/border rounded-lg/g, 'border border-border/50 rounded-[2rem]');
orderDetailCode = orderDetailCode.replace(/text-gray-500/g, 'text-fg-muted');
orderDetailCode = orderDetailCode.replace(/text-blue-600/g, 'text-accent');
fs.writeFileSync('src/pages/orders/OrderDetail.tsx', orderDetailCode);

let trackingCode = fs.readFileSync('src/pages/orders/OrderTracking.tsx', 'utf8');
trackingCode = trackingCode.replace(/py-12/g, 'py-24');
trackingCode = trackingCode.replace(/text-3xl font-bold/g, 'text-4xl font-semibold tracking-tight');
trackingCode = trackingCode.replace(/border rounded-lg/g, 'border border-border/50 rounded-[2rem]');
trackingCode = trackingCode.replace(/bg-white/g, 'bg-canvas');
trackingCode = trackingCode.replace(/text-gray-500/g, 'text-fg-muted');
trackingCode = trackingCode.replace(/bg-gray-200/g, 'bg-border/50');
trackingCode = trackingCode.replace(/bg-blue-600/g, 'bg-accent');
trackingCode = trackingCode.replace(/text-blue-600/g, 'text-accent');
fs.writeFileSync('src/pages/orders/OrderTracking.tsx', trackingCode);
