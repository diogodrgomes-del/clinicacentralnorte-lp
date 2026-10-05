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

// 01 · "Isso acontece com você?" ---------------------------------------------
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

// 02 · Dentadura × Protocolo -------------------------------------------------
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

// 03 · Equipe: faixa contínua ------------------------------------------------
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
