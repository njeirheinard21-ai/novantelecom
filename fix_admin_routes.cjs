const fs = require('fs');

let code = fs.readFileSync('src/server/routes/admin.ts', 'utf8');

code = code.replace(
  /router\.delete\('\/staff\/:uid', asyncHandler/g,
  `router.delete('/staff/:uid', requirePermission('users:manage'), asyncHandler`
);

code = code.replace(
  /router\.get\('\/inventory', asyncHandler/g,
  `router.get('/inventory', requirePermission('inventory:read'), asyncHandler`
);

code = code.replace(
  /router\.post\('\/inventory\/adjust', asyncHandler/g,
  `router.post('/inventory/adjust', requirePermission('inventory:adjust'), asyncHandler`
);

fs.writeFileSync('src/server/routes/admin.ts', code);
