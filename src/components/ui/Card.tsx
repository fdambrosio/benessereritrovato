interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-background rounded-lg shadow-sm border border-brand-gray-light/30 p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}
