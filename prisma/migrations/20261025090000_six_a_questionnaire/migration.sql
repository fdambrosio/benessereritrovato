ALTER TABLE "Submission"
ADD COLUMN "sixAAnswers" TEXT,
ALTER COLUMN "locusScore" DROP NOT NULL,
ALTER COLUMN "locusNormalized" DROP NOT NULL,
ALTER COLUMN "eventiSaluteScore" DROP NOT NULL,
ALTER COLUMN "eventiSaluteNormalized" DROP NOT NULL,
ALTER COLUMN "medicineAlternativeScore" DROP NOT NULL,
ALTER COLUMN "medicineAlternativeNormalized" DROP NOT NULL,
ALTER COLUMN "leadershipScore" DROP NOT NULL,
ALTER COLUMN "leadershipNormalized" DROP NOT NULL,
ALTER COLUMN "locusInterpretation" DROP NOT NULL,
ALTER COLUMN "eventiInterpretation" DROP NOT NULL,
ALTER COLUMN "medicineInterpretation" DROP NOT NULL,
ALTER COLUMN "leadershipInterpretation" DROP NOT NULL;
