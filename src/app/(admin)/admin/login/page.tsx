'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-brand-dark text-center mb-2 font-[family-name:var(--font-platypi)]">
          Area Riservata
        </h1>
        <p className="text-sm text-brand-gray-medium text-center mb-6">
          Il Benessere Ritrovato - Dashboard Admin
        </p>
        <form action={formAction}>
          <label className="block text-sm font-medium text-brand-charcoal mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple"
            placeholder="Inserisci la password"
          />
          {state?.error && (
            <p className="mt-2 text-sm text-red-500">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="mt-4 w-full py-3 bg-brand-purple text-white rounded-lg font-medium hover:bg-brand-purple-dark transition-colors disabled:opacity-50"
          >
            {isPending ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}
