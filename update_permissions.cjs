const fs = require('fs');
let code = fs.readFileSync('src/lib/permissions.ts', 'utf8');

code = code.replace(
  /export function hasPermission\(role: Role \| undefined \| null, permission: Permission\): boolean \{[\s\S]*?\}/g,
  `export function hasPermission(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  if (role === 'super_admin') return true;
  return PERMISSIONS[permission]?.includes(role) ?? false;
}`
);

fs.writeFileSync('src/lib/permissions.ts', code);
