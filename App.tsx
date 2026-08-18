import { I18nHelmet } from './components/I18nHelmet';
import { BrowserRouter, Routes, Route } from 'react-router';
import { lazy } from 'react';
import { lazyWithRetry } from './lib/lazyWithRetry';
import { AuthProvider } from './components/auth/AuthProvider';
import { RouteGuard } from './components/auth/RouteGuard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RootLayout } from './components/RootLayout';
import { NotFound } from './components/NotFound';
const AdminLayout = lazyWithRetry(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));

const Home = lazyWithRetry(() => import('./pages/Home'));
const Category = lazyWithRetry(() => import('./pages/Category'));
const Product = lazyWithRetry(() => import('./pages/Product'));
const AdminProductList = lazyWithRetry(() => import('./pages/admin/products/ProductList'));
const AdminProductForm = lazyWithRetry(() => import('./pages/admin/products/ProductForm'));
const AdminOrderList = lazyWithRetry(() => import('./pages/admin/orders/AdminOrderList'));
const AdminOrderDetail = lazyWithRetry(() => import('./pages/admin/orders/AdminOrderDetail'));
const Checkout = lazyWithRetry(() => import('./pages/Checkout'));
const CheckoutWait = lazyWithRetry(() => import('./pages/CheckoutWait'));

const Dashboard = lazyWithRetry(() => import('./pages/admin/Dashboard'));
const Inventory = lazyWithRetry(() => import('./pages/admin/Inventory'));
const Customers = lazyWithRetry(() => import('./pages/admin/Customers'));
const Staff = lazyWithRetry(() => import('./pages/admin/Staff'));
const Settings = lazyWithRetry(() => import('./pages/admin/Settings'));
const Login = lazyWithRetry(() => import('./pages/auth/Login'));
const Register = lazyWithRetry(() => import('./pages/auth/Register'));
const ResetPassword = lazyWithRetry(() => import('./pages/auth/ResetPassword'));



const AccountLayout = lazyWithRetry(() => import('./pages/account/AccountLayout'));
const Overview = lazyWithRetry(() => import('./pages/account/Overview'));
const Orders = lazyWithRetry(() => import('./pages/account/Orders'));
const OrderDetails = lazyWithRetry(() => import('./pages/account/OrderDetails'));
const Addresses = lazyWithRetry(() => import('./pages/account/Addresses'));
const AccountSupport = lazyWithRetry(() => import('./pages/account/Support'));
const AccountWishlist = lazyWithRetry(() => import('./pages/account/Wishlist'));
const Profile = lazyWithRetry(() => import('./pages/account/Profile'));
const Security = lazyWithRetry(() => import('./pages/account/Security'));
const Preferences = lazyWithRetry(() => import('./pages/account/Preferences'));

const Services = lazyWithRetry(() => import('./pages/info/Services'));
const Support = lazyWithRetry(() => import('./pages/info/Support'));
const Contact = lazyWithRetry(() => import('./pages/info/Contact'));
const TradeIn = lazyWithRetry(() => import('./pages/info/TradeIn'));
const Repairs = lazyWithRetry(() => import('./pages/info/Repairs'));
const Financing = lazyWithRetry(() => import('./pages/info/Financing'));
const Warranty = lazyWithRetry(() => import('./pages/info/Warranty'));

const FAQ = lazyWithRetry(() => import('./pages/info/FAQ'));
const Legal = lazyWithRetry(() => import('./pages/info/Legal'));
const Search = lazyWithRetry(() => import('./pages/info/Search'));
const Wishlist = lazyWithRetry(() => import('./pages/info/Wishlist'));



import { Navigate, Outlet, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function LangRedirect() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.split('-')[0] || 'en';
  const targetLang = ['en', 'fr'].includes(currentLang) ? currentLang : 'en';
  return <Navigate to={`/${targetLang}`} replace />;
}

import { useLocation } from 'react-router';

function LangSync() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();

  if (lang && !['en', 'fr'].includes(lang)) {
    const currentLang = i18n.language?.split('-')[0] || 'en';
    const targetLang = ['en', 'fr'].includes(currentLang) ? currentLang : 'en';
    
    let newPath = '';
    // Check if the path part is an unsupported locale like 'es', 'pt-BR', 'zh-TW'
    if (/^[a-z]{2}(-[A-Z]{2})?$/i.test(lang)) {
      newPath = `/${targetLang}${location.pathname.substring(lang.length + 1)}`;
    } else {
      // It's likely a valid app route but the user forgot the language prefix (e.g. /login)
      newPath = `/${targetLang}${location.pathname}`;
    }
    
    return <Navigate to={`${newPath}${location.search}`} replace />;
  }

  useEffect(() => {
    if (lang && ['en', 'fr'].includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  return <Outlet />;
}

export default function App() {
  return (
    <ErrorBoundary><div className="bg-surface/50"></div>
      <AuthProvider>
        <BrowserRouter>
          <I18nHelmet />
          <Routes>
            <Route path="/" element={<LangRedirect />} />
            <Route path="/:lang" element={<LangSync />}>
              <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="category/:id" element={<Category />} />
              <Route path="product/:id" element={<Product />} />

              <Route path="account" element={<RouteGuard requireAuth><AccountLayout /></RouteGuard>}>
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

<Route path="admin" element={<RouteGuard requireAuth requirePermission="orders:read"><AdminLayout /></RouteGuard>}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<RouteGuard requireAuth requirePermission="products:read"><AdminProductList /></RouteGuard>} />
                <Route path="products/new" element={<RouteGuard requireAuth requirePermission="products:write"><AdminProductForm /></RouteGuard>} />
                <Route path="products/:id/edit" element={<RouteGuard requireAuth requirePermission="products:write"><AdminProductForm /></RouteGuard>} />
                <Route path="orders" element={<RouteGuard requireAuth requirePermission="orders:read"><AdminOrderList /></RouteGuard>} />
                <Route path="orders/:id" element={<RouteGuard requireAuth requirePermission="orders:read"><AdminOrderDetail /></RouteGuard>} />
                <Route path="inventory" element={<RouteGuard requireAuth requirePermission="inventory:read"><Inventory /></RouteGuard>} />
                <Route path="customers" element={<RouteGuard requireAuth requirePermission="customers:read"><Customers /></RouteGuard>} />
                <Route path="staff" element={<RouteGuard requireAuth requirePermission="users:manage"><Staff /></RouteGuard>} />
                <Route path="settings" element={<RouteGuard requireAuth requirePermission="settings:manage"><Settings /></RouteGuard>} />
              </Route>
              
              
              <Route path="checkout" element={<RouteGuard requireAuth><Checkout /></RouteGuard>} />
              <Route path="checkout/wait" element={<RouteGuard requireAuth><CheckoutWait /></RouteGuard>} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="reset-password" element={<ResetPassword />} />
              
              
              <Route path="services" element={<Services />} />
              <Route path="support" element={<Support />} />
              <Route path="contact" element={<Contact />} />
              <Route path="trade-in" element={<TradeIn />} />
              <Route path="repairs" element={<Repairs />} />
              <Route path="financing" element={<Financing />} />
              <Route path="warranty" element={<Warranty />} />

              <Route path="faq" element={<FAQ />} />
              <Route path="legal" element={<Legal />} />
              <Route path="search" element={<Search />} />
              <Route path="wishlist" element={<RouteGuard requireAuth><Wishlist /></RouteGuard>} />


              <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
