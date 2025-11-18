# FastFeet API

API para transportadora fictícia FastFeet desenvolvida com Node.js, Fastify, Prisma e PostgreSQL.

## Funcionalidades

### Autenticação
- Login com CPF e senha
- JWT para autenticação
- Controle de acesso baseado em roles (ADMIN/DELIVERYMAN)

### Usuários
- CRUD de entregadores (apenas admin)
- Dois tipos: administrador e entregador

### Encomendas
- CRUD de encomendas (apenas admin)
- Marcar como aguardando retirada
- Retirar encomenda (entregador)
- Marcar como entregue com foto obrigatória
- Marcar como devolvida
- Listar encomendas próximas ao entregador

### Destinatários
- CRUD de destinatários (apenas admin)

## Tecnologias

- Node.js
- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Zod

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente
3. Execute as migrations:

```bash
npx prisma migrate dev
```

## Execução

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## Rotas da API

### Autenticação
- `POST /sessions` - Login

### Admin (requer role ADMIN)
- `POST /users` - Criar usuário
- `GET /users` - Listar usuários
- `DELETE /users/:id` - Deletar usuário
- `POST /orders` - Criar encomenda
- `GET /orders` - Listar encomendas
- `PATCH /orders/:id/awaiting` - Marcar como aguardando
- `POST /recipients` - Criar destinatário
- `GET /recipients` - Listar destinatários
- `DELETE /recipients/:id` - Deletar destinatário

### Entregador (requer role DELIVERYMAN)
- `GET /deliveries` - Listar suas entregas
- `GET /orders/nearby` - Listar encomendas próximas
- `PATCH /orders/:id/pick-up` - Retirar encomenda
- `PATCH /orders/:id/deliver` - Marcar como entregue

## Arquitetura

O projeto segue os princípios de Clean Architecture e Domain-Driven Design (DDD):

- **Domain**: Entidades e repositórios
- **Application**: Casos de uso
- **Infrastructure**: Implementações concretas (Prisma, HTTP, etc.)

## Regras de Negócio

- Apenas admin pode gerenciar usuários, encomendas e destinatários
- Foto obrigatória para confirmar entrega
- Apenas o entregador que retirou pode marcar como entregue
- Entregadores só veem suas próprias entregas