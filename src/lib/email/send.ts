import nodemailer from 'nodemailer';
import type { ScoreInterpretation } from '@/types/test';
import type { LifestyleData } from '@/types/wizard';

interface AdminNotificationData {
  submission: {
    id: string;
    nome: string;
    cognome: string;
    email: string;
    telefono: string | null;
    eta: number | null;
    peso: number | null;
    altezza: number | null;
    citta: string | null;
    locusNormalized: number;
    eventiSaluteNormalized: number;
    medicineAlternativeNormalized: number;
    leadershipNormalized: number;
    createdAt: Date;
  };
  locusInterp: ScoreInterpretation;
  eventiInterp: ScoreInterpretation;
  medicineInterp: ScoreInterpretation;
  leadershipInterp: ScoreInterpretation;
  selfAssessmentAvg: number;
  lifestyleData: LifestyleData;
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
}

export async function sendAdminNotification(data: AdminNotificationData) {
  const { submission: s, locusInterp, eventiInterp, medicineInterp, leadershipInterp, selfAssessmentAvg } = data;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const html = `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #3B3B3B;">
  <div style="background: #7516e3; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 22px;">Nuova Consulenza Preliminare</h1>
    <p style="margin: 5px 0 0; opacity: 0.9;">${new Date(s.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
  </div>

  <div style="border: 1px solid #E2E2E2; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #7516e3; font-size: 18px; margin-top: 0;">Dati Personali</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 4px 8px; font-weight: bold;">Nome:</td><td>${s.nome} ${s.cognome}</td></tr>
      <tr><td style="padding: 4px 8px; font-weight: bold;">Email:</td><td>${s.email}</td></tr>
      ${s.telefono ? `<tr><td style="padding: 4px 8px; font-weight: bold;">Telefono:</td><td>${s.telefono}</td></tr>` : ''}
      ${s.eta ? `<tr><td style="padding: 4px 8px; font-weight: bold;">Et&agrave;:</td><td>${s.eta} anni</td></tr>` : ''}
      ${s.peso ? `<tr><td style="padding: 4px 8px; font-weight: bold;">Peso:</td><td>${s.peso} kg</td></tr>` : ''}
      ${s.altezza ? `<tr><td style="padding: 4px 8px; font-weight: bold;">Altezza:</td><td>${s.altezza} cm</td></tr>` : ''}
      ${s.citta ? `<tr><td style="padding: 4px 8px; font-weight: bold;">Citt&agrave;:</td><td>${s.citta}</td></tr>` : ''}
    </table>

    <hr style="border: none; border-top: 1px solid #E2E2E2; margin: 20px 0;">

    <h2 style="color: #7516e3; font-size: 18px;">Risultati Test</h2>

    <div style="background: #F5EDFF; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
      <strong>Locus of Control:</strong> ${Math.round(s.locusNormalized)}/100 - ${locusInterp.label}
      <br><small style="color: #5F5F5F;">${locusInterp.description}</small>
    </div>

    <div style="background: #F5EDFF; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
      <strong>Controllo Eventi e Salute:</strong> ${Math.round(s.eventiSaluteNormalized)}/72 - ${eventiInterp.label}
      <br><small style="color: #5F5F5F;">${eventiInterp.description}</small>
    </div>

    <div style="background: #F5EDFF; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
      <strong>Medicine Alternative:</strong> ${Math.round(s.medicineAlternativeNormalized)}/80 - ${medicineInterp.label}
      <br><small style="color: #5F5F5F;">${medicineInterp.description}</small>
    </div>

    <div style="background: #F5EDFF; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
      <strong>Leadership:</strong> ${Math.round(s.leadershipNormalized)}/80 - ${leadershipInterp.label}
      <br><small style="color: #5F5F5F;">${leadershipInterp.description}</small>
    </div>

    <div style="background: #F5EDFF; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
      <strong>Autovalutazione Media:</strong> ${selfAssessmentAvg.toFixed(1)}/10
    </div>

    <hr style="border: none; border-top: 1px solid #E2E2E2; margin: 20px 0;">

    <p style="text-align: center;">
      <a href="${appUrl}/admin/submission/${s.id}" style="background: #7516e3; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
        Vedi dettaglio completo nella Dashboard
      </a>
    </p>
  </div>

  <p style="text-align: center; color: #5F5F5F; font-size: 12px; margin-top: 20px;">
    Il Benessere Ritrovato - Consulenza automatica preliminare
  </p>
</body>
</html>`;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'consulenza@ilbenessereritrovato.it',
    to: process.env.SMTP_TO || 'roberta@ilbenessereritrovato.it',
    subject: `Nuova consulenza: ${s.nome} ${s.cognome}`,
    html,
  });
}
