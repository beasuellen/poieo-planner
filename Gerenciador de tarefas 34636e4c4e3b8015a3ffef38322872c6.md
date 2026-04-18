# Gerenciador de tarefas

vamos aqui criar um sistema de gerenciamento de tarefas e que funcione dentro das seguintes regras:

- deve ter um espaço para eu subir as tarefas do meu dia
- o objetivo principal aqui é eu conseguir visualizar bem claramente as tarefas do meu dia e semana, de forma que fique fácil de eu entender o que é e que principalmente me mostre uma barra de progresso e que eu tenha uma visao do quanto fui produtiva no dia
- devemos ter a possibilidade de taggear se é da kasper, pessoal, freela, igreja, curso, tcc…
- quero que seja básico e claro
- devemos tbm ter a possibilidade de ter um timer para eu ver quanto tempo fico focada no servico

baseado no briefing basico que te forneci, me faca mais perguntas para que fique um sistema bonito e que mais pessoas possam utilizar relamente.

no caso, as etapas para a construcao do app será definir o briefing, ir pro claude code e depois fazer a deploy no vercel

vamos primeiro definir os requisitos

quero um design no estilo da imagem abaixo:

![image.png](Gerenciador%20de%20tarefas/image.png)

1. deverá ser salvo em localhost; o que significa isso de backup e sincronizacao?; sim, os dados devem ficar salvos.
2. a tarefa deve vir com o espaço de titulo, descricao, data e horário do dia que eu vou reservar para fazer isso (estilo planner), deve conter um timer que ficar contando os minutos quando clicado, status de to do, doing, done e on hold. quero visualizar em formato de dia, mas que tenha um calendario pequeno que posso clicar no dia e aparece o que eu fiz. as tarefas sao diárias, mas posso planejar minha semana toda num dia apenas, entao posso alimentar ela inteira. sim, devemos colocar prioridade por cor e texto
3. o timer deverá ser clicado para comecar a contabilizar, para eu Entender quanto tempo gasto em uma task. sim, quero que mostre depois que finalizar mostre quanto tempo trabalhei nessa tarefa. o timer deverá ter pause e o finish
4. por enquanto sao essas tags que eu me lembro, sao algumas fixas que eu me recordo, mas depois posso adicionar mais se necessário. nao, todas podem ter a mesma cor. podemos ver multiplas tags simnultaneamente. vamos adicionar masi as seguintes tags: portfolio, orar, leitura biblica, pizzaria, tarefas de casa
5. isso, quero o máximo de trackeamento da minha produtividade, cmo eu tenho procastinado demais, quero ter uma visao completa do quanto eu consigo produzir de fato. isso, quero que contabilize mei streak de produtividade
6. quero light mode. animacoes suaves e intuitivas. quero celebracao sim. sim, quero a barra de progressao na home e tbm a tarefa em doing que esteja com o timer acionado. atencao, apenas podemos ter uma tarefa por vez em doing com o timer acionado, pois quero que seja bem fiel a minha necessidade e realidade.
7. preciso utilizar no desktop e no mobile. sobre ser web ou PWA pode escolher o mais fácil
8. ok, pode ser, mas precisamos deixar bem intuitivo, sem muitas distracoes, mas que cumpra bem seu principal propósito
9. esqueca-se sobre a estética Y2K, quero que o design seja nesse estilo de design

Perfeito! Entendi tudo. Vou analisar a imagem que você enviou para captar a essência do design.Entendi perfeitamente! A referência mostra um design **limpo, elegante e minimalista** com:

- Cores suaves (azul profundo + brancos/off-white)
- Tipografia clara e sofisticada
- Muito espaço em branco
- Ilustrações delicadas
- Foco total na funcionalidade

Isso é bem diferente do Y2K — é mais **moderne girlie minimalist**. Perfeito para produtividade! 💙

---

## 📋 **BRIEFING FINAL CONSOLIDADO**

### **1. VISÃO GERAL**

**App de Gerenciamento de Tarefas com Foco em Produtividade**

- Design minimalista elegante (referência: Coffee Haven)
- Versão web + responsivo para mobile e desktop
- Dados salvos em localStorage (persistem ao recarregar)
- Uma única tarefa pode estar em "doing" com timer por vez

### **2. ESTRUTURA DE DADOS**

Cada tarefa tem:

