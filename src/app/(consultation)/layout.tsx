import { WizardProvider } from '@/context/WizardContext';

export default function ConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WizardProvider>{children}</WizardProvider>;
}
