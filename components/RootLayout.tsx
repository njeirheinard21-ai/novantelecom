import { Outlet } from 'react-router';
import { Suspense, lazy } from 'react';
import { Loading } from './Loading';
import { Header } from './Header';
import { Footer } from './Footer';
import { useCartStore } from '../store/cartStore';
const CartDrawer = lazy(() => import('./storefront/CartDrawer').then(m => ({ default: m.CartDrawer })));

export function RootLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-canvas text-fg">
      <Header />
      
      <main className="flex-grow w-full flex flex-col">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      {useCartStore(state => state.isOpen) && <Suspense fallback={null}><CartDrawer /></Suspense>}
    </div>
  );
}

