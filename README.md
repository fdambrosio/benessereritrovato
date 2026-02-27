# Il Benessere Ritrovato — Consulenza Preliminare Online

Applicazione web per la raccolta di consulenze preliminari di benessere naturopatico per la Dott.ssa Roberta Loprieno.

---

## Indice

1. [Accesso rapido](#accesso-rapido)
2. [Funzionamento dell'applicazione](#funzionamento-dellapplicazione)
3. [Il questionario lite — scelta delle domande](#il-questionario-lite--scelta-delle-domande)
4. [Metodologia scientifica e scoring](#metodologia-scientifica-e-scoring)
5. [Interpretazione dei risultati](#interpretazione-dei-risultati)
6. [Dashboard amministratore](#dashboard-amministratore)
7. [Configurazione e avvio](#configurazione-e-avvio)
8. [Configurazione email e produzione](#configurazione-email-e-produzione)

---

## Accesso rapido

| Percorso | Descrizione |
|---|---|
| `http://localhost:3000/` | Pagina di benvenuto → avvia la consulenza |
| `http://localhost:3000/consenso` | Primo step del wizard (consenso) |
| `http://localhost:3000/admin/login` | Login area riservata admin |
| `http://localhost:3000/admin/dashboard` | Dashboard (richiede autenticazione) |

---

## Funzionamento dell'applicazione

### Flusso utente (versione lite)

L'utente completa una consulenza in **4 semplici passaggi**:

```
Step 1 — Consenso          Accetta informativa GDPR e disclaimer medico
Step 2 — Dati personali    Nome, cognome, email (telefono opzionale)
Step 3 — Questionario      10 domande: 8 a risposta multipla + 2 slider
Step 4 — Risultati         Profilo di benessere con radar chart + CTA prenotazione
```

Al termine, l'applicazione:
- calcola automaticamente i punteggi nei quattro ambiti testati
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

## Il questionario lite — scelta delle domande

### Razionale della selezione

La versione lite usa **10 domande** (contro le 36 della versione completa) selezionate per:

1. **Massimizzare le conversioni**: ogni domanda aggiuntiva aumenta il tasso di abbandono. 10 domande su 1 pagina richiedono circa 3 minuti.
2. **Copertura bilanciata**: 2 domande per ogni area testata assicurano un campione rappresentativo.
3. **Polarità bipolare**: per ogni area si usano 1 domanda in scala "discendente" (d'accordo = punteggio alto) e 1 in scala "inversa" (d'accordo = punteggio basso) per evitare bias da risposta acquiescente.
4. **Comprensibilità**: le domande scelte sono le più chiare e autonome, comprensibili senza il contesto dell'intero questionario.

### Le 10 domande selezionate

#### Autoefficacia / Locus of Control (2 domande)

| N. | Testo | Scala |
|---|---|---|
| 1 | *"Sono convinto/a che per avere successo nella vita occorrano impegno e costanza"* | Discendente (accordo = controllo interno) |
| 25 | *"A volte penso che la mia vita sia determinata in larga parte dal destino"* | Inversa (accordo = controllo esterno) |

**Perché queste?** Coprono i due poli del costrutto: autodeterminazione attiva (Q1) e fatalismo passivo (Q25). Entrambe sono formulate in modo diretto e comprensibile.

#### Salute e Benessere / Controllo della Salute (2 domande)

| N. | Testo | Scala |
|---|---|---|
| 5 | *"Credo di poter far molto per conservare una buona salute"* | Discendente (accordo = agency sulla salute) |
| 8 | *"La buona salute è in larga parte una questione di fortuna"* | Inversa (accordo = fatalismo sulla salute) |

**Perché queste?** Tematicamente centrali al benessere naturopatico. Valutano la percezione di controllo sulla propria salute, predittore chiave dell'aderenza a percorsi di benessere.

#### Medicine Alternative (2 domande)

| N. | Testo | Scala |
|---|---|---|
| 4 | *"Il fatto stesso che una terapia alternativa esista e sia praticata da millenni significa che è valida ed efficace"* | Inversa (accordo = pensiero magico) |
| 6 | *"Non è vero che i rimedi naturali non hanno effetti collaterali e controindicazioni"* | Discendente (accordo = consapevolezza critica) |

**Perché queste?** Rilevano la postura epistemica del paziente verso le medicine integrative. Un paziente con punteggio basso in quest'area (eccessivamente credulo o eccessivamente scettico) richiede un approccio consulenziale diverso.

#### Autonomia / Leadership (2 domande)

| N. | Testo | Scala |
|---|---|---|
| 11 | *"Se sono convinto razionalmente di qualcosa, è difficile farmi cambiare idea e perseguo il mio scopo con determinazione"* | Discendente (accordo = autonomia decisionale) |
| 20 | *"Senza l'aiuto di persone esperte e competenti, è difficile costruire una vita conforme alle proprie esigenze e desideri"* | Inversa (accordo = dipendenza da esperti) |

**Perché queste?** Valutano la capacità di autodeterminazione del paziente. Un paziente con alta autonomia tende ad aderire meglio a percorsi di benessere auto-gestiti.

#### Autovalutazione del Benessere (2 slider 1-10)

| ID | Testo | Tipo |
|---|---|---|
| `stress` | *"Sono stressato/a in generale"* | Negativo (il valore è invertito nel calcolo: 11 − valore) |
| `felicita` | *"In generale mi considero una persona felice"* | Positivo |

**Perché questi due?** Stress e felicità soggettiva sono i due predittori più robusti e immediati del benessere psicobiologico percepito. Gli slider (scala 1-10) raccolgono una risposta sfumata e analogica piuttosto che categorica.

---

## Metodologia scientifica e scoring

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
| Tipo | **Lite** (arancio) o **Completa** (verde) |
| Media punteggi | Percentuale media dei 5 ambiti |
| Email | Stato notifica email (inviata / non inviata) |

### Dettaglio consulenza

Cliccando su un nome si apre il dettaglio con:
- **Dati personali** del paziente
- **Banner arancio** (se consulenza lite) con bottone "**Completa consulenza**"
- **Punteggi** dei 4 test (grezzo, normalizzato, interpretazione)
- **Autovalutazione** con media e dettaglio per item
- **Stile di vita** (compilato solo nelle consulenze complete)
- **Note private** — campo di testo riservato alla Dott.ssa Loprieno

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
│   │   ├── questionario/         Step 3: 10 domande lite (NUOVO)
│   │   ├── risultati/            Step 4: risultati e radar chart
│   │   └── actions.ts            Server action: salvataggio e scoring
│   └── (admin)/admin/
│       ├── login/                Login area riservata
│       ├── dashboard/            Lista consulenze
│       ├── submission/[id]/      Dettaglio singola consulenza
│       │   └── completa/         Form consulenza completa (NUOVO)
│       └── actions.ts            Server actions admin
│
├── data/
│   ├── lite-questions.ts         10 domande selezionate per il lite (NUOVO)
│   ├── self-assessment.ts        10 item autovalutazione (versione completa)
│   ├── lifestyle.ts              Abitudini alimentari e stile di vita
│   └── tests/                   Test completi (25+18+20+20 domande)
│
├── lib/
│   ├── auth.ts                   Autenticazione admin (bcrypt + JWT)
│   ├── db.ts                     Client Prisma (singleton)
│   ├── email/send.ts             Notifica email admin
│   └── scoring/engine.ts         Calcolo e normalizzazione punteggi
│
└── types/
    ├── wizard.ts                 WIZARD_STEPS (lite, 4 step) e FULL_WIZARD_STEPS (9 step)
    └── test.ts                   Tipi QuestionConfig, TestConfig, ecc.
```
