# Clínica Dentária Central Norte — Site

Site de uma página com foco em vendas de **implantes dentários e prótese protocolo** em Londrina,
pensado para o público de 45+ (texto grande, alto contraste, botões grandes).
HTML + CSS + JS puro, sem build e sem dependências.

```
index.html              página completa
assets/css/styles.css   estilos (paleta da logo: azul-noite → azul royal)
assets/js/main.js       WhatsApp, antes e depois, seleção de situações, faixa da equipe
assets/img/             logo (original, branca e azul), foto do topo e fotos do caso real
```

## Seções

1. Topo com promessa, botão de WhatsApp e foto
2. Faixa de credibilidade (equipe, foco, plano individual, Londrina)
3. Caso real — antes e depois arrastável (prótese total superior e PPR flex inferior)
4. "Alguma dessas situações faz parte do seu dia?" — a pessoa marca e o botão abre o WhatsApp com o que marcou
5. Implante × Prótese protocolo + tabela dentadura × protocolo fixo
6. Equipe — faixa contínua com 9 especialistas (pausa ao passar o mouse ou tocar)
7. Outros tratamentos (cada item abre o WhatsApp com a mensagem daquele tratamento)
8. Dúvidas frequentes
9. Contato + rodapé com responsável técnico
10. Botão flutuante (computador) e barra fixa (celular)

## Antes de publicar

- **WhatsApp:** `CONFIG.whatsapp` no topo de `assets/js/main.js` (hoje é um número provisório).
- **Pontos `<!-- EDITAR -->`** no `index.html` (`grep -n EDITAR index.html`):
  itens da faixa de credibilidade, endereço, horários, CNPJ, responsável técnico com CRO,
  condições de pagamento, respostas do FAQ, domínio e rastreamento.
- **Equipe:** fotos em `assets/img/dentista-1.webp` … `dentista-9.webp` (descomente a `<img>` de cada cartão),
  nomes, especialidades e CRO.
- **Antes e depois (`caso1-antes.webp` / `caso1-depois.webp`):** confirme a autorização por escrito
  da paciente e as normas de publicidade do CFO. Para outro caso, gere duas fotos 800×600 com o mesmo
  enquadramento e troque os `src`.
- **Foto do hero (`assets/img/casal.webp` e `casal-560.webp`):** confirme que tem licença de uso.

## Conversões

Cada clique em WhatsApp envia `whatsapp_click` ao `dataLayer`, com o campo `origem`
(hero, implante, protocolo, trat-ortodontia, barra-celular…). É só instalar o GTM/Pixel.

## Rodar localmente

```bash
python3 -m http.server 8080
```
