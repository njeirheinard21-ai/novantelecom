const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/products/ProductForm.tsx', 'utf8');

code = code.replace(/id: z\.string\(\)\.optional\(\),/g, 'id: z.string().optional(),\n  name: z.string().min(1, "Name is required"),\n  isActive: z.boolean().default(true),');
code = code.replace(/append\(\{ sku: '', price: 0, stock: 0 \}\)/g, "append({ sku: '', name: '', price: 0, stock: 0, isActive: true })");

// Also add fields for name and isActive to the UI for variants
// Find where it renders the variant fields
code = code.replace(
  /<input id="field_15"/,
  `<div className="grid grid-cols-2 gap-4 mb-2">
    <div>
      <label className="block text-sm font-medium text-fg-muted mb-1">Variant Name</label>
      <input {...register(\`variants.\${index}.name\`)} className="w-full rounded-md border border-border p-1.5 text-sm" />
    </div>
    <div className="flex items-end mb-2">
      <label className="flex items-center space-x-2">
        <input type="checkbox" {...register(\`variants.\${index}.isActive\`)} className="rounded border-border" />
        <span className="text-sm font-medium">Active</span>
      </label>
    </div>
  </div>
  <input id="field_15"`
);

fs.writeFileSync('src/pages/admin/products/ProductForm.tsx', code);
