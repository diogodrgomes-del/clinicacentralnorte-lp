# Clínica Dentária Central Norte — Site

Site de uma página com foco em vendas de **implantes dentários e prótese protocolo** em Londrina,
pensado para o público de 45+ (texto grande, alto contraste, botões grandes).
HTML + CSS + JS puro, sem build e sem dependências.

```
index.html              página completa
assets/css/styles.css   estilos (paleta da logo: azul-noite → azul royal)
assets/js/main.js       WhatsApp, quiz, comparativo, faixa da equipe, animações
assets/img/             logo (original, branca e ícone) e foto do hero
```

## Seções

1. Hero com promessa, CTA de WhatsApp e foto
3. 01 · Antes e depois — comparação arrastável (protocolo e implante unitário)
4. 02 · "Isso acontece com você?" — a pessoa marca as situações e o botão abre o WhatsApp com elas escritas
5. 03 · Implante × Prótese protocolo + comparativo interativo dentadura × protocolo
6. 04 · Equipe — faixa contínua com 9 dentistas (pausa ao passar o mouse ou tocar)
7. 05 · Outros tratamentos (cada cartão abre o WhatsApp com a mensagem daquele tratamento)
8. 06 · Dúvidas rápidas
9. Chamada final + contato
10. Botão flutuante (computador) e barra fixa (celular)

## Antes de publicar

- **WhatsApp:** `CONFIG.whatsapp` no topo de `assets/js/main.js` (hoje é um número provisório).
- **Pontos `<!-- EDITAR -->`** no `index.html` (`grep -n EDITAR index.html`):
  selo "Agenda aberta", endereço, horários, CNPJ, responsável técnico com CRO,
  condições de pagamento, respostas do FAQ, domínio e rastreamento.
- **Equipe:** fotos em `assets/img/dentista-1.webp` … `dentista-9.webp` (descomente a `<img>` de cada cartão),
  nomes, especialidades e CRO.
- **Antes e depois:** hoje usa uma ilustração em SVG. Troque por fotos reais de pacientes,
  com autorização por escrito e seguindo as normas de publicidade do CFO
  (coloque um `<img>` dentro de `.ad__antes` e `.ad__depois`).
- **Foto do hero (`assets/img/casal.webp` e `casal-560.webp`):** confirme que tem licença de uso.

## Conversões

Cada clique em WhatsApp envia `whatsapp_click` ao `dataLayer`, com o campo `origem`
(hero, implante, protocolo, trat-ortodontia, barra-celular…). É só instalar o GTM/Pixel.

## Rodar localmente

```bash
python3 -m http.server 8080
```
