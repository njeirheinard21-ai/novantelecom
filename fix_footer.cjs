const fs = require('fs');
const write = (f, c) => fs.writeFileSync(f, c);

write('src/components/Footer.tsx', `
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-canvas-secondary pt-12 pb-8 text-xs text-fg-muted border-t border-border/50">
      <div className="max-w-[980px] mx-auto px-4">
        <div className="border-b border-border/50 pb-8 mb-8">
          <p className="mb-4">
            * Prices are subject to change. Trade-in values will vary based on the condition, year, and configuration of your eligible trade-in device. 
            Not all devices are eligible for credit. You must be at least 18 years old to be eligible to trade in for credit or for an Apple Gift Card. 
            Trade-in value may be applied toward qualifying new device purchase, or added to an Apple Gift Card. Actual value awarded is based on receipt 
            of a qualifying device matching the description provided when estimate was made.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-fg mb-3">Shop and Learn</h3>
            <ul className="space-y-2">
              <li><Link to="/category/mac" className="hover:underline">Mac</Link></li>
              <li><Link to="/category/ipad" className="hover:underline">iPad</Link></li>
              <li><Link to="/category/iphone" className="hover:underline">iPhone</Link></li>
              <li><Link to="/category/watch" className="hover:underline">Watch</Link></li>
              <li><Link to="/category/airpods" className="hover:underline">AirPods</Link></li>
              <li><Link to="/category/accessories" className="hover:underline">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-fg mb-3">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/support" className="hover:underline">Support</Link></li>
              <li><Link to="/trade-in" className="hover:underline">Trade In</Link></li>
              <li><Link to="/repairs" className="hover:underline">Repairs</Link></li>
              <li><Link to="/financing" className="hover:underline">Financing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-fg mb-3">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/account" className="hover:underline">Manage Your ID</Link></li>
              <li><Link to="/orders" className="hover:underline">Orders</Link></li>
              <li><Link to="/login" className="hover:underline">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-fg mb-3">About iStore</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link to="/legal" className="hover:underline">Legal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Copyright © {new Date().getFullYear()} iStore Nigeria. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/legal" className="hover:underline">Privacy Policy</Link>
            <span className="text-border">|</span>
            <Link to="/legal" className="hover:underline">Terms of Use</Link>
            <span className="text-border">|</span>
            <Link to="/legal" className="hover:underline">Legal</Link>
            <span className="text-border">|</span>
            <Link to="/contact" className="hover:underline">Site Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
`);
