const fs = require('fs');

let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

// Modernize the checkout layout
code = code.replace(/<Container className="py-12">[\s\S]*?<\/Container>/, 
  `<Container className="py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-12 text-center">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Where should we send your order?</h2>
              <div className="space-y-4">
                <input required type="text" placeholder="Full Name" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-4 focus:bg-canvas transition-colors" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                <input required type="text" placeholder="Phone Number (e.g. +237...)" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-4 focus:bg-canvas transition-colors" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <input required type="text" placeholder="Street Address" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-4 focus:bg-canvas transition-colors" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="City" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-4 focus:bg-canvas transition-colors" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                  <input required type="text" placeholder="Postal Code" className="w-full border border-border/50 bg-canvas-secondary rounded-xl p-4 focus:bg-canvas transition-colors" value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} />
                </div>
                <input required type="text" className="w-full border border-border/50 bg-canvas-secondary/50 text-fg-muted rounded-xl p-4 cursor-not-allowed" readOnly value={form.country} />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">How would you like to pay?</h2>
              <div className="space-y-3">
                <label className={\`flex items-center space-x-3 border \${paymentMethod === 'orange_money' ? 'border-accent bg-accent/5' : 'border-border/50 bg-canvas-secondary'} rounded-xl p-5 cursor-pointer transition-colors\`}>
                  <input type="radio" name="payment" value="orange_money" checked={paymentMethod === 'orange_money'} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-5 h-5 accent-accent" />
                  <span className="font-medium text-lg">Orange Money</span>
                </label>
                <label className={\`flex items-center space-x-3 border \${paymentMethod === 'mtn_momo' ? 'border-accent bg-accent/5' : 'border-border/50 bg-canvas-secondary'} rounded-xl p-5 cursor-pointer transition-colors\`}>
                  <input type="radio" name="payment" value="mtn_momo" checked={paymentMethod === 'mtn_momo'} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-5 h-5 accent-accent" />
                  <span className="font-medium text-lg">MTN Mobile Money</span>
                </label>
                <label className={\`flex items-center space-x-3 border \${paymentMethod === 'cash_on_delivery' ? 'border-accent bg-accent/5' : 'border-border/50 bg-canvas-secondary'} rounded-xl p-5 cursor-pointer transition-colors\`}>
                  <input type="radio" name="payment" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-5 h-5 accent-accent" />
                  <span className="font-medium text-lg">Cash on Delivery</span>
                </label>
              </div>
            </section>
          </form>
        </div>

        <div className="w-full md:w-[380px] flex-shrink-0">
          <div className="bg-canvas-secondary rounded-3xl p-8 sticky top-24">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div className="flex-1 pr-4">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-fg-muted ml-1">x{item.quantity}</span>
                  </div>
                  <span className="font-medium whitespace-nowrap">{(item.product.price * item.quantity).toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border/50 pt-4 space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-fg-muted">
                <span>Subtotal</span>
                <span>{items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
            </div>
            
            <div className="flex justify-between font-semibold text-xl mb-8">
              <span>Total</span>
              <span>{items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toLocaleString()} FCFA</span>
            </div>

            <Button 
              form="checkout-form"
              type="submit" 
              className="w-full rounded-xl py-6 text-lg bg-accent hover:bg-accent/90" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
            <p className="text-xs text-center text-fg-muted mt-4">
               By placing this order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </Container>`);

fs.writeFileSync('src/pages/Checkout.tsx', code);
