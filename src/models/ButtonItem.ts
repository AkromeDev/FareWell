export interface ButtonItem {
  label: string;
  link: string;
  theme: 'light' | 'dark';
  external?: boolean;
  analyticsEvent?: string;
  analyticsLocation?: string;
  analyticsLabel?: string;
}