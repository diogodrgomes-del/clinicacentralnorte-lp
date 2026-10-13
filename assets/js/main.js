/* ==========================================================================
   Clínica Dentária Central Norte — scripts do site
   Para trocar o número ou a mensagem, edite só o bloco CONFIG.
   ========================================================================== */

const CONFIG = {
  // EDITAR: número do WhatsApp com DDI + DDD, só dígitos. Ex.: 5543999999999
  whatsapp: '5543000000000',
  mensagem: 'Olá! Vim pelo site e quero agendar uma avaliação na Clínica Dentária Central Norte.',
  // Velocidade da faixa da equipe (pixels por segundo)
  velocidadeEquipe: 32
};

const reduzMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const linkWhatsApp = (texto) => 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);

function registrar(evento, dados) {
  (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: evento }, dados));
}

// Botões de WhatsApp ----------------------------------------------------------
$$('[data-wa]').forEach((botao) => {
  botao.href = linkWhatsApp(botao.dataset.msg || CONFIG.mensagem);
  botao.addEventListener('click', () => registrar('whatsapp_click', { origem: botao.dataset.wa }));
});


// 01 · Antes e depois ---------------------------------------------------------
// Ilustração de sorriso desenhada em SVG (provisória até chegarem fotos reais).
function sorriso(faltando, depois) {
  const sup = [32, 34, 36, 44, 44, 36, 34, 32];
  const inf = [28, 30, 30, 32, 32, 30, 30, 28];
  const alturaSup = [64, 72, 78, 86, 86, 78, 72, 64];
  const cor = depois ? 'url(#dBranco)' : 'url(#dAmarelo)';
  let x = 300 - sup.reduce((a, b) => a + b, 0) / 2;
  let dentes = '';
  sup.forEach((w, i) => {
    if (!faltando.includes(i)) {
      const torto = depois ? 0 : [2, -3, 1, 0, -2, 3, -1, 2][i];
      dentes += `<rect x="${x + 1.5}" y="${150 + torto}" width="${w - 3}" height="${alturaSup[i]}" rx="11" fill="${cor}"/>`;
    }
    x += w;
  });
  x = 300 - inf.reduce((a, b) => a + b, 0) / 2;
  inf.forEach((w, i) => {
    if (!faltando.includes('i' + i)) {
      dentes += `<rect x="${x + 1.5}" y="240" width="${w - 3}" height="58" rx="10" fill="${cor}"/>`;
    }
    x += w;
  });
  return `<svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${depois ? 'Depois: dentes completos' : 'Antes: dentes faltando'}">
    <defs>
      <linearGradient id="pele${depois ? 'D' : 'A'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6dccd"/><stop offset="1" stop-color="#e8bfa8"/></linearGradient>
      <linearGradient id="dBranco" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef1f4"/></linearGradient>
      <linearGradient id="dAmarelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe1b5"/><stop offset="1" stop-color="#cdb57c"/></linearGradient>
      <clipPath id="boca${depois ? 'D' : 'A'}"><path d="M118 182C200 150 400 150 482 182C450 268 370 304 300 304S150 268 118 182Z"/></clipPath>
    </defs>
    <rect width="600" height="380" fill="url(#pele${depois ? 'D' : 'A'})"/>
    <path d="M70 178C150 112 250 128 300 142C350 128 450 112 530 178C480 300 390 342 300 342S120 300 70 178Z" fill="#c4766d"/>
    <path d="M70 178C150 112 250 128 300 142C350 128 450 112 530 178C470 168 400 160 300 166S130 168 70 178Z" fill="#b5655d"/>
    <path d="M118 182C200 150 400 150 482 182C450 268 370 304 300 304S150 268 118 182Z" fill="#4a1b22"/>
    <g clip-path="url(#boca${depois ? 'D' : 'A'})">
      <rect x="100" y="140" width="400" height="22" fill="#e48c8f"/>
      ${dentes}
      <rect x="100" y="290" width="400" height="30" fill="#e48c8f"/>
    </g>
    <path d="M150 200C230 186 370 186 450 200" stroke="#fff" stroke-opacity=".12" stroke-width="6" fill="none"/>
  </svg>`;
}

const CASOS = {
  protocolo: [0, 1, 2, 4, 5, 7, 'i0', 'i2', 'i3', 'i5', 'i7'],
  implante: [2]
};
const ad = $('#ad');
const adAntes = $('#ad-antes');
const adDepois = $('#ad-depois');
const adRange = $('.ad__range', ad);

function mostrarCaso(caso) {
  adAntes.innerHTML = sorriso(CASOS[caso], false);
  adDepois.innerHTML = sorriso([], true);
  $$('.ad-abas button').forEach((b) => b.setAttribute('aria-selected', b.dataset.caso === caso));
}
$$('.ad-abas button').forEach((b) => b.addEventListener('click', () => mostrarCaso(b.dataset.caso)));
mostrarCaso('protocolo');

