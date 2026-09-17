# Clínica Dentária Central Norte — Landing Page

Landing page estática (HTML + CSS + JS, sem build e sem dependências).
Basta abrir o `index.html` ou publicar a pasta em qualquer hospedagem.

```
index.html              página completa
assets/css/styles.css   estilos (paleta da logo: azul + creme)
assets/js/main.js       menu, FAQ, vídeos, formulário → WhatsApp
assets/img/             imagens (as atuais são placeholders .svg)
assets/video/           depoimentos em vídeo (.mp4)
```

## 1. O que trocar primeiro

### WhatsApp (o mais importante)
Em `assets/js/main.js`, no topo do arquivo:

```js
const CONFIG = {
  whatsapp: '5500000000000',        // DDI + DDD + número, só dígitos
  mensagemPadrao: 'Olá! ...'
};
```

Todos os botões da página (hero, cabeçalho, botão flutuante, barra do celular e
o formulário) usam esse número automaticamente.

### Textos e dados
Todo ponto que precisa de informação real está marcado com `<!-- EDITAR -->`
no `index.html`. Para achar todos de uma vez:

```bash
grep -n "EDITAR" index.html
```

Lista do que está com valor provisório:

- telefone, endereço e horários (barra superior, contato e rodapé);
- números da faixa de destaque (anos, atendimentos, especialidades);
- nota e quantidade de avaliações do Google (card do hero);
- nomes e legendas dos 3 depoimentos;
- condições de pagamento e convênios atendidos;
- CNPJ e responsável técnico com CRO no rodapé (exigência do CFO);
- link do Google Maps (Maps → Compartilhar → Incorporar um mapa);
- domínio nas tags de SEO, `sitemap.xml` e `robots.txt`.

### Fotos
Substitua os arquivos em `assets/img/` mantendo os nomes, ou troque o `src` no HTML.
Formatos: `.jpg`/`.webp`. Proporções usadas no layout:

| Arquivo | Onde aparece | Proporção sugerida |
|---|---|---|
| `hero.svg` | destaque principal | vertical 4:5 (ex. 1080×1350) |
| `sobre.svg` | seção "A clínica" | horizontal 9:7 |
| `clinica-1..4.svg` | galeria de fotos | quadrada 1:1 |
| `trat-*.svg` | cards de tratamentos | vertical 4:5 |
| `video-1..3.svg` | capa dos depoimentos | vertical 9:16 |
| `logo.svg` | cabeçalho e rodapé | use a logo oficial (`logo.png`) |

> Dica: salve as fotos com no máximo ~1600px de largura e qualidade 80 para o site
> continuar rápido no celular.

### Depoimentos em vídeo
1. Coloque os arquivos em `assets/video/` como `depoimento-1.mp4`, `depoimento-2.mp4`, `depoimento-3.mp4`.
2. Coloque a capa (um frame do vídeo) em `assets/img/video-1.jpg` etc. e atualize o `src` da imagem.
3. Ajuste nome e legenda de cada paciente no `index.html`.

O vídeo só é baixado quando a pessoa clica no play — a página abre rápido mesmo no 4G.
Vídeos verticais (9:16), até ~15 MB cada, funcionam melhor.

## 2. Rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## 3. Publicar

**Netlify:** arraste a pasta em app.netlify.com/drop, ou conecte este repositório
(sem comando de build, diretório de publicação `.`). O `netlify.toml` já está pronto.

**GitHub Pages:** Settings → Pages → branch `main` / pasta `/ (root)`.

## 4. Estrutura da página

1. Barra de horário e telefone
2. Cabeçalho fixo com CTA
3. Hero com proposta de valor e prova social
4. Faixa de números
5. Como atendemos (4 passos)
6. Tratamentos (8 cards)
7. Depoimentos em vídeo (3)
8. A clínica + galeria de fotos
9. Formas de pagamento
10. Dúvidas frequentes
11. Contato com formulário que abre o WhatsApp + mapa
12. Rodapé
13. Botão flutuante de WhatsApp e barra fixa de ação no celular
