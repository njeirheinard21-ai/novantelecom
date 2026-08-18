const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const newImports = `
const AccountLayout = lazy(() => import('./pages/account/AccountLayout'));
const Overview = lazy(() => import('./pages/account/Overview'));
const Orders = lazy(() => import('./pages/account/Orders'));
const OrderDetails = lazy(() => import('./pages/account/OrderDetails'));
const Addresses = lazy(() => import('./pages/account/Addresses'));
const Profile = lazy(() => import('./pages/account/Profile'));
const Security = lazy(() => import('./pages/account/Security'));
const Preferences = lazy(() => import('./pages/account/Preferences'));
const Support = lazy(() => import('./pages/account/Support'));
const Wishlist = lazy(() => import('./pages/account/Wishlist'));
`;

code = code.replace(/const Account = lazy\(\(\) => import\('\.\/pages\/info\/Account'\)\);/, newImports);

const oldRoutes = `
              <Route path="/account" element={<RouteGuard requireAuth><Account /></RouteGuard>} />
              <Route path="/orders" element={<RouteGuard requireAuth><OrderList /></RouteGuard>} />
              <Route path="/orders/:id" element={<RouteGuard requireAuth><OrderDetail /></RouteGuard>} />
`;

const newRoutes = `
              <Route path="/account" element={<RouteGuard requireAuth><AccountLayout /></RouteGuard>}>
                <Route index element={<Overview />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetails />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="profile" element={<Profile />} />
                <Route path="security" element={<Security />} />
                <Route path="preferences" element={<Preferences />} />
                <Route path="support" element={<Support />} />
                <Route path="wishlist" element={<Wishlist />} />
              </Route>
`;

code = code.replace(oldRoutes, newRoutes);
code = code.replace(/<Route path="\/orders" element=\{<RouteGuard requireAuth><OrderList \/><\/RouteGuard>\} \/>/g, '');
code = code.replace(/<Route path="\/orders\/:id" element=\{<RouteGuard requireAuth><OrderDetail \/><\/RouteGuard>\} \/>/g, '');
code = code.replace(/<Route path="\/account" element=\{<RouteGuard requireAuth><Account \/><\/RouteGuard>\} \/>/g, '');

fs.writeFileSync('src/App.tsx', code);
