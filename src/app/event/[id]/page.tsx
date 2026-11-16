import { Suspense } from 'react';
import Header from '@/components/Header';
import EventDetailClient from '@/components/EventDetailClient';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#0a0c10]">
      <Header />
      <Suspense fallback={
        <main className="pt-16 px-4 md:px-6">
          <div className="max-w-6xl mx-auto py-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-800 rounded w-1/3" />
              <div className="h-48 bg-[#141720] rounded-2xl" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 h-64 bg-[#141720] rounded-2xl" />
                <div className="h-64 bg-[#141720] rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
      }>
        <EventDetailClient eventId={id} />
      </Suspense>
    </div>
  );
}
