// effects.jsx — kinetic / pixel effects shared by the portfolio
const { useEffect, useRef, useState, useCallback } = React;

const KATA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン';
const LAT = '#$%&*+=<>/\\0123456789ABCDEFXYZ';

/* ---------- Scramble text: decodes when scrolled into view ---------- */
function Scramble({ text, as = 'span', className = '', duration = 700, delay = 0, trigger }) {
  const ref = useRef(null);
  const [out, setOut] = useState(text);
  const run = useCallback(() => {
    const start = performance.now() + delay;
    let raf;
    const tick = (now) => {
      const p = Math.max(0, Math.min(1, (now - start) / duration));
      const n = Math.floor(p * text.length);
      let s = '';
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (i < n || c === ' ' || c === '\n') s += c;
        else {
          const set = c.charCodeAt(0) > 0x2e80 ? KATA : LAT;
          s += set[(Math.random() * set.length) | 0];
        }
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, delay]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancel;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { cancel = run(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); cancel && cancel(); };
  }, [run, trigger]);

  const Tag = as;
  return <Tag ref={ref} className={className} aria-label={text}
    onMouseEnter={() => run()}>{out}</Tag>;
}

/* ---------- Hover-jump letters ---------- */
function JumpText({ text, className = '' }) {
  return (
    <span className={'jump ' + className} aria-label={text}>
      {text.split('').map((c, i) => (
        <span key={i} aria-hidden="true" style={{ '--i': i }}>{c === ' ' ? '\u00A0' : c}</span>
      ))}
    </span>
  );
}

/* ---------- Reveal-on-scroll (pixel wipe) ---------- */
function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.rv:not(.in), .up:not(.in)');
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, deps);
}

