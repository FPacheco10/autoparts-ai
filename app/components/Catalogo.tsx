"use client";

import { useState } from "react";

type Produto = {
  codigo: string;
  nome: string;
  categoria: string;
  descricao: string;
};

type DetalhesProduto = {
  marca: string;
  aplicacao: string;
  descricaoCompleta: string;
};

const detalhesPorCodigo: Record<string, DetalhesProduto> = {
  "AP-001": {
    marca: "Marca demonstrativa",
    aplicacao: "Veículo de exemplo — aplicação não validada.",
    descricaoCompleta:
      "Item demonstrativo da categoria de freios. Em um catálogo real, os detalhes devem incluir fabricante, referência e aplicação confirmada no catálogo técnico.",
  },
  "AP-002": {
    marca: "Marca demonstrativa",
    aplicacao: "Motor de exemplo — aplicação não validada.",
    descricaoCompleta:
      "Item demonstrativo para manutenção do motor. Em um catálogo real, a seleção deve considerar a referência do fabricante e as especificações do veículo.",
  },
  "AP-003": {
    marca: "Marca demonstrativa",
    aplicacao: "Suspensão de exemplo — aplicação não validada.",
    descricaoCompleta:
      "Item demonstrativo da categoria de suspensão. Em um catálogo real, os detalhes devem informar posição de montagem, referência e aplicação confirmada.",
  },
};

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function Catalogo({
  produtos,
}: {
  produtos: Produto[];
}) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("");

  const categorias = Array.from(
    new Set(produtos.map((produto) => produto.categoria))
  );

  const produtosFiltrados = produtos.filter((produto) => {
    const correspondeBusca = normalizar(produto.nome).includes(
      normalizar(busca)
    );

    const correspondeCategoria =
      categoria === "" || produto.categoria === categoria;

    return correspondeBusca && correspondeCategoria;
  });

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="busca-produto"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Buscar por nome
          </label>

          <input
            id="busca-produto"
            type="search"
            placeholder="Ex.: filtro de óleo"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
          />
        </div>

        <div>
          <label
            htmlFor="categoria-produto"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Categoria
          </label>

          <select
            id="categoria-produto"
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
          >
            <option value="">Todas as categorias</option>

            {categorias.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-sm text-slate-400">
          {produtosFiltrados.length}{" "}
          {produtosFiltrados.length === 1
            ? "produto encontrado"
            : "produtos encontrados"}
        </p>

        <button
          type="button"
          onClick={() => {
            setBusca("");
            setCategoria("");
          }}
          className="rounded-lg px-3 py-2 text-sm font-medium text-orange-400 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        >
          Limpar filtros
        </button>
      </div>

      {produtosFiltrados.length > 0 ? (
        <div className="mt-6 grid items-start gap-5 md:grid-cols-3">
          {produtosFiltrados.map((produto) => {
            const detalhes = detalhesPorCodigo[produto.codigo];

            return (
              <article
                key={produto.codigo}
                className="min-w-0 rounded-2xl border border-white/10 bg-slate-900 p-6"
              >
                <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-orange-300">
                  {produto.categoria}
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  {produto.nome}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {produto.descricao}
                </p>

                <p className="mt-6 border-t border-white/10 pt-4 font-mono text-xs text-slate-500">
                  Código de exemplo: {produto.codigo}
                </p>

                <details className="group mt-5 border-t border-white/10 pt-4">
                  <summary className="cursor-pointer rounded-lg py-2 text-sm font-semibold text-orange-400 hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400">
                    <span className="group-open:hidden">
                      Ver detalhes
                    </span>
                    <span className="hidden group-open:inline">
                      Ocultar detalhes
                    </span>
                    <span className="sr-only">
                      {" "}de {produto.nome}
                    </span>
                  </summary>

                  <div className="mt-4 space-y-5">
                    <dl className="space-y-4 text-sm">
                      <div>
                        <dt className="font-medium text-slate-200">
                          Marca
                        </dt>
                        <dd className="mt-1 text-slate-400">
                          {detalhes?.marca ?? "Não informada"}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-medium text-slate-200">
                          Aplicação demonstrativa
                        </dt>
                        <dd className="mt-1 leading-6 text-slate-400">
                          {detalhes?.aplicacao ?? "Não informada"}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-medium text-slate-200">
                          Descrição completa
                        </dt>
                        <dd className="mt-1 leading-6 text-slate-400">
                          {detalhes?.descricaoCompleta ??
                            produto.descricao}
                        </dd>
                      </div>
                    </dl>

                    <p className="rounded-xl border border-orange-400/20 bg-orange-400/5 p-3 text-xs leading-6 text-orange-200">
                      Dados fictícios para demonstração. Confirme a
                      compatibilidade no catálogo técnico antes de
                      qualquer compra ou instalação.
                    </p>
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-10 text-center">
          <h3 className="text-lg font-semibold">
            Nenhum produto encontrado
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Tente outro nome ou limpe os filtros.
          </p>
        </div>
      )}
    </div>
  );
}