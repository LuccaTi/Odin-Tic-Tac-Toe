# The Odin Tic Tac Toe

Aplicação web de jogo da velha desenvolvida com HTML, CSS e JavaScript puro (vanilla JS).

## Descrição

Este projeto implementa uma Single Page Application (SPA) simples para partidas locais de Tic Tac Toe entre dois jogadores.

Fluxo principal:

- Iniciar jogo pela sidebar.
- Informar nome dos dois jogadores em formulário dinâmico.
- Jogar alternando turnos em um tabuleiro 3x3 interativo.
- Visualizar vencedor, empate, placar acumulado e linha da jogada vencedora.

## Funcionalidades Implementadas

- Formulário dinâmico para cadastro dos nomes dos jogadores.
- Validação de campos obrigatórios e limites de caracteres.
- Renderização dinâmica do tabuleiro com manipulação de DOM.
- Controle de turnos entre jogador X e jogador O.
- Bloqueio de jogadas em casas já ocupadas.
- Detecção de vitória em linhas, colunas e diagonais.
- Detecção de empate quando o tabuleiro é preenchido sem vencedor.
- Exibição visual da linha vencedora sobre o tabuleiro.
- Placar persistente durante a sessão (vitórias de cada jogador).
- Botão de `New Round` para reiniciar apenas a rodada atual.
- Botão de `Reset Game` para reiniciar completamente a aplicação.
- Layout responsivo com abordagem mobile first.

## Tecnologias e Conceitos Aplicados

- HTML5 semantico (`header`, `aside`, `main`, `footer`).
- CSS Grid e Flexbox para estrutura e alinhamento.
- Media query para adaptação em telas maiores.
- JavaScript modular com funções factory e controladores (`useGameController`, `useScreenController`).
- Manipulação de DOM, eventos (`click`, `submit`) e controle de estado em memoria.

## Estrutura do Projeto

- `index.html`: estrutura base da interface.
- `style.css`: estilos globais, responsividade, formulário, tabuleiro e efeitos visuais.
- `script.js`: lógica do jogo, fluxo da interface, placar e controle de rodadas.
- `assets/images/`: ícones e recursos visuais.

## Como Executar

1. Clone este repositório.
2. Abra a pasta do projeto.
3. Execute o arquivo `index.html` no navegador.


