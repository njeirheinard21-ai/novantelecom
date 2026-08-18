const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove duplicates
code = code.replace(/const Support = lazy\(\(\) => import\('\.\/pages\/account\/Support'\)\);\n/g, '');
code = code.replace(/const Wishlist = lazy\(\(\) => import\('\.\/pages\/account\/Wishlist'\)\);\n/g, '');

// Rename account versions
code = code.replace(/const Profile = lazy/, "const AccountSupport = lazy(() => import('./pages/account/Support'));\nconst AccountWishlist = lazy(() => import('./pages/account/Wishlist'));\nconst Profile = lazy");

const accountRoutes = `
              <Route path="/account" element={<RouteGuard requireAuth><AccountLayout /></RouteGuard>}>
                <Route index element={<Overview />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetails />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="profile" element={<Profile />} />
                <Route path="security" element={<Security />} />
                <Route path="preferences" element={<Preferences />} />
                <Route path="support" element={<AccountSupport />} />
                <Route path="wishlist" element={<AccountWishlist />} />
              </Route>
`;

code = code.replace(/<Route path="\/product\/:id" element=\{<Product \/>\} \/>\n(\s+)\n(\s+)\n(\s+)\n(\s+)\n(\s+)/, `<Route path="/product/:id" element={<Product />} />\n${accountRoutes}\n`);

fs.writeFileSync('src/App.tsx', code);
