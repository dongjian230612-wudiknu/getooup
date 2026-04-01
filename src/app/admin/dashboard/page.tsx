'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to orders page as the default admin view
    router.push('/admin/orders');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-b-2 border-black"></div>
    </div>
  );
}
