"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState("");

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const dados = new FormData(event.currentTarget);

    setEntrando(true);
    setErro("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: String(dados.get("email") ?? "").trim(),
        password: String(dados.get("senha") ?? ""),
      });

      if (error) {
        setErro(
          "Não foi possível entrar. Confira o e-mail, a senha e a confirmação da conta."
        );
        return;
      }

      // Uma nova navegação envia os cookies ao servidor.
      window.location.replace("/gerenciar");
    } catch {
      setErro("Não foi possível conectar. Tente novamente.");
    } finally {
      setEntrando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 font-sans text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8">
        <Link href="/" className="text-xl font-bold">
          AutoParts <span className="text-orange-400">AI</span>
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          Acessar gerenciamento
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Entre com sua conta cadastrada no AutoParts AI.
        </p>

        <form onSubmit={entrar} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
              disabled={entrando}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="mb-2 block text-sm font-medium"
            >
              Senha
            </label>

            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              disabled={entrando}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
            />
          </div>

          <p role="alert" className="text-sm text-red-300">
            {erro}
          </p>

          <button
            type="submit"
            disabled={entrando}
            className="w-full rounded-xl bg-orange-400 px-6 py-3 font-semibold text-slate-950 hover:bg-orange-300 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
          >
            {entrando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-slate-400 hover:text-orange-400"
        >
          ← Voltar ao catálogo
        </Link>
      </div>
    </main>
  );
}