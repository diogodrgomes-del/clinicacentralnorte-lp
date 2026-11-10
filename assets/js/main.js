/* ==========================================================================
   Clínica Dentária Central Norte — scripts do site
   Para trocar o número ou a mensagem, edite só o bloco CONFIG.
   ========================================================================== */

const CONFIG = {
  // Número do WhatsApp com DDI + DDD, só dígitos
  whatsapp: '5543999913414',
  mensagem: 'Olá! Vim pelo site e quero agendar uma avaliação na Clínica Dentária Central Norte.',
  // Velocidade da faixa da equipe (pixels por segundo)
  velocidadeEquipe: 45
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
  ad.classList.toggle('so-antes', pct >= 99);
  ad.classList.toggle('so-depois', pct <= 1);
  adRange.value = Math.round(pct);
}
const pctDoEvento = (e) => { const r = ad.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
ad.addEventListener('pointerdown', (e) => { arrastando = true; ad.classList.add('arrastando', 'usado'); ad.setPointerCapture(e.pointerId); posicionar(pctDoEvento(e)); marcarBotao(null); });
ad.addEventListener('pointermove', (e) => { if (arrastando) posicionar(pctDoEvento(e)); });
const soltar = () => { if (!arrastando) return; arrastando = false; ad.classList.remove('arrastando'); registrar('antes_depois', { modo: 'arrastar' }); };
ad.addEventListener('pointerup', soltar);
ad.addEventListener('pointercancel', soltar);

// Botões "Ver antes / Comparar / Ver depois" — mais fácil que arrastar para muita gente
const botoesAd = $$('.ad__botoes button');
function marcarBotao(alvo) { botoesAd.forEach((b) => b.setAttribute('aria-pressed', b === alvo)); }
botoesAd.forEach((b) => b.addEventListener('click', () => {
  arrastando = false;
  ad.classList.add('usado');
  marcarBotao(b);
  posicionar(+b.dataset.ir);
  registrar('antes_depois', { modo: b.textContent.trim() });
}));
adRange.addEventListener('input', () => { ad.classList.add('usado', 'arrastando'); posicionar(+adRange.value); });
adRange.addEventListener('change', () => ad.classList.remove('arrastando'));

// Uma passada curta da linha quando aparece, para mostrar que dá para arrastar
if ('IntersectionObserver' in window && !reduzMovimento) {
  new IntersectionObserver((itens, obs) => {
    if (!itens[0].isIntersecting) return;
    obs.disconnect();
    const quadros = [[0, 50], [650, 25], [1400, 75], [2100, 50]];
    const inicio = performance.now();
    ad.classList.add('arrastando');
    (function animar(agora) {
      if (arrastando || ad.classList.contains('usado')) { ad.classList.remove('arrastando'); return; }
      const t = agora - inicio;
      let i = 0;
      while (i < quadros.length - 2 && t > quadros[i + 1][0]) i++;
      const [t0, p0] = quadros[i], [t1, p1] = quadros[i + 1];
      const k = Math.min(1, (t - t0) / (t1 - t0));
      posicionar(p0 + (p1 - p0) * (1 - Math.cos(k * Math.PI)) / 2);
      if (t < quadros[quadros.length - 1][0]) requestAnimationFrame(animar);
      else ad.classList.remove('arrastando');
    })(inicio);
  }, { threshold: .6 }).observe(ad);
}

// Depoimentos: troca a cada 7 segundos, pausa quando a pessoa interage
(function () {
  const caixa = $('#depos');
  if (!caixa) return;
  const itens = $$('.depo', caixa);
  const pontos = $('#depos-pontos');
  let atual = 0, timer;
  itens.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Ver depoimento ' + (i + 1));
    b.addEventListener('click', () => { ir(i); reiniciar(); });
    pontos.appendChild(b);
  });
  function ir(i) {
    atual = (i + itens.length) % itens.length;
    itens.forEach((el, k) => el.classList.toggle('ativo', k === atual));
    $$('button', pontos).forEach((b, k) => b.setAttribute('aria-current', k === atual));
  }
  function reiniciar() { clearInterval(timer); if (!reduzMovimento) timer = setInterval(() => ir(atual + 1), 7000); }
  caixa.addEventListener('mouseenter', () => clearInterval(timer));
  caixa.addEventListener('mouseleave', reiniciar);
  let x0 = null;
  caixa.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  caixa.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { ir(atual + (dx < 0 ? 1 : -1)); reiniciar(); }
    x0 = null;
  }, { passive: true });
  ir(0);
  reiniciar();
})();

