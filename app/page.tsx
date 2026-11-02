import Catalogo from "./components/Catalogo";
import Link from "next/link";

const produtos = [
  {
    codigo: "AP-001",
    nome: "Pastilha de freio dianteira",
    categoria: "Freios",
    descricao: "Exemplo de produto para o catálogo de peças.",
  },
  {
    codigo: "AP-002",
    nome: "Filtro de óleo",
    categoria: "Motor",
    descricao: "Exemplo de produto para manutenção preventiva.",
  },
  {
    codigo: "AP-003",
    nome: "Amortecedor dianteiro",
    categoria: "Suspensão",
    descricao: "Exemplo de produto para o sistema de suspensão.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
  AutoParts <span className="text-orange-400">AI</span>
</Link>

          <nav aria-label="Menu principal" className="flex gap-6 text-sm">
            <a
              href="#catalogo"
              className="text-slate-300 transition hover:text-orange-400"
            >
              Catálogo
            </a>

            <a
              href="#projeto"
              className="text-slate-300 transition hover:text-orange-400"
            >
              Sobre o projeto
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-orange-400">
              Tecnologia para autopeças
            </p>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Sua operação de autopeças começa a evoluir aqui.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Um projeto para organizar produtos, facilitar consultas e
              construir uma experiência de atendimento mais eficiente.
            </p>

            <a
              href="#catalogo"
              className="mt-8 inline-flex rounded-xl bg-orange-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
            >
              Explorar catálogo →
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <span className="rounded-full bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-300">
              EM DESENVOLVIMENTO
            </span>

            <h2 className="mt-7 text-2xl font-semibold">
              Uma base para crescer
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Estamos construindo o sistema por etapas, começando pela
              interface e pelo catálogo de produtos.
            </p>

            <ol className="mt-8 space-y-5">
              {[
                "Interface e catálogo demonstrativo",
                "Cadastro e consulta de produtos",
                "Integração com atendimento pelo WhatsApp",
              ].map((etapa, indice) => (
                <li key={etapa} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-orange-400">
                    {indice + 1}
                  </span>

                  <span className="text-sm text-slate-300">
                    {etapa}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="catalogo"
          className="scroll-mt-8 border-t border-white/10 py-16"
        >
          <p className="text-sm font-semibold text-orange-400">
            CATÁLOGO DEMONSTRATIVO
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Peças em destaque
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Os itens abaixo são exemplos para desenvolver a interface.
            Não representam estoque, preços ou compatibilidade reais.
          </p>

          <Catalogo produtos={produtos} />
        </section>

        <section
          id="projeto"
          className="scroll-mt-8 border-t border-white/10 py-16"
        >
          <h2 className="text-2xl font-bold">
            Sobre o AutoParts AI
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-slate-400">
            Projeto de portfólio desenvolvido por Felipe Pacheco para
            aplicar conhecimentos de desenvolvimento web em um cenário
            de autopeças. O objetivo é evoluir esta interface para um
            sistema com gestão de produtos e atendimento integrado.
          </p>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500">
        AutoParts AI · Desenvolvido por Felipe Pacheco
      </footer>
    </div>
  );
}