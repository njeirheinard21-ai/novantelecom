import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '../../components/ui/LocalizedLink';
import { MessageCircle, FileText, Package, Wrench } from 'lucide-react';

export default function Support() {
  const { t } = useTranslation(['common']);
  const supportTopics = [
    { icon: Package, title: 'Orders & Delivery', desc: 'Track, return, or cancel an order', link: '/account/orders' },
    { icon: Wrench, title: 'Repairs & Warranty', desc: 'Check coverage or start a repair', link: '/repairs' },
    { icon: FileText, title: 'FAQ', desc: 'Find answers to common questions', link: '/faq' },
    { icon: MessageCircle, title: 'Contact Us', desc: 'Get in touch with our team', link: '/contact' },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-semibold tracking-tight">{t('support', { ns: 'common' })}</h2>

      <div className="bg-canvas border border-border/50 rounded-[2rem] p-6 sm:p-10 shadow-sm text-center">
        <h3 className="text-xl font-semibold mb-2">Need help?</h3>
        <p className="text-fg-muted mb-8 max-w-lg mx-auto">Our support team is here to help with your orders, payments, repairs, and product questions.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {supportTopics.map((topic, i) => (
            <Link 
              key={i} 
              to={topic.link}
              className="group flex flex-col p-6 rounded-2xl border border-border/50 bg-canvas-secondary/30 hover:bg-canvas hover:border-accent/50 hover:shadow-sm transition-all"
            >
              <topic.icon className="w-8 h-8 text-fg-muted mb-4 group-hover:text-accent transition-colors" />
              <h4 className="font-semibold">{topic.title}</h4>
              <p className="text-sm text-fg-muted mt-1">{topic.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
