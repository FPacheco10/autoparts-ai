"use client";

import { useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import type { Produto } from "@/lib/produtos";
import Catalogo from "./Catalogo";

const CHAVE = "autoparts-ai:produtos-cadastrados:v1";
const EVENTO = "autoparts-ai:produtos-alterados";

const estiloCampo =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30";

const campos = [
  { nome: "codigo", rotulo: "Código", exemplo: "AP-004" },
  { nome: "nome", rotulo: "Nome", exemplo: "Filtro de ar" },
  { nome: "categoria", rotulo: "Categoria", exemplo: "Motor" },
  {
    nome: "descricao",
    rotulo: "Descrição curta",
    exemplo: "Resumo do produto",
  },
  {
    nome: "marca",
    rotulo: "Marca",
    exemplo: "Marca demonstrativa",
  },
  {
    nome: "aplicacao",
    rotulo: "Aplicação demonstrativa",
    exemplo: "Veículo de exemplo — aplicação não validada",
  },
] as const;

function inscrever(notificar: () => void) {
  window.addEventListener("storage", notificar);
  window.addEventListener(EVENTO, notificar);

  return () => {
    window.removeEventListener("storage", notificar);
    window.removeEventListener(EVENTO, notificar);
  };
}

function obterDadosSalvos() {
  try {
    return window.localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

function obterDadosServidor() {
  return null;
}

function ehProduto(valor: unknown): valor is Produto {
  if (typeof valor !== "object" || valor === null) {
    return false;
  }

  const item = valor as Record<string, unknown>;

  return [
    "codigo",
    "nome",
    "categoria",
    "descricao",
    "marca",
    "aplicacao",
    "descricaoCompleta",
  ].every(
    (campo) =>
      typeof item[campo] === "string" &&
      item[campo].trim().length > 0
  );
}

function lerProdutosSalvos(texto: string | null): Produto[] {
  if (texto === null) {
    return [];
  }

  const dados: unknown = JSON.parse(texto);

  if (!Array.isArray(dados) || !dados.every(ehProduto)) {
    throw new Error("Formato de dados inválido.");
  }

  const codigos = dados.map((produto) =>
    produto.codigo.trim().toUpperCase()
  );

  if (new Set(codigos).size !== codigos.length) {
    throw new Error("Existem códigos duplicados.");
  }

  return dados;
}

function combinarProdutos(
  iniciais: Produto[],
  cadastrados: Produto[]
) {
  const resultado = [...iniciais];

  for (const produto of cadastrados) {
    const existe = resultado.some(
      (item) =>
        item.codigo.toUpperCase() === produto.codigo.toUpperCase()
    );

    if (!existe) {
      resultado.push(produto);
    }
  }

  return resultado;
}

function salvarProdutos(produtos: Produto[]) {
  window.localStorage.setItem(CHAVE, JSON.stringify(produtos));
  window.dispatchEvent(new Event(EVENTO));
}

export default function GestaoCatalogo({
  produtosIniciais,
}: {
  produtosIniciais: Produto[];
}) {
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [emEdicao, setEmEdicao] = useState<Produto | null>(null);

  const dadosSalvos = useSyncExternalStore(
    inscrever,
    obterDadosSalvos,
    obterDadosServidor
  );

  let cadastrados: Produto[] = [];
  let dadosInvalidos = false;

  try {
    cadastrados = lerProdutosSalvos(dadosSalvos);
  } catch {
    dadosInvalidos = true;
  }

  const produtos = combinarProdutos(produtosIniciais, cadastrados);

  function limparMensagens() {
    setMensagem("");
    setErro("");
  }

  function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const dados = new FormData(formulario);

    function ler(campo: string) {
      return String(dados.get(campo) ?? "").trim();
    }

    const produto: Produto = {
      codigo: ler("codigo").toUpperCase(),
      nome: ler("nome"),
      categoria: ler("categoria"),
      descricao: ler("descricao"),
      marca: ler("marca"),
      aplicacao: ler("aplicacao"),
      descricaoCompleta: ler("descricaoCompleta"),
    };

    limparMensagens();

    if (!ehProduto(produto)) {
      setErro("Preencha todos os campos com conteúdo válido.");
      return;
    }

    try {
      const salvos = lerProdutosSalvos(
        window.localStorage.getItem(CHAVE)
      );

      const atuais = combinarProdutos(produtosIniciais, salvos);

      if (emEdicao) {
        const original = salvos.find(
          (item) => item.codigo === emEdicao.codigo
        );

        if (!original) {
          setErro(
            "Esse produto não está mais salvo. Cancele a edição e atualize a página."
          );
          return;
        }

        if (JSON.stringify(original) !== JSON.stringify(emEdicao)) {
          setErro(
            "Esse produto foi alterado em outra aba. Cancele e abra a edição novamente."
          );
          return;
        }

        // O código identifica o produto e permanece fixo na edição.
        produto.codigo = original.codigo;
      }

      const codigoExiste = atuais.some(
        (item) =>
          item.codigo.toUpperCase() === produto.codigo.toUpperCase() &&
          item.codigo !== emEdicao?.codigo
      );

      if (codigoExiste) {
        setErro("Esse código já existe. Informe outro código.");
        return;
      }

      const categoriaExistente = atuais.find(
        (item) =>
          item.categoria.toLocaleLowerCase("pt-BR") ===
          produto.categoria.toLocaleLowerCase("pt-BR")
      );

      if (categoriaExistente) {
        produto.categoria = categoriaExistente.categoria;
      }

      const atualizados = emEdicao
        ? salvos.map((item) =>
            item.codigo === emEdicao.codigo ? produto : item
          )
        : [...salvos, produto];

      salvarProdutos(atualizados);

      formulario.reset();
      setEmEdicao(null);

      setMensagem(
        `${produto.nome} foi ${
          emEdicao ? "atualizado" : "cadastrado"
        } neste navegador. Limpe os filtros caso ele não apareça.`
      );
    } catch {
      setErro(
        "Não foi possível salvar. Verifique o armazenamento do navegador. Os dados anteriores foram preservados."
      );
    }
  }

  function editar(produto: Produto) {
    limparMensagens();
    setEmEdicao(produto);

    document.getElementById("formulario-produto")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    document.getElementById("cadastro-nome")?.focus({
      preventScroll: true,
    });
  }

  function excluir(produto: Produto) {
    const confirmou = window.confirm(
      `Excluir "${produto.nome}" dos produtos salvos neste navegador?`
    );

    if (!confirmou) {
      return;
    }

    limparMensagens();

    try {
      const salvos = lerProdutosSalvos(
        window.localStorage.getItem(CHAVE)
      );

      const original = salvos.find(
        (item) => item.codigo === produto.codigo
      );

      if (!original) {
        setErro("Esse produto já foi removido.");
        return;
      }

      if (JSON.stringify(original) !== JSON.stringify(produto)) {
        setErro(
          "O produto foi alterado em outra aba. Confira os dados e tente novamente."
        );
        return;
      }

      salvarProdutos(
        salvos.filter((item) => item.codigo !== produto.codigo)
      );

      if (emEdicao?.codigo === produto.codigo) {
        setEmEdicao(null);
      }

      setMensagem(`${produto.nome} foi excluído deste navegador.`);
    } catch {
      setErro(
        "Não foi possível excluir. Os dados existentes foram preservados."
      );
    }
  }

  return (
    <div>
      <section
        id="formulario-produto"
        aria-labelledby="titulo-formulario"
        className="mt-8 scroll-mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6"
      >
        <h3
          id="titulo-formulario"
          className="text-xl font-semibold text-orange-400"
        >
          {emEdicao
            ? "Editar produto demonstrativo"
            : "Cadastrar produto demonstrativo"}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Use dados fictícios. Os cadastros ficam salvos apenas neste
          navegador e podem ser apagados ao limpar os dados de navegação.
        </p>

        <form
          key={emEdicao?.codigo ?? "novo-produto"}
          onSubmit={salvar}
          className="mt-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {campos.map((campo) => (
              <div key={campo.nome}>
                <label
                  htmlFor={`cadastro-${campo.nome}`}
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  {campo.rotulo}
                </label>

                <input
                  id={`cadastro-${campo.nome}`}
                  name={campo.nome}
                  type="text"
                  required
                  maxLength={campo.nome === "codigo" ? 40 : 200}
                  placeholder={campo.exemplo}
                  defaultValue={emEdicao?.[campo.nome] ?? ""}
                  readOnly={campo.nome === "codigo" && emEdicao !== null}
                  className={`${estiloCampo} read-only:cursor-not-allowed read-only:opacity-60`}
                />
              </div>
            ))}
          </div>

          {emEdicao && (
            <p className="mt-3 text-xs text-slate-400">
              O código permanece fixo para identificar o produto.
            </p>
          )}

          <div className="mt-4">
            <label
              htmlFor="cadastro-descricao-completa"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Descrição completa
            </label>

            <textarea
              id="cadastro-descricao-completa"
              name="descricaoCompleta"
              required
              maxLength={2000}
              rows={4}
              defaultValue={emEdicao?.descricaoCompleta ?? ""}
              placeholder="Descreva o produto demonstrativo."
              className={estiloCampo}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-orange-400 px-6 py-3 font-semibold text-slate-950 hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
            >
              {emEdicao ? "Salvar alterações" : "Adicionar ao catálogo"}
            </button>

            {emEdicao && (
              <button
                type="button"
                onClick={() => {
                  setEmEdicao(null);
                  limparMensagens();
                }}
                className="rounded-xl border border-slate-600 px-5 py-3 text-sm hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </section>

      <p role="alert" className="mt-4 text-sm text-red-300">
        {erro}
      </p>

      <p role="status" className="mt-2 text-sm text-emerald-300">
        {mensagem}
      </p>

      {dadosInvalidos && (
        <p role="alert" className="mt-5 text-sm text-red-300">
          Os cadastros salvos estão em formato inválido. Apenas os
          produtos iniciais estão sendo exibidos. Os dados salvos
          foram preservados.
        </p>
      )}

      <section
        aria-labelledby="titulo-cadastrados"
        className="mt-8 rounded-2xl border border-white/10 p-6"
      >
        <h3 id="titulo-cadastrados" className="text-lg font-semibold">
          Gerenciar produtos cadastrados
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Os três exemplos iniciais são fixos. Aqui você gerencia os
          produtos que cadastrou neste navegador.
        </p>

        {cadastrados.length === 0 ? (
          <p className="mt-5 text-sm text-slate-400">
            Nenhum produto cadastrado.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {cadastrados.map((produto) => (
              <li
                key={produto.codigo}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900 p-4"
              >
                <div className="min-w-0">
                  <p className="break-words font-medium">
                    {produto.nome}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {produto.codigo} · {produto.categoria}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => editar(produto)}
                    aria-label={`Editar ${produto.nome}`}
                    className="rounded-lg px-3 py-2 text-sm text-orange-400 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-orange-400"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => excluir(produto)}
                    aria-label={`Excluir ${produto.nome}`}
                    className="rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-red-300"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Catalogo produtos={produtos} />
    </div>
  );
}