// Cliques em ligar
$$('[data-evento="ligar"]').forEach((a) => a.addEventListener('click', () => registrar('ligar_click', {})));

// Cliques no mapa
$$('[data-evento="mapa"], .local__foto').forEach((a) => a.addEventListener('click', () => registrar('mapa_click', {})));

// Equipe: faixa contínua ------------------------------------------------------
// Nunca para: anda sozinha o tempo todo. Se a pessoa segurar, continua andando;
// se arrastar, a faixa vai junto com o dedo e, ao soltar, segue com o embalo.
(function () {
  const faixa = $('#equipe-faixa');
  const trilho = $('#equipe-trilho');
  if (!faixa || !trilho) return;

  $$('.doutor', trilho).forEach((card) => {
    const copia = card.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');
    trilho.appendChild(copia);
  });

  let metade = trilho.scrollWidth / 2;
  addEventListener('resize', () => { metade = trilho.scrollWidth / 2; });

  const base = reduzMovimento ? 0 : -CONFIG.velocidadeEquipe; // px/s, para a esquerda
  let x = 0;
  let embalo = 0;            // velocidade extra do gesto, vai sumindo sozinha
  let tocando = false, decidido = false, horizontal = false;
  let iniX = 0, iniY = 0, ultX = 0, ultT = 0, velDedo = 0;

  function aplicar() {
    if (metade > 0) { while (x <= -metade) x += metade; while (x > 0) x -= metade; }
    trilho.style.transform = 'translate3d(' + x + 'px,0,0)';
  }

  let anterior = performance.now();
  (function quadro(agora) {
    const dt = Math.min(0.05, (agora - anterior) / 1000);
    anterior = agora;
    if (!(tocando && horizontal)) embalo *= Math.exp(-dt * 2.5);
    x += (base + embalo) * dt;
    aplicar();
    requestAnimationFrame(quadro);
  })(anterior);

  function inicio(cx, cy, mouse) {
    tocando = true; decidido = mouse; horizontal = mouse;
    iniX = ultX = cx; iniY = cy; ultT = performance.now(); velDedo = 0;
  }
  function mover(cx, cy, e) {
    if (!tocando) return;
    if (!decidido) {
      const dx = Math.abs(cx - iniX), dy = Math.abs(cy - iniY);
      if (dx < 5 && dy < 5) return;
      decidido = true; horizontal = dx >= dy;
      if (!horizontal) { tocando = false; return; } // gesto vertical: deixa a página rolar
      ultX = iniX; ultT = performance.now();
      embalo = 0;
    }
    if (e && e.cancelable) e.preventDefault();
    const agora = performance.now();
    const d = cx - ultX;
    x += d; aplicar();
    const t = Math.max(8, agora - ultT);
    velDedo = velDedo * 0.5 + (d / t * 1000) * 0.5;
    ultX = cx; ultT = agora;
  }
  function fim() {
    if (!tocando) return;
    if (horizontal) embalo = Math.max(-3000, Math.min(3000, velDedo - base));
    tocando = false; horizontal = false;
  }

  // Toque (celular)
  faixa.addEventListener('touchstart', (e) => { const t = e.touches[0]; inicio(t.clientX, t.clientY, false); }, { passive: true });
  faixa.addEventListener('touchmove', (e) => { const t = e.touches[0]; mover(t.clientX, t.clientY, e); }, { passive: false });
  faixa.addEventListener('touchend', fim, { passive: true });
  faixa.addEventListener('touchcancel', fim, { passive: true });

  // Mouse (computador)
  faixa.addEventListener('mousedown', (e) => { e.preventDefault(); inicio(e.clientX, e.clientY, true); });
  addEventListener('mousemove', (e) => mover(e.clientX, e.clientY));
  addEventListener('mouseup', fim);
  faixa.addEventListener('dragstart', (e) => e.preventDefault());
})();

// Entrada suave das seções ----------------------------------------------------
const aRevelar = $$('.cab, .caso, .depos, .local, .tratamentos, .faq, .final__grid');
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
