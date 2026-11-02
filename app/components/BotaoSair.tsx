"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function BotaoSair() {
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState("");

  async function sair() {
    setSaindo(true);
    setErro("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut({
        scope: "local",
      });

      if (error) {
        throw error;
      }

      window.location.replace("/login");
    } catch {
      setErro("Não foi possível sair. Tente novamente.");
    } finally {
      setSaindo(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={sair}
        disabled={saindo}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-orange-400"
      >
        {saindo ? "Saindo..." : "Sair"}
      </button>

      <p role="alert" className="mt-2 text-xs text-red-300">
        {erro}
      </p>
    </div>
  );
}