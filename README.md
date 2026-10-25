# Il Benessere Ritrovato — Consulenza Preliminare Online

Applicazione web per la raccolta di consulenze preliminari di benessere naturopatico per la Dott.ssa Roberta Loprieno.

---

## Indice

1. [Accesso rapido](#accesso-rapido)
2. [Funzionamento dell'applicazione](#funzionamento-dellapplicazione)
3. [Il Test delle 6A](#il-test-delle-6a)
4. [Metodologia scientifica e scoring](#metodologia-scientifica-e-scoring)
5. [Interpretazione dei risultati](#interpretazione-dei-risultati)
6. [Dashboard amministratore](#dashboard-amministratore)
7. [Sicurezza](#sicurezza)
8. [Privacy e GDPR](#privacy-e-gdpr)
9. [SEO](#seo)
10. [Google Analytics e Cookie Consent](#google-analytics-e-cookie-consent)
11. [Configurazione e avvio](#configurazione-e-avvio)
12. [Configurazione email e produzione](#configurazione-email-e-produzione)

---

## Accesso rapido

| Percorso | Descrizione |
|---|---|
| `http://localhost:3000/` | Pagina di benvenuto → avvia la consulenza |
| `http://localhost:3000/consenso` | Primo step del wizard (consenso) |
| `http://localhost:3000/privacy-policy` | Informativa privacy GDPR |
| `http://localhost:3000/admin/login` | Login area riservata admin |
| `http://localhost:3000/admin/dashboard` | Dashboard (richiede autenticazione) |

---

## Funzionamento dell'applicazione

### Flusso utente (Test delle 6A)

L'utente completa una consulenza in **4 semplici passaggi**:

```
Step 1 — Consenso          Accetta informativa GDPR e disclaimer medico
Step 2 — Dati personali    Nome
Step 3 — Questionario      14 domande: 12 a risposta multipla + 2 slider
Step 4 — Risultati         Profilo di benessere con radar chart + CTA prenotazione
```

Al termine, l'applicazione:
- calcola automaticamente i punteggi nelle sei aree del metodo
- mostra all'utente un profilo visivo (radar chart)
- salva la consulenza nel database
- invia una notifica email alla Dott.ssa Loprieno
- invita l'utente a prenotare una consulenza approfondita

### Flusso amministratore

Dopo il login, la Dott.ssa Loprieno accede alla dashboard dove:
- vede tutte le consulenze ricevute (ordinate per data)
- distingue le consulenze lite (badge arancio) da quelle complete (badge verde)
- legge l'indirizzo email del paziente con un click
- apre il dettaglio completo di ogni consulenza
- aggiunge note private visibili solo a lei
- **completa il questionario** per un paziente che ha fatto la versione lite

---

## Il Test delle 6A

Il questionario pubblico riproduce le 14 domande del documento **Test delle 6A**.
Si risponde d'impulso pensando alla routine delle ultime settimane.

| Area | Domande |
|---|---|
| Alimentazione | 1–2 |
| Attività Fisica | 3–4 |
| Atteggiamento Mentale (Emozioni e Stress) | 5–6 |
| Attività Mentale (Focus e Igiene Digitale) | 7–8 |
| Ambiente | 9–10 |
| Affettività e Relazioni | 11–12 |

### Risposte e punteggi

| Risposta | Domande problema (dispari) | Domande risorsa (pari) |
|---|---|---|
| A — Quasi sempre / Molto spesso | 1 | 4 |
| B — Spesso | 2 | 3 |
| C — Raramente | 3 | 2 |
| D — Quasi mai / Mai | 4 | 1 |

Ogni area somma due risposte: **2–8 punti**, con valori alti associati a maggiore
benessere percepito. Il radar mostra esclusivamente le sei aree, trasformate su
scala 0–100 con `(punteggio − 2) / 6 × 100`.
Il PDF non definisce soglie cliniche o fasce interpretative: non vengono aggiunte.
Le aree con punteggio minimo sono proposte come priorità relative; a parità di tutte
le aree non si conclude che il benessere sia necessariamente elevato.

Le domande 13 e 14 sono slider interi da **1 (Per niente) a 10 (Completamente)**:

- «Complessivamente, in questo periodo mi sento stressato/a.»
- «In generale mi considero una persona felice e appagata.»

Sono mostrate separatamente dal radar. Si conserva la media di benessere già usata
dall'app: `((11 − stress) + felicità) / 2`; questa media è una convenzione
dell'applicazione, non una soglia o un indice validato dal PDF.

Testi, polarità e validazione sono in [six-a.ts](src/data/six-a.ts);
i calcoli rimangono in [engine.ts](src/lib/scoring/engine.ts).
La server action richiede esattamente le 12 risposte ABCD e i due slider validi,
rifiutando domande mancanti, sconosciute o valori fuori scala.

### Persistenza e compatibilità

Le risposte sono salvate nel campo dedicato `Submission.sixAAnswers`; i punteggi
dei vecchi test rimangono nulli per non attribuire significati non pertinenti.
Le consulenze precedenti e il relativo completamento restano disponibili.
Il Test delle 6A è completo con 14 domande e non può essere sovrascritto dal
completamento del vecchio questionario.

Prima di distribuire il codice, applicare la migrazione **PostgreSQL** al database
previsto per l'ambiente, dopo il backup:

```bash
npx prisma migrate deploy
npx prisma generate
```

Non usare le vecchie indicazioni SQLite riportate più avanti per questa migrazione.
La notifica email del nuovo test contiene solo il link all'area riservata,
senza nome, risposte o punteggi.

Verifica locale di domande, polarità, punteggi e validazione:

```bash
node --test tests/six-a.test.mjs
```

---

## Metodologia scientifica e scoring

**Sezione storica:** le regole seguenti descrivono i questionari precedenti,
non il Test delle 6A.

### Scala delle risposte ABCD

Ogni domanda offre 4 opzioni:

| Risposta | Scala discendente | Scala inversa |
|---|---|---|
| A — Molto d'accordo | 4 punti | 1 punto |
| B — Abbastanza d'accordo | 3 punti | 2 punti |
| C — Poco d'accordo | 2 punti | 3 punti |
| D — Per niente d'accordo | 1 punto | 4 punti |

### Normalizzazione del punteggio grezzo

Per rendere confrontabili le versioni lite e completa, il punteggio viene **normalizzato** sull'intervallo della versione completa del test:

```
punteggio_grezzo = somma dei punti delle risposte date

punteggio_normalizzato = ((grezzo − min_subset) / (max_subset − min_subset))
                         × (max_completo − min_completo) + min_completo
```

Dove `min_subset` e `max_subset` dipendono dal numero effettivo di domande risposte (2 nel lite, n nel completo). Questo garantisce che il punteggio normalizzato sia sempre nell'intervallo del test originale, **indipendentemente da quante domande sono state risposte**.

### Intervalli normalizzati dei test completi

| Test | Domande complete | Intervallo normalizzato |
|---|---|---|
| Locus of Control | 25 | 25 — 100 |
| Controllo Eventi e Salute | 18 | 18 — 72 |
| Medicine Alternative | 20 | 20 — 80 |
| Leadership e Autonomia | 20 | 20 — 80 |

### Autovalutazione (slider)

Per gli slider negativi (es. stress) il valore viene invertito prima della media:

```
valore_elaborato = 11 − valore_slider    (per item negativi)
valore_elaborato = valore_slider         (per item positivi)

media_autovalutazione = media(valori_elaborati)
```

Il risultato è una scala 1-10 dove **10 = massimo benessere percepito**.

---

## Interpretazione dei risultati

**Sezione storica:** le fasce seguenti restano associate solo ai vecchi test.

Ogni test ha fasce di interpretazione definite sul punteggio normalizzato:

- **Fascia bassa** → segnalazione di possibile area di lavoro
- **Fascia media** → risultato nella norma
- **Fascia alta** → punto di forza del paziente

Le fasce sono definite nei file `src/data/tests/*.ts` e vengono mostrate:
- all'utente nella pagina risultati (con descrizione testuale)
- alla Dott.ssa Loprieno nel dettaglio della submission (con punteggio grezzo e normalizzato)

Il **radar chart** mostra i 5 punteggi (4 test + autovalutazione) convertiti in percentuale 0-100 per una visione immediata del profilo complessivo.

---

## Dashboard amministratore

### Accesso

**URL:** `http://localhost:3000/admin/login`
(In produzione: `https://[dominio]/admin/login`)

**Password corrente:** `benessere2024!`

> Cambia la password per la produzione — vedi sezione "Configurazione".

### Panoramica della dashboard

Dopo il login viene mostrata la lista di tutte le consulenze:

| Colonna | Descrizione |
|---|---|
| Punto colorato | Viola = non ancora vista, grigio = già vista |
| Data | Data e ora di compilazione |
| Nome | Link al dettaglio della consulenza |
| Email | Indirizzo del paziente |
| Tipo | **Test delle 6A**, oppure **Lite** / **Completa** per i questionari precedenti |
| Media punteggi | Media delle sei aree per il Test delle 6A, dei 5 ambiti per i vecchi questionari |
| Email | Stato notifica email (inviata / non inviata) |

### Dettaglio consulenza

Cliccando su un nome si apre il dettaglio con:
- **Dati personali** del paziente
- **Banner arancio** (se consulenza lite) con bottone "**Completa consulenza**"
- **Punteggi** dei 4 test (grezzo, normalizzato, interpretazione)
- **Autovalutazione** con media e dettaglio per item
- **Stile di vita** (compilato solo nelle consulenze complete)
- **Note private** — campo di testo riservato alla Dott.ssa Loprieno

Per il Test delle 6A il dettaglio mostra invece le sei aree, le 12 risposte
originali e l'autovalutazione globale, senza il banner di completamento storico.

### Completare una consulenza lite

Dalla pagina di dettaglio, cliccando "**Completa consulenza**" si apre un form che:
1. Pre-carica le risposte già date dall'utente (evidenziate in viola con etichetta "compilata dall'utente")
2. Permette di compilare le domande mancanti (in totale: 25+18+20+20 domande ABCD + 10 slider + stile di vita completo)
3. Raccoglie i dati aggiuntivi non richiesti nel lite (età, peso, altezza, città)
4. Salva tutto e ricalcola i punteggi sulla base del questionario completo
5. Aggiorna la consulenza da "Lite" a "Completa"

### Note e gestione paziente

Nella pagina di dettaglio:
- Il campo **Note private** è visibile solo alla Dott.ssa Loprieno, non al paziente
- Il bottone **"Segna come non letto"** / **"Segna come letto"** permette di marcare le consulenze da rivedere

---

## Sicurezza

### Security headers

Il file `next.config.ts` configura i seguenti header di sicurezza su tutte le risposte HTTP:

| Header | Valore |
|---|---|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | Permette `self`, Google Analytics, Google Fonts |

### Rate limiting login admin

Il login admin (`/admin/login`) applica un rate limiter in-memory che blocca l'IP dopo **5 tentativi falliti** per **15 minuti**. Implementato in `src/lib/rate-limit.ts`.

### Validazione input con Zod

La server action `submitSixAConsultation` valida tutti i dati in ingresso con Zod:
- Dati personali: nome (1-100 caratteri)
- Risposte test: valori `A`, `B`, `C`, `D`
- Slider autovalutazione: numeri interi da 1 a 10

### JWT secret obbligatorio

`src/lib/auth.ts` e `src/middleware.ts` richiedono che la variabile `JWT_SECRET` sia impostata. Se manca, il server genera un errore esplicito invece di usare un fallback insicuro.

---

## Privacy e GDPR

### Informativa privacy

La pagina `/privacy-policy` contiene l'informativa completa ex Art. 13 GDPR in italiano. Include:

- Titolare del trattamento (Dott.ssa Roberta Loprieno)
- Finalità e base giuridica del trattamento
- Categorie di dati raccolti
- Periodo di conservazione (24 mesi)
- Diritti dell'interessato (accesso, rettifica, cancellazione, portabilità, ecc.)
- Informativa sui cookie

### Link alla privacy policy

L'informativa è linkata da:
- **Pagina consenso** (`/consenso`): link nel checkbox GDPR, si apre in nuova tab
- **Footer della home page**: link "Privacy Policy" nella sezione disclaimer

---

## SEO

### Metadata

Il root layout (`src/app/layout.tsx`) definisce metadata con:
- `metadataBase` puntato al dominio di produzione
- Template per titoli: `%s | Il Benessere Ritrovato`
- Open Graph (tipo website, locale `it_IT`, immagine)
- Twitter Card (`summary_large_image`)
- Direttive robots (`index: true, follow: true`)

### Structured data (JSON-LD)

La home page include due schemi JSON-LD:
- **HealthAndBeautyBusiness**: nome, descrizione, URL, fondatrice
- **FAQPage**: domande frequenti sulla consulenza

### Sitemap e robots.txt

| File | Percorso generato | Contenuto |
|---|---|---|
| `src/app/sitemap.ts` | `/sitemap.xml` | Pagine pubbliche (home, privacy-policy, consenso) |
| `src/app/robots.ts` | `/robots.txt` | Allow `/`, disallow `/admin/`, pagine wizard interne |

### HTML semantico

La home page usa tag semantici (`<main>`, `<section>` con `aria-label`, `<footer>`) per migliorare accessibilità e indicizzazione.

---

## Google Analytics e Cookie Consent

### Google Analytics (GA4)

Il componente `src/components/GoogleAnalytics.tsx` carica gli script `gtag.js` solo se:
1. La variabile `NEXT_PUBLIC_GA_MEASUREMENT_ID` è impostata
2. L'utente ha accettato i cookie (`localStorage.cookie-consent === 'accepted'`)

Lo script è configurato con `anonymize_ip: true`.

### Banner Cookie Consent

Il componente `src/components/CookieConsent.tsx` mostra un banner fisso in basso alla prima visita. L'utente può:
- **Accettare**: attiva Google Analytics e salva la preferenza
- **Rifiutare**: nessun cookie analitico, solo tecnici

Dopo la scelta il banner non riappare (preferenza salvata in `localStorage`). Il banner include un link alla privacy policy.

### Configurazione

Aggiungere il Measurement ID nell'ambiente:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Se la variabile non è impostata, Google Analytics non viene caricato (nessun errore).

---

## Configurazione e avvio

### Prerequisiti

- Node.js 18+
- npm

### Installazione

```bash
npm install
npx prisma migrate dev
npm run dev
```

Il server sarà disponibile su `http://localhost:3000`.

### Variabili d'ambiente (`.env.local`)

```env
DATABASE_URL="file:./dev.db"

# SMTP — configurare per l'invio email reale
SMTP_HOST=smtp.tuoprovider.it
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=consulenza@ilbenessereritrovato.it
SMTP_PASS=password-email
SMTP_FROM="Il Benessere Ritrovato <consulenza@ilbenessereritrovato.it>"
SMTP_TO=roberta@ilbenessereritrovato.it

# Admin
ADMIN_PASSWORD_HASH=<hash-bcrypt-della-tua-password>
JWT_SECRET=<stringa-casuale-lunga-almeno-32-caratteri>

# App
NEXT_PUBLIC_APP_URL=https://[tuo-dominio]

# Google Analytics (opzionale)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Come cambiare la password admin

1. Genera un nuovo hash bcrypt dalla tua password:
   ```bash
   node -e "require('bcryptjs').hash('LA-TUA-NUOVA-PASSWORD', 10).then(console.log)"
   ```
2. Copia l'hash generato in `ADMIN_PASSWORD_HASH` nel file `.env.local`
3. Riavvia il server (`npm run dev` oppure ripubblica in produzione)

### Password attuale (sviluppo)

| Campo | Valore |
|---|---|
| URL login | `http://localhost:3000/admin/login` |
| Password | `benessere2024!` |

---

## Configurazione email e produzione

### Email (SMTP)

Per ricevere le notifiche email quando un nuovo paziente compila il questionario, configura SMTP nel file `.env.local`. Qualsiasi provider SMTP funziona (Gmail con App Password, Aruba, Brevo, ecc.).

Esempio con Gmail:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tua@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx   # App Password di Google
```

Se SMTP non è configurato, le consulenze vengono comunque salvate nel database — manca solo la notifica email.

### Deployment in produzione

Questa applicazione può essere pubblicata su qualsiasi piattaforma che supporti Node.js (Vercel, Railway, Render, VPS).

**Nota importante per SQLite in produzione:** il database è un file locale (`dev.db`). Su piattaforme con filesystem effimero (Vercel) è necessario migrare a un database hosted (PostgreSQL via Neon, PlanetScale MySQL, ecc.) aggiornando il `provider` in `prisma/schema.prisma` e la `DATABASE_URL` corrispondente.

---

## Struttura dei file principali

```
src/
├── app/
│   ├── (consultation)/           Flusso wizard utente
│   │   ├── consenso/             Step 1: consenso GDPR
│   │   ├── dati-personali/       Step 2: dati personali
│   │   ├── questionario/         Step 3: Test delle 6A (14 domande)
│   │   ├── risultati/            Step 4: risultati e radar chart
│   │   └── actions.ts            Server action: salvataggio, scoring, validazione Zod
│   ├── (admin)/admin/
│   │   ├── login/                Login area riservata
│   │   ├── dashboard/            Lista consulenze
│   │   ├── submission/[id]/      Dettaglio singola consulenza
│   │   │   └── completa/         Form consulenza completa
│   │   └── actions.ts            Server actions admin (con rate limiting)
│   ├── privacy-policy/           Informativa GDPR ex Art. 13
│   ├── sitemap.ts                Generazione sitemap.xml
│   ├── robots.ts                 Generazione robots.txt
│   ├── layout.tsx                Root layout (fonts, GA, cookie consent)
│   └── page.tsx                  Home page (SEO, JSON-LD, HTML semantico)
│
├── components/
│   ├── GoogleAnalytics.tsx       GA4 con gestione consenso cookie
│   ├── CookieConsent.tsx         Banner consenso cookie
│   └── ...                       UI components (Card, Button, ProgressBar, ecc.)
│
├── data/
│   ├── lite-questions.ts         Selezione storica del questionario lite
│   ├── self-assessment.ts        10 item autovalutazione (versione completa)
│   ├── lifestyle.ts              Abitudini alimentari e stile di vita
│   └── tests/                    Test completi (25+18+20+20 domande)
│
├── lib/
│   ├── auth.ts                   Autenticazione admin (bcrypt + JWT, no fallback)
│   ├── db.ts                     Client Prisma (singleton)
│   ├── email/send.ts             Notifica email admin
│   ├── rate-limit.ts             Rate limiter in-memory per login
│   └── scoring/engine.ts         Calcolo e normalizzazione punteggi
│
└── types/
    ├── wizard.ts                 WIZARD_STEPS (lite, 4 step) e FULL_WIZARD_STEPS (9 step)
    └── test.ts                   Tipi QuestionConfig, TestConfig, ecc.
```
