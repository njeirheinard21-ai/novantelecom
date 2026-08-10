import { Outlet } from 'react-router';
import { Suspense, lazy } from 'react';
import { Loading } from './Loading';
import { Header } from './Header';
import { Footer } from './Footer';
const CartDrawer = lazy(() => import('./storefront/CartDrawer').then(m => ({ default: m.CartDrawer })));

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-fg">
      <Header />
      
      <main className="flex-grow w-full flex flex-col">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <Suspense fallback={null}><CartDrawer /></Suspense>
    </div>
  );
}

