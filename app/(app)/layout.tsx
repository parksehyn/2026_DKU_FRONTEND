import AppNav from '@/components/AppNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#E8ECF2' }}>
      <AppNav />
      {children}
    </div>
  );
}
