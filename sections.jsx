// sections.jsx — portfolio page sections
const { useState: useS } = React;

const PROJECTS = [
  { n: '01', t: 'Kotoba', jp: '言葉', yr: '2026', kind: 'ai', tag: 'LLM · RAG', d: 'Retrieval-augmented assistant over 40k internal docs. Hybrid search, citation grounding, eval harness.', role: 'Lead engineer', img: 'rag pipeline diagram / product ui' },
  { n: '02', t: 'Hoshi', jp: '星', yr: '2025', kind: 'app', tag: 'iOS · SwiftUI', d: 'Offline-first habit tracker with on-device ML nudges. 120k downloads, 4.8★.', role: 'Solo dev', img: 'iphone screens' },
  { n: '03', t: 'Mado', jp: '窓', yr: '2025', kind: 'ai', tag: 'Agents · Tools', d: 'Browser agent that fills multi-step forms from plain-language intent. Planner + verifier loop.', role: 'Co-founder', img: 'agent trace ui' },
  { n: '04', t: 'Kumo Eval', jp: '雲', yr: '2024', kind: 'oss', tag: 'Open source', d: 'Lightweight eval framework for prompt regressions. 2.1k GitHub stars.', role: 'Maintainer', img: 'terminal / dashboard' },
  { n: '05', t: 'Tabi', jp: '旅', yr: '2024', kind: 'app', tag: 'React Native', d: 'Trip planner that turns screenshots and links into a day-by-day itinerary.', role: 'Full-stack', img: 'mobile itinerary' },
  { n: '06', t: 'Oto', jp: '音', yr: '2023', kind: 'ai', tag: 'Speech · Edge', d: 'Real-time meeting transcription running Whisper on-device, sub-300ms latency.', role: 'ML engineer', img: 'waveform / transcript' },
];

const JOBS = [
  { from: '2024', to: 'Now', jp: '現在', role: 'Senior AI Engineer', co: 'Placeholder Labs · Tokyo / Remote', pts: ['Shipped LLM features to 2M+ users; owns eval + guardrail infra.', 'Cut inference cost 58% via distillation and response caching.', 'Mentors 4 engineers on applied ML practice.'] },
  { from: '2021', to: '2024', jp: '三年', role: 'Mobile & ML Engineer', co: 'Studio Company · Osaka', pts: ['Built iOS/Android apps for 12 clients across fintech and health.', 'Introduced on-device models for search and recommendations.'] },
  { from: '2019', to: '2021', jp: '二年', role: 'Software Engineer', co: 'Startup Inc. · Remote', pts: ['Full-stack TypeScript; data pipelines and internal tooling.'] },
];

/* ---------------- HERO ---------------- */
function HeroKanji({ t }) {
  const [k, setK] = useS(KANJI[0]);
  return (
    <div className="h-kanji">
      <div>
        <div className="mono mute up rv-up" style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 18 }}>
          ▸ Portfolio / 作品集 — vol.{new Date().getFullYear() % 100}
        </div>
        <h1 className="h-name">
          <Scramble text={t.first} duration={900} /><br />
          <Scramble text={t.last} duration={1100} delay={150} /><span className="acc-sq" />
        </h1>
        <div className="h-role">
          <span className="tag fill">AI Engineer</span>
          <span className="tag">App Developer</span>
          <span className="tag">東京 · Tokyo</span>
        </div>
        <p className="h-lede">{t.lede}</p>
      </div>
      <div className="kanji-box">
        <div className="cap"><span>fig.01 — 点描</span><span className="mute">click · hover</span></div>
        <KanjiField onChange={setK} />
        <div className="cap2"><span className="k">{k.c}</span><span className="mono" style={{ fontSize: 12 }}>{k.r} — <span className="mute">{k.m}</span></span></div>
      </div>
    </div>
  );
}

function HeroKinetic({ t }) {
  const Row = ({ items, cls = '', sp }) => (
    <div className={'row ' + cls} style={{ '--sp': sp }}>
      <div className="track">{[0, 1].map(k => <React.Fragment key={k}>{items.map((it, i) => <span key={i} className={it[1] || ''}>{it[0]}</span>)}</React.Fragment>)}</div>
    </div>
  );
  return (
    <>
      <div className="h-kin">
        <Row sp="26s" items={[[t.first + ' ' + t.last], ['■', 'a'], ['AI Engineer', 'o'], ['■', 'a']]} cls="big" />
        <Row sp="20s" cls="rev" items={[['人工知能'], ['App Developer', 'o'], ['アプリ', 'a'], ['Systems', 'o']]} />
        <Row sp="32s" items={[['Models → Products'], ['創', 'a'], ['Ship it', 'o'], ['智', 'a']]} />
      </div>
      <div className="kin-sub">
        <p className="h-lede" style={{ marginTop: 0 }}>{t.lede}</p>
        <div className="h-role" style={{ marginTop: 0, alignSelf: 'end' }}>
          <span className="tag fill">Open to collabs</span><span className="tag">東京 · Tokyo</span>
        </div>
      </div>
    </>
  );
}

