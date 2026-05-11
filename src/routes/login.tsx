import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flower2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Flora Luxe Admin" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Conta criada! Faça login.");
      setMode("login");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/admin" });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-elegant">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-green-deep">
          <Flower2 className="h-6 w-6" /> <span className="font-display text-2xl">Flora Luxe</span>
        </Link>
        <h1 className="text-center font-display text-2xl text-green-deep">
          {mode === "login" ? "Entrar no admin" : "Criar conta admin"}
        </h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail"
            className="w-full rounded-xl border border-border bg-cream px-3 py-3 text-sm" />
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha"
            className="w-full rounded-xl border border-border bg-cream px-3 py-3 text-sm" />
          <button disabled={loading} className="w-full rounded-full bg-green-deep py-3 text-sm text-cream disabled:opacity-50">
            {loading ? "..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-green-deep">
          {mode === "login" ? "Não tem conta? Criar" : "Já tem conta? Entrar"}
        </button>
        <p className="mt-4 rounded-xl bg-cream-dark p-3 text-[11px] text-muted-foreground">
          ⚠️ Após criar a conta, peça a um admin para conceder o papel <code>admin</code> no banco
          (tabela <code>user_roles</code>).
        </p>
      </div>
    </div>
  );
}
