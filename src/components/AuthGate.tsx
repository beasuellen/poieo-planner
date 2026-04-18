import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PoieoMonograma, PoieoWordmark } from "./Logo";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-gate">
        <div className="auth-spinner-wrap">
          <PoieoMonograma size={48} className="auth-spinner-logo" />
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return <>{children}</>;
}

function LoginScreen() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await signInWithEmail(email);
    setBusy(false);
    if (error) {
      setError("Não consegui enviar o e-mail. Tente de novo.");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="auth-gate">
      <div className="auth-logo">
        <PoieoWordmark size={52} />
        <p className="auth-statement">Uma nova forma de ser produtivo.</p>
      </div>

      <div className="auth-card">
        {sent ? (
          <div className="auth-success">
            <div className="auth-success-icon">✉️</div>
            <p className="auth-success-title">Verifique seu e-mail</p>
            <p className="auth-success-text">
              Enviamos um link de acesso para <strong>{email}</strong>. Clique
              nele para entrar no app.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="auth-title">Bem-vinda de volta</p>
            <p className="auth-subtitle">
              Digite seu e-mail e enviaremos um link mágico para entrar — sem senha.
            </p>
            <input
              className="auth-input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <button
              type="submit"
              className="btn btn-lime"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={busy}
            >
              {busy ? "Enviando…" : "Enviar link de acesso"}
            </button>
          </form>
        )}
      </div>

      <p className="auth-footer">Poieo Planner</p>

      <div className="auth-monogram-corner">
        <PoieoMonograma size={72} />
      </div>
    </div>
  );
}