function HeroTerminal({ t }) {
  const lines = [
    ['$ ', 'whoami'],
    ['', `${t.first.toLowerCase()}_${t.last.toLowerCase()} — ai engineer / app developer`],
    ['$ ', 'cat focus.txt'],
    ['', '> LLM systems, agents, evals\n> native iOS + react native\n> on-device inference'],
    ['$ ', 'status --now'],
    ['ok', '[ok] writing about evals · building in public'],
  ];
  const full = lines.map(l => l[0] + l[1]).join('\n');
  const [n, setN] = useS(0);
  React.useEffect(() => {
    let i = 0; const id = setInterval(() => { i += 2; setN(i); if (i >= full.length) clearInterval(id); }, 28);
    return () => clearInterval(id);
  }, [full]);
  // render with coloring by walking lines
  let rem = n; const out = [];
  lines.forEach((l, i) => {
    const s = l[0] + l[1] + (i < lines.length - 1 ? '\n' : '');
    const vis = s.slice(0, Math.max(0, rem)); rem -= s.length;
    if (!vis) return;
    out.push(<span key={i} className={l[0] === 'ok' ? 'ok' : ''}>{l[0] === 'ok' ? vis.replace(/^ok/, '') : vis}</span>);
  });
  return (
    <div className="h-term">
      <div>
        <h1 className="h-name"><Scramble text={t.first} /><br /><Scramble text={t.last} delay={150} /><span className="acc-sq" /></h1>
        <p className="h-lede">{t.lede}</p>
      </div>
      <div className="term">
        <div className="tb"><i /><i /><i /><span style={{ marginLeft: 'auto', fontSize: 11, opacity: .6 }}>~/portfolio — zsh</span></div>
        <pre>{out}<span className="caret" /></pre>
      </div>
    </div>
  );
}

function Hero({ t }) {
  const clock = useClock();
  const V = { kanji: HeroKanji, kinetic: HeroKinetic, terminal: HeroTerminal }[t.hero] || HeroKanji;
  return (
    <section className="hero" id="top" data-screen-label="Hero">
      <V t={t} />
      <div className="hero-foot">
        <div>Based in<b>Tokyo, JP</b></div>
        <div>Local time<b>{clock} JST</b></div>
        <div>Currently<b>Senior AI Eng.</b></div>
        <div>Status<b className="acc">● Available Q4</b></div>
      </div>
    </section>
  );
}

function Band() {
  const w = ['LLM Systems', 'エージェント', 'iOS · SwiftUI', '評価', 'React Native', 'オンデバイス', 'Evals', 'RAG', 'プロダクト'];
  return (
    <div className="band" aria-hidden="true"><div className="track">{[...w, ...w].map((x, i) => <span key={i}>{x}</span>)}</div></div>
  );
}

function SecHead({ num, title, jp }) {
  return (
    <div className="sec-head">
      <span className="num">{num}</span>
      <h2><Scramble text={title} /></h2>
      <span className="jp">{jp}</span>
    </div>
  );
}

