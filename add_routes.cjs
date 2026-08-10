const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const imports = `
const FAQ = lazy(() => import('./pages/info/FAQ'));
const Legal = lazy(() => import('./pages/info/Legal'));
const Search = lazy(() => import('./pages/info/Search'));
const Wishlist = lazy(() => import('./pages/info/Wishlist'));
`;

const routes = `
              <Route path="/faq" element={<FAQ />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/search" element={<Search />} />
              <Route path="/wishlist" element={<RouteGuard requireAuth><Wishlist /></RouteGuard>} />
`;

appCode = appCode.replace('const Warranty = lazy(() => import(\'./pages/info/Warranty\'));', 'const Warranty = lazy(() => import(\'./pages/info/Warranty\'));\n' + imports);
appCode = appCode.replace('<Route path="/warranty" element={<Warranty />} />', '<Route path="/warranty" element={<Warranty />} />\n' + routes);

fs.writeFileSync('src/App.tsx', appCode);
