# PieFit

App para montar a rotina de treino. O catálogo guarda os exercícios; a semana diz o que entra em cada dia.

O repositório tem duas partes:

- `piefit` — interface em Next.js
- `PieFitApi` — API em Express, com MongoDB e validação em Zod

## O que dá para fazer

Na tela de exercícios, listar e cadastrar um exercício: nome, grupos musculares, equipamento e descrição.

Na tela da semana, criar um plano e incluir exercícios num dia. Cada item leva séries, faixa de repetições e carga.

A API expõe o CRUD de `/exercises` e de `/workout-plans`. O app usa esses recursos para gravar o catálogo e o plano.

## Como rodar

É preciso Node.js e um MongoDB acessível. Os exemplos abaixo sobem a API na porta 3001 e o app na 3000.

### API

```bash
cd PieFitApi
cp .env.example .env
npm install
npm run dev
```

O `.env.example` define `MONGO_URI` e `PORT`. Sem `MONGO_URI`, a API não conecta.

### App

```bash
cd piefit
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A URL da API vem de `NEXT_PUBLIC_API_URL`. O padrão é `http://localhost:3001`, e o exemplo está em `piefit/.env.example`.

## Testes

Os testes automatizados ficam na API:

```bash
cd PieFitApi
npm test
```

O frontend não tem suíte de testes.

## Onde olhar

- `piefit/app` — tela
- `piefit/services` — chamadas HTTP
- `PieFitApi/src` — rotas, controllers e models
- `.github/pull_request_template.md` — corpo padrão de pull request
