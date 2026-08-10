mkdir -p src/pages/info
for page in account services support contact trade-in repairs financing warranty; do
  Component=$(echo $page | awk -F- '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1' OFS="")
  cat << INNER > src/pages/info/$Component.tsx
import { SEO } from '../../components/SEO';
import { Container } from '../../components/ui/Container';

export default function $Component() {
  return (
    <div className="py-24 min-h-[60vh]">
      <SEO title="$Component" />
      <Container>
        <h1 className="text-4xl font-semibold mb-6">$Component</h1>
        <p className="text-xl text-fg-muted">This page is currently under construction.</p>
      </Container>
    </div>
  );
}
INNER
done
