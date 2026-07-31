import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import FloatingButtons from '@/components/common/FloatingButtons';
import { getCurrentUser } from '@/lib/auth';

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <>
      <Header user={user} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
