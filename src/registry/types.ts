import type { CSSProperties } from 'react';

export interface BaseComponentProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
  role?: string;
  tabIndex?: number;
  color?: 'violet' | 'emerald' | 'rose' | 'blue' | 'amber';
}
