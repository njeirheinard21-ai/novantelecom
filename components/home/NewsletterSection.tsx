import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export function NewsletterSection() {
  return (
    <section className="py-24 bg-canvas border-t border-border">
      <Container>
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Restez informé.
          </h2>
          <p className="text-lg text-fg-muted mb-8">
            S'inscrire for the latest news, offers, and product announcements from Nova Telecom.
          </p>
          
          <form 
            className="w-full max-w-md flex flex-col sm:flex-row gap-4"
            onSubmit={(e) => { e.preventDefault(); /* handle newsletter signup */ }}
          >
            <div className="flex-grow">
              <label htmlFor="email-address" className="sr-only">Adresse e-mail</label>
              <input 
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-xl border border-border bg-canvas px-4 py-3 text-base text-fg placeholder-fg-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div className="mt-3 sm:mt-0 sm:flex-shrink-0">
              <Button type="submit" size="lg" className="w-full">
                Sign Up
              </Button>
            </div>
          </form>
          
          <p className="mt-4 text-xs text-fg-muted text-center">
            En vous inscrivant, vous acceptez nos Terms of Use and Politique de confidentialité.
          </p>
        </div>
      </Container>
    </section>
  );
}
