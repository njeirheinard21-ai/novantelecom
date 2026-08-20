import fs from 'fs';
['en', 'fr'].forEach(lang => {
  const file = `src/i18n/locales/${lang}/checkout.ts`;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('free')) {
    content = content.replace('};', `  "free": "${lang === 'en' ? 'Free' : 'Gratuit'}",\n  "processing": "${lang === 'en' ? 'Processing...' : 'Traitement...'}",\n  "place_order": "${lang === 'en' ? 'Place Order' : 'Passer la commande'}",\n  "total": "Total"\n};`);
    fs.writeFileSync(file, content);
  }
});
