import Header from '@/components/Header';
import SettingsPage from '@/components/SettingsContent';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0c10]">
      <Header />
      <main className="pt-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto py-6">
          <SettingsPage />
        </div>
      </main>
    </div>
  );
}
