const fs = require('fs');
const path = require('path');

const infoDir = 'src/pages/info';
const files = fs.readdirSync(infoDir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const componentName = file.replace('.tsx', '');
    const title = componentName.replace(/([A-Z])/g, ' $1').trim();
    
    const code = `import { SEO } from '../../components/SEO';
import { Container } from '../../components/ui/Container';

export default function ${componentName}() {
  return (
    <div className="py-24 min-h-[60vh] bg-canvas-secondary/30">
      <SEO title="${title}" />
      <Container className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">${title}</h1>
        
        <div className="bg-canvas border border-border/50 rounded-[2rem] p-8 md:p-12 shadow-sm">
          <p className="text-xl text-fg-muted font-medium mb-6">
            This section is currently being updated.
          </p>
          <div className="space-y-6 text-fg/80 leading-relaxed">
            <p>
              We are working to bring you the best possible experience. Check back soon for more details regarding our ${title.toLowerCase()} policies and options.
            </p>
            <p>
              If you have immediate questions, please reach out to our support team or visit an Apple Store near you.
            </p>
          </div>
          <div className="mt-10 pt-8 border-t border-border/50">
            <a href="/" className="text-accent font-medium hover:underline">
              Return to Homepage
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
`;
    fs.writeFileSync(path.join(infoDir, file), code);
  }
});
