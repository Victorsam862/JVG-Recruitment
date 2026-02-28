// ============================================================
// JVG RECRUITMENT SOLUTIONS — app.jsx
// Email delivery: EmailJS → info@jvgrecruitmentsolutions.com
// Admin access: type "jvgadmin" anywhere on page
// Admin password: jvgadmin862
// Live jobs database: Firebase Firestore
// ============================================================

// ── EMAILJS CREDENTIALS ──────────────────────────────────────
const EMAILJS_PUBLIC_KEY    = 'd26MprEm9Q41eC6-g';
const EMAILJS_SERVICE_ID    = 'service_thy1736';
const EMAILJS_TPL_EMPLOYER  = 'template_xr9ktpo';
const EMAILJS_TPL_CANDIDATE = 'template_b05p02z';

// ── ADMIN CREDENTIALS ────────────────────────────────────────
const ADMIN_PASSWORD = 'jvgadmin862';

// ================================================================
//  🔥 FIREBASE CONFIG — REPLACE THESE VALUES WITH YOUR OWN
//  Steps:
//  1. Go to https://firebase.google.com → sign in → "Add project"
//  2. Name it (e.g. jvg-recruitment) → continue through setup
//  3. Left sidebar → Firestore Database → Create database
//     → "Start in test mode" → pick a region → Enable
//  4. Left sidebar → Project Settings (gear icon)
//     → scroll to "Your apps" → click </> (Web) icon
//     → register app → copy the firebaseConfig below
//  5. Replace EVERY value below with your own values
// ================================================================
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyACl_R12VThr9vvWZPnpAM0lxJ0CK8iS6o",
  authDomain:        "jvgrecruit.firebaseapp.com",
  projectId:         "jvgrecruit",
  storageBucket:     "jvgrecruit.firebasestorage.app",
  messagingSenderId: "334752750690",
  appId:             "1:334752750690:web:8a3924644d09349f7ac53b",
  measurementId:     "G-SL9H98RD4S"
};

// ── FIREBASE SDK (loaded from CDN in index.html) ─────────────
// Lazy getter — initialises Firebase the FIRST time getDb() is
// called. This guarantees the compat SDK scripts are fully loaded
// before we touch the firebase global, regardless of how fast
// Babel compiles app.jsx.

let _db = null;

function getDb() {
  if (_db) return _db;
  try {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not available');
      return null;
    }
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    _db = firebase.firestore();
    return _db;
  } catch (e) {
    console.warn('Firebase init error:', e.message);
    return null;
  }
}

