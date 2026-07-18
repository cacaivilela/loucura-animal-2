# Loucura Animal 2

Continuação do **Loucura Animal** — jogo de sobrevivência predador-presa em vista de cima, feito com **Phaser 3** + **Vite**.

## Novidades da versão 2

- **24 animais jogáveis**, cada um com habilidade própria (dash, voo, pulo, disparada, rugido, **cavar**...) — incluindo os pares sapo↔garça, esquilo↔gavião e ovelha↔lobo.
- **Ecossistema sorteado** (modos normal/turbo): se você é **presa**, o jogo sorteia 5 presas e traz os predadores que as caçam; se você é **predador**, traz a presa dele.
- **Animapédia** — enciclopédia no menu com informações de cada bicho.
- **Itens mágicos** — power-ups espalhados pelo mapa (turbo, escudo, recarga, bônus).
- **4 mecânicas de ambiente**: ciclo dia/noite, chuva, mato alto (furtividade) e fôlego/corrida (Shift).
- **Som de bicho** — efeitos sonoros 100% procedurais (Web Audio, sem arquivos): rugidos, mordidas, passos, moedas, vitória. Liga/desliga com **J**.
- **Trilha ambiente** — pássaros cantando de dia, grilos à noite.
- **Bichos vivos** — respiram parados e dão pulinho/agacham ao caminhar.
- **Balões de emoção** — 😱 fugindo, 😋 comendo, 😵 atordoado, 🆘 pedindo ajuda.
- **Combo de caça** — presas caçadas em sequência sobem o tom e rendem moedas extras (🔥).
- **Juice** — tremor de câmera e partículas (poeira ao correr, pelo/penas ao comer, faíscas nas moedas).
- **Caos animal** — eventos aleatórios durante a partida: debandada, hora da caçada, chuva de moedas, lua de sangue, ventania.
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
- **Clique / toque** — mover até o ponto (segure e arraste pra guiar); funciona no celular
- **Shift** — correr (gasta fôlego)
- **E / espaço** — habilidade
- **P** — pausa · **B** isca · **V** avisar · **N** ajuda · **H** base · **G** passagem · **F** habilidade especial · **J** liga/desliga som

Há um **minimapa** no canto (🔴 quem te caça · 🟢 sua presa · 🟡 você) e **setas na borda** apontando o predador/alvo mais próximo fora da tela.
- **I** — abrir a Animapédia (no menu)

## Tecnologias

- [Phaser 3](https://phaser.io/) — motor do jogo
- [Vite](https://vitejs.dev/) — bundler e servidor de desenvolvimento (live reload)
