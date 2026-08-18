import { useScrollLock } from '../../hooks/useScrollLock';
export function Navbar() {
  useScrollLock(true);
  return <nav>Navbar</nav>;
}
