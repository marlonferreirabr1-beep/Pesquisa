import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, KeyRound, AlertCircle, Loader2, X, Shield } from 'lucide-react';
import { loginAdmin, type AdminUser } from '../../services/firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await loginAdmin(email, password);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Falha no acesso administrativo. Verifique o e-mail ou a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#D9BA79]/30 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 border border-[#D9BA79]/40 flex items-center justify-center text-[#B8964C] mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif-title text-2xl font-bold text-[#283D35]">
            Painel da Direção
          </h3>
          <p className="text-xs text-[#283D35]/70 mt-1">
            Área restrita à equipe de governança e gestão escolar
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#283D35] mb-1">
              E-mail Institucional
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: usuario@colegio.edu.br"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm text-[#283D35] bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#D9BA79] focus:ring-2 focus:ring-[#D9BA79]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#283D35] mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm text-[#283D35] bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#D9BA79] focus:ring-2 focus:ring-[#D9BA79]/20"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#283D35] hover:bg-[#1E2E28] text-white font-semibold text-sm shadow-md shadow-[#283D35]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D9BA79]" />
                  <span>Verificando credenciais...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-[#D9BA79]" />
                  <span>Entrar no Painel Seguro</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-stone-100 text-[11px] text-stone-400 text-center">
          <span>Acesso confidencial protegido por criptografia institucional.</span>
        </div>
      </motion.div>
    </div>
  );
};
