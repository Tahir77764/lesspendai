export default async function AuditPage({ params }: { params: { id: string } }) {
  // Await the params object before accessing properties, as required by Next.js 15
  const { id } = await params;
  
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Audit Results for {id}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Loading your cloud audit details...</p>
      </div>
    </main>
  );
}
