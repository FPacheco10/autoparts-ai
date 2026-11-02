"use client";

import { useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import type { Produto } from "@/lib/produtos";
import Catalogo from "./Catalogo";

const CHAVE = "autoparts-ai:produtos-cadastrados:v1";
const EVENTO = "autoparts-ai:produtos-alterados";

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

export default function GestaoCatalogo({
  produtosIniciais,
}: {
  produtosIniciais: Produto[];
}) {
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

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

  function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const dados = new FormData(formulario);

    function ler(campo: string) {
      return String(dados.get(campo) ?? "").trim();
    }

    const novoProduto: Produto = {
      codigo: ler("codigo").toUpperCase(),
      nome: ler("nome"),
      categoria: ler("categoria"),
      descricao: ler("descricao"),
      marca: ler("marca"),
      aplicacao: ler("aplicacao"),
      descricaoCompleta: ler("descricaoCompleta"),
    };

    setMensagem("");
    setErro("");

    if (!ehProduto(novoProduto)) {
      setErro("Preencha todos os campos com conteúdo válido.");
      return;
    }

    try {
      // Lê novamente para considerar alterações de outras abas.
      const salvos = lerProdutosSalvos(
        window.localStorage.getItem(CHAVE)
      );

      const atuais = combinarProdutos(produtosIniciais, salvos);

      const codigoExiste = atuais.some(
        (produto) =>
          produto.codigo.toUpperCase() === novoProduto.codigo
      );

      if (codigoExiste) {
        setErro("Esse código já existe. Informe outro código.");
        return;
      }

      const categoriaExistente = atuais.find(
        (produto) =>
          produto.categoria.toLocaleLowerCase("pt-BR") ===
          novoProduto.categoria.toLocaleLowerCase("pt-BR")
      );

      if (categoriaExistente) {
        novoProduto.categoria = categoriaExistente.categoria;
      }

      window.localStorage.setItem(
        CHAVE,
        JSON.stringify([...salvos, novoProduto])
      );

      window.dispatchEvent(new Event(EVENTO));

      formulario.reset();

      setMensagem(
        `${novoProduto.nome} foi salvo neste navegador. Limpe os filtros caso ele não apareça no catálogo.`
      );
    } catch {
      setErro(
        "Não foi possível salvar. O armazenamento pode estar indisponível, cheio ou conter dados inválidos. Os dados existentes foram preservados."
      );
    }
  }

  return (
    <div>
      <details className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">
        <summary className="cursor-pointer rounded-lg font-semibold text-orange-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400">
          Cadastrar produto demonstrativo
        </summary>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          Use dados fictícios. Os cadastros ficam salvos neste navegador,
          inclusive após atualizar a página. Não são compartilhados
          entre dispositivos e podem ser apagados ao limpar os dados
          do navegador.
        </p>

        <form onSubmit={cadastrar} className="mt-6">
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
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                />
              </div>
            ))}
          </div>

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
              placeholder="Descreva o produto demonstrativo."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
            />
          </div>

          <p role="alert" className="mt-4 text-sm text-red-300">
            {erro}
          </p>

          <p role="status" className="mt-2 text-sm text-emerald-300">
            {mensagem}
          </p>

          <button
            type="submit"
            className="mt-5 rounded-xl bg-orange-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
          >
            Adicionar ao catálogo
          </button>
        </form>
      </details>

      {dadosInvalidos && (
        <p role="alert" className="mt-5 text-sm text-red-300">
          Os cadastros salvos estão em formato inválido. Apenas os
          produtos iniciais estão sendo exibidos. Os dados salvos
          foram preservados.
        </p>
      )}

      <Catalogo produtos={produtos} />
    </div>
  );
}