import GNB from '@/components/GNB';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#E8ECF2' }}>
      <GNB activeMenu="대시보드" />
      {children}
    </div>
  );
}
