export type Produto = {
  codigo: string;
  nome: string;
  categoria: string;
  descricao: string;
  marca: string;
  aplicacao: string;
  descricaoCompleta: string;
};

export const produtos: Produto[] = [
  {
    codigo: "AP-001",
    nome: "Pastilha de freio dianteira",
    categoria: "Freios",
    descricao: "Exemplo de produto para o catálogo de peças.",
    marca: "Marca demonstrativa",
    aplicacao: "Veículo de exemplo — aplicação não validada.",
    descricaoCompleta:
      "Item demonstrativo da categoria de freios. Em um catálogo real, os detalhes devem incluir fabricante, referência e aplicação confirmada no catálogo técnico.",
  },
  {
    codigo: "AP-002",
    nome: "Filtro de óleo",
    categoria: "Motor",
    descricao: "Exemplo de produto para manutenção preventiva.",
    marca: "Marca demonstrativa",
    aplicacao: "Motor de exemplo — aplicação não validada.",
    descricaoCompleta:
      "Item demonstrativo para manutenção do motor. Em um catálogo real, a seleção deve considerar a referência do fabricante e as especificações do veículo.",
  },
  {
    codigo: "AP-003",
    nome: "Amortecedor dianteiro",
    categoria: "Suspensão",
    descricao: "Exemplo de produto para o sistema de suspensão.",
    marca: "Marca demonstrativa",
    aplicacao: "Suspensão de exemplo — aplicação não validada.",
    descricaoCompleta:
      "Item demonstrativo da categoria de suspensão. Em um catálogo real, os detalhes devem informar posição de montagem, referência e aplicação confirmada.",
  },
];