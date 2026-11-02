import Link from "next/link";
import GestaoCatalogo from "@/app/components/GestaoCatalogo";
import { produtos } from "@/lib/produtos";

export default function GerenciarPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            AutoParts <span className="text-orange-400">AI</span>
          </Link>

          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm text-orange-400 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-orange-400"
          >
            ← Voltar ao catálogo
          </Link>
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
          As alterações ficam salvas apenas neste navegador.
        </p>

        <p className="mt-4 rounded-xl border border-orange-400/20 bg-orange-400/5 p-4 text-sm leading-6 text-orange-200">
          Área demonstrativa sem autenticação. Use apenas dados fictícios.
        </p>

        <GestaoCatalogo produtosIniciais={produtos} />
      </main>
    </div>
  );
}