function posicionar(pct) {
  pct = Math.max(0, Math.min(100, pct));
  ad.style.setProperty('--pos', pct + '%');
  adRange.value = Math.round(pct);
}
let arrastando = false;
const pctDoEvento = (e) => { const r = ad.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
ad.addEventListener('pointerdown', (e) => { arrastando = true; ad.setPointerCapture(e.pointerId); posicionar(pctDoEvento(e)); ad.classList.remove('dica'); });
ad.addEventListener('pointermove', (e) => { if (arrastando) posicionar(pctDoEvento(e)); });
ad.addEventListener('pointerup', () => { arrastando = false; });
ad.addEventListener('pointercancel', () => { arrastando = false; });
adRange.addEventListener('input', () => posicionar(+adRange.value));

// A linha "passeia" sozinha para mostrar que dá para arrastar
function passear() {
  if (reduzMovimento) { posicionar(50); return; }
  ad.classList.remove('dica'); void ad.offsetWidth; ad.classList.add('dica');
  const quadros = [[0, 50], [700, 18], [1500, 82], [2300, 50]];
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
}
$$('.ad-abas button').forEach((b) => b.addEventListener('click', passear));
if ('IntersectionObserver' in window) {
  new IntersectionObserver((itens, obs) => {
    if (!itens[0].isIntersecting) return;
    obs.disconnect();
    passear();
  }, { threshold: .55 }).observe(ad);
}

// 02 · "Isso acontece com você?" ---------------------------------------------
const dores = $$('.dor');
const resultado = $('#resultado');
const resultadoN = $('#resultado-n');
const resultadoTitulo = $('#resultado-titulo');
const resultadoBtn = $('#resultado-btn');
const frases = ['', 'Isso tem solução.', 'Dá para resolver.', 'Você não precisa conviver com isso.', 'Está na hora de mudar.', 'Seu sorriso pode voltar.', 'Vamos resolver tudo isso.'];

dores.forEach((dor) => {
  dor.addEventListener('click', () => {
    dor.setAttribute('aria-pressed', dor.getAttribute('aria-pressed') !== 'true');
    if (navigator.vibrate) navigator.vibrate(12);
    const marcadas = dores.filter((d) => d.getAttribute('aria-pressed') === 'true');
    const total = marcadas.length;

    resultado.hidden = total === 0;
    if (!total) return;

    resultadoN.textContent = total;
    resultadoN.classList.remove('pula'); void resultadoN.offsetWidth; resultadoN.classList.add('pula');
    resultadoTitulo.textContent = frases[total];
    resultadoBtn.href = linkWhatsApp(
      'Olá! Vim pelo site e me identifiquei com:\n' +
      marcadas.map((d) => '• ' + d.textContent.trim()).join('\n') +
      '\n\nQuero agendar uma avaliação.'
    );
  });
});

// 03 · Dentadura × Protocolo -------------------------------------------------
const troca = $('#troca');
let trocaTocada = false;
function mudarModo(modo) {
  troca.classList.toggle('depois', modo === 'depois');
  $$('[data-modo]', troca).forEach((b) => b.tagName === 'BUTTON' && b.setAttribute('aria-selected', b.dataset.modo === modo));
}
$$('button[data-modo]', troca).forEach((b) => b.addEventListener('click', () => { trocaTocada = true; mudarModo(b.dataset.modo); }));
// Vira sozinho para "Com protocolo" quando aparece na tela, se a pessoa ainda não tocou
if ('IntersectionObserver' in window) {
  new IntersectionObserver((itens, obs) => {
    if (itens[0].isIntersecting) {
      setTimeout(() => { if (!trocaTocada) mudarModo('depois'); }, 1400);
      obs.disconnect();
    }
  }, { threshold: .6 }).observe(troca);
}

// 04 · Equipe: faixa contínua ------------------------------------------------
const faixa = $('#equipe-faixa');
const trilho = $('#equipe-trilho');
if (!reduzMovimento) {
  $$('.doutor', trilho).forEach((card) => {
    const copia = card.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');
    trilho.appendChild(copia);
  });
  const ajustarVelocidade = () => {
    trilho.style.setProperty('--duracao', (trilho.scrollWidth / 2 / CONFIG.velocidadeEquipe) + 's');
  };
  ajustarVelocidade();
  addEventListener('resize', ajustarVelocidade);

  // No celular, segurar o dedo pausa; solta e volta a andar
  let retomar;
  faixa.addEventListener('touchstart', () => { clearTimeout(retomar); faixa.classList.add('pausado'); }, { passive: true });
  faixa.addEventListener('touchend', () => { retomar = setTimeout(() => faixa.classList.remove('pausado'), 1800); }, { passive: true });
}

// Revelar ao rolar (em cascata) ----------------------------------------------
$$('.dores, .solucoes, .tratamentos').forEach((grupo) => {
  [...grupo.children].forEach((filho, i) => filho.style.setProperty('--atraso', (i * 0.07) + 's'));
});
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((itens) => {
    itens.forEach((item) => {
      if (!item.isIntersecting) return;
      item.target.classList.add('visto');
      obs.unobserve(item.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.revela').forEach((el) => obs.observe(el));
} else {
  $$('.revela').forEach((el) => el.classList.add('visto'));
}

// Cabeçalho, progresso e barra do celular -------------------------------------
const topo = $('#topo');
const progresso = $('#progresso');
const barraCel = $('#barra-cel');
const hero = $('#inicio');
let agendado = false;
function aoRolar() {
  agendado = false;
  const y = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  topo.classList.toggle('rolou', y > 20);
  progresso.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
  barraCel.classList.toggle('visivel', hero.getBoundingClientRect().bottom < innerHeight * 0.4);
}
addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); } }, { passive: true });
aoRolar();

// Balão do WhatsApp aparece uma vez
const flutuante = $('.wa-flutuante');
setTimeout(() => {
  flutuante.classList.add('mostra');
  setTimeout(() => flutuante.classList.remove('mostra'), 5000);
}, 7000);

// FAQ: um aberto por vez
$$('.faq details').forEach((item, _, todos) => {
  item.addEventListener('toggle', () => { if (item.open) todos.forEach((o) => o !== item && (o.open = false)); });
});

$('#ano').textContent = new Date().getFullYear();
