import fs from 'fs';
['en', 'fr'].forEach(lang => {
  const file = `src/i18n/locales/${lang}/products.ts`;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('select_variant_error')) {
    content = content.replace('};', `  "select_variant_error": "${lang === 'en' ? 'Please select a variant before adding to cart.' : 'Veuillez sélectionner un modèle avant d\\'ajouter au panier.'}"\n};`);
    fs.writeFileSync(file, content);
  }
});
