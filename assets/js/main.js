/* ==========================================================================
   Clínica Dentária Central Norte — scripts do site
   Para trocar o número ou a mensagem, edite só o bloco CONFIG.
   ========================================================================== */

const CONFIG = {
  // EDITAR: número do WhatsApp com DDI + DDD, só dígitos. Ex.: 5543999999999
  whatsapp: '5543000000000',
  // Mensagem padrão dos botões (cada tratamento tem a sua no data-msg do HTML)
  mensagem: 'Olá! Vim pelo site e quero agendar uma avaliação na Clínica Dentária Central Norte.'
};

const reduzMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

function linkWhatsApp(texto) {
  return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
}

function registrar(evento, dados) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: evento }, dados));
}

// Botões de WhatsApp ----------------------------------------------------------
document.querySelectorAll('[data-wa]').forEach((botao) => {
  botao.href = linkWhatsApp(botao.dataset.msg || CONFIG.mensagem);
  botao.addEventListener('click', () => registrar('whatsapp_click', { origem: botao.dataset.wa }));
});

// "Você se identifica?" -------------------------------------------------------
const dores = [...document.querySelectorAll('.dor')];
const resultado = document.getElementById('resultado');
const resultadoTitulo = document.getElementById('resultado-titulo');
const resultadoBarra = document.getElementById('resultado-barra');
const resultadoBtn = document.getElementById('resultado-btn');

dores.forEach((dor) => {
  dor.addEventListener('click', () => {
    dor.setAttribute('aria-pressed', dor.getAttribute('aria-pressed') !== 'true');
    const marcadas = dores.filter((d) => d.getAttribute('aria-pressed') === 'true');
    const total = marcadas.length;

    resultado.hidden = total === 0;
    if (!total) return;

    resultadoTitulo.textContent = total === 1
      ? 'Você marcou 1 situação.'
      : 'Você marcou ' + total + ' situações.';
    requestAnimationFrame(() => { resultadoBarra.style.width = (total / dores.length * 100) + '%'; });

    const lista = marcadas.map((d) => '• ' + d.textContent.trim()).join('\n');
    resultadoBtn.href = linkWhatsApp(
      'Olá! Vim pelo site e me identifiquei com:\n' + lista + '\n\nQuero agendar uma avaliação.'
    );
  });
});

// Contadores ------------------------------------------------------------------
function contar(el) {
  const alvo = parseFloat(el.dataset.conta);
  const casas = parseInt(el.dataset.casas || '0', 10);
  const formata = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
  if (reduzMovimento) { el.textContent = formata(alvo); return; }
  const inicio = performance.now();
  const duracao = 1600;
  (function passo(agora) {
    const t = Math.min((agora - inicio) / duracao, 1);
    const suave = 1 - Math.pow(1 - t, 3);
    el.textContent = formata(alvo * suave);
    if (t < 1) requestAnimationFrame(passo);
  })(inicio);
}

// Revelar ao rolar (com efeito cascata) e disparar os contadores ---------------
document.querySelectorAll('.dores, .solucoes, .beneficios, .passos, .tratamentos, .diferenciais, .numeros__grid').forEach((grupo) => {
  [...grupo.children].forEach((filho, i) => filho.style.setProperty('--atraso', (i * 0.08) + 's'));
});

if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((itens) => {
    itens.forEach((item) => {
      if (!item.isIntersecting) return;
      item.target.classList.add('visto');
      item.target.querySelectorAll('[data-conta]').forEach(contar);
      obs.unobserve(item.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.revela').forEach((el) => obs.observe(el));
} else {
  document.querySelectorAll('.revela').forEach((el) => el.classList.add('visto'));
  document.querySelectorAll('[data-conta]').forEach(contar);
}

// Brilho que segue o mouse nos cartões ---------------------------------------
document.querySelectorAll('.cartao').forEach((cartao) => {
  cartao.addEventListener('pointermove', (e) => {
    const r = cartao.getBoundingClientRect();
    cartao.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    cartao.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// Cabeçalho, barra de progresso e barra fixa do celular -----------------------
const topo = document.getElementById('topo');
const progresso = document.getElementById('progresso');
const barraCel = document.getElementById('barra-cel');
const flutuante = document.querySelector('.wa-flutuante');
const hero = document.getElementById('inicio');
let agendado = false;

function aoRolar() {
  agendado = false;
  const y = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  topo.classList.toggle('rolou', y > 20);
  progresso.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
  const passouHero = hero.getBoundingClientRect().bottom < innerHeight * 0.35;
  barraCel.classList.toggle('visivel', passouHero);
}
addEventListener('scroll', () => {
  if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); }
}, { passive: true });
aoRolar();

// Balão do WhatsApp aparece sozinho uma vez, depois de alguns segundos
setTimeout(() => {
  flutuante.classList.add('mostra');
  setTimeout(() => flutuante.classList.remove('mostra'), 5000);
}, 6000);

// FAQ: abre um de cada vez
document.querySelectorAll('.faq details').forEach((item, _, todos) => {
  item.addEventListener('toggle', () => {
    if (item.open) todos.forEach((outro) => { if (outro !== item) outro.open = false; });
  });
});

document.getElementById('ano').textContent = new Date().getFullYear();