/* ---------- Pixel cursor + trail ---------- */
function PixelCursor({ enabled }) {
  const curRef = useRef(null);
  const cvRef = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.documentElement.classList.add('has-cur');
    const cur = curRef.current, cv = cvRef.current, ctx = cv.getContext('2d');
    let W, H, dpr;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    const cells = new Map();
    const G = 14;
    let mx = -100, my = -100, cx = -100, cy = -100;
    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      const k = Math.floor(mx / G) + ',' + Math.floor(my / G);
      cells.set(k, { x: Math.floor(mx / G) * G, y: Math.floor(my / G) * G, t: performance.now() });
      const t = e.target.closest && e.target.closest('a,button,[data-hover]');
      cur.classList.toggle('hover', !!t);
    };
    const down = () => cur.classList.add('down');
    const up = () => cur.classList.remove('down');
    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    let raf;
    const loop = (now) => {
      cx += (mx - cx) * 0.35; cy += (my - cy) * 0.35;
      cur.style.transform = `translate(${Math.round(cx / 2) * 2}px, ${Math.round(cy / 2) * 2}px)`;
      ctx.clearRect(0, 0, W, H);
      const acc = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim();
      ctx.fillStyle = acc;
      cells.forEach((c, k) => {
        const age = (now - c.t) / 520;
        if (age >= 1) { cells.delete(k); return; }
        const step = Math.floor(age * 4) / 4; // stepped fade
        ctx.globalAlpha = (1 - step) * 0.55;
        const s = G - 2 - Math.floor(step * 8);
        ctx.fillRect(c.x + (G - s) / 2, c.y + (G - s) / 2, s, s);
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove('has-cur');
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [enabled]);
  if (!enabled) return null;
  return (<>
    <canvas ref={cvRef} className="trail" aria-hidden="true" />
    <div ref={curRef} className="cur" aria-hidden="true"><i /></div>
  </>);
}

/* ---------- Kanji particle field ---------- */
const KANJI = [
  { c: '創', r: 'tsukuru', m: 'to create' },
  { c: '智', r: 'chi', m: 'intelligence' },
  { c: '繋', r: 'tsunagu', m: 'to connect' },
  { c: '夢', r: 'yume', m: 'dream' },
];

function KanjiField({ onChange }) {
  const cvRef = useRef(null);
  const idxRef = useRef(0);
  const nextRef = useRef(() => {});
  useEffect(() => {
    const cv = cvRef.current, ctx = cv.getContext('2d');
    const G = 34;
    let targets = [];
    let parts = [];
    let size = 0, cell = 0, dpr = 1;
    const mouse = { x: -99, y: -99 };

    const sample = (ch) => {
      const o = document.createElement('canvas'); o.width = G; o.height = G;
      const c = o.getContext('2d');
      c.fillStyle = '#000'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = `${Math.floor(G * 0.92)}px "DotGothic16", monospace`;
      c.fillText(ch, G / 2, G / 2 + 1);
      const d = c.getImageData(0, 0, G, G).data;
      const pts = [];
      for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) if (d[(y * G + x) * 4 + 3] > 110) pts.push([x, y]);
      return pts;
    };

    const setTarget = (i) => {
      const pts = targets[i].slice().sort(() => Math.random() - 0.5);
      while (parts.length < pts.length) {
        parts.push({ x: Math.random() * G, y: Math.random() * G, vx: 0, vy: 0, tx: 0, ty: 0, on: false, a: Math.random() < 0.12 });
      }
      parts.forEach((p, k) => {
        if (k < pts.length) { p.tx = pts[k][0]; p.ty = pts[k][1]; p.on = true; }
        else { p.tx = Math.random() * G; p.ty = G + 2 + Math.random() * 4; p.on = false; }
        // kick for a burst
        p.vx += (Math.random() - 0.5) * 2.2; p.vy += (Math.random() - 0.5) * 2.2;
      });
      onChange && onChange(KANJI[i]);
    };

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      size = cv.clientWidth; cell = size / G;
      cv.width = size * dpr; cv.height = size * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize); ro.observe(cv); resize();

    const pm = (e) => {
      const r = cv.getBoundingClientRect();
      const pt = e.touches ? e.touches[0] : e;
      mouse.x = (pt.clientX - r.left) / cell; mouse.y = (pt.clientY - r.top) / cell;
    };
    const pl = () => { mouse.x = -99; mouse.y = -99; };
    cv.addEventListener('mousemove', pm); cv.addEventListener('mouseleave', pl);
    cv.addEventListener('touchmove', pm, { passive: true }); cv.addEventListener('touchend', pl);

    let raf, timer, alive = true;
    const next = () => {
      idxRef.current = (idxRef.current + 1) % KANJI.length;
      setTarget(idxRef.current);
      clearInterval(timer); timer = setInterval(next, 4200);
    };
    nextRef.current = next;

    document.fonts.load(`40px "DotGothic16"`, KANJI.map(k => k.c).join('')).then(() => {
      if (!alive) return;
      targets = KANJI.map(k => sample(k.c));
      setTarget(0);
      timer = setInterval(next, 4200);
    });

    const loop = () => {
      const cs = getComputedStyle(document.documentElement);
      const fg = cs.getPropertyValue('--fg').trim();
      const acc = cs.getPropertyValue('--acc').trim();
      ctx.clearRect(0, 0, size, size);
      // faint grid dots
      ctx.fillStyle = fg; ctx.globalAlpha = 0.09;
      for (let y = 0; y < G; y += 2) for (let x = 0; x < G; x += 2) ctx.fillRect(x * cell + cell / 2 - 1, y * cell + cell / 2 - 1, 2, 2);
      ctx.globalAlpha = 1;
      for (const p of parts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 30) { const f = (30 - d2) / 30 * 0.9; const d = Math.sqrt(d2) || 1; p.vx += dx / d * f; p.vy += dy / d * f; }
        p.vx += (p.tx - p.x) * 0.045; p.vy += (p.ty - p.y) * 0.045;
        p.vx *= 0.8; p.vy *= 0.8;
        p.x += p.vx; p.y += p.vy;
        if (!p.on && p.y > G) continue;
        const gx = Math.round(p.x), gy = Math.round(p.y);
        ctx.fillStyle = p.a ? acc : fg;
        ctx.globalAlpha = p.on ? 1 : 0.25;
        ctx.fillRect(gx * cell + 0.5, gy * cell + 0.5, cell - 1.5, cell - 1.5);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); clearInterval(timer); ro.disconnect(); };
  }, []);
  return <canvas ref={cvRef} className="kanji-cv" data-hover onClick={() => nextRef.current()} />;
}

/* ---------- Clock ---------- */
function useClock(tz = 'Asia/Tokyo') {
  const [t, setT] = useState('');
  useEffect(() => {
    const f = () => {
      try {
        setT(new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour12: false }));
      } catch (e) {
        setT(new Date().toLocaleTimeString('en-GB', { hour12: false }));
      }
    };
    f(); const id = setInterval(f, 1000); return () => clearInterval(id);
  }, [tz]);
  return t;
}

/* ---------- Scroll progress (0..1) ---------- */
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    f(); window.addEventListener('scroll', f, { passive: true }); window.addEventListener('resize', f);
    return () => { window.removeEventListener('scroll', f); window.removeEventListener('resize', f); };
  }, []);
  return p;
}

Object.assign(window, { Scramble, JumpText, useReveal, PixelCursor, KanjiField, KANJI, useClock, useScrollProgress });
