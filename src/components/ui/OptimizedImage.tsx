import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  baseName: string; // e.g. "/optimized/image_1"
  alt: string;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({ baseName, alt, className, priority = false, ...props }: OptimizedImageProps) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`
          ${baseName}_640.avif 640w,
          ${baseName}_960.avif 960w,
          ${baseName}_1280.avif 1280w
        `}
        sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
      />
      <source
        type="image/webp"
        srcSet={`
          ${baseName}_640.webp 640w,
          ${baseName}_960.webp 960w,
          ${baseName}_1280.webp 1280w
        `}
        sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
      />
      <img
        src={`${baseName}_960.webp`}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        {...props}
      />
    </picture>
  );
}
