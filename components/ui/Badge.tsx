interface BadgeProps {
  children: React.ReactNode;
  variant?: 'llsp' | 'standby' | 'rope-drop' | 'hop' | 'warning' | 'success' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    llsp: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    standby: 'bg-blue-100 text-blue-800 border border-blue-300',
    'rope-drop': 'bg-purple-100 text-purple-800 border border-purple-300',
    hop: 'bg-teal-100 text-teal-800 border border-teal-300',
    warning: 'bg-red-100 text-red-800 border border-red-300',
    success: 'bg-green-100 text-green-800 border border-green-300',
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
