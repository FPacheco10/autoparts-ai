# AutoParts AI

Catálogo demonstrativo de autopeças com busca por nome e filtro por categoria, desenvolvido com Next.js, React e TypeScript.

Projeto de portfólio de Felipe Pacheco, criado para aplicar conhecimentos de desenvolvimento web em um cenário de venda de autopeças.

## Funcionalidades disponíveis

- Interface responsiva com tema escuro.
- Listagem de produtos demonstrativos.
- Busca por nome, ignorando acentos e diferenças entre maiúsculas e minúsculas.
- Filtro por categoria combinado com a busca.
- Contagem de resultados.
- Mensagem para buscas sem resultados.
- Botão para limpar os filtros.
- Detalhes expansíveis dos produtos, com marca, aplicação e descrição demonstrativas.

## Tecnologias

- Next.js — App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Git e GitHub

## Como executar

É necessário ter Node.js e npm instalados em uma versão compatível com o projeto.

Clone o repositório:

```bash
git clone https://github.com/FPacheco10/autoparts-ai.git
```

Entre na pasta:

```bash
cd autoparts-ai
```

Instale as dependências a partir do arquivo de lock:

```bash
npm ci
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra o endereço informado no terminal, normalmente http://localhost:3000.

No PowerShell, se a execução de `npm.ps1` estiver bloqueada, use `npm.cmd` no lugar de `npm`.

## Verificações

Verificar o código da página e do catálogo:

```bash
npx eslint app/page.tsx app/components/Catalogo.tsx
```

Gerar a versão de produção e verificar os tipos:

```bash
npm run build
```

A implementação inicial passou pelas duas verificações.

## Estrutura principal

- `app/page.tsx`: página inicial e composição do catálogo.
- `lib/produtos.ts`: tipo Produto e dados demonstrativos.
- `app/components/Catalogo.tsx`: catálogo interativo com busca e filtros.
- `app/globals.css`: estilos globais.
- `app/layout.tsx`: layout principal da aplicação.

## Conceitos aplicados

- Composição de Server e Client Components.
- Estado e eventos com React.
- Tipagem de propriedades com TypeScript.
- Renderização de listas com `map`.
- Filtragem de dados com `filter`.
- Campos com rótulos e indicação da quantidade de resultados.
- Layout responsivo com Tailwind CSS.

## Limitações atuais

Os produtos são exemplos definidos no código. Não representam estoque, preços ou compatibilidade reais.

Esta versão ainda não possui banco de dados, autenticação, cadastro de produtos, integração com WhatsApp ou recursos de inteligência artificial.

## Próximas etapas

- [x ] Exibir detalhes dos produtos.
- [ ] Implementar cadastro e edição de produtos.
- [ ] Integrar um banco de dados.
- [ ] Implementar autenticação para a área administrativa.
- [ ] Integrar o atendimento pelo WhatsApp.
- [ ] Avaliar recursos de inteligência artificial para o atendimento.

## Autor

Desenvolvido por **Felipe Pacheco**.

GitHub: https://github.com/FPacheco10