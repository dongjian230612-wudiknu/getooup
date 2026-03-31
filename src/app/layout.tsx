import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Getooup | Premium Prescription Glasses',
  description: 'Premium prescription glasses at affordable prices. Shop standard and Asia fit frames with custom lenses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
