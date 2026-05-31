# Loucura Animal 2

Continuação do **Loucura Animal** — jogo de sobrevivência predador-presa em vista de cima, feito com **Phaser 3** + **Vite**.

## Novidades da versão 2

- **18 animais jogáveis**, cada um com habilidade própria (dash, voo, pulo, disparada, rugido, **cavar**...).
- **Animapédia** — enciclopédia no menu com informações de cada bicho.
- **Itens mágicos** — power-ups espalhados pelo mapa (turbo, escudo, recarga, bônus).
- **4 mecânicas de ambiente**: ciclo dia/noite, chuva, mato alto (furtividade) e fôlego/corrida (Shift).
- Resolução e capacidade de renderização aumentadas, visual mais bonito.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço local que o Vite mostrar (ex.: `http://localhost:5173`).

## Build de produção

```bash
npm run build
npm run preview
```

## Controles

- **WASD / setas** — mover
- **Shift** — correr (gasta fôlego)
- **E / espaço** — habilidade
- **B** isca · **V** avisar · **N** ajuda · **H** base · **G** passagem · **F** habilidade especial
- **I** — abrir a Animapédia (no menu)

## Tecnologias

- [Phaser 3](https://phaser.io/) — motor do jogo
- [Vite](https://vitejs.dev/) — bundler e servidor de desenvolvimento (live reload)
