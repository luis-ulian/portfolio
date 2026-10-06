# Atlas de Luís Ulian

Meu portfólio em forma de mapa de RPG. Cada cidade é uma parte do portfólio (sobre mim, projetos, habilidades e contato) e em cada uma da pra rolar um d20.

Feito com HTML, CSS e JavaScript puro, o Vite é usado só pra rodar e fazer o build.

para rodar:
```bash
npm install
npm run dev
```

para gerar o build (fica na pasta dist):
```bash
npm run build
```

onde mudar as coisas:
- textos das cidades, projetos e habilidades: `index.html`
- nome das cidades, testes e frases do dado: `cities` no começo do `src/main.js`
- posição das cidades no mapa: `.city-sobre`, `.city-projetos`... no `src/style.css`
- desenho do mapa: `public/map.svg`
- imagens: `public/pfp.jpg`, `public/projetos/` e `public/og.jpg` (preview quando manda o link)

da pra abrir uma cidade direto pelo link: `/#sobre`, `/#projetos`, `/#habilidades`, `/#contato`
