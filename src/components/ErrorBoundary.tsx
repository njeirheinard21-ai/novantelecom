import { Component, ErrorInfo, ReactNode } from 'react';
import i18n from '../i18n';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-dvh p-4 bg-canvas text-fg">
          <h1 className="text-2xl font-display font-semibold mb-4 text-brand-primary">{i18n.t('something_went_wrong', { ns: 'common' })}</h1>
          <p className="text-fg-muted mb-6">{i18n.t('unexpected_error', { ns: 'common' })}</p>
          <button 
            className="px-4 py-2 bg-brand-primary text-surface rounded hover:bg-opacity-90"
            onClick={() => window.location.reload()}
          >
            {i18n.t('reload_page', { ns: 'common' })}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
