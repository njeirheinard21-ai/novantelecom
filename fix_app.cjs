const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const imports = `
const Account = lazy(() => import('./pages/info/Account'));
const Services = lazy(() => import('./pages/info/Services'));
const Support = lazy(() => import('./pages/info/Support'));
const Contact = lazy(() => import('./pages/info/Contact'));
const TradeIn = lazy(() => import('./pages/info/TradeIn'));
const Repairs = lazy(() => import('./pages/info/Repairs'));
const Financing = lazy(() => import('./pages/info/Financing'));
const Warranty = lazy(() => import('./pages/info/Warranty'));
`;

const routes = `
              <Route path="/account" element={<RouteGuard requireAuth><Account /></RouteGuard>} />
              <Route path="/services" element={<Services />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/trade-in" element={<TradeIn />} />
              <Route path="/repairs" element={<Repairs />} />
              <Route path="/financing" element={<Financing />} />
              <Route path="/warranty" element={<Warranty />} />
`;

code = code.replace(/export default function App\(\) \{/, imports + '\nexport default function App() {');
code = code.replace(/<Route path="\*" element=\{<NotFound \/>\} \/>/, routes + '\n              <Route path="*" element={<NotFound />} />');

fs.writeFileSync('src/App.tsx', code);