/* ---------------- ABOUT ---------------- */
function About({ t }) {
  return (
    <section id="about" data-screen-label="About">
      <SecHead num="01" title="About" jp="自己紹介 — JIKO SHŌKAI" />
      <div className="about">
        <div className="portrait rv">
          <div className="ph"><span className="jpk">写真</span><span className="lbl">portrait · 3:4</span></div>
        </div>
        <div className="about-txt">
          <p className="big up">I turn <em>models</em> into products people actually open every day.</p>
          <div className="about-cols">
            <p className="up d1">{t.first} is an AI engineer and app developer with 7 years shipping software — from on-device speech models to agentic web tools. Works at the seam between research and product, where evals matter more than demos.</p>
            <p className="up d2">Writes about building with LLMs, practical evaluation, and the craft of small, fast apps. Previously consulted for fintech and health teams across Japan.</p>
            <div className="stack up d1"><h4>AI / ML</h4><div className="chips">{['PyTorch', 'LLM APIs', 'RAG', 'Agents', 'Evals', 'Whisper', 'Core ML', 'vLLM'].map(s => <span key={s}>{s}</span>)}</div></div>
            <div className="stack up d2"><h4>App / Platform</h4><div className="chips">{['Swift', 'SwiftUI', 'React Native', 'TypeScript', 'Next.js', 'Postgres', 'AWS', 'Go'].map(s => <span key={s}>{s}</span>)}</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WORK ---------------- */
function Card({ p }) {
  return (
    <a href="#work" className="card up" onClick={e => e.preventDefault()}>
      <div className="media"><div className="ph"><span className="jpk">{p.jp}</span><span className="lbl">{p.img}</span></div><span className="idx">{p.n}</span></div>
      <div className="body">
        <div className="t"><h3>{p.t}<small>{p.jp}</small></h3><span className="yr">{p.yr}</span></div>
        <p>{p.d}</p>
        <div className="foot"><span className="mute">{p.tag}</span><span className="arrow">→</span></div>
      </div>
    </a>
  );
}

function Work({ t }) {
  const [f, setF] = useS('all');
  const list = PROJECTS.filter(p => f === 'all' || p.kind === f);
  React.useEffect(() => {
    document.querySelectorAll('#work .up:not(.in)').forEach(el => el.classList.add('in'));
  }, [f, t.grid]);
  const filters = [['all', 'All'], ['ai', 'AI'], ['app', 'Apps'], ['oss', 'Open source']];
  return (
    <section id="work" data-screen-label="Work">
      <SecHead num="02" title="Selected Work" jp="作品 — SAKUHIN" />
      <div className="work-filter">
        {filters.map(([k, l]) => <button key={k} className={f === k ? 'on' : ''} onClick={() => setF(k)}>{l} <span className="mute">{k === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.kind === k).length}</span></button>)}
      </div>
      {t.grid === 'list' ? (
        <div className="wlist">
          {list.map(p => (
            <a key={p.n} href="#work" className="wrow" onClick={e => e.preventDefault()}>
              <span className="n">{p.n}</span>
              <h3>{p.t} <span className="mute" style={{ fontSize: '.55em' }}>{p.jp}</span></h3>
              <p>{p.d}</p>
              <span className="k">{p.tag}</span>
              <span className="yr" style={{ fontSize: 12 }}>{p.yr}</span>
              <span>→</span>
              <div className="peek"><div className="ph"><span className="lbl">{p.img}</span></div></div>
            </a>
          ))}
        </div>
      ) : (
        <div className={t.grid === 'bento' ? 'grid-bento' : 'grid-grid'}>
          {list.map(p => <Card key={p.n} p={p} />)}
        </div>
      )}
    </section>
  );
}

/* ---------------- EXPERIENCE ---------------- */
function Experience() {
  return (
    <section id="cv" data-screen-label="Experience">
      <SecHead num="03" title="Experience" jp="経歴 — KEIREKI" />
      <div className="cv">
        {JOBS.map((j, i) => (
          <div key={i} className="cv-row up">
            <div className="when">{j.from} — {j.to}<b>{j.jp}</b></div>
            <div><h3>{j.role}</h3><div className="co">{j.co}</div></div>
            <ul>{j.pts.map((p, k) => <li key={k}>{p}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="cv-extra">
        <div className="up"><h4>Education</h4><ul><li><span>M.S. Computer Science</span><span>2019</span></li><li><span>B.Eng. Information Eng.</span><span>2017</span></li></ul></div>
        <div className="up d1"><h4>Speaking</h4><ul><li><span>Evals in production</span><span>'26</span></li><li><span>On-device Whisper</span><span>'25</span></li><li><span>Agents that verify</span><span>'25</span></li></ul></div>
        <div className="up d2"><h4>Languages</h4><ul><li><span>English</span><span>Native</span></li><li><span>日本語</span><span>Business</span></li></ul></div>
      </div>
      <a href="#cv" className="dl" onClick={e => e.preventDefault()}>↓ Download full CV <span className="mute">PDF</span></a>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
function Contact({ t }) {
  const [copied, setCopied] = useS(false);
  const copy = () => { navigator.clipboard && navigator.clipboard.writeText(t.email).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1400); };
  return (
    <section id="contact" className="contact" data-screen-label="Contact">
      <SecHead num="04" title="Contact" jp="連絡 — RENRAKU" />
      <p className="mono" style={{ marginBottom: 20, maxWidth: '48ch' }}>Open to AI product roles, advisory work and speaking. Replies within two working days.</p>
      <a className="c-big" href={'mailto:' + t.email}><Scramble text={t.email} duration={1000} /></a>
      <button className="c-copy" onClick={copy}>{copied ? '✓ Copied' : '⧉ Copy address'}</button>
      <div className="c-grid">
        {[['GitHub', '@handle'], ['X / Twitter', '@handle'], ['LinkedIn', '/in/handle'], ['Writing', 'blog.domain']].map(([a, b]) => (
          <a key={a} href="#contact" onClick={e => e.preventDefault()}><span><JumpText text={a} /><small>{b}</small></span><span>↗</span></a>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Band, About, Work, Experience, Contact });
