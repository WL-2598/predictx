import Header from '@/components/Header';
import LeaderboardPage from '@/components/LeaderboardTable';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0c10]">
      <Header />
      <main className="pt-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto py-6">
          <LeaderboardPage />
        </div>
      </main>
    </div>
  );
}
