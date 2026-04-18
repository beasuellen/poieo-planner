# Focus · Planner

Planner pessoal de foco e produtividade. Tarefas do dia, calendário, timer com pause/finish, streak, métricas da semana. Inspirado na estética _Coffee Haven_ — azul profundo, off-white, tipografia elegante, ilustrações leves.

## Stack

- **React 18 + TypeScript**
- **Vite**
- **Framer Motion** (animações suaves)
- **React Hot Toast** (feedback)
- **canvas-confetti** (celebração)
- **localStorage** (persistência offline)

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

1. Suba o repositório no GitHub.
2. No Vercel, importe o projeto — ele detecta Vite automaticamente.
3. Build command: `npm run build` · Output: `dist`.

`vercel.json` já está configurado para SPA rewrites.

## Funcionalidades

- ✅ Título, descrição, data, horário, tags múltiplas, prioridade
- 🎯 Prioridade com cor + texto (alta/média/baixa)
- 📌 Status: _a fazer_, _fazendo_, _em espera_, _feito_
- ⏱️ Timer por tarefa (play / pause / finish) com HH:MM:SS
- 🔒 Só **uma** tarefa pode estar "fazendo" por vez — a anterior pausa automaticamente
- 📅 Calendário mensal mini (clique no dia pra ver o que fez)
- 📊 Barra de progresso do dia, métricas (tempo focado, finalizadas, streak)
- 📈 Gráfico da semana (barras por dia)
- 🏷️ Filtro por tag + criação de tags novas
- ✨ Celebração com confetti ao finalizar
- 🌞 Light mode, animações suaves, toasts de feedback
- 📱 Responsivo mobile + desktop
- 💾 Tudo salvo em `localStorage` (persiste ao recarregar; limpa se você limpar o navegador)

## Atalho

- **N** — abre modal de nova tarefa

## Tags padrão

Kasper, Pessoal, Freela, Igreja, Curso, TCC, Portfolio, Orar, Leitura Bíblica, Pizzaria, Tarefas de Casa — e você pode adicionar mais no modal.
