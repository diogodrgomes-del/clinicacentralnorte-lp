/* ==========================================================================
   Sorrifácil Londrina — scripts da landing page
   Para trocar o número ou a mensagem, edite só o bloco CONFIG.
   ========================================================================== */

const CONFIG = {
  // Número do WhatsApp com DDI + DDD, só dígitos
  whatsapp: '5543988198379',
  // Mensagem dos botões
  mensagem: 'Olá, vim pelo site, e quero voltar a sorrir com Implantes.'
};

// Guarda os parâmetros de campanha (utm_*) para mandar junto no formulário
const UTM = {};
new URLSearchParams(location.search).forEach((valor, chave) => {
  if (chave.startsWith('utm_') || chave === 'gclid' || chave === 'fbclid') UTM[chave] = valor;
});

function linkWhatsApp(texto) {
  return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
}

function registrar(evento, dados) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: evento }, UTM, dados));
}

// Todos os botões com data-wa abrem o WhatsApp com a mensagem padrão
document.querySelectorAll('[data-wa]').forEach((botao) => {
  botao.href = linkWhatsApp(CONFIG.mensagem);
  botao.addEventListener('click', () => registrar('whatsapp_click', { origem: botao.dataset.wa }));
});

// Formulário: valida e abre o WhatsApp com os dados preenchidos
const form = document.getElementById('form-lead');
const erro = document.getElementById('form-erro');

form.whatsapp.addEventListener('input', (e) => {
  const d = e.target.value.replace(/\D/g, '').slice(0, 11);
  let v = d;
  if (d.length > 2) v = '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length > 7) v = '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  e.target.value = v;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = form.nome.value.trim();
  const fone = form.whatsapp.value.replace(/\D/g, '');
  const dentes = form.dentes.value;
  const bairro = form.bairro.value.trim();

  const faltando = [];
  if (fone.length < 10) faltando.push(form.whatsapp);
  if (!dentes) faltando.push(form.dentes);
  if (!bairro) faltando.push(form.bairro);

  form.querySelectorAll('.invalido').forEach((c) => c.classList.remove('invalido'));
  if (faltando.length) {
    faltando.forEach((c) => c.classList.add('invalido'));
    erro.textContent = 'Preencha seu WhatsApp, quantos dentes perdeu e o bairro.';
    erro.hidden = false;
    faltando[0].focus();
    return;
  }
  erro.hidden = true;

  const linhas = [
    'Olá, vim pelo site e quero agendar uma avaliação para voltar a sorrir com Implantes.',
    '',
    nome ? 'Nome: ' + nome : null,
    'WhatsApp: ' + form.whatsapp.value,
    'Dentes perdidos: ' + dentes,
    'Bairro: ' + bairro,
    UTM.utm_source ? 'Origem: ' + [UTM.utm_source, UTM.utm_campaign].filter(Boolean).join(' / ') : null
  ].filter((l) => l !== null);

  registrar('lead_form', { dentes: dentes, bairro: bairro });
  window.open(linkWhatsApp(linhas.join('\n')), '_blank', 'noopener');
});

// Vídeos do YouTube: só carregam quando a pessoa clica
document.querySelectorAll('.yt').forEach((caixa) => {
  caixa.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + caixa.dataset.yt + '?autoplay=1&rel=0';
    iframe.title = caixa.getAttribute('aria-label');
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    caixa.replaceChildren(iframe);
    registrar('video_play', { video: caixa.dataset.yt });
  }, { once: true });
});

// Sombra no cabeçalho e barra fixa do celular depois do hero
const topo = document.getElementById('topo');
const barra = document.querySelector('.barra-cel');
const agendar = document.getElementById('agendar');
function aoRolar() {
  topo.classList.toggle('com-sombra', scrollY > 10);
  barra.classList.toggle('visivel', agendar.getBoundingClientRect().bottom < 0);
}
addEventListener('scroll', aoRolar, { passive: true });
aoRolar();

// Animação de entrada das seções
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((itens) => {
    itens.forEach((item) => {
      if (item.isIntersecting) {
        item.target.classList.add('visto');
        obs.unobserve(item.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.revela').forEach((el) => obs.observe(el));
} else {
  document.querySelectorAll('.revela').forEach((el) => el.classList.add('visto'));
}

document.getElementById('ano').textContent = new Date().getFullYear();
