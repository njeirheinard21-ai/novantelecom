const fs = require('fs');

let adminCode = fs.readFileSync('src/server/routes/admin.ts', 'utf8');
adminCode = adminCode.replace(/let currentStock = 0;/g, 'let currentStock: number;');
adminCode = adminCode.replace(/v\.stock /g, 'v.stockCount ');
adminCode = adminCode.replace(/v\.stock\b/g, 'v.stockCount');
adminCode = adminCode.replace(/product\.stock\b/g, 'product.stockCount');
adminCode = adminCode.replace(/stock: newStock/g, 'stockCount: newStock');
adminCode = adminCode.replace(/Function/g, '((...args: any[]) => any)');
fs.writeFileSync('src/server/routes/admin.ts', adminCode);

let ordersCode = fs.readFileSync('src/server/routes/orders.ts', 'utf8');
ordersCode = ordersCode.replace(/Function/g, '((...args: any[]) => any)');
fs.writeFileSync('src/server/routes/orders.ts', ordersCode);

let paymentsCode = fs.readFileSync('src/server/routes/payments.ts', 'utf8');
paymentsCode = paymentsCode.replace(/Function/g, '((...args: any[]) => any)');
fs.writeFileSync('src/server/routes/payments.ts', paymentsCode);
