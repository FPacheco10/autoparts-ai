import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GestaoCatalogo from "@/app/components/GestaoCatalogo";
import BotaoSair from "@/app/components/BotaoSair";
import { produtos } from "@/lib/produtos";
import { connection } from "next/server";

async function AreaGerenciamento() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            AutoParts <span className="text-orange-400">AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              ← Voltar ao catálogo
            </Link>

            <BotaoSair />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
          Gerenciamento
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          Seus produtos
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-slate-400">
          Cadastre, edite e exclua produtos demonstrativos.
          As alterações desta área ainda ficam salvas apenas neste
          navegador.
        </p>

        <p className="mt-4 rounded-xl border border-orange-400/20 bg-orange-400/5 p-4 text-sm leading-6 text-orange-200">
          Sessão autenticada. O gerenciamento ainda utiliza armazenamento
          local e não altera os produtos do catálogo no Supabase.
        </p>

        <GestaoCatalogo produtosIniciais={produtos} />
      </main>
    </div>
  );
}

export default function GerenciarPage() {
  return (
    <Suspense
      fallback={
        <main
          role="status"
          className="min-h-screen bg-slate-950 px-6 py-16 text-slate-300"
        >
          Verificando acesso...
        </main>
      }
    >
      <AreaGerenciamento />
    </Suspense>
  );
}