# Clínica Dentária Central Norte — Site

Site de uma página com foco em vendas de **implantes dentários e prótese protocolo** em Londrina,
pensado para o público de 45+ (texto grande, alto contraste, botões grandes).
HTML + CSS + JS puro, sem build e sem dependências.

```
index.html              página completa
assets/css/styles.css   estilos (paleta da logo: azul-noite → azul royal)
assets/js/main.js       WhatsApp, quiz "você se identifica?", contadores, animações
assets/img/             logo (original, branca e ícone) e foto do hero
```

## Seções

1. Hero com promessa, CTA de WhatsApp e foto
2. Números da clínica (contadores animados)
3. "Você se identifica?" — a pessoa marca as situações e o botão abre o WhatsApp com elas escritas
4. Implantes × Prótese protocolo + comparativo dentadura × protocolo fixo
5. O que muda na vida do paciente
6. Como funciona (4 passos)
7. Outros tratamentos (cada cartão abre o WhatsApp com a mensagem daquele tratamento)
8. Por que a Central Norte (referência em Londrina)
9. Dúvidas frequentes
10. Chamada final + contato
11. Botão flutuante (computador) e barra fixa (celular)

## Antes de publicar

- **WhatsApp:** `CONFIG.whatsapp` no topo de `assets/js/main.js` (hoje é um número provisório).
- **Pontos `<!-- EDITAR -->`** no `index.html` (`grep -n EDITAR index.html`):
  números da faixa de destaque, endereço, horários, CNPJ, responsável técnico com CRO,
  condições de pagamento, respostas do FAQ, domínio e rastreamento.
- **Foto do hero (`assets/img/casal.webp`):** foi recortada do banner de referência.
  Troque por uma foto própria ou de banco de imagens licenciado.

## Conversões

Cada clique em WhatsApp envia `whatsapp_click` ao `dataLayer`, com o campo `origem`
(hero, implante, protocolo, trat-ortodontia, barra-celular…). É só instalar o GTM/Pixel.

## Rodar localmente

```bash
python3 -m http.server 8080
```
