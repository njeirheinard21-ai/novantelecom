const fs = require('fs');

let code = fs.readFileSync('src/pages/account/AccountLayout.tsx', 'utf8');

code = code.replace(
  /const user = useAuthStore\(state => state\.user\);/g,
  `const user = useAuthStore(state => state.user);
  const role = useAuthStore(state => state.role);
  const isAdmin = role === 'super_admin' || role === 'admin' || role === 'staff';`
);

code = code.replace(
  /import \{ useNavigate \} from 'react-router';/g,
  `import { useNavigate, Link } from 'react-router';\nimport { ArrowRight } from 'lucide-react';`
);

// add to desktop sidebar
code = code.replace(
  /<div className="pt-8 mt-8 border-t border-border\/50">/g,
  `{isAdmin && (
                <div className="pt-8 mt-8 border-t border-border/50">
                  <h3 className="px-4 text-xs font-semibold text-fg-muted uppercase tracking-wider mb-4">Administrative Access</h3>
                  <Link 
                    to="/admin"
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-white bg-accent hover:bg-accent/90 transition-colors w-full"
                  >
                    <span>Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
              
              <div className="pt-4 mt-4 border-t border-border/50">`
);

// add to mobile nav
code = code.replace(
  /<button[\s\S]*?onClick=\{handleSignOut\}[\s\S]*?className="flex items-center space-x-2 px-4 py-2\.5 rounded-full whitespace-nowrap text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"[\s\S]*?>[\s\S]*?<LogOut className="w-4 h-4" \/>[\s\S]*?<span>Sign Out<\/span>[\s\S]*?<\/button>/g,
  `{isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium text-white bg-accent hover:bg-accent/90 transition-colors"
                >
                  <span>Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>`
);

fs.writeFileSync('src/pages/account/AccountLayout.tsx', code);
