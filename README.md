# Sorrifácil Londrina — Landing Page de Implantes

Landing page estática (HTML + CSS + JS, sem build e sem dependências), feita a partir
do conteúdo da página `onmid.app/sorrifacil-londrina`.

```
index.html              página completa
assets/css/styles.css   estilos (azul #009BC9 / #88D4E3 do site original)
assets/js/main.js       WhatsApp, formulário, vídeos, animações
```

## Estrutura da página

1. Cabeçalho fixo com botão de agendamento
2. Hero com a promessa principal + formulário (nome, WhatsApp, dentes perdidos, bairro)
3. "Os Implantes são para quem quer..." (5 benefícios)
4. Depoimento em vídeo em destaque
5. Como funciona (4 passos) — **seção nova**
6. "Seu sorriso está aqui! Pertinho de você" (localização)
7. Equipe: Dr. Junior Zanon, Dr. Denes, Dr. Wericon e Dra. Isabela
8. Depoimentos em vídeo (Maria Aparecida, Cristiane, Lurdes da Silva)
9. Dúvidas frequentes — **seção nova, revisar respostas**
10. Chamada final + rodapé
11. Botão flutuante de WhatsApp (computador) e barra fixa de agendamento (celular)

## O que ajustar

- **WhatsApp:** `CONFIG` no topo de `assets/js/main.js` (hoje `5543988198379`).
- **Pontos marcados com `<!-- EDITAR -->`** no `index.html` (`grep -n EDITAR index.html`):
  domínio, rastreamento, endereço, CNPJ/responsável técnico, FAQ e textos herdados.
- **Imagens:** ainda carregam direto de `onmid.app`. Baixe-as para `assets/img/` e troque
  os `src`, senão a página quebra se o site antigo sair do ar.

## Conversões

O formulário abre o WhatsApp com os dados preenchidos (e a origem `utm_source` / `utm_campaign`
quando existir). Cada clique empurra um evento no `dataLayer`:

| Evento | Quando |
|---|---|
| `whatsapp_click` | clique em qualquer botão de WhatsApp (campo `origem` diz qual) |
| `lead_form` | envio do formulário |
| `video_play` | play em um depoimento |

Basta instalar o GTM/Pixel do cliente no `<head>` e criar as conversões a partir deles.

## Rodar localmente

```bash
python3 -m http.server 8080
```

## Publicar

Netlify: conecte o repositório (sem comando de build, pasta `.`).
