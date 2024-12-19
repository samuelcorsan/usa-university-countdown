interface Window {
  dataLayer: any[]; // or use a more specific type if known
  gtag: (command: string, ...args: any[]) => void;
}
