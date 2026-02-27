import Link from 'next/link';
import { prisma } from '@/lib/db';
import { logoutAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      nome: true,
      cognome: true,
      email: true,
      locusNormalized: true,
      eventiSaluteNormalized: true,
      medicineAlternativeNormalized: true,
      leadershipNormalized: true,
      selfAssessmentAverage: true,
      adminViewed: true,
      emailSent: true,
      isLite: true,
    },
  });

  const unseenCount = submissions.filter((s) => !s.adminViewed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-brand-dark font-[family-name:var(--font-platypi)]">
              Dashboard
            </h1>
            {unseenCount > 0 && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-purple text-white">
                {unseenCount} nuov{unseenCount === 1 ? 'a' : 'e'}
              </span>
            )}
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-brand-gray-medium hover:text-brand-dark transition-colors"
            >
              Esci
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {submissions.length === 0 ? (
          <div className="text-center py-16 text-brand-gray-medium">
            <p className="text-lg mb-2">Nessuna consulenza ricevuta</p>
            <p className="text-sm">Le nuove consulenze appariranno qui.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-brand-charcoal">Stato</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-charcoal">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-charcoal">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-charcoal">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-charcoal">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-charcoal">Media Punteggi</th>
                    <th className="text-left px-4 py-3 font-medium text-brand-charcoal">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => {
                    const avg = (
                      (((s.locusNormalized - 25) / 75) * 100 +
                        ((s.eventiSaluteNormalized - 18) / 54) * 100 +
                        ((s.medicineAlternativeNormalized - 20) / 60) * 100 +
                        ((s.leadershipNormalized - 20) / 60) * 100 +
                        ((s.selfAssessmentAverage - 1) / 9) * 100) /
                      5
                    ).toFixed(0);

                    return (
                      <tr
                        key={s.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block w-2.5 h-2.5 rounded-full ${
                              s.adminViewed ? 'bg-gray-300' : 'bg-brand-purple'
                            }`}
                          />
                        </td>
                        <td className="px-4 py-3 text-brand-gray-medium whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString('it-IT', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/submission/${s.id}`}
                            className="font-medium text-brand-dark hover:text-brand-purple transition-colors"
                          >
                            {s.cognome} {s.nome}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-brand-gray-medium">{s.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              s.isLite
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {s.isLite ? 'Lite' : 'Completa'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-brand-charcoal">{avg}%</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              s.emailSent
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {s.emailSent ? 'Inviata' : 'Non inviata'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
