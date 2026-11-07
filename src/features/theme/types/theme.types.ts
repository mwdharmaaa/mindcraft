import { BackgroundVariant } from '@xyflow/react';

export interface ThemePreset {
  id: string;
  name: string;
  canvasBg: string;
  dotColor: string;
  dotSize: number;
  dotGap: number;
  variant: BackgroundVariant;
  panelBg: string;
  borderColor: string;
  primaryAccent: string;
}
