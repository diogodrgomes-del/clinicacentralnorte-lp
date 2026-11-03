# Clínica Dentária Central Norte — Site

Site de uma página com foco em vendas de **implantes dentários e prótese protocolo** em Londrina,
pensado para o público de 45+ (texto grande, alto contraste, botões grandes).
HTML + CSS + JS puro, sem build e sem dependências.

```
index.html              página completa
assets/css/styles.css   estilos (paleta da logo: azul-noite → azul royal)
assets/js/main.js       WhatsApp, antes e depois, seleção de situações, faixa da equipe
assets/img/             logo, favicon, foto do topo, fachada e fotos do caso real
```

## Seções

1. Topo azul-escuro: promessa, "Agendar pelo WhatsApp", "Ligar agora" e endereço
2. Faixa de credibilidade
3. Caso real — antes e depois com botões Ver antes / Comparar / Ver depois
4. Depoimentos — um por vez, troca a cada 7 segundos (arrasta no celular)
5. Localização — fachada + botão para abrir o mapa (Av. Saul Elkind)
6. Implante × Prótese protocolo + tabela dentadura × protocolo fixo
7. "Você se reconhece?" — a pessoa marca e o WhatsApp já abre com o que marcou
8. Equipe — faixa contínua com 9 especialistas
9. Outros tratamentos (11 itens)
10. Dúvidas frequentes
11. Contato + rodapé com responsável técnico e política de privacidade

## Antes de publicar

- **WhatsApp/telefone:** (43) 99991-3414 — `CONFIG.whatsapp` em `assets/js/main.js` e os links `tel:` no `index.html`.
- **Pontos `<!-- EDITAR -->`** no `index.html` (`grep -n EDITAR index.html`):
  itens da faixa de credibilidade, endereço, horários, CNPJ, responsável técnico com CRO,
  condições de pagamento, respostas do FAQ, domínio e rastreamento.
- **Equipe:** fotos em `assets/img/dentista-1.webp` … `dentista-9.webp` (descomente a `<img>` de cada cartão),
  nomes, especialidades e CRO.
- **Antes e depois (`caso1-antes.webp` / `caso1-depois.webp`):** confirme a autorização por escrito
  da paciente e as normas de publicidade do CFO. Para outro caso, gere duas fotos 800×600 com o mesmo
  enquadramento e troque os `src`.
- **Foto do topo (`hero-casal.webp`):** confirme que tem licença de uso.
- **Localização:** o link do mapa está em `index.html` (procure `share.google`). Complete número e horários.

## Google Ads

- Página de política de privacidade: `politica-de-privacidade.html` (revise CNPJ).
- Conversões para criar no GTM a partir do `dataLayer`:
  `whatsapp_click` (campo `origem`), `ligar_click`, `mapa_click` e `antes_depois`.
- Use o título do anúncio alinhado ao topo: "Implantes Dentários em Londrina".

## Conversões

Cada clique em WhatsApp envia `whatsapp_click` ao `dataLayer`, com o campo `origem`
(hero, implante, protocolo, trat-ortodontia, barra-celular…). É só instalar o GTM/Pixel.

## Rodar localmente

```bash
python3 -m http.server 8080
```
