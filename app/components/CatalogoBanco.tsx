import type { Produto } from "@/lib/produtos";
import Catalogo from "./Catalogo";

function converterProduto(valor: unknown): Produto {
  if (typeof valor !== "object" || valor === null) {
    throw new Error("Produto inválido.");
  }

  const item = valor as Record<string, unknown>;

  function texto(campo: string): string {
    const valorCampo = item[campo];

    if (typeof valorCampo !== "string") {
      throw new Error(`Campo inválido: ${campo}`);
    }

    return valorCampo;
  }

  return {
    codigo: texto("codigo"),
    nome: texto("nome"),
    categoria: texto("categoria"),
    descricao: texto("descricao"),
    marca: texto("marca"),
    aplicacao: texto("aplicacao"),
    descricaoCompleta: texto("descricao_completa"),
  };
}

export default async function CatalogoBanco() {
  let produtos: Produto[];

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const chave =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !chave) {
      throw new Error("Configuração do Supabase ausente.");
    }

    const endpoint = new URL("/rest/v1/produtos", url);

    endpoint.searchParams.set(
      "select",
      "codigo,nome,categoria,descricao,marca,aplicacao,descricao_completa"
    );
    endpoint.searchParams.set("order", "nome.asc");

    const resposta = await fetch(endpoint, {
      headers: {
        apikey: chave,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (!resposta.ok) {
      throw new Error(`Consulta falhou: HTTP ${resposta.status}`);
    }

    const dados: unknown = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("Resposta inválida do banco.");
    }

    produtos = dados.map(converterProduto);
  } catch {
    return (
      <div
        role="alert"
        className="mt-8 rounded-2xl border border-red-400/30 bg-red-400/5 p-6"
      >
        <h3 className="font-semibold text-red-300">
          Não foi possível carregar o catálogo
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Verifique a conexão e atualize a página para tentar novamente.
        </p>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <p
        role="status"
        className="mt-8 rounded-2xl border border-white/10 p-6 text-slate-400"
      >
        Nenhum produto disponível no catálogo.
      </p>
    );
  }

  return <Catalogo produtos={produtos} />;
}