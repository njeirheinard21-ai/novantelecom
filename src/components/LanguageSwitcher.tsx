import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const changeLanguage = (lng: string) => {
    // If the path starts with /en or /fr, replace it
    const currentPath = location.pathname;
    const currentLang = i18n.language?.split('-')[0] || 'en';
    
    let newPath = currentPath;
    if (currentPath.startsWith(`/${currentLang}`)) {
      newPath = currentPath.replace(`/${currentLang}`, `/${lng}`);
    } else if (currentPath === '/') {
      newPath = `/${lng}`;
    }
    
    i18n.changeLanguage(lng);
    navigate(newPath + location.search + location.hash);
  };

  const currentLang = i18n.language?.split('-')[0] || 'en';

  return (
    <div className="flex items-center space-x-2 text-sm font-medium">
      <button
        onClick={() => changeLanguage('en')}
        className={`hover:text-accent transition-colors ${currentLang === 'en' ? 'text-fg' : 'text-fg-muted'}`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-border">|</span>
      <button
        onClick={() => changeLanguage('fr')}
        className={`hover:text-accent transition-colors ${currentLang === 'fr' ? 'text-fg' : 'text-fg-muted'}`}
        aria-label="Switch to French"
      >
        FR
      </button>
    </div>
  );
}