- ✅ **Título** (obrigatório)
- 📝 **Descrição** (opcional)
- 📅 **Data e Horário** (quando você vai fazer)
- 🏷️ **Tag** (Kasper, Pessoal, Freela, Igreja, Curso, TCC, Portfolio, Orar, Leitura Bíblica, Pizzaria, Tarefas de Casa)
- 🎯 **Prioridade** (Alta/Média/Baixa) — indicada por cor + texto
- ⏱️ **Timer** (clica para iniciar, pause/finish)
- 📊 **Tempo Real Gasto** (mostra após concluir)
- 📌 **Status**: To Do → Doing → Done | On Hold
- 🎨 **Cor de Prioridade**:
    - 🔴 Alta (vermelho/coral)
    - 🟡 Média (laranja/amarelo)
    - 🟢 Baixa (verde/azul)

### **3. FUNCIONALIDADES PRINCIPAIS**

### **Dashboard/Home**

- [ ]  Barra de progresso geral do dia (tarefas concluídas/total)
- [ ]  Card destacado da tarefa em "doing" com timer ativo
- [ ]  Métrica rápida: Horas produtivas hoje, streak de produtividade
- [ ]  Botão flutuante "Nova Tarefa"

### **Visualização Principal (Dia)**

- [ ]  Calendário pequeno no topo (clica no dia, vê tarefas daquele dia)
- [ ]  Lista de tarefas do dia em formato de cards/rows
- [ ]  Filtro por tag (ver múltiplas tags simultaneamente)
- [ ]  Drag-and-drop para reordenar (opcional, mas legal)
- [ ]  Clica no card → abre modal com detalhes

### **Modal de Tarefa**

- [ ]  Título, descrição, data/horário, tag, prioridade (tudo editável)
- [ ]  Status: botões To Do → Doing → Done | On Hold
- [ ]  **Timer**:
    - Clica para iniciar (começa a contar)
    - Botão Pause (pausa)
    - Botão Finish (finaliza e mostra tempo total gasto)
    - Display: HH:MM:SS
- [ ]  Histórico de tempo (após concluir: "Você gastou 2h 15min nesta tarefa")
- [ ]  Deletar tarefa

### **Estatísticas & Produtividade**

- [ ]  **Hoje**: Tarefas concluídas, tempo total focado, streak
- [ ]  **Essa semana**: Gráfico de produtividade por dia
- [ ]  **Streak**: Dias consecutivos com at least 1 tarefa concluída
- [ ]  Relatório simples (por tag, por prioridade)

### **Adicionar Nova Tarefa**

- [ ]  Modal limpo com campos: título, descrição, data/hora, tag, prioridade
- [ ]  Salvamento automático em localStorage
- [ ]  Feedback visual ao criar

### **4. RESTRIÇÕES & COMPORTAMENTOS**

- ⚠️ **Apenas 1 tarefa em "doing" com timer por vez** — ao selecionar outra, a anterior pausa automaticamente
- ⏸️ Timer pausa quando você fecha a aba? Não, continua rodando (mas app precisa estar aberto)
- 🗑️ Tarefas deletadas saem para sempre (sem trash/restauração)
- 📱 PWA é optional — fazer como webapp comum primeiro (mais fácil)

### **5. DESIGN & UX**

- **Paleta**: Azul suave, brancos, tons de cinza, acentos em coral/verde para prioridades
- **Tipografia**: Sans-serif limpa (tipo Inter, Poppins, ou similar)
- **Animações**: Suaves e discretas (fade in/out, slide, progress bar animada)
- **Celebração**: Confetti/efeito visual ao completar tarefa ✨
- **Light mode**: Primário, sem dark mode
- **Feedback**: Toast notifications para ações (criou, deletou, pausou, finalizou)

### **6. TECNOLOGIA RECOMENDADA**

- **Frontend**: React + TypeScript
- **State**: useState/useContext (simples, sem Redux)
- **Storage**: localStorage + JSON
- **Deploy**: Vercel (como planejado)
- **Animações**: Framer Motion (opcional) ou CSS puro
- **Toasts**: React Hot Toast ou similar

---

## 🎯 **PRÓXIMOS PASSOS**

1. ✅ **Briefing aprovado** (você pode ajustar algo?)
2. 🚀 **Claude Code** → Construir a aplicação completa
3. 🌐 **Deploy Vercel** → Publicar e testar em produção

**Tem algo que você quer ajustar no briefing antes de começarmos a codificar?** Tipo paleta de cores específica, alguma funcionalidade extra, ou retirar algo?