import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
    </div>
  );
}
