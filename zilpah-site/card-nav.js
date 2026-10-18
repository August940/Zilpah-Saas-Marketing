// CardNav (React Bits): spring-driven open/close with staggered cards
(() => {
  const root = document.getElementById('card-nav'), panel = root.querySelector('.card-nav__panel'), bar = root.querySelector('.card-nav__bar');
  const content = root.querySelector('.card-nav__content'), menu = root.querySelector('.card-nav__menu'), words = root.querySelectorAll('.card-nav__word');
  const cards = [...root.querySelectorAll('.card-nav__card, .card-nav__wide')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stagger = 0.12, bounce = 0.2, k = 160;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), easeOut = t => 1 - (1 - t) ** 3;
  const state = { p: 0, v: 0 };
  let open = false, raf = 0, last = 0;

  const render = () => {
    panel.style.height = `${60 + Math.max(0, state.p) * content.offsetHeight}px`;
    const shown = cards.filter(c => c.offsetParent), lag = shown.length > 1 ? Math.min(stagger, 0.7 / (shown.length - 1)) : 0, span = 1 - lag * (shown.length - 1);
    shown.forEach((card, i) => {
      const e = easeOut(clamp((state.p - i * lag) / Math.max(span, 0.05), 0, 1));
      card.style.transform = `translateY(${(1 - e) * 26}px) scale(${0.97 + 0.03 * e})`;
      card.style.opacity = e;
    });
  };
  const tick = now => {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60, target = open ? 1 : 0;
    last = now;
    if (reduce) Object.assign(state, { p: target, v: 0 });
    else {
      const zeta = open ? 1 - 0.68 * bounce : 1, steps = Math.ceil(dt * 240), h = dt / steps;
      for (let i = 0; i < steps; i++) { state.v += (-k * (state.p - target) - 2 * zeta * Math.sqrt(k) * state.v) * h; state.p += state.v * h; }
    }
    const done = Math.abs(state.p - target) < 0.0005 && Math.abs(state.v) < 0.002;
    if (done) Object.assign(state, { p: target, v: 0 });
    render();
    if (done && !open) root.removeAttribute('data-shown');
    if (!done) raf = requestAnimationFrame(tick);
  };
  const setOpen = next => {
    if (next === open) return;
    open = next;
    root.toggleAttribute('data-open', open);
    if (open) root.setAttribute('data-shown', '');
    menu.setAttribute('aria-expanded', open);
    content.inert = !open;
    content.setAttribute('aria-hidden', !open);
    words[0].setAttribute('aria-hidden', open);
    words[1].setAttribute('aria-hidden', !open);
    if (!raf) { last = 0; raf = requestAnimationFrame(tick); }
  };
  menu.addEventListener('click', () => setOpen(!open));
  content.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('pointerdown', e => { if (open && !root.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => { if (open && e.key === 'Escape') { setOpen(false); menu.focus(); } });
  new ResizeObserver(render).observe(content);
  render();

  if (reduce) return; // intro: panel opens from a pill, bar items rise in
  const w = panel.offsetWidth, h = panel.offsetHeight;
  panel.animate([{ clipPath: `inset(0px ${Math.max(0, (w - h) / 2)}px round ${h / 2}px)`, opacity: 0 }, { clipPath: 'inset(0px 0px round 18px)', opacity: 1 }], { duration: 820, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  [...bar.children].forEach((child, i) => child.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: 220 + i * 70, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
})();
