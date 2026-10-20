# Istruzioni per gli agenti

## Contesto e architettura

- App Next.js App Router con React e TypeScript strict; l'alias `@/*` punta a `src/*`.
- Il flusso di consultazione condivide lo stato tramite [WizardContext](src/context/WizardContext.tsx); pagine e azioni sono in `src/app/(consultation)/`.
- Le server actions validano i dati in ingresso e orchestrano persistenza e notifiche; mantieni i calcoli di scoring in [engine.ts](src/lib/scoring/engine.ts) e le definizioni dei test in `src/data/tests/`.
- L'area admin ha autenticazione e middleware dedicati: consulta [auth.ts](src/lib/auth.ts) e [middleware.ts](src/middleware.ts) prima di modificarne l'accesso.

## Verifica

- `npm run dev`: avvia l'app in sviluppo.
- `npm run lint`: esegue ESLint.
- `npm run build`: verifica la build di produzione.
- `package.json` non definisce uno script di test; non presumere che esista una suite eseguibile con `npm test`.

## Dati e configurazione

- I dati personali e di salute richiedono particolare cautela: mantieni la validazione lato server, non aggiungere logging di dati identificabili e non esporre dati nelle risposte o nella documentazione.
- Non copiare password o segreti in file, output o log. L'autenticazione usa `JWT_SECRET` e `ADMIN_PASSWORD_HASH`; non riutilizzare credenziali documentate per ambienti reali.
- Per database e migrazioni fai riferimento allo [schema Prisma](prisma/schema.prisma) e alla configurazione corrente: lo schema dichiara PostgreSQL e `DATABASE_URL`, mentre alcune istruzioni nel [README](README.md) descrivono SQLite. Non applicare quelle istruzioni senza prima risolvere la discrepanza.
- Consulta il [README](README.md) per il flusso utente e le funzionalità, evitando di duplicarne qui la documentazione.
