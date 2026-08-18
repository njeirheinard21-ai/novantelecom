# PHASE 2 SECURITY & COMMERCE REPORT

## Vulnerabilities Found
- **Missing Server-Side Authorization:** Admin APIs relied on client-side routing and simple checks.
- **Overly Permissive Firestore Rules:** The `payments` collection was fully locked out for everyone instead of allowing read for the owner, preventing real-time status updates for customers.
- **Missing Global Error Handling:** Server could potentially leak internal stack traces on unhandled exceptions.
- **Lack of Rate Limiting on Key Endpoints:** Admin and webhook endpoints were not rate-limited.

## Vulnerabilities Fixed
- **Centralized Permissions:** Implemented a unified `hasPermission` logic shared between frontend and server.
- **Server-Side Authorization:** Implemented `requirePermission` middleware on all administrative endpoints to restrict operations based on user role (e.g., `orders:read`, `settings:manage`).
- **Normalized Errors:** Added a global Express error handler to sanitize outputs in production.
- **Rate Limiting:** Added `express-rate-limit` to `adminRouter`, `payments/webhook`, `payments/initialize`, `orders/`, and `orders/track`.

## Payment Flow
1. Customer initiates checkout.
2. Server validates products and calculates authoritative total price.
3. Server initializes payment record and generates `redirectUrl`.
4. Provider webhook (`/api/payments/webhook`) processes incoming notifications, verifying the HMAC signature using `PAYMENT_WEBHOOK_SECRET`.
5. Checkout waiting page listens to real-time `payments` collection updates using Firestore `onSnapshot`.
6. Once payment status changes to `successful`, order status updates to `paid` and user is automatically redirected to their orders list.

## Authorization Model
- **Roles:** `customer`, `staff`, `admin`, `super_admin`.
- **Permissions Structure:** Maps explicit capabilities (e.g., `products:write`) to specific roles.
- **Server Authority:** The server reads the role from the user's Firestore document attached to their authenticated token, guaranteeing state cannot be manipulated client-side.

## Firestore Security Status
- `users`: Users can read/write their own profile; Admins can manage all.
- `orders`: Customers can read their own orders; Admins can read all; Writes are disabled from client.
- `payments`: Customers can read their own payments; Writes are disabled from client.
- `inventory_ledger`: fully restricted from client.
- `settings`: super_admins can write; all can read.

## Test Results
- All unit and integration tests are green.
- `npm run build` succeeds perfectly.
- Linter checks pass without errors.
