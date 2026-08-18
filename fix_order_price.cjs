const fs = require('fs');
let code = fs.readFileSync('src/server/routes/orders.ts', 'utf8');

code = code.replace(
  /        subtotal \+= product\.price \* quantity;\n\n        orderItems\.push\(\{[\s\S]*?\}\);/m,
  `        let itemPrice = product.price;
        if (requestedVariantId && product.variants) {
          const variant = product.variants.find((v:any) => v.id === requestedVariantId);
          if (variant) {
            itemPrice = variant.price;
          }
        }
        subtotal += itemPrice * quantity;

        orderItems.push({
          productId: product.id,
          variantId: requestedVariantId,
          name: product.name,
          quantity,
          price: itemPrice
        });`
);
fs.writeFileSync('src/server/routes/orders.ts', code);
