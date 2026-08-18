import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  image: string;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, image, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex-1 flex flex-col md:flex-row w-full min-h-[calc(100vh-64px)]">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-canvas">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3 text-fg">{title}</h1>
            <p className="text-fg-muted">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
      
      <div className="hidden md:block w-1/2 relative bg-canvas-secondary">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 mix-blend-multiply" />
        <img 
          src={image} 
          alt="Authentication background" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
}
