"use client";

import { useState } from "react";

type Produto = {
  codigo: string;
  nome: string;
  categoria: string;
  descricao: string;
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
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {produtosFiltrados.map((produto) => (
            <article
              key={produto.codigo}
              className="rounded-2xl border border-white/10 bg-slate-900 p-6"
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
            </article>
          ))}
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