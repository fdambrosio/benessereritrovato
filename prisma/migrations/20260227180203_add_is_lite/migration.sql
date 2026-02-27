-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "eta" INTEGER,
    "peso" REAL,
    "altezza" REAL,
    "citta" TEXT,
    "privacyConsent" BOOLEAN NOT NULL DEFAULT true,
    "locusAnswers" TEXT NOT NULL,
    "eventiSaluteAnswers" TEXT NOT NULL,
    "medicineAlternativeAnswers" TEXT NOT NULL,
    "leadershipAnswers" TEXT NOT NULL,
    "selfAssessmentAnswers" TEXT NOT NULL,
    "lifestyleAnswers" TEXT NOT NULL,
    "locusScore" REAL NOT NULL,
    "locusNormalized" REAL NOT NULL,
    "eventiSaluteScore" REAL NOT NULL,
    "eventiSaluteNormalized" REAL NOT NULL,
    "medicineAlternativeScore" REAL NOT NULL,
    "medicineAlternativeNormalized" REAL NOT NULL,
    "leadershipScore" REAL NOT NULL,
    "leadershipNormalized" REAL NOT NULL,
    "selfAssessmentAverage" REAL NOT NULL,
    "locusInterpretation" TEXT NOT NULL,
    "eventiInterpretation" TEXT NOT NULL,
    "medicineInterpretation" TEXT NOT NULL,
    "leadershipInterpretation" TEXT NOT NULL,
    "isLite" BOOLEAN NOT NULL DEFAULT true,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "adminViewed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT
);
INSERT INTO "new_Submission" ("adminViewed", "altezza", "citta", "cognome", "createdAt", "email", "emailSent", "eta", "eventiInterpretation", "eventiSaluteAnswers", "eventiSaluteNormalized", "eventiSaluteScore", "id", "leadershipAnswers", "leadershipInterpretation", "leadershipNormalized", "leadershipScore", "lifestyleAnswers", "locusAnswers", "locusInterpretation", "locusNormalized", "locusScore", "medicineAlternativeAnswers", "medicineAlternativeNormalized", "medicineAlternativeScore", "medicineInterpretation", "nome", "notes", "peso", "privacyConsent", "selfAssessmentAnswers", "selfAssessmentAverage", "telefono") SELECT "adminViewed", "altezza", "citta", "cognome", "createdAt", "email", "emailSent", "eta", "eventiInterpretation", "eventiSaluteAnswers", "eventiSaluteNormalized", "eventiSaluteScore", "id", "leadershipAnswers", "leadershipInterpretation", "leadershipNormalized", "leadershipScore", "lifestyleAnswers", "locusAnswers", "locusInterpretation", "locusNormalized", "locusScore", "medicineAlternativeAnswers", "medicineAlternativeNormalized", "medicineAlternativeScore", "medicineInterpretation", "nome", "notes", "peso", "privacyConsent", "selfAssessmentAnswers", "selfAssessmentAverage", "telefono" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