// ── FIRESTORE HELPERS ─────────────────────────────────────────
async function fbGetJobs() {
  const db = getDb();
  if (!db) return [];
  try {
    const snap = await db.collection('jobs').orderBy('createdAt', 'desc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn('fbGetJobs error:', e.message);
    return [];
  }
}

async function fbSaveJob(jobData) {
  const db = getDb();
  if (!db) throw new Error('Firebase not initialised — check your config in app.jsx and that the Firebase SDK scripts are loading in index.html');
  const ref = await db.collection('jobs').add({
    ...jobData,
    adminSecret: ADMIN_PASSWORD,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return ref.id;
}

async function fbUpdateJob(id, jobData) {
  const db = getDb();
  if (!db) throw new Error('Firebase not initialised — check your config in app.jsx and that the Firebase SDK scripts are loading in index.html');
  await db.collection('jobs').doc(id).update({
    ...jobData,
    adminSecret: ADMIN_PASSWORD
  });
}

async function fbDeleteJob(id) {
  const db = getDb();
  if (!db) throw new Error('Firebase not initialised — check your config in app.jsx and that the Firebase SDK scripts are loading in index.html');
  await db.collection('jobs').doc(id).delete();
}

function fbSubscribeJobs(callback) {
  const db = getDb();
  if (!db) { setTimeout(() => callback([]), 100); return () => {}; }
  try {
    return db.collection('jobs')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        const jobs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(jobs);
      }, err => console.warn('fbSubscribeJobs error:', err.message));
  } catch (e) {
    console.warn('fbSubscribeJobs setup error:', e.message);
    return () => {};
  }
}

// Helper — send via EmailJS
async function sendEmail(templateId, params) {
  if (typeof emailjs === 'undefined') throw new Error('EmailJS SDK not loaded');
  const response = await emailjs.send(EMAILJS_SERVICE_ID, templateId, params);
  if (response && response.status !== 200) throw new Error('EmailJS status ' + response.status);
  return response;
}

// ============================================================
// HOOKS
// ============================================================
const { useState, useEffect, useRef } = React;

function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useCountUp(targetStr, duration = 3200, triggered = false) {
  const [display, setDisplay] = useState('0');
  const rafRef = useRef(null); const startedRef = useRef(false);
  useEffect(() => {
    if (!triggered || startedRef.current) return; startedRef.current = true;
    const match = String(targetStr).match(/^(\D*?)(\d+(?:\.\d+)?)(\D*)$/);
    if (!match) { setDisplay(targetStr); return; }
    const prefix = match[1]||'', target = parseFloat(match[2]), suffix = match[3]||'';
    const isDecimal = match[2].includes('.'), decimals = isDecimal ? match[2].split('.')[1].length : 0;
    const startTime = performance.now();
    const ease = t => 1 - Math.pow(1-t,3);
    function tick(now) {
      const p = Math.min((now-startTime)/duration,1), cur = ease(p)*target;
      setDisplay(prefix+(isDecimal?cur.toFixed(decimals):Math.floor(cur))+suffix);
      if (p<1) rafRef.current=requestAnimationFrame(tick);
      else setDisplay(prefix+(isDecimal?target.toFixed(decimals):Math.floor(target))+suffix);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [triggered]);
  return display;
}

// ============================================================
// DATA
// ============================================================
const HERO_STATS = [
  { value:'500+', label:'Placements Made' }, { value:'80+', label:'Client Partners' },
  { value:'15+', label:'Industries Served' }, { value:'96%', label:'Satisfaction Rate' },
];
const ABOUT_STATS = [{ value:'10+', label:'Years Experience' }, { value:'500+', label:'Placements Made' }];
const ABOUT_PAGE_STATS = [
  { value:'10+', label:'Years in Business' }, { value:'500+', label:'Successful Placements' },
  { value:'80+', label:'Corporate Clients' }, { value:'15+', label:'Industries Covered' }, { value:'96%', label:'Client Satisfaction' },
];
const JOBS_PAGE_STATS = [
  { value:'500+', label:'Candidates Placed' },
  { value:'80+', label:'Hiring Partners' }, { value:'15+', label:'Sectors' }, { value:'48', label:'Hrs Avg Placement' },
];
const CONTACT_PAGE_STATS = [
  { value:'24', label:'Hour Response Time' }, { value:'80+', label:'Happy Clients' },
  { value:'500+', label:'Careers Launched' }, { value:'96%', label:'Repeat Business Rate' },
];
const BENEFITS = [
  { icon:'⚡', title:'Speed to Hire', text:'Our pre-vetted talent pool means you get shortlisted candidates within 48 hours — not weeks.' },
  { icon:'🎯', title:'Precision Matching', text:'We go beyond CVs. Our process assesses culture fit, attitude, and long-term potential.' },
  { icon:'🏆', title:'Guaranteed Results', text:'96% of our placements stay beyond 12 months. We offer a free replacement guarantee.' },
  { icon:'🌍', title:'Pan-Nigeria Reach', text:'From Lagos to Abuja, Port Harcourt to Kano — we place talent across all 36 states.' },
  { icon:'🤝', title:'Full HR Support', text:'Onboarding, payroll administration, compliance — we handle the full employee lifecycle.' },
  { icon:'🏨', title:'Hospitality Specialists', text:'Deep expertise placing hotel, restaurant, and events staff at every level.' },
];
const SERVICES = [
  { n:'01', title:'Permanent Recruitment', text:'End-to-end talent acquisition from sourcing to onboarding. We find leaders, managers, and specialists across all functions.' },
  { n:'02', title:'Contract & Temporary Staffing', text:'Flexible workforce solutions for seasonal demands, project peaks, and interim roles. Scale up or down with confidence.' },
  { n:'03', title:'HR Outsourcing', text:'Let us manage payroll, compliance, employee relations, and HR administration so you can focus on growth.' },
  { n:'04', title:'Hospitality Staffing', text:"Specialist placement of front-of-house, back-of-house, event, and management roles across Nigeria's hospitality sector." },
  { n:'05', title:'Executive Search', text:'Confidential, research-led search for C-suite, director, and senior management appointments.' },
  { n:'06', title:'Training & Development', text:'Custom learning programmes to upskill your existing workforce and embed a culture of continuous improvement.' },
];
const HOW_IT_WORKS_EMPLOYER = {
  intro:'From your first call to a successful hire — we handle every step so you can focus on running your business.',
  steps:[
    { step:'1', title:'Discovery Call', text:"We learn your business, culture, team structure and the exact profile you need to succeed." },
    { step:'2', title:'Role Briefing', text:'We agree on timelines, salary benchmarks, and craft a compelling job spec that attracts the best.' },
    { step:'3', title:'Talent Search', text:"Our consultants tap our network and database to identify candidates others can't reach." },
    { step:'4', title:'Shortlist & Present', text:'You receive 3–5 thoroughly vetted candidates with our detailed assessment notes within 48 hours.' },
    { step:'5', title:'Interview & Select', text:'We coordinate interviews, gather feedback, manage offers and handle counteroffers on your behalf.' },
  ],
};
const HOW_IT_WORKS_CANDIDATE = {
  intro:'Your career deserves more than just a CV submission. We advocate for you at every stage of the process.',
  steps:[
    { step:'1', title:'Register with Us', text:"Submit your profile online or call us directly. We'll match you with a specialist consultant in your field." },
    { step:'2', title:'CV & Profile Review', text:"We help you craft a compelling CV and position your strengths to stand out to Nigeria's top employers." },
    { step:'3', title:'Role Matching', text:'We proactively match you with live vacancies and exclusive roles not advertised anywhere else.' },
    { step:'4', title:'Interview Preparation', text:'We brief you fully on every company and role, and coach you through interview techniques that win offers.' },
    { step:'5', title:'Offer & Placement', text:'We negotiate on your behalf and support your onboarding so your new career starts on the right foot.' },
  ],
};
const TESTIMONIALS = [
  { name:'Adaeze Okonkwo', role:'HR Director, Transcorp Hotels', initials:'AO', stars:5, text:'JVG filled 14 positions across our Lagos properties in under three weeks. The quality was exceptional — every hire is still with us today.' },
  { name:'Emeka Nwachukwu', role:'CEO, Meridian Consulting', initials:'EN', stars:5, text:"We've used many recruitment agencies. JVG is the only one that truly understands our culture and consistently delivers above expectation." },
  { name:'Fatima Al-Hassan', role:'Operations Manager, Sterling Bank', initials:'FA', stars:5, text:'From our first call to onboarding our new team lead, JVG was professional, responsive and transparent throughout. Highly recommended.' },
  { name:'Chukwudi Eze', role:'MD, Eagle Heights Properties', initials:'CE', stars:5, text:'JVG handled our entire HR outsourcing and reduced our administrative burden by 60%. The ROI was clear within the first quarter.' },
  { name:'Amina Garba', role:'Director, NISA Hospital', initials:'AG', stars:5, text:'Finding qualified medical support staff in Abuja is notoriously difficult. JVG found us three excellent hires within a fortnight.' },
  { name:'Tunde Adesanya', role:'GM, Broll Nigeria', initials:'TA', stars:5, text:'Their executive search practice is world-class. Discreet, thorough, and they found our new COO in 6 weeks. Remarkable.' },
];
const LEADERSHIP = [
  { name:'Patience .I. Akhanemhe', role:'HEAD OF RECRUITMENT', photo:'hr.jpeg', bio:"A seasoned recruitment professional with deep expertise in talent acquisition across Nigeria's most competitive sectors. She leads our consultant team with precision, passion, and an unmatched eye for potential." },
  { name:'Ruth .O. Ndukwe', role:'FOUNDER & CEO', photo:'Founder.jpeg', bio:'The visionary behind JVG Recruitment Solutions. With over a decade of HR leadership experience across banking, hospitality, and FMCG, she founded JVG with one mission — to raise the standard of recruitment in Nigeria.' },
  { name:'Victor Samson', role:'CLIENT RELATIONS DIRECTOR', photo:'passport.jpeg', bio:'The bridge between our clients and our consultants. He ensures every employer partnership is built on trust, transparency, and results.' },
];
const INDUSTRY_ICONS = {
  'Hospitality':'🏨','Finance':'💰','HR':'👥','Oil & Gas':'⛽',
  'FMCG':'🛒','Healthcare':'🏥','Technology':'💻','Banking':'🏦',
  'Construction':'🏗️','Education':'🎓','Legal':'⚖️','Marketing':'📣',
  'Logistics':'🚚','Real Estate':'🏠','Consulting':'📊','Default':'💼',
};
function getJobIcon(industry) { return INDUSTRY_ICONS[industry] || INDUSTRY_ICONS['Default']; }

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, setPage, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [page]);
  const navLinks = [
    { label:'Home', id:'home' }, { label:'About', id:'about' },
    { label:'Services', id:'services' }, { label:'Jobs', id:'jobs' }, { label:'Contact', id:'contact' },
  ];
  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="navbar__inner">
            <button onClick={() => setPage('home')} className="navbar__logo" style={{background:'none',border:'none',cursor:'pointer'}}>
              <div className="navbar__logo-mark">JVG</div><span>JVG Recruitment</span>
            </button>
            <div className="navbar__nav">
              {navLinks.map(l => (
                <a key={l.id} href="#" onClick={e=>{e.preventDefault();setPage(l.id);}} style={{color:page===l.id?'var(--gold)':undefined}}>{l.label}</a>
              ))}
            </div>
            <div className="navbar__actions">
              <button className="btn-theme" onClick={toggleTheme} title="Toggle theme">{theme==='dark'?'☀️':'🌙'}</button>
              <button className="mobile-menu-btn" onClick={()=>setMenuOpen(p=>!p)} aria-label="Open menu">
                <span/><span/><span/>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu${menuOpen?' open':''}`}>
        <button className="mobile-menu-close" onClick={()=>setMenuOpen(false)}>✕</button>
        {navLinks.map(l => (
          <a key={l.id} href="#" onClick={e=>{e.preventDefault();setPage(l.id);setMenuOpen(false);}}>{l.label}</a>
        ))}
      </div>
    </>
  );
}

// ============================================================
// HERO
// ============================================================
function HeroSection({ setPage }) {
  const stars = Array.from({length:24}, ()=>({ size:Math.random()*4+2, x:Math.random()*100, y:Math.random()*100, dur:Math.random()*4+3, delay:Math.random()*5, op:Math.random()*0.4+0.15 }));
  const [titleRef, titleVisible] = useReveal();
  return (
    <section className="hero">
      <div className="hero__stars">{stars.map((s,i)=><span key={i} className="star" style={{width:s.size,height:s.size,left:`${s.x}%`,top:`${s.y}%`,'--dur':`${s.dur}s`,'--delay':`${s.delay}s`,'--op':s.op}}/>)}</div>
      <div className="hero__orb hero__orb--1"/><div className="hero__orb hero__orb--2"/>
      <div className="container">
        <div className="hero__content" ref={titleRef}>
          <div className={`hero__eyebrow reveal${titleVisible?' visible':''}`}>
            <div className="hero__eyebrow-line"/>
            <span className="luxury-badge">
              <span className="luxury-badge__star" aria-hidden="true">✦</span>
              Nigeria's Trusted Recruitment Partner
              <span className="luxury-badge__star luxury-badge__star--right" aria-hidden="true">✦</span>
            </span>
          </div>
          <h1 className={`display-xl hero__title reveal reveal-delay-1${titleVisible?' visible':''}`}>
            Professional Recruitment &<em> HR Outsourcing</em> Services in Nigeria
          </h1>
          <p className={`hero__subtitle reveal reveal-delay-2${titleVisible?' visible':''}`}>
            Match your business with top talent — quickly, efficiently and reliably. We help employers build winning teams and support job seekers in securing meaningful careers across Nigeria.
          </p>
          <div className={`hero__cta reveal reveal-delay-3${titleVisible?' visible':''}`}>
            <button className="btn btn--primary btn--lg" onClick={()=>setPage('contact')}>Find Talent →</button>
            <button className="btn btn--outline btn--lg" onClick={()=>setPage('jobs')}>Browse Jobs</button>
          </div>
        </div>
        <div className="hero__stats">
          {HERO_STATS.map((s,i) => <HeroStatItem key={i} stat={s} delay={i*0.1}/>)}
        </div>
      </div>
    </section>
  );
}

function HeroStatItem({ stat, delay }) {
  const [ref, vis] = useReveal();
  const display = useCountUp(stat.value, 3200, vis);
  return (
    <div ref={ref} className={`hero__stat-item reveal${vis?' visible':''}`} style={{transitionDelay:`${delay}s`}}>
      <span className="hero__stat-number count-up-value">{display}</span>
      <span className="hero__stat-label">{stat.label}</span>
    </div>
  );
}

// ============================================================
// BENEFITS
// ============================================================
function BenefitCard({ benefit, delay }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`benefit-card reveal${vis?' visible':''}`} style={{transitionDelay:`${delay}s`}}>
      <div className="benefit-card__icon">{benefit.icon}</div>
      <h3 className="benefit-card__title">{benefit.title}</h3>
      <p className="benefit-card__text">{benefit.text}</p>
    </div>
  );
}

function BenefitsSection() {
  const [headerRef, headerVis] = useReveal();
  return (
    <section className="section benefits">
      <div className="container">
        <div ref={headerRef} className="section-header">
          <p className={`eyebrow section-header__eyebrow reveal${headerVis?' visible':''}`}>Why JVG</p>
          <h2 className={`display-md section-header__title reveal reveal-delay-1${headerVis?' visible':''}`}>Built for Results</h2>
          <p className={`section-header__subtitle reveal reveal-delay-2${headerVis?' visible':''}`}>We combine speed, precision, and deep industry knowledge to deliver talent that transforms organisations.</p>
        </div>
        <div className="benefits__grid">
          {BENEFITS.map((b,i) => <BenefitCard key={i} benefit={b} delay={(i%3)*0.12}/>)}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT SECTION (home)
// ============================================================
function AboutStatItem({ stat }) {
  const [ref, vis] = useReveal();
  const display = useCountUp(stat.value, 3200, vis);
  return (
    <div ref={ref} className={`about__visual-stat reveal${vis?' visible':''}`}>
      <div className="about__visual-number count-up-value">{display}</div>
      <div className="about__visual-label">{stat.label}</div>
    </div>
  );
}

function AboutSection() {
  const [colRef,colVis]=useReveal(); const [visRef,visVis]=useReveal();
  return (
    <section className="section" id="about-section">
      <div className="container">
        <div className="about__grid">
          <div ref={visRef}>
            <div className={`about__visual-card reveal${visVis?' visible':''}`}>
              <div className="eyebrow" style={{marginBottom:'1rem'}}>Our Track Record</div>
              <h3 className="display-sm" style={{marginBottom:'0.5rem'}}>Proven Impact</h3>
              <p style={{fontFamily:'var(--font-body)',fontSize:'0.88rem',fontWeight:300,color:'var(--text-muted)',marginBottom:'1rem'}}>Numbers that speak for themselves</p>
              <div className="about__visual-stats">
                {ABOUT_STATS.map((s,i) => <AboutStatItem key={i} stat={s}/>)}
              </div>
              <div style={{marginTop:'2rem',padding:'1.5rem',background:'var(--gold-glow)',borderRadius:'var(--radius-md)',border:'1px solid var(--border)'}}>
                <div className="eyebrow" style={{marginBottom:'0.5rem'}}>Our Commitment</div>
                <p style={{fontFamily:'var(--font-body)',fontSize:'0.88rem',fontWeight:300,color:'var(--text-secondary)',lineHeight:1.7}}>Every placement comes with our 90-day guarantee. If a hire doesn't work out, we find a replacement at no additional cost.</p>
              </div>
            </div>
          </div>
          <div ref={colRef}>
            <p className={`eyebrow reveal${colVis?' visible':''}`} style={{marginBottom:'1rem'}}>About JVG</p>
            <blockquote className={`about__quote reveal reveal-delay-1${colVis?' visible':''}`}>"Nigeria deserves world-class recruitment. That's what we deliver every day."</blockquote>
            <p className={`about__body reveal reveal-delay-2${colVis?' visible':''}`}>Founded by HR professionals with over a decade of combined experience, JVG was built on a simple belief: the right person in the right role changes everything.</p>
            <p className={`about__body reveal reveal-delay-3${colVis?' visible':''}`}>We serve employers across banking, hospitality, oil and gas, healthcare, FMCG, and the public sector — partnering as a true strategic extension of your HR function.</p>
            <div className={`about__values reveal reveal-delay-4${colVis?' visible':''}`}>
              {['Integrity','Speed','Precision','Partnership','Excellence'].map(v=><span key={v} className="about__value-tag">✦ {v}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// LEADERSHIP
// ============================================================
function LeaderCard({ person, delay }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`leader-card reveal${vis?' visible':''}`} style={{transitionDelay:`${delay}s`}}>
      <div className="leader-card__photo-circle-wrap">
        <img src={person.photo} alt={person.name} className="leader-card__photo-circle"/>
      </div>
      <div className="leader-card__body">
        <h3 className="leader-card__name">{person.name}</h3>
        <p className="leader-card__role">{person.role}</p>
        <p className="leader-card__bio">{person.bio}</p>
      </div>
    </div>
  );
}

function LeadershipSection() {
  const [headerRef, headerVis] = useReveal();
  return (
    <section className="section leadership">
      <div className="container">
        <div ref={headerRef} className="section-header">
          <p className={`eyebrow section-header__eyebrow reveal${headerVis?' visible':''}`}>The People Behind JVG</p>
          <h2 className={`display-md section-header__title reveal reveal-delay-1${headerVis?' visible':''}`}>Meet Our Leadership Team</h2>
          <p className={`section-header__subtitle reveal reveal-delay-2${headerVis?' visible':''}`}>Experienced, passionate, and deeply connected — our leaders bring decades of combined expertise to every client engagement.</p>
        </div>
        <div className="leadership__grid">
          {LEADERSHIP.map((person,i) => <LeaderCard key={i} person={person} delay={i*0.15}/>)}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SERVICES
// ============================================================
function ServiceCard({ service, delay }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`service-card reveal${vis?' visible':''}`} style={{transitionDelay:`${delay}s`}}>
      <div className="service-card__number">{service.n}</div>
      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__text">{service.text}</p>
    </div>
  );
}

function ServicesSection({ setPage }) {
  const [headerRef, headerVis] = useReveal();
  return (
    <section className="section services">
      <div className="container">
        <div ref={headerRef} className="section-header">
          <p className={`eyebrow section-header__eyebrow reveal${headerVis?' visible':''}`}>What We Do</p>
          <h2 className={`display-md section-header__title reveal reveal-delay-1${headerVis?' visible':''}`}>Our Services</h2>
          <p className={`section-header__subtitle reveal reveal-delay-2${headerVis?' visible':''}`}>From one placement to a full outsourced HR function — we scale to your needs.</p>
        </div>
        <div className="services__grid">
          {SERVICES.map((s,i) => <ServiceCard key={i} service={s} delay={(i%3)*0.1}/>)}
        </div>
        <div style={{textAlign:'center',marginTop:'3rem'}}><button className="btn btn--outline" onClick={()=>setPage('contact')}>Discuss Your Needs →</button></div>
      </div>
    </section>
  );
}

// ============================================================
// HOW IT WORKS
// ============================================================
function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState('employer');
  const [headerRef, headerVis] = useReveal();
  const panels = { employer: HOW_IT_WORKS_EMPLOYER, candidate: HOW_IT_WORKS_CANDIDATE };
  return (
    <section className="section how-it-works">
      <div className="container">
        <div ref={headerRef} className="section-header">
          <p className={`eyebrow section-header__eyebrow reveal${headerVis?' visible':''}`}>Our Process</p>
          <h2 className={`display-md section-header__title reveal reveal-delay-1${headerVis?' visible':''}`}>How It Works</h2>
          <p className={`section-header__subtitle reveal reveal-delay-2${headerVis?' visible':''}`}>A transparent process tailored to your role — whether you're hiring or seeking your next opportunity.</p>
        </div>
        <div className="hiw-tab-switcher">
          <button className={`hiw-tab-btn${activeTab==='employer'?' active':''}`} onClick={()=>setActiveTab('employer')}><span className="hiw-tab-icon">🏢</span> I'm an Employer</button>
          <button className={`hiw-tab-btn${activeTab==='candidate'?' active':''}`} onClick={()=>setActiveTab('candidate')}><span className="hiw-tab-icon">👤</span> I'm a Job Seeker</button>
        </div>
        <div className="hiw-panels">
          {['employer','candidate'].map(tab=>(
            <div key={tab} className={`hiw-panel${activeTab===tab?' active':''}`}>
              <div className="hiw-panel-intro"><p className="eyebrow">{tab==='employer'?'For Employers':'For Job Seekers'}</p><p>{panels[tab].intro}</p></div>
              <div className="how-it-works__grid">
                {panels[tab].steps.map((step,i)=>(
                  <div key={i} className="step-card"><div className="step-card__num">{step.step}</div><h3 className="step-card__title">{step.title}</h3><p className="step-card__text">{step.text}</p></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS
// ============================================================
function TestimonialCard({ testimonial, delay }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`testimonial-card reveal${vis?' visible':''}`} style={{transitionDelay:`${delay}s`}}>
      <div className="testimonial-card__stars">{'★'.repeat(testimonial.stars)}</div>
      <p className="testimonial-card__text">"{testimonial.text}"</p>
      <div className="testimonial-card__author">
        <div className="testimonial-card__avatar">{testimonial.initials}</div>
        <div><div className="testimonial-card__name">{testimonial.name}</div><div className="testimonial-card__role">{testimonial.role}</div></div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const [headerRef, headerVis] = useReveal();
  return (
    <section className="section testimonials">
      <div className="container">
        <div ref={headerRef} className="section-header">
          <p className={`eyebrow section-header__eyebrow reveal${headerVis?' visible':''}`}>Client Stories</p>
          <h2 className={`display-md section-header__title reveal reveal-delay-1${headerVis?' visible':''}`}>What Our Clients Say</h2>
        </div>
        <div className="testimonials__grid">
          {TESTIMONIALS.map((t,i) => <TestimonialCard key={i} testimonial={t} delay={(i%3)*0.12}/>)}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PAGE HERO
// ============================================================
function PageHeroStatItem({ stat, delay }) {
  const [ref, vis] = useReveal();
  const display = useCountUp(stat.value, 3200, vis);
  return (
    <div ref={ref} className={`page-hero__stat reveal${vis?' visible':''}`} style={{transitionDelay:`${delay}s`}}>
      <div className="page-hero__stat-number count-up-value">{display}</div>
      <div className="page-hero__stat-label">{stat.label}</div>
    </div>
  );
}

function PageHero({ eyebrow, title, subtitle, stats }) {
  const [heroRef, heroVis] = useReveal();
  return (
    <section className="page-hero">
      <div className="container" ref={heroRef}>
        <p className={`eyebrow reveal${heroVis?' visible':''}`} style={{marginBottom:'1rem'}}>{eyebrow}</p>
        <h1 className={`display-lg reveal reveal-delay-1${heroVis?' visible':''}`}>{title}</h1>
        {subtitle && <p className={`reveal reveal-delay-2${heroVis?' visible':''}`} style={{fontFamily:'var(--font-body)',fontSize:'1.05rem',fontWeight:300,color:'var(--text-secondary)',maxWidth:'540px',margin:'1rem auto 0',lineHeight:1.75}}>{subtitle}</p>}
        {stats && (
          <div className="page-hero__stats" style={{marginTop:'3rem'}}>
            {stats.map((s,i) => <PageHeroStatItem key={i} stat={s} delay={i*0.1}/>)}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// CONTACT FORM
// ============================================================
function ContactForm({ jobTitle }) {
  const [tab, setTab] = useState('employer');
  const [status, setStatus] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [empForm, setEmpForm] = useState({ name:'', company:'', email:'', phone:'', role:jobTitle||'', message:'' });
  const [hrForm,  setHrForm]  = useState({ name:'', email:'', phone:'', position:jobTitle||'', experience:'', cover:'' });
  const fileRef = useRef();
  const [fileName, setFileName] = useState('');

  const saveEnquiry = (type, data) => {
    const all = JSON.parse(localStorage.getItem('jvg_enquiries') || '[]');
    all.unshift({ id:Date.now(), type, ...data, date:new Date().toISOString(), read:false });
    localStorage.setItem('jvg_enquiries', JSON.stringify(all));
  };

  const setFeedback = (s, m) => { setStatus(s); setStatusMsg(m); };

  const submitEmployer = async () => {
    const { name, email, message } = empForm;
    if (!name.trim() || !email.trim() || !message.trim()) { setFeedback('error','Please fill in Name, Email and Message — they are required.'); return; }
    if (!email.includes('@') || !email.includes('.')) { setFeedback('error','Please enter a valid email address.'); return; }
    setBusy(true); setFeedback('loading','Sending your enquiry…');
    saveEnquiry('employer', { name:empForm.name, email:empForm.email, company:empForm.company, role:empForm.role, phone:empForm.phone, message:empForm.message });
    try {
      await sendEmail(EMAILJS_TPL_EMPLOYER, { from_name:empForm.name, company:empForm.company||'Not provided', from_email:empForm.email, phone:empForm.phone||'Not provided', role_needed:empForm.role||'Not specified', message:empForm.message, to_name:'JVG Recruitment Team', reply_to:empForm.email });
      setFeedback('success',"Enquiry sent! We'll be in touch within 24 hours.");
    } catch(e) { console.warn('EmailJS error:',e.message); setFeedback('success',"Enquiry received! We'll be in touch within 24 hours."); }
    setBusy(false); setEmpForm({ name:'', company:'', email:'', phone:'', role:'', message:'' });
  };

  const submitHR = async () => {
    const { name, email, position } = hrForm;
    if (!name.trim() || !email.trim() || !position.trim()) { setFeedback('error','Please fill in Name, Email and Position — they are required.'); return; }
    if (!email.includes('@') || !email.includes('.')) { setFeedback('error','Please enter a valid email address.'); return; }
    setBusy(true); setFeedback('loading','Submitting your application…');
    saveEnquiry('candidate', { name:hrForm.name, email:hrForm.email, position:hrForm.position, phone:hrForm.phone, experience:hrForm.experience, cover:hrForm.cover });
    try {
      await sendEmail(EMAILJS_TPL_CANDIDATE, { from_name:hrForm.name, from_email:hrForm.email, phone:hrForm.phone||'Not provided', position:hrForm.position, experience:hrForm.experience||'Not specified', cover_letter:hrForm.cover||'Not provided', message:hrForm.cover||'Application submitted via website.', to_name:'JVG HR Team', reply_to:hrForm.email });
      setFeedback('success',"Application received! We'll review and be in touch shortly.");
    } catch(e) { console.warn('EmailJS error:',e.message); setFeedback('success',"Application received! We'll review and be in touch shortly."); }
    setBusy(false); setHrForm({ name:'', email:'', phone:'', position:'', experience:'', cover:'' }); setFileName('');
  };

  return (
    <div className="form-card">
      <div className="form-tabs">
        <button className={`form-tab${tab==='employer'?' active':''}`} onClick={()=>{setTab('employer');setFeedback('','');}}>🏢 I'm Hiring</button>
        <button className={`form-tab${tab==='candidate'?' active':''}`} onClick={()=>{setTab('candidate');setFeedback('','');}}>👤 I'm Job Seeking</button>
      </div>
      {tab === 'employer' ? (
        <>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="John Adeyemi" value={empForm.name} disabled={busy} onChange={e=>setEmpForm(p=>({...p,name:e.target.value}))}/></div>
            <div className="form-group"><label className="form-label">Company</label><input className="form-input" placeholder="Acme Corp Nigeria" value={empForm.company} disabled={busy} onChange={e=>setEmpForm(p=>({...p,company:e.target.value}))}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Email Address *</label><input className="form-input" type="email" placeholder="john@company.com" value={empForm.email} disabled={busy} onChange={e=>setEmpForm(p=>({...p,email:e.target.value}))}/></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+234 800 000 0000" value={empForm.phone} disabled={busy} onChange={e=>setEmpForm(p=>({...p,phone:e.target.value}))}/></div>
          </div>
          <div className="form-group"><label className="form-label">Role(s) You're Hiring For</label><input className="form-input" placeholder="e.g. Finance Manager, Sales Lead" value={empForm.role} disabled={busy} onChange={e=>setEmpForm(p=>({...p,role:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">Tell Us More *</label><textarea className="form-textarea" placeholder="Describe the role, timeline, key requirements…" value={empForm.message} disabled={busy} onChange={e=>setEmpForm(p=>({...p,message:e.target.value}))}/></div>
          <button className="btn btn--primary w-full" onClick={submitEmployer} disabled={busy}>{busy?'⏳ Sending…':'Send Enquiry →'}</button>
        </>
      ) : (
        <>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Jane Okafor" value={hrForm.name} disabled={busy} onChange={e=>setHrForm(p=>({...p,name:e.target.value}))}/></div>
            <div className="form-group"><label className="form-label">Email Address *</label><input className="form-input" type="email" placeholder="jane@email.com" value={hrForm.email} disabled={busy} onChange={e=>setHrForm(p=>({...p,email:e.target.value}))}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+234 800 000 0000" value={hrForm.phone} disabled={busy} onChange={e=>setHrForm(p=>({...p,phone:e.target.value}))}/></div>
            <div className="form-group"><label className="form-label">Position Sought *</label><input className="form-input" placeholder="e.g. Marketing Manager" value={hrForm.position} disabled={busy} onChange={e=>setHrForm(p=>({...p,position:e.target.value}))}/></div>
          </div>
          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <select className="form-select" value={hrForm.experience} disabled={busy} onChange={e=>setHrForm(p=>({...p,experience:e.target.value}))}>
              <option value="">Select…</option>
              <option>0–2 years (Entry level)</option><option>3–5 years (Mid-level)</option>
              <option>6–10 years (Senior)</option><option>10+ years (Executive)</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Cover Letter / Notes</label><textarea className="form-textarea" placeholder="Tell us about yourself and what you're looking for…" value={hrForm.cover} disabled={busy} onChange={e=>setHrForm(p=>({...p,cover:e.target.value}))}/></div>
          <div className="form-group">
            <div className="form-upload" onClick={()=>fileRef.current&&fileRef.current.click()}>
              <div className="form-upload__icon">📎</div>
              <div className="form-upload__text">{fileName||'Upload your CV (PDF, DOCX — max 5MB)'}</div>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{display:'none'}} onChange={e=>{if(e.target.files[0]) setFileName(e.target.files[0].name);}}/>
            </div>
          </div>
          <button className="btn btn--primary w-full" onClick={submitHR} disabled={busy}>{busy?'⏳ Submitting…':'Submit Application →'}</button>
        </>
      )}
      {statusMsg && (
        <div className={`form-status form-status--${status}`}>
          {status==='loading'?'⏳ ':status==='success'?'✅ ':'❌ '}{statusMsg}
        </div>
      )}
    </div>
  );
}

// ============================================================
// JOB CARD
// ============================================================
function JobCard({ job, onApply, onLearnMore, delay }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`job-card reveal${vis?' visible':''}`} style={{transitionDelay:`${delay}s`}}>
      <div className="job-card__accent-line"/>
      <div className="job-card__header">
        <div className="job-card__industry-row">
          <div className="job-card__icon-wrap">{getJobIcon(job.industry)}</div>
          <div className="job-card__industry-label">{job.industry}</div>
        </div>
        <div className="job-card__type-pill">{job.type}</div>
      </div>
      <div className="job-card__body">
        <h3 className="job-card__title">{job.title}</h3>
        <div className="job-card__meta">
          <span className="job-card__meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {job.location}
          </span>
        </div>
        <p className="job-card__excerpt">{job.excerpt}</p>
      </div>
      <div className="job-card__footer">
        {job.salary && (
          <div className="job-card__salary-block">
            <span className="job-card__salary-label">Monthly Salary</span>
            <span className="job-card__salary-value">{job.salary}</span>
          </div>
        )}
        <div className="job-card__actions">
          <button className="job-card__btn-secondary" onClick={()=>onLearnMore(job)}>Details</button>
          <button className="job-card__btn-primary" onClick={()=>onApply(job)}>Apply Now</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGES
// ============================================================
function HomePage({ setPage }) {
  return <><HeroSection setPage={setPage}/><BenefitsSection/><AboutSection/><ServicesSection setPage={setPage}/><HowItWorksSection/><TestimonialsSection/></>;
}

function AboutPage({ setPage }) {
  const [bodyRef, bodyVis] = useReveal();
  return (
    <>
      <PageHero eyebrow="Our Story" title="Nigeria's Most Trusted Talent Partner" subtitle="A decade of connecting the right people with the right organisations." stats={ABOUT_PAGE_STATS}/>
      <section className="section">
        <div className="container">
          <div className="about__grid">
            <div ref={bodyRef}>
              <p className={`eyebrow reveal${bodyVis?' visible':''}`} style={{marginBottom:'1rem'}}>Our Mission</p>
              <h2 className={`display-md reveal reveal-delay-1${bodyVis?' visible':''}`} style={{marginBottom:'1.5rem'}}>Talent Is Our Business</h2>
              <p className={`about__body reveal reveal-delay-2${bodyVis?' visible':''}`}>JVG Recruitment Solutions was founded with a clear vision: to raise the standard of recruitment in Nigeria.</p>
              <p className={`about__body reveal reveal-delay-3${bodyVis?' visible':''}`}>We built JVG to fix that. Our team of specialist consultants brings domain expertise across hospitality, finance, healthcare, oil and gas, FMCG, and the public sector.</p>
              <p className={`about__body reveal reveal-delay-4${bodyVis?' visible':''}`}>The result? Placements that stick, careers that flourish, and businesses that grow.</p>
              <div style={{marginTop:'2.5rem'}}><button className="btn btn--primary" onClick={()=>setPage('contact')}>Work With Us →</button></div>
            </div>
            <div>
              <div className="about__visual-card">
                <div className="eyebrow" style={{marginBottom:'1rem'}}>What Drives Us</div>
                <h3 className="display-sm" style={{marginBottom:'1rem'}}>Our Core Values</h3>
                <div style={{display:'flex',flexDirection:'column',gap:'1rem',marginTop:'1.5rem'}}>
                  {[{icon:'🤝',title:'Integrity',text:'We operate with full transparency — no hidden fees, no false promises, no shortcuts.'},{icon:'⚡',title:'Speed',text:'We move fast without cutting corners. Your urgency is our priority.'},{icon:'🎯',title:'Precision',text:'Every candidate we present is thoroughly assessed — technically and culturally.'},{icon:'🌍',title:'Partnership',text:'We become an extension of your team, not just a vendor you call once.'},{icon:'🏆',title:'Excellence',text:'We hold ourselves to the highest standard in everything we deliver.'}].map((v,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'0.85rem',padding:'1rem',background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',border:'1px solid var(--border)'}}>
                      <span style={{fontSize:'1.4rem',flexShrink:0}}>{v.icon}</span>
                      <div><div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:'0.95rem',marginBottom:'0.25rem'}}>{v.title}</div><div style={{fontFamily:'var(--font-body)',fontSize:'0.82rem',fontWeight:300,color:'var(--text-secondary)',lineHeight:1.65}}>{v.text}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LeadershipSection/>
      <TestimonialsSection/>
    </>
  );
}

// ── JOBS PAGE — reads live from Firebase ─────────────────────
function JobsPage({ setPage }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [modalJob, setModalJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Real-time listener — updates instantly when admin posts/edits/deletes
    const unsubscribe = fbSubscribeJobs(liveJobs => {
      setJobs(liveJobs);
      setLoading(false);
    });
    // Fallback: if Firebase not configured, stop loading after 3s
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => { unsubscribe(); clearTimeout(timeout); };
  }, []);

  const industries = ['All', ...Array.from(new Set(jobs.map(j => j.industry).filter(Boolean)))];
  const filtered = jobs.filter(job => {
    const t = search.trim().toLowerCase();
    const ms = !t || (job.title.toLowerCase().includes(t) || job.location.toLowerCase().includes(t) || job.industry.toLowerCase().includes(t));
    return ms && (filter === 'All' || job.industry === filter);
  });

  return (
    <>
      <PageHero eyebrow="Opportunities" title="Find Your Next Role" subtitle="Browse current openings across Nigeria's leading employers." stats={JOBS_PAGE_STATS}/>
      <section className="section"><div className="container">

        {loading ? (
          <div className="empty-state">
            <div className="empty-state__icon" style={{animation:'spin 1s linear infinite',display:'inline-block'}}>⏳</div>
            <p style={{fontFamily:'var(--font-body)',color:'var(--text-muted)',marginTop:'1rem'}}>Loading opportunities…</p>
          </div>
        ) : (
          <>
            <div className="jobs__search-bar">
              <input className="form-input" placeholder="Search by title, location or industry…" value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:'380px'}}/>
              {search && <button className="btn btn--ghost btn--sm" onClick={()=>setSearch('')}>✕ Clear</button>}
              {search && <span style={{fontFamily:'var(--font-body)',fontSize:'0.82rem',color:'var(--text-muted)',alignSelf:'center'}}>{filtered.length} result{filtered.length!==1?'s':''} found</span>}
            </div>
            <div className="jobs__filters">
              {industries.map(ind=><button key={ind} className={`filter-btn${filter===ind?' active':''}`} onClick={()=>setFilter(ind)}>{ind}</button>)}
            </div>
            {jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">💼</div>
                <h3 className="empty-state__title">No job listings yet</h3>
                <p className="empty-state__text">Check back soon — new opportunities are posted regularly.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <h3 className="empty-state__title">No roles found</h3>
                <p className="empty-state__text">{search?`No jobs match "${search}" — try a different keyword`:'Try adjusting your filter'}</p>
              </div>
            ) : (
              <div className="jobs__grid">
                {filtered.map((job,i)=><JobCard key={job.id} job={job} delay={(i%3)*0.1} onApply={setApplyJob} onLearnMore={setModalJob}/>)}
              </div>
            )}
          </>
        )}

        <div style={{textAlign:'center',marginTop:'3rem'}}>
          <p style={{fontFamily:'var(--font-body)',color:'var(--text-muted)',marginBottom:'1rem',fontSize:'0.88rem',fontWeight:300}}>Don't see what you're looking for? Send us a speculative application.</p>
          <button className="btn btn--outline" onClick={()=>setPage('contact')}>Register Your Interest →</button>
        </div>
      </div></section>

      {modalJob && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModalJob(null)}>
          <div className="modal modal--job-detail">
            <div className="modal__header">
              <div><span className="job-card__type-pill" style={{marginBottom:'0.75rem',display:'inline-flex'}}>{modalJob.type}</span><h2 className="modal__title" style={{marginTop:'0.75rem'}}>{modalJob.title}</h2></div>
              <button className="modal__close" onClick={()=>setModalJob(null)}>✕</button>
            </div>
            <div className="job-card__meta" style={{marginBottom:'0.75rem'}}><span>📍 {modalJob.location}</span><span style={{marginLeft:'1rem'}}>🏢 {modalJob.industry}</span></div>
            {modalJob.salary && <div style={{marginBottom:'1.5rem'}}><span className="job-card__salary-value" style={{fontSize:'1rem'}}>💰 {modalJob.salary}</span></div>}
            {modalJob.description ? <div className="job-description" dangerouslySetInnerHTML={{__html:modalJob.description}}/> : <p style={{fontFamily:'var(--font-body)',fontSize:'0.92rem',fontWeight:300,color:'var(--text-secondary)',lineHeight:1.75,marginBottom:'2rem'}}>{modalJob.excerpt}</p>}
            <div style={{display:'flex',gap:'0.75rem',marginTop:'2rem',flexWrap:'wrap'}}><button className="btn btn--primary" style={{flex:1}} onClick={()=>{setModalJob(null);setApplyJob(modalJob);}}>Apply for This Role →</button></div>
          </div>
        </div>
      )}
      {applyJob && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setApplyJob(null)}>
          <div className="modal"><div className="modal__header"><div><p className="eyebrow" style={{marginBottom:'0.5rem'}}>Apply Now</p><h2 className="modal__title">{applyJob.title}</h2></div><button className="modal__close" onClick={()=>setApplyJob(null)}>✕</button></div><ContactForm jobTitle={applyJob.title}/></div>
        </div>
      )}
    </>
  );
}

function ContactPage() {
  const [colRef, colVis] = useReveal();
  return (
    <>
      <PageHero eyebrow="Get In Touch" title="Let's Build Something Great" subtitle="Whether you're hiring or job seeking, we're ready to help." stats={CONTACT_PAGE_STATS}/>
      <section className="section"><div className="container"><div className="contact__grid">
        <div ref={colRef}>
          <h2 className={`contact__info-title reveal${colVis?' visible':''}`}>Talk to a Consultant</h2>
          <p className={`contact__info-text reveal reveal-delay-1${colVis?' visible':''}`}>Our team is available Monday to Friday, 8am–6pm WAT. We aim to respond to all enquiries within 24 hours.</p>
          <div className={`contact__info-items reveal reveal-delay-2${colVis?' visible':''}`}>
            {[
              {icon:'📧',label:'Email',value:'info@jvgrecruitmentsolutions.com'},
              {icon:'📞',label:'Phone',value:'+234 704 745 3599'},
              {icon:'📍',label:'Office',value:'11, Aliyu Mohammed Road TAK Continental Estate Life Camp FCT Abuja'},
              {icon:'🕐',label:'Hours',value:'Mon–Fri, 8:00am – 6:00pm WAT'}
            ].map((item,i)=>(
              <div key={i} className="contact__info-item"><div className="contact__info-icon">{item.icon}</div><div><div className="contact__info-label">{item.label}</div><div className="contact__info-value">{item.value}</div></div></div>
            ))}
          </div>
        </div>
        <div><ContactForm/></div>
      </div></div></section>
    </>
  );
}

// ============================================================
// ADMIN LOGIN
// ============================================================
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { onLogin(); }
    else { setError('Incorrect password. Please try again.'); setPassword(''); }
  };
  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">JVG</div>
        <h2 className="admin-login__title">Admin Access</h2>
        <p className="admin-login__sub">Enter your admin password to continue</p>
        {error && <div className="admin-login__error">⚠️ {error}</div>}
        <div className="form-group" style={{marginBottom:'1.25rem',textAlign:'left',position:'relative'}}>
          <label className="form-label">Password</label>
          <input className="form-input" type={show?'text':'password'} placeholder="Enter admin password" value={password} onChange={e=>{setPassword(e.target.value);setError('');}} onKeyDown={e=>e.key==='Enter'&&handleLogin()} style={{paddingRight:'3rem'}}/>
          <button onClick={()=>setShow(p=>!p)} style={{position:'absolute',right:'0.75rem',top:'2.1rem',background:'none',border:'none',cursor:'pointer',fontSize:'1.1rem',color:'var(--text-muted)'}}>{show?'🙈':'👁️'}</button>
        </div>
        <button className="btn btn--primary w-full" onClick={handleLogin}>Sign In →</button>
        <p style={{marginTop:'1.5rem',fontFamily:'var(--font-body)',fontSize:'0.78rem',color:'var(--text-muted)',fontWeight:300}}><strong>🔒 Authorised personnel only.</strong> For access issues, contact your system administrator</p>
      </div>
    </div>
  );
}

// ============================================================
// ENQUIRY DETAIL MODAL
// ============================================================
function EnquiryDetailModal({ enquiry, onClose, onMarkRead, onDelete }) {
  if (!enquiry) return null;
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal__header">
          <div>
            <span className={`badge badge--${enquiry.type==='employer'?'employer':'candidate'}`} style={{marginBottom:'0.5rem',display:'inline-flex'}}>{enquiry.type==='employer'?'Employer Enquiry':'Candidate Application'}</span>
            <h2 className="modal__title" style={{marginTop:'0.4rem'}}>{enquiry.name}</h2>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="enquiry-detail">
          <div className="enquiry-detail__field"><div className="enquiry-detail__label">Email</div><div className="enquiry-detail__value"><a href={`mailto:${enquiry.email}`} style={{color:'var(--gold)'}}>{enquiry.email}</a></div></div>
          {enquiry.phone    && <div className="enquiry-detail__field"><div className="enquiry-detail__label">Phone</div><div className="enquiry-detail__value">{enquiry.phone}</div></div>}
          {enquiry.company  && <div className="enquiry-detail__field"><div className="enquiry-detail__label">Company</div><div className="enquiry-detail__value">{enquiry.company}</div></div>}
          {enquiry.role     && <div className="enquiry-detail__field"><div className="enquiry-detail__label">Role Needed</div><div className="enquiry-detail__value">{enquiry.role}</div></div>}
          {enquiry.position && <div className="enquiry-detail__field"><div className="enquiry-detail__label">Position Sought</div><div className="enquiry-detail__value">{enquiry.position}</div></div>}
          {enquiry.experience&&<div className="enquiry-detail__field"><div className="enquiry-detail__label">Experience</div><div className="enquiry-detail__value">{enquiry.experience}</div></div>}
          {enquiry.message  && <div className="enquiry-detail__field"><div className="enquiry-detail__label">Message</div><div className="enquiry-detail__value" style={{whiteSpace:'pre-wrap'}}>{enquiry.message}</div></div>}
          {enquiry.cover    && <div className="enquiry-detail__field"><div className="enquiry-detail__label">Cover Letter</div><div className="enquiry-detail__value" style={{whiteSpace:'pre-wrap'}}>{enquiry.cover}</div></div>}
          <div className="enquiry-detail__field"><div className="enquiry-detail__label">Received</div><div className="enquiry-detail__value">{new Date(enquiry.date).toLocaleString('en-GB',{dateStyle:'full',timeStyle:'short'})}</div></div>
        </div>
        <div style={{display:'flex',gap:'0.75rem',marginTop:'1.5rem',flexWrap:'wrap'}}>
          <a href={`mailto:${enquiry.email}?subject=Re: Your enquiry — JVG Recruitment`} className="btn btn--primary btn--sm">Reply by Email</a>
          {!enquiry.read && <button className="btn btn--ghost btn--sm" onClick={()=>{onMarkRead(enquiry.id);onClose();}}>✓ Mark as Read</button>}
          <button className="btn btn--danger btn--sm" onClick={()=>{onDelete(enquiry.id);onClose();}}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN STAT CARD
// ============================================================
function AdminStatCard({ icon, label, value, colour, delay }) {
  const [ref, vis] = useReveal();
  const display = useCountUp(String(value), 1800, vis);
  return (
    <div ref={ref} className={`admin-stat-card reveal${vis?' visible':''}`} style={{transitionDelay:`${delay}s`}}>
      <div className={`admin-stat-icon admin-stat-icon--${colour}`}>{icon}</div>
      <div className="admin-stat-info">
        <div className="admin-stat-number count-up-value">{display}</div>
        <div className="admin-stat-label">{label}</div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PANEL — Jobs saved to Firebase, visible to all
// ============================================================
function AdminPanel({ onClose, toggleTheme, theme }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [enquiries, setEnquiries] = useState(()=>JSON.parse(localStorage.getItem('jvg_enquiries')||'[]'));
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [enquiryTab, setEnquiryTab] = useState('all');
  const [viewEnquiry, setViewEnquiry] = useState(null);
  const [jobSearch, setJobSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const emptyJob = { title:'', type:'Permanent', location:'', industry:'', salaryAmount:'', excerpt:'', description:'' };
  const [jobForm, setJobForm] = useState(emptyJob);

  // Subscribe to Firebase live feed
  useEffect(() => {
    const unsub = fbSubscribeJobs(liveJobs => { setJobs(liveJobs); setJobsLoading(false); });
    const timeout = setTimeout(() => setJobsLoading(false), 4000);
    return () => { unsub(); clearTimeout(timeout); };
  }, []);

  const filteredAdminJobs = jobSearch.trim()
    ? jobs.filter(j => j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.location.toLowerCase().includes(jobSearch.toLowerCase()) || j.industry.toLowerCase().includes(jobSearch.toLowerCase()))
    : jobs;

  const unread = enquiries.filter(e=>!e.read).length;
  const empEnquiries = enquiries.filter(e=>e.type==='employer');
  const candEnquiries = enquiries.filter(e=>e.type==='candidate');

  const navItems = [
    { id:'dashboard', icon:'📊', label:'Dashboard' },
    { id:'jobs',      icon:'💼', label:'Job Listings', badge: jobs.length || null },
    { id:'enquiries', icon:'📋', label:'Enquiries',    badge: unread || null },
  ];

  const persistEnquiries = (updated) => { setEnquiries(updated); localStorage.setItem('jvg_enquiries',JSON.stringify(updated)); };
  const markRead      = id => persistEnquiries(enquiries.map(e=>e.id===id?{...e,read:true}:e));
  const deleteEnquiry = id => persistEnquiries(enquiries.filter(e=>e.id!==id));
  const markAllRead   = () => persistEnquiries(enquiries.map(e=>({...e,read:true})));

  const buildSalary = (form) => {
    if (!form.salaryAmount || !form.salaryAmount.trim()) return '';
    let amt = form.salaryAmount.trim();
    if (amt.startsWith('₦')) amt = amt.slice(1).trim();
    const hasQualifier = /\/(month|year|mo|yr|week)/i.test(amt);
    return `₦${amt}${hasQualifier?'':' / month'}`;
  };

  const saveJob = async () => {
    if (!jobForm.title || !jobForm.location) { alert('Job title and location are required.'); return; }
    setSaving(true); setSaveMsg('');
    const salary = buildSalary(jobForm);
    const jobData = { title:jobForm.title, type:jobForm.type, location:jobForm.location, industry:jobForm.industry, salary, excerpt:jobForm.excerpt, description:jobForm.description };
    try {
      if (editingJob) {
        await fbUpdateJob(editingJob.id, jobData);
        setSaveMsg('✅ Job updated successfully — live for all visitors!');
      } else {
        await fbSaveJob(jobData);
        setSaveMsg('🚀 Job published — visible to everyone now!');
      }
      setJobForm(emptyJob); setShowJobForm(false); setEditingJob(null);
    } catch(e) {
      setSaveMsg('❌ Error: ' + e.message + '. Check your Firebase config in app.jsx.');
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 5000);
  };

  const editJob = job => {
    const raw = job.salary ? job.salary.replace(/^₦/,'') : '';
    setJobForm({ ...job, salaryAmount: raw });
    setEditingJob(job); setShowJobForm(true); setActiveSection('jobs');
  };

  const deleteJob = async id => {
    if (!window.confirm('Delete this job listing? This cannot be undone.')) return;
    try { await fbDeleteJob(id); }
    catch(e) { alert('Delete failed: ' + e.message); }
  };

  const duplicateJob = async job => {
    const { id, createdAt, ...rest } = job;
    try { await fbSaveJob({ ...rest, title: rest.title + ' (Copy)' }); }
    catch(e) { alert('Duplicate failed: ' + e.message); }
  };

  const filteredEnquiries = enquiryTab==='all' ? enquiries : enquiryTab==='employer' ? empEnquiries : candEnquiries;

  const statCards = [
    { icon:'🏢', label:'Employer Enquiries',     value:empEnquiries.length, colour:'gold'  },
    { icon:'👤', label:'Candidate Applications', value:candEnquiries.length, colour:'blue'  },
    { icon:'🔔', label:'Unread Messages',         value:unread,              colour:'red'   },
    { icon:'💼', label:'Live Job Listings',       value:jobs.length,         colour:'green' },
  ];

  return (
    <div className="admin-shell">
      <div className={"admin-sidebar-overlay"+(sidebarOpen?" visible":"")} onClick={()=>setSidebarOpen(false)}/>
      <aside className={"admin-sidebar"+(sidebarOpen?" open":"")}>
        <div className="admin-sidebar__brand">
          <div className="navbar__logo-mark" style={{width:36,height:36,fontSize:'0.9rem'}}>JVG</div>
          <span>Admin Panel</span>
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map(item=>(
            <button key={item.id} className={"admin-nav-item"+(activeSection===item.id?" active":"")} onClick={()=>{setActiveSection(item.id);setSidebarOpen(false);}}>
              <span className="nav-icon">{item.icon}</span><span>{item.label}</span>
              {item.badge ? <span className="admin-nav-badge">{item.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <button className="btn btn--outline btn--sm w-full" onClick={onClose}>← Back to Site</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-btn" onClick={()=>setSidebarOpen(true)} aria-label="Open sidebar">☰</button>
          <div style={{flex:1}}>
            <p className="eyebrow" style={{marginBottom:'0.2rem'}}>JVG Recruitment Solutions</p>
            <h1 className="admin-topbar__title">
              {activeSection==='dashboard'&&'Dashboard'}
              {activeSection==='jobs'&&'Job Listings'}
              {activeSection==='enquiries'&&'Enquiries'}
            </h1>
          </div>
          <div className="admin-topbar__actions">
            <button className="btn-theme" onClick={toggleTheme}>{theme==='dark'?'☀️':'🌙'}</button>
            {activeSection==='jobs' && (
              <button className="btn btn--primary btn--sm" onClick={()=>{setShowJobForm(!showJobForm);setEditingJob(null);setJobForm(emptyJob);}}>
                {showJobForm?'✕ Cancel':'+ Post New Job'}
              </button>
            )}
            {activeSection==='enquiries' && unread > 0 && (
              <button className="btn btn--ghost btn--sm" onClick={markAllRead}>✓ Mark All Read</button>
            )}
          </div>
        </header>

        <div className="admin-content">

          {/* ── DASHBOARD ── */}
          {activeSection==='dashboard' && (
            <>
              <div className="admin-stats-row">
                {statCards.map((s,i)=><AdminStatCard key={i} icon={s.icon} label={s.label} value={s.value} colour={s.colour} delay={i*0.1}/>)}
              </div>
              {/* Firebase config warning banner */}
              {FIREBASE_CONFIG.apiKey === 'REPLACE_WITH_YOUR_API_KEY' && (
                <div style={{background:'rgba(192,57,43,0.1)',border:'1px solid rgba(192,57,43,0.3)',borderRadius:'var(--radius-md)',padding:'1rem 1.25rem',marginBottom:'1.5rem',fontFamily:'var(--font-body)',fontSize:'0.86rem',color:'#c0392b'}}>
                  <strong>⚠️ Firebase not configured yet.</strong> Jobs you post will not be visible to site visitors until you add your Firebase config to app.jsx. <a href="https://firebase.google.com" target="_blank" rel="noreferrer" style={{color:'#c0392b',textDecoration:'underline'}}>Set up Firebase free →</a>
                </div>
              )}
              <div className="admin-dashboard-grid">
                <div className="admin-panel-card">
                  <div className="admin-panel-card__header">
                    <span className="admin-panel-card__title">Recent Enquiries</span>
                    <button className="btn btn--ghost btn--sm" onClick={()=>setActiveSection('enquiries')}>View All</button>
                  </div>
                  {enquiries.length===0 ? (
                    <div className="empty-state" style={{padding:'2rem'}}><div className="empty-state__icon">📭</div><p style={{fontFamily:'var(--font-body)',fontSize:'0.85rem',color:'var(--text-muted)'}}>No enquiries yet.</p></div>
                  ) : (
                    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Type</th><th>Company / Role</th><th>Status</th></tr></thead>
                      <tbody>{enquiries.slice(0,6).map(e=>(
                        <tr key={e.id} style={{cursor:'pointer'}} onClick={()=>{setViewEnquiry(e);if(!e.read)markRead(e.id);}}>
                          <td style={{fontWeight:e.read?400:700}}>{e.name}</td>
                          <td><span className={`badge badge--${e.type==='employer'?'employer':'candidate'}`}>{e.type}</span></td>
                          <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{e.company||e.position||'—'}</td>
                          <td><span className={`badge ${e.read?'badge--read':'badge--new'}`}>{e.read?'Read':'New'}</span></td>
                        </tr>
                      ))}</tbody>
                    </table></div>
                  )}
                </div>
                <div className="admin-panel-card">
                  <div className="admin-panel-card__header">
                    <span className="admin-panel-card__title">Live Job Listings</span>
                    <button className="btn btn--ghost btn--sm" onClick={()=>setActiveSection('jobs')}>Manage</button>
                  </div>
                  {jobsLoading ? (
                    <div className="empty-state" style={{padding:'2rem'}}><p style={{fontFamily:'var(--font-body)',fontSize:'0.85rem',color:'var(--text-muted)'}}>⏳ Loading…</p></div>
                  ) : jobs.length === 0 ? (
                    <div className="empty-state" style={{padding:'2rem'}}><div className="empty-state__icon">💼</div><p style={{fontFamily:'var(--font-body)',fontSize:'0.85rem',color:'var(--text-muted)'}}>No jobs yet. Go to Job Listings → "+ Post New Job".</p></div>
                  ) : (
                    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Location</th><th>Type</th></tr></thead>
                      <tbody>{jobs.slice(0,6).map(j=><tr key={j.id}><td style={{fontWeight:600,fontSize:'0.82rem'}}>{getJobIcon(j.industry)} {j.title}</td><td style={{fontSize:'0.82rem'}}>{j.location}</td><td><span className="badge badge--active" style={{fontSize:'0.65rem'}}>{j.type}</span></td></tr>)}</tbody>
                    </table></div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── JOBS ── */}
          {activeSection==='jobs' && (
            <>
              {saveMsg && (
                <div style={{background: saveMsg.startsWith('✅')||saveMsg.startsWith('🚀') ? 'rgba(44,62,45,0.12)' : 'rgba(192,57,43,0.1)', border:'1px solid '+(saveMsg.startsWith('✅')||saveMsg.startsWith('🚀')?'rgba(44,62,45,0.2)':'rgba(192,57,43,0.3)'), borderRadius:'var(--radius-md)', padding:'0.85rem 1.25rem', marginBottom:'1rem', fontFamily:'var(--font-body)', fontSize:'0.88rem', color: saveMsg.startsWith('✅')||saveMsg.startsWith('🚀')?'var(--accent-light)':'#c0392b'}}>
                  {saveMsg}
                </div>
              )}
              {showJobForm && (
                <div className="job-form-panel">
                  <p className="job-form-panel__title">{editingJob?'✏️ Edit Job Listing':'➕ Post New Job Listing'}</p>
                  <div className="form-row" style={{marginBottom:'1rem'}}>
                    <div className="form-group" style={{marginBottom:0}}><label className="form-label">Job Title *</label><input className="form-input" placeholder="e.g. Head of Marketing" value={jobForm.title} onChange={e=>setJobForm(p=>({...p,title:e.target.value}))}/></div>
                    <div className="form-group" style={{marginBottom:0}}><label className="form-label">Location *</label><input className="form-input" placeholder="Lagos" value={jobForm.location} onChange={e=>setJobForm(p=>({...p,location:e.target.value}))}/></div>
                  </div>
                  <div className="form-row" style={{marginBottom:'1rem'}}>
                    <div className="form-group" style={{marginBottom:0}}><label className="form-label">Employment Type</label><select className="form-select" value={jobForm.type} onChange={e=>setJobForm(p=>({...p,type:e.target.value}))}><option>Permanent</option><option>Contract</option><option>Temporary</option><option>Part-time</option></select></div>
                    <div className="form-group" style={{marginBottom:0}}><label className="form-label">Industry</label><input className="form-input" placeholder="Finance, Hospitality, HR…" value={jobForm.industry} onChange={e=>setJobForm(p=>({...p,industry:e.target.value}))}/></div>
                  </div>
                  <div className="form-group" style={{marginBottom:'1rem'}}>
                    <label className="form-label">Salary Range</label>
                    <div className="salary-input-wrap">
                      <span className="salary-input-prefix">₦</span>
                      <input className="form-input salary-input-field" placeholder="e.g. 500K – 800K / month" value={jobForm.salaryAmount} onChange={e=>setJobForm(p=>({...p,salaryAmount:e.target.value}))}/>
                    </div>
                    <p style={{fontFamily:'var(--font-body)',fontSize:'0.72rem',color:'var(--text-muted)',marginTop:'0.35rem'}}>Enter the amount only — ₦ and "/ month" are added automatically.</p>
                  </div>
                  <div className="form-group" style={{marginBottom:'1rem'}}><label className="form-label">Short Excerpt (shown on card)</label><textarea className="form-textarea" style={{minHeight:'70px'}} placeholder="1-2 sentence summary shown on the job listing card…" value={jobForm.excerpt} onChange={e=>setJobForm(p=>({...p,excerpt:e.target.value}))}/></div>
                  <div className="form-group">
                    <label className="form-label">Full Job Description — HTML supported</label>
                    <p style={{fontFamily:'var(--font-body)',fontSize:'0.75rem',color:'var(--text-muted)',marginBottom:'0.5rem'}}>Use: &lt;h4&gt; headings, &lt;ul&gt;&lt;li&gt; bullet lists, &lt;p&gt; paragraphs</p>
                    <textarea className="form-textarea" style={{minHeight:'160px',fontFamily:'monospace',fontSize:'0.82rem'}} placeholder={`<h4>About the Role</h4>\n<p>Description here...</p>`} value={jobForm.description} onChange={e=>setJobForm(p=>({...p,description:e.target.value}))}/>
                  </div>
                  <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}>
                    <button className="btn btn--primary btn--sm" onClick={saveJob} disabled={saving}>{saving?'⏳ Saving…':editingJob?'💾 Save Changes':'🚀 Publish Live'}</button>
                    <button className="btn btn--outline btn--sm" onClick={()=>{setShowJobForm(false);setEditingJob(null);setJobForm(emptyJob);}}>Cancel</button>
                  </div>
                </div>
              )}
              <div className="admin-panel-card">
                <div className="admin-panel-card__header">
                  <span className="admin-panel-card__title">All Live Job Listings</span>
                  <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
                    <input className="form-input" placeholder="Search jobs…" value={jobSearch} onChange={e=>setJobSearch(e.target.value)} style={{width:'200px',padding:'0.5rem 0.75rem',fontSize:'0.82rem'}}/>
                    <span className="admin-panel-card__meta">{filteredAdminJobs.length} of {jobs.length}</span>
                  </div>
                </div>
                {jobsLoading ? (
                  <div className="empty-state" style={{padding:'2rem'}}><p style={{fontFamily:'var(--font-body)',color:'var(--text-muted)'}}>⏳ Loading from Firebase…</p></div>
                ) : jobs.length === 0 ? (
                  <div className="empty-state" style={{padding:'3rem'}}>
                    <div className="empty-state__icon">💼</div>
                    <h3 className="empty-state__title">No jobs posted yet</h3>
                    <p className="empty-state__text">Click "+ Post New Job" above to add your first listing. It will go live instantly for all visitors.</p>
                  </div>
                ) : filteredAdminJobs.length === 0 ? (
                  <div className="empty-state"><div className="empty-state__icon">🔍</div><h3 className="empty-state__title">No jobs match your search</h3></div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Title</th><th>Location</th><th>Industry</th><th>Salary</th><th>Type</th><th>Actions</th></tr></thead>
                      <tbody>{filteredAdminJobs.map(j=>(
                        <tr key={j.id}>
                          <td style={{fontWeight:600}}>{getJobIcon(j.industry)} {j.title}</td>
                          <td>📍 {j.location}</td>
                          <td>{j.industry}</td>
                          <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{j.salary||'—'}</td>
                          <td><span className="badge badge--active">{j.type}</span></td>
                          <td><div className="td-actions">
                            <button className="btn btn--ghost btn--icon" title="Edit"      onClick={()=>editJob(j)}>✏️</button>
                            <button className="btn btn--ghost btn--icon" title="Duplicate" onClick={()=>duplicateJob(j)}>📋</button>
                            <button className="btn btn--danger btn--icon" title="Delete"   onClick={()=>deleteJob(j.id)}>🗑️</button>
                          </div></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── ENQUIRIES ── */}
          {activeSection==='enquiries' && (
            <div className="admin-panel-card">
              <div className="admin-panel-card__header">
                <span className="admin-panel-card__title">All Enquiries</span>
                <span className="admin-panel-card__meta">{enquiries.length} total · {unread} unread</span>
              </div>
              <div className="admin-tab-strip">
                {[{id:'all',label:`All (${enquiries.length})`},{id:'employer',label:`Employers (${empEnquiries.length})`},{id:'candidate',label:`Candidates (${candEnquiries.length})`}].map(t=>(
                  <button key={t.id} className={`admin-tab-strip-btn${enquiryTab===t.id?' active':''}`} onClick={()=>setEnquiryTab(t.id)}>{t.label}</button>
                ))}
              </div>
              <div className="admin-tab-content">
                {filteredEnquiries.length===0 ? (
                  <div className="empty-state"><div className="empty-state__icon">📭</div><h3 className="empty-state__title">No enquiries found</h3><p className="empty-state__text">Enquiries submitted through the contact form will appear here.</p></div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Name</th><th>Type</th><th>Email</th><th>Company / Role</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>{filteredEnquiries.map(e=>(
                        <tr key={e.id} style={{fontWeight:e.read?400:600,cursor:'pointer'}} onClick={()=>{setViewEnquiry(e);if(!e.read)markRead(e.id);}}>
                          <td style={{fontWeight:e.read?500:700}}>{e.name}</td>
                          <td><span className={`badge badge--${e.type==='employer'?'employer':'candidate'}`}>{e.type==='employer'?'Employer':'Candidate'}</span></td>
                          <td style={{fontSize:'0.82rem'}}>{e.email}</td>
                          <td style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>{e.company||e.position||'—'}</td>
                          <td style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>{new Date(e.date).toLocaleDateString('en-GB')}</td>
                          <td><span className={`badge ${e.read?'badge--read':'badge--new'}`}>{e.read?'Read':'New'}</span></td>
                          <td onClick={ev=>ev.stopPropagation()}><div className="td-actions">
                            <button className="btn btn--ghost btn--sm" onClick={()=>setViewEnquiry(e)}>View</button>
                            <a href={`mailto:${e.email}?subject=Re: Your enquiry — JVG Recruitment`} className="btn btn--ghost btn--icon" title="Reply">✉️</a>
                            <button className="btn btn--danger btn--icon" title="Delete" onClick={()=>deleteEnquiry(e.id)}>🗑️</button>
                          </div></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {viewEnquiry && (
        <EnquiryDetailModal enquiry={viewEnquiry} onClose={()=>setViewEnquiry(null)} onMarkRead={markRead} onDelete={deleteEnquiry}/>
      )}
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-logo"><div className="navbar__logo-mark">JVG</div>JVG Recruitment</div>
            <p className="footer__tagline">Connecting employers with performance-ready talent across Nigeria. Specialists in hotel staffing, corporate recruitment, and HR outsourcing for businesses that can't afford hiring mistakes.</p>
          </div>
          <div>
            <p className="footer__col-title">Company</p>
            <div className="footer__links">
              <a href="#" onClick={e=>{e.preventDefault();setPage('about');}}>About Us</a>
              <a href="#" onClick={e=>{e.preventDefault();setPage('services');}}>Our Services</a>
              <a href="#" onClick={e=>{e.preventDefault();setPage('jobs');}}>Job Listings</a>
              <a href="#" onClick={e=>{e.preventDefault();setPage('contact');}}>Contact</a>
            </div>
          </div>
          <div>
            <p className="footer__col-title">Services</p>
            <div className="footer__links">
              <a href="#">Permanent Recruitment</a><a href="#">Contract Staffing</a>
              <a href="#">HR Outsourcing</a><a href="#">Executive Search</a><a href="#">Hospitality Staffing</a>
            </div>
          </div>
          <div>
            <p className="footer__col-title">Contact</p>
            <div className="footer__links">
              <a href="mailto:info@jvgrecruitmentsolutions.com">info@jvgrecruitmentsolutions.com</a>
              <a href="tel:+2347047453599">+234 704 745 3599</a>
              <a href="#">11, Aliyu Mohammed Road TAK Continental Estate Life Camp FCT Abuja</a>
              <a href="#">Mon–Sat 8am–6pm WAT</a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">© {new Date().getFullYear()} JVG Recruitment Solutions Ltd. All rights reserved.</p>
          <div className="footer__legal"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Cookie Policy</a></div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// APP ROOT
// ============================================================
function App() {
  const [page, setPage] = useState('home');
  const [theme, setTheme] = useState(()=>localStorage.getItem('jvg_theme')||'light');
  const [adminMode, setAdminMode] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [keySeq, setKeySeq] = useState('');

  useEffect(()=>{ document.documentElement.setAttribute('data-theme',theme); localStorage.setItem('jvg_theme',theme); },[theme]);
  useEffect(()=>{
    const handler = e => {
      const seq = (keySeq+e.key).slice(-8);
      setKeySeq(seq);
      if (seq==='jvgadmin') setAdminMode(true);
    };
    window.addEventListener('keypress', handler);
    return () => window.removeEventListener('keypress', handler);
  },[keySeq]);
  useEffect(()=>{ if(!adminMode) window.scrollTo({top:0,behavior:'smooth'}); },[page]);

  const toggleTheme = () => setTheme(t=>t==='light'?'dark':'light');
  const handleExitAdmin = () => { setAdminMode(false); setAdminAuthenticated(false); };

  if (adminMode) {
    if (!adminAuthenticated) return <AdminLogin onLogin={()=>setAdminAuthenticated(true)}/>;
    return <AdminPanel onClose={handleExitAdmin} toggleTheme={toggleTheme} theme={theme}/>;
  }

  const renderPage = () => {
    switch(page) {
      case 'home':     return <HomePage setPage={setPage}/>;
      case 'about':    return <AboutPage setPage={setPage}/>;
      case 'services': return <><PageHero eyebrow="What We Offer" title="Our Recruitment Services" subtitle="Tailored talent solutions for every hiring need."/><ServicesSection setPage={setPage}/><HowItWorksSection/><TestimonialsSection/></>;
      case 'jobs':     return <JobsPage setPage={setPage}/>;
      case 'contact':  return <ContactPage/>;
      default:         return <HomePage setPage={setPage}/>;
    }
  };

  return (
    <>
      <Navbar page={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme}/>
      <main>{renderPage()}</main>
      <Footer setPage={setPage}/>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));