const fs = require('fs');

let code = fs.readFileSync('src/server/routes/payments.ts', 'utf8');
code = code.replace(
  /if \(method === 'card' && process\.env\.STRIPE_SECRET_KEY\) \{[\s\S]*?\} else if \(method === 'mobile_money' && process\.env\.PAYMENT_API_KEY\) \{[\s\S]*?\}/g,
  `if ((method === 'orange_money' || method === 'mtn_momo') && process.env.PAYMENT_API_KEY) {
        // Integrate with mobile money provider API here
      }`
);

fs.writeFileSync('src/server/routes/payments.ts', code);
