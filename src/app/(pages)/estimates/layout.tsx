import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schesti - Estimates',
  description: 'Schesti - Estimates',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
