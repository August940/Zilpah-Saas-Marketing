const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.1 });
document.querySelectorAll('[data-animate]').forEach(el => {
  if (el.dataset.animate === 'stagger') [...el.children].forEach((c, i) => c.style.setProperty('--i', i));
  io.observe(el);
});

document.querySelectorAll('.flip-card').forEach(card => {
  const faces = card.querySelectorAll('.flip-card__face');
  let turn = 0;
  card.addEventListener('click', () => {
    turn += 180;
    const back = turn / 180 % 2 === 1, hadFocus = card.contains(document.activeElement);
    card.style.setProperty('--turn', turn + 'deg');
    faces[0].inert = back;
    faces[1].inert = !back;
    if (hadFocus) faces[+back].querySelector('.flip-btn').focus({ preventScroll: true }); // keep keyboard focus on the visible side
  });
  card.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    card.style.cssText += `--tx:${(0.5 - py) * 16}deg;--ty:${(px - 0.5) * 16}deg;--gx:${px * 100}%;--gy:${py * 100}%;--sheen:1;--lift:1.02`;
  });
  card.addEventListener('pointerleave', () => { card.style.cssText += '--tx:0deg;--ty:0deg;--sheen:0;--lift:1'; });
});

// a cursor effect: skipped on touch screens, and hidden while the pointer is outside the hero so it never parks on the centred text
if (matchMedia('(hover: hover)').matches) mountSwarmCursor(document.querySelector('.hero-intro'), { color: '#f6f0dc', accentColor: '#ff4d8b', count: 600, idle: 'hide' });

// ScrollExpand (React Bits), vanilla port of its window-scroll mode; shorter scroll and hold than its defaults so content arrives sooner
(() => {
  const root = document.querySelector('.scroll-expand');
  const $ = c => root.querySelector('.scroll-expand__' + c);
  const track = $('track'), stage = $('stage'), frame = $('frame'), media = $('media'), scrim = $('scrim'), overlay = $('overlay'), title = $('title'), hint = $('hint');
  const c = { startWidth: 42, startHeight: 58, startRadius: 24, endRadius: 0, mediaZoom: 1.35, scrollDistance: 0.8, holdDistance: 0.15, smoothing: 0.1, overlayScrim: 0.45 };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a || 1e-6), 0, 1); return t * t * (3 - 2 * t); };
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0, current = 0, target = 0, stageH = 0;

  const apply = p => {
    const e = smoothstep(0, 1, p);
    const w = c.startWidth + (100 - c.startWidth) * e, h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2), iy = Math.max(0, (100 - h) / 2);
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${c.startRadius + (c.endRadius - c.startRadius) * e}px)`;
    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;
    scrim.style.opacity = c.overlayScrim * e;
    const out = smoothstep(0.4, 0.88, p);
    title.style.opacity = 1 - out;
    title.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    const gone = smoothstep(0, 0.12, p);
    hint.style.opacity = 1 - gone;
    const inn = smoothstep(0.68, 1, p);
    overlay.style.opacity = inn;
    overlay.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
    overlay.inert = inn < 0.5; // keep the hidden button out of tab order and clicks
  };
  const measure = () => {
    stageH = innerHeight;
    stage.style.height = stageH + 'px';
    track.style.height = stageH * (reduceMotion ? 1 : 1 + c.scrollDistance + c.holdDistance) + 'px'; // reduced motion: one static, fully expanded screen
    stage.style.setProperty('--se-title-size', clamp(innerWidth * 0.075, 20, 84) + 'px');
  };
  const read = () => reduceMotion ? 1 : clamp(-track.getBoundingClientRect().top / (stageH * c.scrollDistance), 0, 1);
  const tick = () => {
    current += (target - current) * (1 - Math.exp(-1 / (60 * c.smoothing)));
    if (Math.abs(target - current) < 0.0004) current = target;
    apply(current);
    raf = current === target ? 0 : requestAnimationFrame(tick);
  };
  addEventListener('scroll', () => {
    target = read();
    if (reduceMotion) return apply(current = target);
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  addEventListener('resize', () => { measure(); apply(current = target = read()); });
  measure(); apply(current = target = read());
})();
