import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0a0a0f]">
        <div className="container mx-auto p-6 lg:p-10 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
