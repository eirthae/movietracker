import type * as React from 'react';

declare global {
  /** Injected by Vite from package.json's version. */
  const __APP_VERSION__: string;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      /** Iconify web component, loaded from index.html. */
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        icon: string;
      };
    }
  }
}
