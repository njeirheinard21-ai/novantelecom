import { BrowserRouter, Routes, Route } from 'react-router';
import { lazy } from 'react';
import { AuthProvider } from './components/auth/AuthProvider';
import { RouteGuard } from './components/auth/RouteGuard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RootLayout } from './components/RootLayout';
import { NotFound } from './components/NotFound';
import { AdminLayout } from './components/admin/AdminLayout';

const Home = lazy(() => import('./pages/Home'));
const Category = lazy(() => import('./pages/Category'));
const Product = lazy(() => import('./pages/Product'));
const AdminProductList = lazy(() => import('./pages/admin/products/ProductList'));
const AdminProductForm = lazy(() => import('./pages/admin/products/ProductForm'));
const AdminOrderList = lazy(() => import('./pages/admin/orders/AdminOrderList'));
const AdminOrderDetail = lazy(() => import('./pages/admin/orders/AdminOrderDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutWait = lazy(() => import('./pages/CheckoutWait'));

const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Inventory = lazy(() => import('./pages/admin/Inventory'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Staff = lazy(() => import('./pages/admin/Staff'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));



const AccountLayout = lazy(() => import('./pages/account/AccountLayout'));
const Overview = lazy(() => import('./pages/account/Overview'));
const Orders = lazy(() => import('./pages/account/Orders'));
const OrderDetails = lazy(() => import('./pages/account/OrderDetails'));
const Addresses = lazy(() => import('./pages/account/Addresses'));
const AccountSupport = lazy(() => import('./pages/account/Support'));
const AccountWishlist = lazy(() => import('./pages/account/Wishlist'));
const Profile = lazy(() => import('./pages/account/Profile'));
const Security = lazy(() => import('./pages/account/Security'));
const Preferences = lazy(() => import('./pages/account/Preferences'));

const Services = lazy(() => import('./pages/info/Services'));
const Support = lazy(() => import('./pages/info/Support'));
const Contact = lazy(() => import('./pages/info/Contact'));
const TradeIn = lazy(() => import('./pages/info/TradeIn'));
const Repairs = lazy(() => import('./pages/info/Repairs'));
const Financing = lazy(() => import('./pages/info/Financing'));
const Warranty = lazy(() => import('./pages/info/Warranty'));

const FAQ = lazy(() => import('./pages/info/FAQ'));
const Legal = lazy(() => import('./pages/info/Legal'));
const Search = lazy(() => import('./pages/info/Search'));
const Wishlist = lazy(() => import('./pages/info/Wishlist'));


export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/product/:id" element={<Product />} />

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

<Route path="/admin" element={<RouteGuard requireAuth requirePermission="orders:read"><AdminLayout /></RouteGuard>}>
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
              
              
              <Route path="/checkout" element={<RouteGuard requireAuth><Checkout /></RouteGuard>} />
              <Route path="/checkout/wait" element={<RouteGuard requireAuth><CheckoutWait /></RouteGuard>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              
              <Route path="/services" element={<Services />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/trade-in" element={<TradeIn />} />
              <Route path="/repairs" element={<Repairs />} />
              <Route path="/financing" element={<Financing />} />
              <Route path="/warranty" element={<Warranty />} />

              <Route path="/faq" element={<FAQ />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/search" element={<Search />} />
              <Route path="/wishlist" element={<RouteGuard requireAuth><Wishlist /></RouteGuard>} />


              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
