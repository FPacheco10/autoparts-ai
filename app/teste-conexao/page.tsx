"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TesteConexaoPage() {
  const [testando, setTestando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  async function testarConexao() {
    setTestando(true);
    setMensagem("");
    setErro(false);

    try {
      const supabase = createClient();

      const { count, error } = await supabase
        .from("produtos")
        .select("id", { count: "exact", head: true });

      if (error) {
        throw new Error(error.message);
      }

      setMensagem(
        `Conexão e consulta funcionando! Produtos visíveis no banco: ${count ?? 0}.`
      );
    } catch (error) {
      setErro(true);
      setMensagem(
        error instanceof Error
          ? error.message
          : "Não foi possível consultar o Supabase."
      );
    } finally {
      setTestando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 font-sans text-slate-100">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-orange-400">
          ← Voltar ao catálogo
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          Teste de conexão
        </h1>

        <p className="mt-4 leading-7 text-slate-400">
          Verifica a comunicação com o Supabase e a leitura da tabela
          de produtos.
        </p>

        <button
          type="button"
          onClick={testarConexao}
          disabled={testando}
          className="mt-6 rounded-xl bg-orange-400 px-6 py-3 font-semibold text-slate-950 hover:bg-orange-300 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
        >
          {testando ? "Testando..." : "Testar conexão"}
        </button>

        <p
          role="status"
          className={`mt-6 break-words rounded-xl border p-4 ${
            erro
              ? "border-red-400/30 text-red-300"
              : "border-slate-700 text-slate-300"
          }`}
        >
          {mensagem || "Clique no botão para iniciar o teste."}
        </p>
      </div>
    </main>
  );
}