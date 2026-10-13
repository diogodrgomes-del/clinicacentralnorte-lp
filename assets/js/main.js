/* ==========================================================================
   Clínica Dentária Central Norte — scripts do site
   Para trocar o número ou a mensagem, edite só o bloco CONFIG.
   ========================================================================== */

const CONFIG = {
  // EDITAR: número do WhatsApp com DDI + DDD, só dígitos. Ex.: 5543999999999
  whatsapp: '5543000000000',
  mensagem: 'Olá! Vim pelo site e quero agendar uma avaliação na Clínica Dentária Central Norte.',
  // Velocidade da faixa da equipe (pixels por segundo)
  velocidadeEquipe: 28
};

const reduzMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const linkWhatsApp = (texto) => 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
const registrar = (evento, dados) => (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: evento }, dados));

document.documentElement.classList.add('js');

// Botões de WhatsApp ----------------------------------------------------------
$$('[data-wa]').forEach((botao) => {
  botao.href = linkWhatsApp(botao.dataset.msg || CONFIG.mensagem);
  botao.addEventListener('click', () => registrar('whatsapp_click', { origem: botao.dataset.wa }));
});

// Antes e depois --------------------------------------------------------------
const ad = $('#ad');
const adRange = $('.ad__range', ad);
let arrastando = false;

function posicionar(pct) {
  pct = Math.max(0, Math.min(100, pct));
  ad.style.setProperty('--pos', pct + '%');
  adRange.value = Math.round(pct);
}
const pctDoEvento = (e) => { const r = ad.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
ad.addEventListener('pointerdown', (e) => { arrastando = true; ad.setPointerCapture(e.pointerId); posicionar(pctDoEvento(e)); });
ad.addEventListener('pointermove', (e) => { if (arrastando) posicionar(pctDoEvento(e)); });
ad.addEventListener('pointerup', () => { arrastando = false; registrar('antes_depois', {}); });
ad.addEventListener('pointercancel', () => { arrastando = false; });
adRange.addEventListener('input', () => posicionar(+adRange.value));

// Uma passada curta da linha quando aparece, para mostrar que dá para arrastar
if ('IntersectionObserver' in window && !reduzMovimento) {
  new IntersectionObserver((itens, obs) => {
    if (!itens[0].isIntersecting) return;
    obs.disconnect();
    const quadros = [[0, 50], [650, 25], [1400, 75], [2100, 50]];
    const inicio = performance.now();
    (function animar(agora) {
      if (arrastando) return;
      const t = agora - inicio;
      let i = 0;
      while (i < quadros.length - 2 && t > quadros[i + 1][0]) i++;
      const [t0, p0] = quadros[i], [t1, p1] = quadros[i + 1];
      const k = Math.min(1, (t - t0) / (t1 - t0));
      posicionar(p0 + (p1 - p0) * (1 - Math.cos(k * Math.PI)) / 2);
      if (t < quadros[quadros.length - 1][0]) requestAnimationFrame(animar);
    })(inicio);
  }, { threshold: .6 }).observe(ad);
}

// "Alguma dessas situações faz parte do seu dia?" -----------------------------
const dores = $$('.dor');
const resultado = $('#resultado');
const resultadoTitulo = $('#resultado-titulo');
const resultadoBtn = $('#resultado-btn');

dores.forEach((dor) => {
  dor.addEventListener('click', () => {
    dor.setAttribute('aria-pressed', dor.getAttribute('aria-pressed') !== 'true');
    const marcadas = dores.filter((d) => d.getAttribute('aria-pressed') === 'true');
    resultado.hidden = marcadas.length === 0;
    if (!marcadas.length) return;
    resultadoTitulo.textContent = marcadas.length === 1 ? 'Isso tem tratamento.' : 'Tudo isso tem tratamento.';
    resultadoBtn.href = linkWhatsApp(
      'Olá! Vim pelo site. Hoje eu:\n' + marcadas.map((d) => '• ' + d.textContent.trim()).join('\n') +
      '\n\nGostaria de agendar uma avaliação.'
    );
  });
});

// Equipe: faixa contínua ------------------------------------------------------
const faixa = $('#equipe-faixa');
const trilho = $('#equipe-trilho');
if (!reduzMovimento) {
  $$('.doutor', trilho).forEach((card) => {
    const copia = card.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');
    trilho.appendChild(copia);
  });
  const ajustar = () => trilho.style.setProperty('--duracao', (trilho.scrollWidth / 2 / CONFIG.velocidadeEquipe) + 's');
  ajustar();
  addEventListener('resize', ajustar);
  let retomar;
  faixa.addEventListener('touchstart', () => { clearTimeout(retomar); faixa.classList.add('pausado'); }, { passive: true });
  faixa.addEventListener('touchend', () => { retomar = setTimeout(() => faixa.classList.remove('pausado'), 2000); }, { passive: true });
}

// Entrada suave das seções ----------------------------------------------------
const aRevelar = $$('.cab, .caso, .dores, .solucoes, .compara, .tratamentos, .faq, .final__grid');
if ('IntersectionObserver' in window && !reduzMovimento) {
  aRevelar.forEach((el) => el.classList.add('revela'));
  const obs = new IntersectionObserver((itens) => {
    itens.forEach((item) => {
      if (!item.isIntersecting) return;
      item.target.classList.add('visto');
      obs.unobserve(item.target);
    });
  }, { rootMargin: '0px 0px -6% 0px' });
  aRevelar.forEach((el) => obs.observe(el));
}

// Cabeçalho e barra fixa do celular -------------------------------------------
const topo = $('#topo');
const barraCel = $('#barra-cel');
const heroAcoes = $('.hero__acoes');
let agendado = false;
function aoRolar() {
  agendado = false;
  topo.classList.toggle('rolou', scrollY > 10);
  barraCel.classList.toggle('visivel', heroAcoes.getBoundingClientRect().bottom < 0);
}
addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); } }, { passive: true });
aoRolar();

// FAQ: um aberto por vez
$$('.faq details').forEach((item, _, todos) => {
  item.addEventListener('toggle', () => { if (item.open) todos.forEach((o) => o !== item && (o.open = false)); });
});

$('#ano').textContent = new Date().getFullYear();
