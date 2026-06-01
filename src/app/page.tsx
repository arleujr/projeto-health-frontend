import { redirect } from 'next/navigation';

export default function HomePage() {
  // Automatically routes the initial entry point to the general dashboard layout
  redirect('/dashboard');
}