/* ==========================================================================
   Clínica Dentária Central Norte — scripts da landing page
   Tudo que precisa ser trocado está no bloco CONFIG abaixo.
   ========================================================================== */

const CONFIG = {
  // EDITAR: número do WhatsApp com DDI + DDD, só dígitos. Ex.: 5544999999999
  whatsapp: '5500000000000',
  // Mensagem que já vem escrita quando o paciente abre a conversa
  mensagemPadrao: 'Olá! Vim pelo site e gostaria de agendar uma avaliação na Clínica Dentária Central Norte.'
};

const linkWhats = (texto) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto || CONFIG.mensagemPadrao)}`;

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Links de WhatsApp ---------- */
  document.querySelectorAll('[data-wa]').forEach((el) => {
    el.href = linkWhats();
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---------- 2. Menu mobile ---------- */
  const cab = document.getElementById('cab');
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');

  const fecharMenu = () => {
    nav.classList.remove('is-aberto');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('trava');
  };

  menuBtn.addEventListener('click', () => {
    const aberto = nav.classList.toggle('is-aberto');
    menuBtn.setAttribute('aria-expanded', String(aberto));
    menuBtn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('trava', aberto);
  });

  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', fecharMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });

  /* ---------- 3. Sombra do cabeçalho ao rolar ---------- */
  const aoRolar = () => cab.classList.toggle('is-rolado', window.scrollY > 8);
  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });

  /* ---------- 4. Link ativo conforme a seção visível ---------- */
  const secoes = [...document.querySelectorAll('main section[id]')];
  const links = new Map(
    [...nav.querySelectorAll('ul a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a])
  );

  if ('IntersectionObserver' in window && secoes.length) {
    const obsNav = new IntersectionObserver((entradas) => {
      entradas.forEach((ent) => {
        const link = links.get(ent.target.id);
        if (link && ent.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-ativo'));
          link.classList.add('is-ativo');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach((s) => obsNav.observe(s));
  }

  /* ---------- 5. Depoimentos em vídeo (carrega só ao clicar) ---------- */
  document.querySelectorAll('.video__play').forEach((botao) => {
    botao.addEventListener('click', () => {
      const src = botao.dataset.video;
      if (!src) return;

      const poster = botao.querySelector('img');
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'auto';
      if (poster) video.poster = poster.getAttribute('src');
      video.setAttribute('aria-label', botao.getAttribute('aria-label') || 'Depoimento de paciente');

      botao.replaceWith(video);
      video.play().catch(() => { /* navegador pediu interação; o controle já está visível */ });
    });
  });

  /* ---------- 6. Formulário → WhatsApp ---------- */
  const form = document.getElementById('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const tel = form.tel.value.trim();
    const assunto = form.assunto.value;
    const msg = form.msg.value.trim();

    let invalido = null;
    [form.nome, form.tel].forEach((campo) => {
      const vazio = campo.value.trim().length < 3;
      campo.setAttribute('aria-invalid', String(vazio));
      if (vazio && !invalido) invalido = campo;
    });
    if (invalido) { invalido.focus(); return; }

    const texto =
      `Olá! Meu nome é ${nome}.\n` +
      `Gostaria de agendar: ${assunto}.\n` +
      `Meu WhatsApp: ${tel}.` +
      (msg ? `\nObservação: ${msg}` : '');

    window.open(linkWhats(texto), '_blank', 'noopener');
  });

  form.querySelectorAll('input').forEach((campo) => {
    campo.addEventListener('input', () => campo.removeAttribute('aria-invalid'));
  });

  /* ---------- 7. FAQ: abre um por vez ---------- */
  const perguntas = [...document.querySelectorAll('.faq details')];
  perguntas.forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) perguntas.forEach((o) => { if (o !== d) o.open = false; });
    });
  });

  /* ---------- 8. Entrada suave dos blocos ---------- */
  const alvos = document.querySelectorAll(
    '.passo, .trat, .video, .sobre__txt, .sobre__img, .galeria img, .pagto__lista li, .faq, .form, .contato__txt'
  );

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const alturaTela = window.innerHeight;
    alvos.forEach((el, i) => {
      // o que já está visível ao abrir a página nunca é escondido
      if (el.getBoundingClientRect().top > alturaTela * 0.9) {
        el.classList.add('rev');
        el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
      }
    });
    const obs = new IntersectionObserver((entradas, o) => {
      entradas.forEach((ent) => {
        if (!ent.isIntersecting) return;
        ent.target.classList.add('is-vis');
        o.unobserve(ent.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    alvos.forEach((el) => { if (el.classList.contains('rev')) obs.observe(el); });
  }

  /* ---------- 9. Mapa: carrega só quando o visitante pede ---------- */
  const mapa = document.getElementById('mapa');
  const verMapa = document.getElementById('verMapa');

  if (mapa && verMapa) {
    verMapa.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = mapa.dataset.mapa;
      iframe.title = 'Localização da Clínica Dentária Central Norte';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      mapa.replaceChildren(iframe);
    });
  }

  /* ---------- 10. Ano no rodapé ---------- */
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
});
