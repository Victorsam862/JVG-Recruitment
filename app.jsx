/* ═══════════════════════════════════════════════════════════
   JVG Recruitment Solutions — app.jsx  (PREMIUM EDITION)
   ═══════════════════════════════════════════════════════════ */
   const { useState, useEffect, useRef, useCallback } = React;

   /* ─── ADMIN CREDENTIALS ─── */
   const ADMIN_PASSWORD = 'jvgadmin862';
   
   /* ─── DEFAULT JOB DATA ─── */
   const DEFAULT_JOBS = [
     { id:1, icon:'💼', badge:'full-time',  title:'Sales Executive',           location:'Abuja, FCT',      industry:'FMCG / Retail',     salary:'₦120,000 – ₦180,000/mo', description:'Drive sales growth and manage client relationships in our Abuja territory.', active:true },
     { id:2, icon:'🗂️', badge:'full-time',  title:'Office Administrator',      location:'Lagos, Nigeria',  industry:'Corporate / Admin',  salary:'₦90,000 – ₦130,000/mo',  description:'Manage daily office operations, scheduling, and administrative tasks.', active:true },
     { id:3, icon:'⚙️', badge:'contract',   title:'Civil Engineer',            location:'Port Harcourt',   industry:'Construction',       salary:'₦350,000 – ₦500,000/mo', description:'Lead civil engineering projects on major construction sites.', active:true },
     { id:4, icon:'📊', badge:'full-time',  title:'Accountant',                location:'Abuja, FCT',      industry:'Finance / Banking',  salary:'₦150,000 – ₦220,000/mo', description:'Handle financial reporting, auditing, and tax compliance.', active:true },
     { id:5, icon:'💻', badge:'remote',     title:'Digital Marketing Officer', location:'Remote / Lagos',  industry:'Marketing',          salary:'₦100,000 – ₦160,000/mo', description:'Manage social media, campaigns, SEO and digital strategy.', active:true },
     { id:6, icon:'🏥', badge:'full-time',  title:'Registered Nurse',          location:'Abuja, FCT',      industry:'Healthcare',         salary:'₦130,000 – ₦200,000/mo', description:'Provide professional nursing care in a leading healthcare facility.', active:true },
   ];
   
   const BADGE_OPTIONS = [
     { value:'full-time', label:'Full-Time' },
     { value:'contract',  label:'Contract'  },
     { value:'remote',    label:'Remote'    },
     { value:'part-time', label:'Part-Time' },
   ];
   
   const ICON_OPTIONS = ['💼','🗂️','⚙️','📊','💻','🏥','🏗️','🎓','📦','🔧','🧪','🎨','📞','🏦','✈️','🌿','🔬','📱','🍽️','🏨'];
   
   /* ─── STORAGE HELPERS ─── */
   function loadJobs() {
     try { const s = localStorage.getItem('jvg_jobs'); return s ? JSON.parse(s) : DEFAULT_JOBS; } catch { return DEFAULT_JOBS; }
   }
   function saveJobs(jobs) {
     try { localStorage.setItem('jvg_jobs', JSON.stringify(jobs)); } catch {}
   }
   function loadEnquiries() {
     try { const s = localStorage.getItem('jvg_enquiries'); return s ? JSON.parse(s) : []; } catch { return []; }
   }
   function saveEnquiries(list) {
     try { localStorage.setItem('jvg_enquiries', JSON.stringify(list)); } catch {}
   }
   
   /* ─── SCROLL REVEAL HOOK ─── */
   function useReveal() {
     const refs = useRef([]);
     useEffect(() => {
       const observer = new IntersectionObserver(
         entries => entries.forEach(e => {
           if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
         }),
         { threshold: 0.08 }
       );
       refs.current.forEach(el => el && observer.observe(el));
       return () => observer.disconnect();
     }, []);
     const ref = useCallback((el, i = refs.current.length) => { refs.current[i] = el; }, []);
     return ref;
   }
   
   /* ─── STAR FIELD ─── */
   function StarField() {
     const stars = Array.from({ length: 60 }, (_, i) => ({
       id: i,
       top:   `${Math.random() * 100}%`,
       left:  `${Math.random() * 100}%`,
       dur:   `${2 + Math.random() * 5}s`,
       delay: `${Math.random() * 6}s`,
       size:  Math.random() > 0.9 ? '3px' : '1.5px',
       opacity: 0.2 + Math.random() * 0.5,
     }));
     return (
       <div className="hero-stars">
         {stars.map(s => (
           <div key={s.id} className="star" style={{
             top:s.top, left:s.left,
             '--dur':s.dur, '--delay':s.delay,
             width:s.size, height:s.size, opacity:s.opacity,
           }} />
         ))}
       </div>
     );
   }
   
   /* ══════════════════════════════════════════════════
      NAVBAR
      ══════════════════════════════════════════════════ */
   function Navbar({ onViewContact }) {
     const [scrolled, setScrolled] = useState(false);
     const [menuOpen, setMenuOpen] = useState(false);
   
     useEffect(() => {
       const fn = () => setScrolled(window.scrollY > 60);
       window.addEventListener('scroll', fn);
       return () => window.removeEventListener('scroll', fn);
     }, []);

     const handleNavClick = (e, label) => {
       if (label === 'How It Works') {
         e.preventDefault();
         setMenuOpen(false);
         const el = document.getElementById('how-it-works');
         if (el) el.scrollIntoView({ behavior: 'smooth' });
       } else if (label === 'Contact') {
         e.preventDefault();
         setMenuOpen(false);
         const el = document.getElementById('contact');
         if (el) el.scrollIntoView({ behavior: 'smooth' });
       } else {
         setMenuOpen(false);
       }
     };
   
     const links = ['About','Services','Jobs','How It Works','Contact'];
     const getLinkHref = (l) => {
       if (l === 'How It Works') return '#how-it-works';
       return `#${l.toLowerCase().replace(' ','-')}`;
     };
   
     return (
       <>
         <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
           <a href="#home" className="nav-logo">
             <div className="nav-logo-mark">JVG</div>
             <div>
               <span className="nav-logo-name">JVG Recruitment</span>
               <span className="nav-logo-sub">Solutions</span>
             </div>
           </a>
           <div className="nav-links">
             {links.map(l => (
               <a key={l} href={getLinkHref(l)} onClick={e => handleNavClick(e, l)}>{l}</a>
             ))}
             <a href="#contact" className="nav-cta" onClick={e => handleNavClick(e, 'Contact')}>Post a Job</a>
           </div>
           <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
             <span /><span /><span />
           </button>
         </nav>
         <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
           {links.map(l => (
             <a key={l} href={getLinkHref(l)} onClick={e => handleNavClick(e, l)}>{l}</a>
           ))}
           <a href="#contact" className="m-cta" onClick={e => handleNavClick(e, 'Contact')}>📋 Post a Job</a>
         </div>
       </>
     );
   }
   
   /* ══════════════════════════════════════════════════
      HERO
      ══════════════════════════════════════════════════ */
   function Hero() {
     const stats = [
       { num:'500+', label:'Placements Made'   },
       { num:'80+',  label:'Employer Clients'  },
       { num:'15+',  label:'Industries Served' },
       { num:'96%',  label:'Satisfaction Rate' },
     ];
     return (
       <section className="hero" id="home">
         <div className="hero-gold-line" />
         <div className="hero-bottom-line" />
         <div className="hero-bg">
           <div className="hero-orb hero-orb-1" />
           <div className="hero-orb hero-orb-2" />
           <div className="hero-orb hero-orb-3" />
           <div className="hc hc1" />
           <div className="hc hc2" />
           <div className="hc hc3" />
           <StarField />
         </div>
   
         <div className="hero-content">
           <div className="hero-eyebrow">
             <span className="hero-eyebrow-line" />
             <span>Nigeria's Premier Recruitment Agency</span>
             <span className="hero-eyebrow-dot" />
           </div>
   
           <h1 className="hero-title">
             Professional Recruitment &amp;<br />
             <em>HR Outsourcing Services</em><br />
             Across Nigeria
           </h1>
   
           <p className="hero-sub">
             From front desk to executive management — we source, screen, and deliver
             performance-ready talent to hotels, corporations, and businesses across
             Abuja, Lagos, and every Nigerian state.
           </p>
   
           <div className="hero-proposition">
             <span>✦</span>
             From Front Desk to Management — Pre-Screened, Performance-Ready Staff for Hotels &amp; Corporate Organisations. Delivered in Days, Not Months.
           </div>
   
           <div className="hero-btns">
             <button className="btn-primary" onClick={()=>window.__goToContact&&window.__goToContact()}><span>📋 Post a Job Vacancy</span></button>
             <a href="#jobs"    className="btn-secondary"><span>🔍 Browse Openings</span></a>
             <button className="btn-secondary" onClick={()=>window.__goToContact&&window.__goToContact()}><span>📄 Submit Your Resume</span></button>
           </div>
   
           <div className="hero-stats">
             {stats.map(s => (
               <div key={s.label} className="hero-stat">
                 <div className="hero-stat-num">{s.num}</div>
                 <div className="hero-stat-label">{s.label}</div>
               </div>
             ))}
           </div>
         </div>
       </section>
     );
   }
   
   /* ══════════════════════════════════════════════════
      BENEFITS — "WHY CHOOSE JVG"
      ══════════════════════════════════════════════════ */
   function Benefits() {
     const ref = useReveal();
     const cards = [
       {
         icon: '🎯',
         title: 'Eliminate Bad Hires. Guaranteed.',
         desc: 'Every candidate is rigorously screened, verified, and assessed before they ever reach your desk. We eliminate costly hiring mistakes so you can focus on running your business.',
       },
       {
         icon: '⚡',
         title: 'Pre-Vetted Staff in Days — Not Months',
         desc: 'Our deep talent pipeline means we can deliver qualified, job-ready candidates in days. No lengthy waits, no wasted interviews — just the right people, fast.',
       },
       {
         icon: '🏨',
         title: 'Specialists in Hotels & Corporate Staffing',
         desc: 'From front desk and housekeeping to finance and management, we understand the unique demands of hospitality and corporate environments across Nigeria.',
       },
       {
         icon: '🛡️',
         title: 'Stop Losing Money to Poor Staffing',
         desc: 'A bad hire costs far more than our fee. We protect your bottom line with thorough background checks, reference verifications, and skills assessments on every candidate.',
       },
       {
         icon: '🌍',
         title: 'Nationwide Reach — Abuja to Lagos & Beyond',
         desc: 'With active talent networks across every Nigerian state, we connect you with the best local and nationally mobile candidates wherever your business operates.',
       },
       {
         icon: '🤝',
         title: 'Your Trusted Long-Term HR Partner',
         desc: 'We don\'t just fill roles — we build lasting relationships. Our post-placement support ensures every hire settles in successfully and delivers results from day one.',
       },
     ];
   
     return (
       <section className="benefits-section" id="why-jvg">
         <div className="benefits-headline reveal" ref={el => ref(el, 0)}>
           <div className="gold-divider" />
           <div className="section-label center">Why Choose JVG</div>
           <h2>Abuja's Trusted Partner for Hotels &amp; Businesses<br /><em>That Can't Afford Hiring Mistakes</em></h2>
           <p>We recruit, screen, and deliver dependable talent — so you never have to compromise on who represents your brand.</p>
         </div>
   
         <div className="benefits-grid">
           {cards.map((c, i) => (
             <div
               key={c.title}
               className={`benefit-card reveal reveal-d${(i % 3) + 1}`}
               ref={el => ref(el, i + 1)}
             >
               <span className="benefit-card-num">0{i + 1}</span>
               <div className="benefit-icon-wrap">{c.icon}</div>
               <h3>{c.title}</h3>
               <p>{c.desc}</p>
             </div>
           ))}
   
           {/* Authority proposition strip */}
           <div className="benefit-proposition reveal" ref={el => ref(el, 7)}>
             <div className="benefit-proposition-icon">💎</div>
             <div className="benefit-proposition-text">
               <strong>Struggling With Unreliable Staff? We Have the Solution.</strong>
               <span>JVG Recruitment Solutions — Recruit, Screen &amp; Deliver Dependable Talent Across Nigeria. Fast, Professional, Guaranteed.</span>
             </div>
           </div>
         </div>
       </section>
     );
   }
   
   /* ══════════════════════════════════════════════════
      ABOUT PREVIEW (on main page)
      ══════════════════════════════════════════════════ */
   function About({ onViewMore }) {
     const ref = useReveal();
     const features = [
       { icon:'🎯', title:'Our Mission',              desc:'To bridge the gap between qualified talent and forward-thinking employers across Nigeria — creating lasting value for businesses and careers alike.' },
       { icon:'🌍', title:'Our Vision',               desc:"To be Nigeria's most trusted and results-driven recruitment agency — known for integrity, speed, and the quality of every placement we make." },
       { icon:'⚡', title:'Cross-Industry Expertise', desc:'From finance and engineering to hospitality, sales, and administration — we recruit across all sectors with deep Nigerian market knowledge.' },
     ];
     return (
       <section className="about-section" id="about">
         <div className="about-grid">
           <div className="about-visual">
             <div className="about-visual-icon">🤝</div>
             <p className="about-visual-text">Connecting talent with opportunity across Nigeria — from Abuja to Lagos and beyond.</p>
             <div className="about-stat-row">
               <div className="about-stat-pill"><strong>10+</strong><span>Years Experience</span></div>
               <div className="about-stat-pill"><strong>500+</strong><span>Placements Made</span></div>
             </div>
             <div className="about-float">🏆 Trusted Staffing Agency — Abuja</div>
           </div>
   
           <div className="about-content">
             <div className="reveal" ref={el => ref(el, 0)}>
               <div className="section-label">About JVG Recruitment Solutions</div>
               <h2 className="section-title dark">Your Strategic <em>Recruitment Partner</em> in Nigeria</h2>
               <p className="section-desc dark">We provide recruitment, staffing, and HR outsourcing solutions — helping businesses find the right match for their workforce needs while supporting job seekers to secure meaningful employment across Abuja, Lagos, Port Harcourt and all Nigerian states.</p>
             </div>
             <div className="about-features">
               {features.map((f, i) => (
                 <div key={f.title} className={`about-feature reveal reveal-d${i+1}`} ref={el => ref(el, i+1)}>
                   <div className="about-feature-icon">{f.icon}</div>
                   <div><h4>{f.title}</h4><p>{f.desc}</p></div>
                 </div>
               ))}
             </div>
             <div style={{display:'flex', gap:'14px', flexWrap:'wrap'}} className="reveal reveal-d3" ref={el => ref(el, 4)}>
               <button className="btn-primary" onClick={()=>window.__goToContact&&window.__goToContact()}><span>🚀 Work With Us</span></button>
               <button className="btn-view-page" onClick={onViewMore}>
                 <span>📖 Full Story</span>
                 <span className="btn-view-page-arrow">→</span>
               </button>
             </div>
           </div>
         </div>
       </section>
     );
   }
   
   /* ══════════════════════════════════════════════════
      ABOUT FULL PAGE
      ══════════════════════════════════════════════════ */
   function AboutPage({ onBack }) {
     useEffect(() => { window.scrollTo(0, 0); }, []);
     const ref = useReveal();
   
     const values = [
       { icon:'🎯', title:'Our Mission', desc:'To bridge the gap between qualified talent and forward-thinking employers across Nigeria — creating lasting value for businesses and careers alike. We believe every organisation deserves access to exceptional talent, and every professional deserves a meaningful career.' },
       { icon:'🌍', title:'Our Vision', desc:"To be Nigeria's most trusted and results-driven recruitment agency — known for integrity, speed, and the quality of every placement we make. We envision a Nigeria where talent and opportunity meet seamlessly, driving economic growth and individual fulfilment." },
       { icon:'⚡', title:'Cross-Industry Expertise', desc:'From finance and engineering to hospitality, sales, and administration — we recruit across all sectors with deep Nigerian market knowledge. Our consultants bring years of industry-specific experience to every search.' },
       { icon:'💎', title:'Our Values', desc:'Integrity in every interaction. Speed without compromise. Quality that exceeds expectations. We hold ourselves to the highest professional standards because our reputation is built on yours.' },
       { icon:'🤝', title:'Our Approach', desc:'We take time to understand your culture, your needs, and what success looks like for your organisation. This deep understanding allows us to go beyond matching skills to CVs — we match people to purpose.' },
       { icon:'🏆', title:'Our Track Record', desc:'With over 500 successful placements across 15+ industries, our results speak for themselves. From front-desk staff to C-suite executives, we have connected thousands of Nigerians with careers that transform their lives.' },
     ];
   
     const team = [
       { init:'', name:'', role:'Founder & CEO', desc:'' },
       { init:'', name:'', role:'Head of Recruitment', desc:'' },
       { init:'', name:'', role:'Client Relations Director', desc:'' },
     ];
   
     return (
       <div className="full-page">
         {/* Page Header */}
         <div className="full-page-hero">
           <div className="full-page-hero-bg">
             <div className="hero-orb hero-orb-1" style={{opacity:0.5}} />
             <div className="hero-orb hero-orb-2" style={{opacity:0.5}} />
           </div>
           <div className="full-page-hero-content">
             <button className="back-btn" onClick={onBack}>
               ← Back to Home
             </button>
             <div className="full-page-eyebrow">
               <span className="hero-eyebrow-line" />
               <span>About JVG Recruitment Solutions</span>
               <span className="hero-eyebrow-dot" />
             </div>
             <h1 className="full-page-title">
               Nigeria's Most Trusted<br />
               <em>Recruitment Partner</em>
             </h1>
             <p className="full-page-subtitle">
               For over a decade, JVG Recruitment Solutions has been the bridge between exceptional talent and Nigeria's most ambitious organisations — from Abuja to Lagos and every state in between.
             </p>
             <div className="full-page-stats">
               <div className="full-page-stat"><strong>10+</strong><span>Years Experience</span></div>
               <div className="full-page-stat"><strong>500+</strong><span>Placements Made</span></div>
               <div className="full-page-stat"><strong>80+</strong><span>Employer Clients</span></div>
               <div className="full-page-stat"><strong>15+</strong><span>Industries Served</span></div>
               <div className="full-page-stat"><strong>96%</strong><span>Satisfaction Rate</span></div>
             </div>
           </div>
         </div>
   
         {/* Story Section */}
         <div className="full-page-section" style={{background:'var(--ivory)'}}>
           <div className="full-page-container">
             <div className="reveal" ref={el => ref(el, 0)}>
               <div className="section-label">Our Story</div>
               <h2 className="section-title dark">Built on <em>Trust &amp; Results</em></h2>
             </div>
             <div className="about-story-grid reveal reveal-d1" ref={el => ref(el, 1)}>
               <div className="about-story-text">
                 <p>JVG Recruitment Solutions was founded with a singular purpose: to solve Nigeria's talent gap by connecting the right people with the right opportunities. What began as a boutique agency in Abuja has grown into one of Nigeria's most respected recruitment firms, trusted by businesses ranging from ambitious startups to established multinationals.</p>
                 <p>We saw firsthand how poor hiring decisions were costing Nigerian businesses millions — in lost productivity, high turnover, and wasted training investment. We decided to do something about it.</p>
                 <p>Today, our rigorous screening process, vast talent network, and deep industry knowledge mean we deliver candidates who don't just fill roles — they transform organisations. We are proud partners to businesses across every Nigerian state, and we take that responsibility seriously.</p>
               </div>
               <div className="about-story-visual">
                 <div className="about-story-card">
                   <div className="about-story-card-icon">🌟</div>
                   <h3>Founded in Abuja</h3>
                   <p>With a mission to redefine talent acquisition across Nigeria</p>
                 </div>
                 <div className="about-story-card">
                   <div className="about-story-card-icon">📈</div>
                   <h3>Nationwide Growth</h3>
                   <p>Expanded to serve clients in every state across the federation</p>
                 </div>
                 <div className="about-story-card">
                   <div className="about-story-card-icon">🤝</div>
                   <h3>Lasting Partnerships</h3>
                   <p>80% of our clients are returning partners — testament to our results</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
   
         {/* Values Grid */}
         <div className="full-page-section" style={{background:'var(--navy-deep)'}}>
           <div className="full-page-container">
             <div className="reveal" ref={el => ref(el, 10)}>
               <div className="section-label center" style={{display:'flex',justifyContent:'center'}}>What Drives Us</div>
               <h2 className="section-title" style={{textAlign:'center',color:'var(--ivory)'}}>Our Mission, <em>Vision &amp; Values</em></h2>
             </div>
             <div className="about-values-grid">
               {values.map((v, i) => (
                 <div key={v.title} className={`about-value-card reveal reveal-d${(i%3)+1}`} ref={el => ref(el, 11+i)}>
                   <div className="about-value-icon">{v.icon}</div>
                   <h3>{v.title}</h3>
                   <p>{v.desc}</p>
                 </div>
               ))}
             </div>
           </div>
         </div>
   
         {/* Team Section */}
         <div className="full-page-section" style={{background:'var(--ivory)'}}>
           <div className="full-page-container">
             <div className="reveal" ref={el => ref(el, 20)}>
               <div className="section-label center" style={{display:'flex',justifyContent:'center'}}>The People Behind JVG</div>
               <h2 className="section-title dark" style={{textAlign:'center'}}>Meet Our <em>Leadership Team</em></h2>
             </div>
             <div className="about-team-grid">
               {team.map((t, i) => (
                 <div key={t.name} className={`about-team-card reveal reveal-d${i+1}`} ref={el => ref(el, 21+i)}>
                   <div className="about-team-avatar">{t.init}</div>
                   <h3>{t.name}</h3>
                   <div className="about-team-role">{t.role}</div>
                   <p>{t.desc}</p>
                 </div>
               ))}
             </div>
           </div>
         </div>
   
         {/* CTA */}
         <div className="full-page-cta">
           <div className="full-page-container" style={{textAlign:'center'}}>
             <h2 style={{fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'var(--ivory)', marginBottom:'16px'}}>Ready to Partner With <em style={{color:'var(--gold-mid)'}}>Nigeria's Best?</em></h2>
             <p style={{color:'rgba(255,255,255,.5)', marginBottom:'36px', fontSize:'16px'}}>Let's discuss how JVG can transform your hiring — or your career.</p>
             <div style={{display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap'}}>
               <button className="btn-primary" onClick={onBack}><span>← Back to Home</span></button>
               <button className="btn-secondary" onClick={()=>window.__goToContact&&window.__goToContact()}><span>📋 Get In Touch</span></button>
             </div>
           </div>
         </div>
       </div>
     );
   }
   
   /* ══════════════════════════════════════════════════
      SERVICES
      ══════════════════════════════════════════════════ */
   function Services() {
     const ref = useReveal();
     const services = [
       {
         num:'01', icon:'👥', title:'Recruitment & Staffing',
         desc:'We source, screen, and deliver qualified candidates tailored precisely to your role requirements — from entry-level to C-suite positions across Nigeria.',
         items:['Permanent & contract placements','Executive search & headhunting','Volume recruitment campaigns','Hotel & hospitality staffing'],
       },
       {
         num:'02', icon:'🏢', title:'HR Outsourcing',
         desc:"Let us manage your HR functions so you can focus on growth. From sourcing to onboarding — we handle it all with professionalism and discretion.",
         items:['Candidate sourcing & rigorous screening','Interview coordination & logistics','Onboarding process management','Background verification & reference checks'],
       },
       {
         num:'03', icon:'🎓', title:'Job Placement for Candidates',
         desc:'We support job seekers throughout the entire employment journey — from CV optimisation to interview coaching and successful placement follow-up.',
         items:['Professional CV review & optimisation','Job matching & direct application support','Interview preparation & confidence coaching','Post-placement follow-up & career guidance'],
       },
     ];
     return (
       <section className="services-section" id="services">
         <div className="section-header center reveal" ref={el => ref(el, 0)} style={{position:'relative',zIndex:1}}>
           <div className="section-label center">What We Offer</div>
           <h2 className="section-title">Our <em>Recruitment Services</em></h2>
           <p className="section-desc">End-to-end talent acquisition and HR outsourcing solutions designed to help your business thrive across Nigeria.</p>
         </div>
         <div className="services-grid">
           {services.map((s, i) => (
             <div key={s.num} className={`service-card reveal reveal-d${i+1}`} ref={el => ref(el, i+1)}>
               <span className="service-num">{s.num}</span>
               <div className="service-icon-wrap">{s.icon}</div>
               <h3>{s.title}</h3>
               <p>{s.desc}</p>
               <ul className="service-list">{s.items.map(it => <li key={it}>{it}</li>)}</ul>
             </div>
           ))}
         </div>
       </section>
     );
   }
   
   /* ══════════════════════════════════════════════════
      HOW IT WORKS
      ══════════════════════════════════════════════════ */
   function HowItWorks() {
     const [tab, setTab] = useState('employers');
     const ref = useReveal();
     const employer = [
       { n:'01', e:'📋', t:'Post Your Requirement', d:'Share your role specifications, team culture, and the ideal candidate profile with our experienced consultants.' },
       { n:'02', e:'🔍', t:'We Source & Screen',     d:'We search our extensive talent pool and networks to identify, verify, and shortlist only the best-fit candidates.' },
       { n:'03', e:'📅', t:'Interview Coordination', d:'We manage the full interview process — scheduling, candidate briefing, logistics, and collecting your feedback.' },
       { n:'04', e:'🎉', t:'Successful Placement',   d:'We facilitate the offer, onboarding, and follow up to ensure a seamless and lasting hire for your organisation.' },
     ];
     const seeker = [
       { n:'01', e:'✍️', t:'Register With Us',  d:'Submit your profile and CV. Share your experience, core skills, salary expectations, and career goals with our team.' },
       { n:'02', e:'👀', t:'Browse Openings',   d:'Explore our active vacancies and get matched to roles aligned with your skills, experience, and career aspirations.' },
       { n:'03', e:'📤', t:'Apply With Ease',   d:"We advocate directly for you with our employer clients — ensuring your application receives the attention it deserves." },
       { n:'04', e:'🌟', t:'Full Journey Support', d:"We guide you through interviews, offer negotiations, and onboarding — until you're fully settled in your new role." },
     ];
     const steps = tab === 'employers' ? employer : seeker;
     return (
       <section className="how-section" id="how-it-works">
         <div className="section-header center reveal" ref={el => ref(el, 0)}>
           <div className="section-label center">Simple & Proven Process</div>
           <h2 className="section-title dark">How <em>It Works</em></h2>
           <p className="section-desc dark">Whether you're hiring or job hunting — our streamlined process delivers results with speed and precision.</p>
         </div>
         <div className="how-tabs">
           <button className={`how-tab${tab==='employers'?' active':''}`} onClick={() => setTab('employers')}>For Employers</button>
           <button className={`how-tab${tab==='seekers'?' active':''}`}   onClick={() => setTab('seekers')}>For Job Seekers</button>
         </div>
         <div className="how-steps">
           {steps.map(s => (
             <div key={s.n} className="how-step">
               <div className="how-bubble">
                 <span className="how-num">{s.n}</span>
                 <span className="how-emoji">{s.e}</span>
               </div>
               <h4>{s.t}</h4>
               <p>{s.d}</p>
             </div>
           ))}
         </div>
       </section>
     );
   }
   
   /* ══════════════════════════════════════════════════
      CV UPLOAD
      ══════════════════════════════════════════════════ */
   function CvUpload({ cvFile, setCvFile, required }) {
     const [dragOver, setDragOver] = useState(false);
     const inputRef = useRef(null);
   
     const handleFile = (file) => {
       if (!file) return;
       const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
       if (!allowed.includes(file.type)) { alert('Please upload a PDF or Word document (.pdf, .doc, .docx)'); return; }
       if (file.size > 5 * 1024 * 1024) { alert('File size must be under 5MB.'); return; }
       setCvFile(file);
     };
     const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };
     const formatSize = (bytes) => {
       if (bytes < 1024) return `${bytes} B`;
       if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
       return `${(bytes/(1024*1024)).toFixed(1)} MB`;
     };
   
     return (
       <div
         className={`cv-upload-zone${cvFile?' has-file':''}${dragOver?' drag-over':''}`}
         onDragOver={e => { e.preventDefault(); setDragOver(true); }}
         onDragLeave={() => setDragOver(false)}
         onDrop={onDrop}
         onClick={() => !cvFile && inputRef.current?.click()}
       >
         <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={e => handleFile(e.target.files[0])} style={{display:'none'}} />
         {cvFile ? (
           <>
             <div className="cv-upload-icon">✅</div>
             <div className="cv-file-name">
               📄 {cvFile.name}
               <button type="button" className="cv-remove-btn"
                 onClick={e => { e.stopPropagation(); setCvFile(null); if(inputRef.current) inputRef.current.value=''; }}
                 title="Remove">✕</button>
             </div>
             <div className="cv-file-size">{formatSize(cvFile.size)} — ready to submit</div>
           </>
         ) : (
           <>
             <div className="cv-upload-icon">📎</div>
             <div className="cv-upload-title">{required ? 'Attach Your CV / Resume (Required)' : 'Attach Your CV / Resume'}</div>
             <div className="cv-upload-sub">Click to browse or drag & drop your file here</div>
             <div className="cv-upload-types">Accepted: PDF, DOC, DOCX · Max 5MB</div>
             {!required && <div className="cv-upload-note">Optional — skip if not applicable</div>}
           </>
         )}
       </div>
     );
   }
   
   /* ══════════════════════════════════════════════════
      ADMIN PANEL
      ══════════════════════════════════════════════════ */
   function AdminPanel({ jobs, setJobs, onClose }) {
     const [authed,      setAuthed]      = useState(false);
     const [password,    setPassword]    = useState('');
     const [loginErr,    setLoginErr]    = useState('');
     const [adminTab,    setAdminTab]    = useState('enquiries');
     const [editJob,     setEditJob]     = useState(null);
     const [notice,      setNotice]      = useState('');
     const [noticeErr,   setNoticeErr]   = useState(false);
     const [enquiries,   setEnquiries]   = useState(loadEnquiries);
     const [expanded,    setExpanded]    = useState(null);
     const [search,      setSearch]      = useState('');
     const [emailSearch, setEmailSearch] = useState('');
     const [copied,      setCopied]      = useState('');
     const [emailFilter, setEmailFilter] = useState('all');
   
     const blankForm = { icon:'💼', badge:'full-time', title:'', location:'', industry:'', salary:'', description:'' };
     const [form, setForm] = useState(blankForm);
   
     const showNotice = (msg, err=false) => {
       setNotice(msg); setNoticeErr(err);
       setTimeout(() => setNotice(''), 3500);
     };
   
     const markRead = id => { const u = enquiries.map(e => e.id===id?{...e,read:true}:e); setEnquiries(u); saveEnquiries(u); };
     const deleteEnquiry = id => {
       if (!window.confirm('Delete this enquiry?')) return;
       const u = enquiries.filter(e => e.id!==id); setEnquiries(u); saveEnquiries(u);
       if (expanded===id) setExpanded(null); showNotice('Enquiry deleted.');
     };
     const clearAllEnquiries = () => {
       if (!window.confirm('Clear ALL enquiries? This cannot be undone.')) return;
       setEnquiries([]); saveEnquiries([]); setExpanded(null); showNotice('All enquiries cleared.');
     };
     const toggleExpand = id => { setExpanded(prev => prev===id?null:id); markRead(id); };
     const formatDate = iso => {
       const d = new Date(iso);
       return d.toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'})+' · '+d.toLocaleTimeString('en-NG',{hour:'2-digit',minute:'2-digit'});
     };
   
     const unreadCount = enquiries.filter(e => !e.read).length;
     const filteredEnquiries = enquiries.filter(e => {
       const q = search.toLowerCase();
       return !q || (e.email||'').toLowerCase().includes(q) || `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) || (e.subject||'').toLowerCase().includes(q);
     });
   
     const employerEmails = [...new Set(enquiries.filter(e=>e.role==='Employer / Hiring Manager').map(e=>e.email).filter(Boolean))];
     const hrEmails       = [...new Set(enquiries.filter(e=>e.role==='HR Professional').map(e=>e.email).filter(Boolean))];
     const allEmails      = [...new Set([...employerEmails,...hrEmails])];
   
     const copyEmails = (type) => {
       const list = type==='employer' ? employerEmails : type==='hr' ? hrEmails : allEmails;
       if (!list.length) return;
       navigator.clipboard.writeText(list.join(', ')).catch(()=>{
         const ta = document.createElement('textarea'); ta.value=list.join(', '); document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
       });
       setCopied(type); setTimeout(()=>setCopied(''),2500);
     };
   
     const downloadCSV = (type) => {
       const source = type==='employer' ? enquiries.filter(e=>e.role==='Employer / Hiring Manager')
         : type==='hr' ? enquiries.filter(e=>e.role==='HR Professional')
         : enquiries.filter(e=>e.role==='Employer / Hiring Manager'||e.role==='HR Professional');
       if (!source.length) { showNotice('No records to download.',true); return; }
       const headers = ['First Name','Last Name','Email','Phone','Role','Subject','Message','Date'];
       const rows = source.map(e=>[`"${(e.firstName||'').replace(/"/g,'""')}"`,`"${(e.lastName||'').replace(/"/g,'""')}"`,`"${(e.email||'').replace(/"/g,'""')}"`,`"${(e.phone||'').replace(/"/g,'""')}"`,`"${(e.role||'').replace(/"/g,'""')}"`,`"${(e.subject||'').replace(/"/g,'""')}"`,`"${(e.message||'').replace(/"/g,'""').replace(/\n/g,' ')}"`,`"${formatDate(e.timestamp)}"`].join(','));
       const csv = [headers.join(','),...rows].join('\n');
       const blob = new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a'); a.href=url; a.download=`jvg-${type}-emails-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
       showNotice('CSV downloaded!');
     };
   
     const toggleJob = id => { const u=jobs.map(j=>j.id===id?{...j,active:!j.active}:j); setJobs(u); saveJobs(u); showNotice('Job visibility updated.'); };
     const deleteJob = id => { if(!window.confirm('Delete this job posting?')) return; const u=jobs.filter(j=>j.id!==id); setJobs(u); saveJobs(u); showNotice('Job deleted.'); };
     const openEdit  = job => { setEditJob(job.id); setForm({icon:job.icon,badge:job.badge,title:job.title,location:job.location,industry:job.industry,salary:job.salary,description:job.description||''}); setAdminTab('edit'); };
     const openAdd   = () => { setEditJob(null); setForm(blankForm); setAdminTab('add'); };
     const saveJob   = e => {
       e.preventDefault();
       if (!form.title.trim()||!form.location.trim()||!form.salary.trim()) { showNotice('Please fill in Title, Location and Salary.',true); return; }
       let u;
       if (editJob!==null) { u=jobs.map(j=>j.id===editJob?{...j,...form}:j); showNotice('Job updated!'); }
       else { u=[...jobs,{...form,id:Date.now(),active:true}]; showNotice('New job added!'); }
       setJobs(u); saveJobs(u); setAdminTab('list'); setForm(blankForm); setEditJob(null);
     };
   
     const getDisplayEmails = () => {
       const pool = emailFilter==='employer'?employerEmails:emailFilter==='hr'?hrEmails:allEmails;
       const q = emailSearch.trim().toLowerCase();
       return q ? pool.filter(em=>em.toLowerCase().includes(q)) : pool;
     };
     const displayEmails = getDisplayEmails();
     const activeCount = jobs.filter(j=>j.active).length;
   
     if (!authed) return (
       <div className="admin-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
         <div className="admin-panel">
           <div className="admin-header">
             <div><h2>🔐 Admin Access</h2><p>JVG Recruitment Solutions — Admin Panel</p></div>
             <button className="admin-close-btn" onClick={onClose}>✕</button>
           </div>
           <div className="admin-login">
             <h3>Administrator Login</h3>
             <p>Enter your admin password to manage job postings and view employer enquiries.</p>
             <form className="admin-login-form" onSubmit={e=>{e.preventDefault();password===ADMIN_PASSWORD?(setAuthed(true),setLoginErr('')):setLoginErr('Incorrect password. Please try again.');}}>
               {loginErr && <div className="admin-login-error">⚠️ {loginErr}</div>}
               <div className="form-group">
                 <label>Password</label>
                 <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter admin password" autoFocus />
               </div>
               <button type="submit" className="btn-save" style={{width:'100%',justifyContent:'center'}}>🔓 Login</button>
               <div className="admin-login-hint">🔒 Authorised personnel only. For access issues, contact your system administrator.</div>
             </form>
           </div>
         </div>
       </div>
     );
   
     return (
       <div className="admin-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
         <div className="admin-panel">
           <div className="admin-header">
             <div><h2>⚙️ Admin Panel</h2><p>Manage job postings and employer & HR enquiries.</p></div>
             <button className="admin-close-btn" onClick={onClose}>✕</button>
           </div>
           <div className="admin-body">
             {notice && <div className={`admin-notice${noticeErr?' error':''}`}>{noticeErr?'⚠️':'✅'} {notice}</div>}
   
             <div className="admin-stats">
               <div className="admin-stat-card"><strong>{enquiries.filter(e=>e.role==='Employer / Hiring Manager').length}</strong><span>Employer Enquiries</span></div>
               <div className="admin-stat-card"><strong>{enquiries.filter(e=>e.role==='HR Professional').length}</strong><span>HR Enquiries</span></div>
               <div className="admin-stat-card" style={unreadCount>0?{borderColor:'var(--gold)',background:'rgba(200,160,80,.06)'}:{}}>
                 <strong style={unreadCount>0?{color:'var(--gold)'}:{}}>{unreadCount}</strong><span>Unread</span>
               </div>
               <div className="admin-stat-card"><strong>{activeCount}</strong><span>Active Jobs</span></div>
             </div>
   
             <div className="admin-tabs">
               <button className={`admin-tab${adminTab==='enquiries'?' active':''}`} onClick={()=>setAdminTab('enquiries')}>
                 📬 All Enquiries {unreadCount>0&&<span className="enq-badge">{unreadCount}</span>}
               </button>
               <button className={`admin-tab${adminTab==='emails'?' active':''}`} onClick={()=>setAdminTab('emails')}>
                 📧 Email Lists {allEmails.length>0&&<span className="enq-badge" style={{background:'var(--gold)',color:'var(--navy)'}}>{allEmails.length}</span>}
               </button>
               <button className={`admin-tab${adminTab==='list'?' active':''}`} onClick={()=>setAdminTab('list')}>📋 Job Listings</button>
               <button className={`admin-tab${adminTab==='add'||adminTab==='edit'?' active':''}`} onClick={openAdd}>
                 {adminTab==='edit'?'✏️ Editing Job':'➕ Add New Job'}
               </button>
             </div>
   
             {adminTab==='enquiries' && (
               <div className="enq-panel">
                 <div className="enq-toolbar">
                   <div className="enq-search-wrap">
                     <span className="enq-search-icon">🔍</span>
                     <input className="enq-search" type="text" placeholder="Search by name, email or subject…" value={search} onChange={e=>setSearch(e.target.value)} />
                     {search&&<button className="enq-search-clear" onClick={()=>setSearch('')}>✕</button>}
                   </div>
                   {enquiries.length>0&&<button className="enq-clear-all" onClick={clearAllEnquiries}>🗑️ Clear All</button>}
                 </div>
                 {filteredEnquiries.length===0&&(
                   <div className="enq-empty">
                     <div className="enq-empty-icon">{search?'🔍':'📭'}</div>
                     <p>{search?'No enquiries match your search.':'No enquiries yet.'}</p>
                     <span>{search?'Try a different search term.':'Employer and HR enquiries from the contact form will appear here.'}</span>
                   </div>
                 )}
                 <div className="enq-list">
                   {filteredEnquiries.map(enq=>(
                     <div key={enq.id} className={`enq-card${!enq.read?' enq-unread':''}${expanded===enq.id?' enq-expanded':''}`}>
                       <div className="enq-card-header" onClick={()=>toggleExpand(enq.id)}>
                         <div className="enq-avatar">{enq.firstName?.[0]?.toUpperCase()}{enq.lastName?.[0]?.toUpperCase()}</div>
                         <div className="enq-card-info">
                           <div className="enq-name">
                             {enq.firstName} {enq.lastName}
                             {!enq.read&&<span className="enq-new-dot" title="New">●</span>}
                             {enq.role&&<span className={`enq-role-tag ${enq.role==='HR Professional'?'enq-role-hr':'enq-role-employer'}`}>{enq.role==='HR Professional'?'🧑‍💼 HR':'🏢 Employer'}</span>}
                           </div>
                           <div className="enq-email-preview">📧 {enq.email}</div>
                           <div className="enq-meta-row">
                             <span className="enq-subject">📌 {enq.subject||'(no subject)'}</span>
                             <span className="enq-date">🕐 {formatDate(enq.timestamp)}</span>
                           </div>
                         </div>
                         <div className="enq-chevron">{expanded===enq.id?'▲':'▼'}</div>
                       </div>
                       {expanded===enq.id&&(
                         <div className="enq-card-body">
                           <div className="enq-detail-grid">
                             <div className="enq-detail-row"><span className="enq-detail-label">Full Name</span><span className="enq-detail-value">{enq.firstName} {enq.lastName}</span></div>
                             <div className="enq-detail-row"><span className="enq-detail-label">Email</span><span className="enq-detail-value"><a href={`mailto:${enq.email}`} className="enq-email-link">{enq.email}</a></span></div>
                             {enq.phone&&<div className="enq-detail-row"><span className="enq-detail-label">Phone</span><span className="enq-detail-value"><a href={`tel:${enq.phone}`} className="enq-email-link">{enq.phone}</a></span></div>}
                             {enq.role&&<div className="enq-detail-row"><span className="enq-detail-label">Role</span><span className="enq-detail-value">{enq.role}</span></div>}
                             {enq.cvFileName&&<div className="enq-detail-row"><span className="enq-detail-label">CV Attached</span><span className="enq-detail-value">📄 {enq.cvFileName} ({enq.cvFileSize})</span></div>}
                             <div className="enq-detail-row"><span className="enq-detail-label">Subject</span><span className="enq-detail-value">{enq.subject||'—'}</span></div>
                             <div className="enq-detail-row enq-detail-full"><span className="enq-detail-label">Message</span><div className="enq-message-box">{enq.message}</div></div>
                             <div className="enq-detail-row"><span className="enq-detail-label">Submitted</span><span className="enq-detail-value">{formatDate(enq.timestamp)}</span></div>
                           </div>
                           <div className="enq-card-actions">
                             <a href={`mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject||'')}`} className="btn-reply">✉️ Reply by Email</a>
                             {enq.phone&&<a href={`https://wa.me/${enq.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">💬 WhatsApp</a>}
                             <button className="btn-icon delete" title="Delete" onClick={()=>deleteEnquiry(enq.id)}>🗑️</button>
                           </div>
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
             )}
   
             {adminTab==='emails'&&(
               <div className="email-lists-panel">
                 <div className="email-summary-row">
                   <div className={`email-summary-card${emailFilter==='employer'?' active':''}`} onClick={()=>setEmailFilter('employer')}><span className="email-summary-icon">🏢</span><strong>{employerEmails.length}</strong><span>Employer Emails</span></div>
                   <div className={`email-summary-card${emailFilter==='hr'?' active':''}`} onClick={()=>setEmailFilter('hr')}><span className="email-summary-icon">🧑‍💼</span><strong>{hrEmails.length}</strong><span>HR Professional Emails</span></div>
                   <div className={`email-summary-card${emailFilter==='all'?' active':''}`} onClick={()=>setEmailFilter('all')}><span className="email-summary-icon">📋</span><strong>{allEmails.length}</strong><span>All Combined</span></div>
                 </div>
                 <div className="enq-search-wrap" style={{marginBottom:'14px'}}>
                   <span className="enq-search-icon">🔍</span>
                   <input className="enq-search" type="text" placeholder={`Search ${emailFilter==='all'?'all':emailFilter} emails…`} value={emailSearch} onChange={e=>setEmailSearch(e.target.value)} />
                   {emailSearch&&<button className="enq-search-clear" onClick={()=>setEmailSearch('')}>✕</button>}
                 </div>
                 {(emailFilter==='employer'||emailFilter==='all')&&(
                   <div className="email-group">
                     <div className="email-group-header">
                       <div className="email-group-title"><span>🏢</span><strong>Employer / Hiring Managers</strong><span className="email-count-badge">{employerEmails.length} email{employerEmails.length!==1?'s':''}</span></div>
                       {employerEmails.length>0&&<div className="email-group-actions">
                         <button className="btn-email-action copy" onClick={()=>copyEmails('employer')}>{copied==='employer'?'✅ Copied!':'📋 Copy'}</button>
                         <button className="btn-email-action download" onClick={()=>downloadCSV('employer')}>⬇️ CSV</button>
                         <a href={`mailto:?bcc=${employerEmails.join(',')}&subject=Update from JVG Recruitment Solutions`} className="btn-email-action mailto">✉️ Email All</a>
                       </div>}
                     </div>
                     {employerEmails.length===0?<div className="email-empty">📭 No employer emails yet.</div>:(
                       <div className="email-chip-list">
                         {(emailSearch?employerEmails.filter(em=>em.toLowerCase().includes(emailSearch.toLowerCase())):employerEmails).map(em=>(
                           <div key={em} className="email-chip employer-chip"><span className="email-chip-dot"/>{em}<button className="email-chip-copy" title="Copy" onClick={()=>{navigator.clipboard.writeText(em).catch(()=>{});showNotice(`Copied: ${em}`);}}>📋</button></div>
                         ))}
                       </div>
                     )}
                   </div>
                 )}
                 {(emailFilter==='hr'||emailFilter==='all')&&(
                   <div className="email-group" style={{marginTop:emailFilter==='all'?'18px':'0'}}>
                     <div className="email-group-header">
                       <div className="email-group-title"><span>🧑‍💼</span><strong>HR Professionals</strong><span className="email-count-badge" style={{background:'rgba(168,85,247,.12)',color:'#A855F7',borderColor:'rgba(168,85,247,.25)'}}>{hrEmails.length} email{hrEmails.length!==1?'s':''}</span></div>
                       {hrEmails.length>0&&<div className="email-group-actions">
                         <button className="btn-email-action copy" onClick={()=>copyEmails('hr')}>{copied==='hr'?'✅ Copied!':'📋 Copy'}</button>
                         <button className="btn-email-action download" onClick={()=>downloadCSV('hr')}>⬇️ CSV</button>
                         <a href={`mailto:?bcc=${hrEmails.join(',')}&subject=Update from JVG Recruitment Solutions`} className="btn-email-action mailto">✉️ Email All</a>
                       </div>}
                     </div>
                     {hrEmails.length===0?<div className="email-empty">📭 No HR professional emails yet.</div>:(
                       <div className="email-chip-list">
                         {(emailSearch?hrEmails.filter(em=>em.toLowerCase().includes(emailSearch.toLowerCase())):hrEmails).map(em=>(
                           <div key={em} className="email-chip hr-chip"><span className="email-chip-dot" style={{background:'#A855F7'}}/>{em}<button className="email-chip-copy" title="Copy" onClick={()=>{navigator.clipboard.writeText(em).catch(()=>{});showNotice(`Copied: ${em}`);}}>📋</button></div>
                         ))}
                       </div>
                     )}
                   </div>
                 )}
                 {emailFilter==='all'&&allEmails.length>0&&(
                   <div className="email-combined-actions">
                     <div className="email-combined-label">⚡ Combined Actions (All {allEmails.length} emails)</div>
                     <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                       <button className="btn-email-action copy" style={{padding:'10px 18px'}} onClick={()=>copyEmails('all')}>{copied==='all'?'✅ Copied All!':'📋 Copy All'}</button>
                       <button className="btn-email-action download" style={{padding:'10px 18px'}} onClick={()=>downloadCSV('all')}>⬇️ Full CSV</button>
                       <a href={`mailto:?bcc=${allEmails.join(',')}&subject=Update from JVG Recruitment Solutions`} className="btn-email-action mailto" style={{padding:'10px 18px'}}>✉️ Email Everyone</a>
                     </div>
                   </div>
                 )}
                 {allEmails.length===0&&<div className="enq-empty" style={{marginTop:'20px'}}><div className="enq-empty-icon">📭</div><p>No emails collected yet.</p><span>Employer and HR emails from the contact form will appear here.</span></div>}
               </div>
             )}
   
             {adminTab==='list'&&(
               <>
                 <div className="admin-job-list">
                   {jobs.length===0&&<div style={{textAlign:'center',padding:'32px',color:'var(--grey-mid)'}}>No jobs yet. Click "Add New Job" to get started.</div>}
                   {jobs.map(job=>(
                     <div key={job.id} className="admin-job-row" style={{opacity:job.active?1:0.5}}>
                       <div className="admin-job-row-icon">{job.icon}</div>
                       <div className="admin-job-row-info">
                         <div className="admin-job-row-title">{job.title}</div>
                         <div className="admin-job-row-meta">📍 {job.location} · 🏢 {job.industry} · 💰 {job.salary} · <span className={`job-badge ${job.badge}`} style={{fontSize:'10px'}}>{job.badge}</span> · {job.active?<span style={{color:'var(--green)',fontWeight:700}}>● Visible</span>:<span style={{color:'var(--grey-mid)',fontWeight:700}}>● Hidden</span>}</div>
                       </div>
                       <div className="admin-job-row-actions">
                         <button className={`btn-icon toggle${!job.active?' off':''}`} title={job.active?'Hide':'Show'} onClick={()=>toggleJob(job.id)}>{job.active?'👁️':'🙈'}</button>
                         <button className="btn-icon edit" title="Edit" onClick={()=>openEdit(job)}>✏️</button>
                         <button className="btn-icon delete" title="Delete" onClick={()=>deleteJob(job.id)}>🗑️</button>
                       </div>
                     </div>
                   ))}
                 </div>
                 <button className="btn-add-job" onClick={openAdd}>➕ Add New Job Posting</button>
               </>
             )}
   
             {(adminTab==='add'||adminTab==='edit')&&(
               <form className="job-form" onSubmit={saveJob}>
                 <h4>{adminTab==='edit'?'✏️ Edit Job Posting':'➕ Add New Job Posting'}</h4>
                 <div className="form-grid">
                   <div className="form-group"><label>Icon</label><select value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})}>{ICON_OPTIONS.map(ico=><option key={ico} value={ico}>{ico} {ico}</option>)}</select></div>
                   <div className="form-group"><label>Job Type</label><select value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}>{BADGE_OPTIONS.map(b=><option key={b.value} value={b.value}>{b.label}</option>)}</select></div>
                   <div className="form-group full"><label>Job Title *</label><input type="text" placeholder="e.g. Senior Accountant" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
                   <div className="form-group"><label>Location *</label><input type="text" placeholder="e.g. Abuja, FCT" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required /></div>
                   <div className="form-group"><label>Industry / Department</label><input type="text" placeholder="e.g. Finance / Banking" value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})} /></div>
                   <div className="form-group full">
                     <label>Salary / Compensation *</label>
                     <div className="salary-input-wrap">
                       <span className="salary-prefix">₦</span>
                       <input
                         type="text"
                         className="salary-input"
                         placeholder="e.g. 150,000 – 220,000/mo"
                         value={form.salary.replace(/^₦\s*/,'')}
                         onChange={e=>setForm({...form,salary:'₦'+e.target.value})}
                         required
                       />
                     </div>
                   </div>
                   <div className="form-group full"><label>Job Description</label><textarea placeholder="Brief description of the role and responsibilities..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
                 </div>
                 <div className="form-actions">
                   <button type="submit" className="btn-save">💾 {adminTab==='edit'?'Save Changes':'Add Job'}</button>
                   <button type="button" className="btn-cancel" onClick={()=>{setAdminTab('list');setForm(blankForm);setEditJob(null);}}>Cancel</button>
                   {adminTab==='edit'&&<button type="button" className="btn-icon delete" style={{width:'auto',padding:'0 14px',borderRadius:'var(--r-xs)',fontSize:'13px',gap:'6px',display:'flex',alignItems:'center'}} onClick={()=>{deleteJob(editJob);setAdminTab('list');}}>🗑️ Delete</button>}
                 </div>
               </form>
             )}
           </div>
         </div>
       </div>
     );
   }
   
   /* ══════════════════════════════════════════════════
      JOBS PREVIEW (on main page)
      ══════════════════════════════════════════════════ */
   function Jobs({ jobs, onViewAll }) {
     const ref = useReveal();
     const visible = jobs.filter(j => j.active);
     const preview = visible.slice(0, 3);
     const scroll = () => window.__goToContact&&window.__goToContact();
   
     return (
       <section className="jobs-section" id="jobs" style={{position:'relative'}}>
         <div className="section-header reveal" ref={el => ref(el, 0)} style={{position:'relative',zIndex:1}}>
           <div className="section-label">Live Opportunities</div>
           <h2 className="section-title">Featured <em>Job Openings</em></h2>
           <p className="section-desc">Explore our current vacancies across Nigeria. New roles added regularly — follow us on Facebook for instant alerts.</p>
         </div>
         <div className="jobs-grid" style={{position:'relative',zIndex:1}}>
           {preview.length===0?(
             <div className="jobs-empty">
               <div className="jobs-empty-icon">🔍</div>
               <p style={{color:'rgba(255,255,255,.5)',fontSize:'16px'}}>No openings at the moment. Check back soon or follow us on Facebook.</p>
             </div>
           ):preview.map((job,i)=>(
             <div key={job.id} className={`job-card reveal reveal-d${(i%3)+1}`} ref={el=>ref(el,i+1)}>
               <div className="job-card-top">
                 <div className="job-icon">{job.icon}</div>
                 <span className={`job-badge ${job.badge}`}>{BADGE_OPTIONS.find(b=>b.value===job.badge)?.label||job.badge}</span>
               </div>
               <div className="job-title">{job.title}</div>
               <div className="job-meta">
                 <span className="job-meta-item">📍 {job.location}</span>
                 <span className="job-meta-item">🏢 {job.industry}</span>
               </div>
               {job.description&&<div className="job-desc-text">{job.description}</div>}
               <div className="job-salary">{job.salary}</div>
               <button className="job-apply-btn" onClick={scroll}>Apply Now →</button>
             </div>
           ))}
         </div>

         {/* View All Jobs CTA */}
         <div className="jobs-view-all-cta reveal" ref={el=>ref(el,4)} style={{position:'relative',zIndex:1}}>
           <div className="jobs-view-all-inner">
             <div className="jobs-view-all-text">
               <div className="jobs-view-all-count">
                 <span className="jobs-count-num">{visible.length}</span>
                 <span className="jobs-count-label">Active Openings</span>
               </div>
               <div>
                 <h3>See All Available Positions</h3>
                 <p>Browse our complete list of current vacancies across Nigeria — updated daily with new opportunities.</p>
               </div>
             </div>
             <button className="jobs-view-all-btn" onClick={onViewAll}>
               <span>View All Jobs</span>
               <span className="jobs-view-all-arrow">
                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                   <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </span>
             </button>
           </div>
         </div>

         <div className="jobs-footer" style={{position:'relative',zIndex:1}} ref={el=>ref(el,5)}>
           <p>More openings posted daily. Follow us on Facebook for instant alerts.</p>
           <div className="jobs-footer-btns">
             <a href="https://www.facebook.com/jvgbusinesssolutionshroutsourcing" target="_blank" rel="noopener noreferrer" className="fb-btn">📘 Follow on Facebook</a>
             <button className="btn-primary" onClick={()=>window.__goToContact&&window.__goToContact()}><span>📄 Submit Your CV</span></button>
           </div>
         </div>
       </section>
     );
   }

   /* ══════════════════════════════════════════════════
      JOBS FULL PAGE
      ══════════════════════════════════════════════════ */
   function JobsPage({ jobs, onBack }) {
     useEffect(() => { window.scrollTo(0, 0); }, []);
     const [filter, setFilter] = useState('all');
     const [search, setSearch] = useState('');
     const scroll = () => window.__goToContact&&window.__goToContact();

     const visible = jobs.filter(j => j.active);
     const filtered = visible.filter(j => {
       const matchBadge = filter === 'all' || j.badge === filter;
       const q = search.trim().toLowerCase();
       const matchSearch = !q ||
         j.title.toLowerCase().includes(q) ||
         j.location.toLowerCase().includes(q) ||
         (j.industry || '').toLowerCase().includes(q) ||
         (j.description || '').toLowerCase().includes(q);
       return matchBadge && matchSearch;
     });

     const handleSearchChange = (e) => setSearch(e.target.value);
     const handleSearchClear = () => setSearch('');

     return (
       <div className="full-page">
         {/* Page Hero */}
         <div className="full-page-hero jobs-page-hero">
           <div className="full-page-hero-bg">
             <div className="hero-orb hero-orb-1" style={{opacity:0.4}} />
             <div className="hero-orb hero-orb-2" style={{opacity:0.4}} />
             <StarField />
           </div>
           <div className="full-page-hero-content">
             <button className="back-btn" onClick={onBack}>← Back to Home</button>
             <div className="full-page-eyebrow">
               <span className="hero-eyebrow-line" />
               <span>Live Opportunities Across Nigeria</span>
               <span className="hero-eyebrow-dot" />
             </div>
             <h1 className="full-page-title">
               Featured <em>Job Openings</em>
             </h1>
             <p className="full-page-subtitle">
               Browse our complete list of current vacancies. Pre-screened roles across every Nigerian state — updated daily with new opportunities.
             </p>
             <div className="full-page-stats">
               <div className="full-page-stat"><strong>{visible.length}</strong><span>Active Roles</span></div>
               <div className="full-page-stat"><strong>{[...new Set(visible.map(j=>j.industry))].length}</strong><span>Industries</span></div>
               <div className="full-page-stat"><strong>{[...new Set(visible.map(j=>j.location))].length}</strong><span>Locations</span></div>
               <div className="full-page-stat"><strong>{visible.filter(j=>j.badge==='remote').length}</strong><span>Remote Roles</span></div>
             </div>
           </div>
         </div>

         {/* Filters */}
         <div className="jobs-page-filters-bar">
           <div className="jobs-page-search-wrap">
             <span className="jobs-page-search-icon">🔍</span>
             <input
               className="jobs-page-search"
               type="text"
               placeholder="Search by title, location or industry…"
               value={search}
               onChange={handleSearchChange}
             />
             {search && <button className="jobs-page-search-clear" onClick={handleSearchClear}>✕</button>}
           </div>
           <div className="jobs-page-filter-tabs">
             {['all','full-time','contract','remote','part-time'].map(f => (
               <button
                 key={f}
                 className={`jobs-page-filter-tab${filter===f?' active':''}`}
                 onClick={() => setFilter(f)}
               >
                 {f === 'all' ? 'All Roles' : BADGE_OPTIONS.find(b=>b.value===f)?.label || f}
               </button>
             ))}
           </div>
         </div>

         {/* Jobs Grid */}
         <div className="jobs-page-body">
           {filtered.length === 0 ? (
             <div className="jobs-empty" style={{background:'var(--navy-deep)', padding:'80px 20px'}}>
               <div className="jobs-empty-icon">🔍</div>
               <p style={{color:'rgba(255,255,255,.5)'}}>No roles match your search. Try adjusting your filters.</p>
             </div>
           ) : (
             <div className="jobs-page-grid">
               {filtered.map((job, i) => (
                 <div key={job.id} className="job-card-full" style={{opacity:1, transform:'none'}}>
                   <div className="job-card-full-header">
                     <div className="job-icon">{job.icon}</div>
                     <span className={`job-badge ${job.badge}`}>{BADGE_OPTIONS.find(b=>b.value===job.badge)?.label||job.badge}</span>
                   </div>
                   <div className="job-title">{job.title}</div>
                   <div className="job-meta">
                     <span className="job-meta-item">📍 {job.location}</span>
                     <span className="job-meta-item">🏢 {job.industry}</span>
                   </div>
                   {job.description && <div className="job-desc-text">{job.description}</div>}
                   <div style={{flex:1}} />
                   <div className="job-salary">{job.salary}</div>
                   <button className="job-apply-btn-full" onClick={scroll}>
                     Apply Now
                     <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{marginLeft:'6px'}}>
                       <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </button>
                 </div>
               ))}
             </div>
           )}
         </div>

         {/* Footer CTA */}
         <div className="full-page-cta">
           <div className="full-page-container" style={{textAlign:'center'}}>
             <h2 style={{fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'var(--ivory)', marginBottom:'16px'}}>Don't See the <em style={{color:'var(--gold-mid)'}}>Right Role?</em></h2>
             <p style={{color:'rgba(255,255,255,.5)', marginBottom:'36px'}}>Submit your CV and we'll match you to opportunities as they arise — across every Nigerian state.</p>
             <div style={{display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap'}}>
               <button className="btn-primary" onClick={scroll}><span>📄 Submit Your CV</span></button>
               <button className="btn-secondary" onClick={onBack}><span>← Back to Home</span></button>
             </div>
           </div>
         </div>
       </div>
     );
   }
   
   /* ══════════════════════════════════════════════════
      TESTIMONIALS
      ══════════════════════════════════════════════════ */
   function Testimonials() {
     const ref = useReveal();
     const list = [
       { init:'AO', name:'Adaeze Okafor',  role:'HR Manager, FinTech Startup — Lagos',       quote:'JVG Recruitment Solutions filled three critical roles for us in under two weeks. The quality of candidates was exceptional and their professionalism throughout was outstanding.' },
       { init:'TI', name:'Tobi Ibrahim',   role:'Placed Candidate — Sales Executive, Abuja', quote:'After months of searching on my own, JVG matched me with my dream role within three weeks. They guided me through every step — from my CV to the final interview. Forever grateful.' },
       { init:'EM', name:'Emmanuel Musa',  role:'Operations Director, Construction Firm',     quote:'We outsourced our entire hiring process for our Abuja expansion to JVG. They recruited 12 qualified staff in 30 days. Seamless, efficient, and worth every naira.' },
     ];
     return (
       <section className="testi-section" id="testimonials">
         <div className="section-header center reveal" ref={el=>ref(el,0)}>
           <div className="section-label center">Client Success Stories</div>
           <h2 className="section-title dark">What Our <em>Clients Say</em></h2>
           <p className="section-desc dark">Trusted by employers and job seekers across Nigeria. Here's what they say about partnering with JVG.</p>
         </div>
         <div className="testi-grid">
           {list.map((t,i)=>(
             <div key={t.name} className={`testi-card reveal reveal-d${i+1}`} ref={el=>ref(el,i+1)}>
               <div className="testi-mark">"</div>
               <div className="testi-stars">★★★★★</div>
               <blockquote>"{t.quote}"</blockquote>
               <div className="testi-author">
                 <div className="testi-avatar">{t.init}</div>
                 <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
               </div>
             </div>
           ))}
         </div>
       </section>
     );
   }
   
   /* ══════════════════════════════════════════════════
      CTA BANNER
      ══════════════════════════════════════════════════ */
   function CtaBanner() {
     return (
       <div className="cta-banner">
         <div className="cta-banner-bg" />
         <div className="cta-inner">
           <div className="section-label center" style={{marginBottom:'16px'}}>Take the Next Step</div>
           <div className="gold-divider" />
           <h2>Ready to Find the <em>Right Talent</em>?</h2>
           <p>Post a vacancy or submit your resume today. Our consultants are ready to connect the right people with the right opportunities — across Nigeria.</p>
           <div className="cta-btns">
             <button className="btn-primary" onClick={()=>window.__goToContact&&window.__goToContact()}><span>📋 Post a Job Vacancy</span></button>
             <button className="btn-secondary" onClick={()=>window.__goToContact&&window.__goToContact()}><span>📄 Submit Your Resume</span></button>
           </div>
         </div>
       </div>
     );
   }
   
   /* ══════════════════════════════════════════════════
      EMAILJS CONFIG
      ══════════════════════════════════════════════════ */
   const EMAILJS_SERVICE    = 'service_oai19oi';
   const EMAILJS_TEMPLATE   = 'template_5yoz7uv';
   const EMAILJS_SERVICE_2  = 'service_thy1736';
   const EMAILJS_TEMPLATE_2 = 'template_b05p02z';
   const EMAILJS_PUBLIC_KEY_2 = 'd26MprEm9Q41eC6-g';
   const CV_REQUIRED_ROLES  = ['Job Seeker / Candidate'];

   /* ══════════════════════════════════════════════════
      CONTACT FULL PAGE
      ══════════════════════════════════════════════════ */
   function ContactPage({ onBack }) {
     useEffect(() => { window.scrollTo(0, 0); }, []);
     const ref = useReveal();

     const info = [
       { icon:'📧', label:'Email Us', val:'info@jvgrecruitmentsolutions.com', href:'mailto:info@jvgrecruitmentsolutions.com', sub:'We reply within 24 hours on business days' },
       { icon:'📞', label:'Call / WhatsApp', val:'+234 704 745 3599', href:'tel:+2347047453599', sub:'Mon – Fri, 8am – 6pm WAT' },
       { icon:'📍', label:'Our Location', val:'Abuja, Federal Capital Territory, Nigeria', href:'https://maps.google.com/?q=Abuja+FCT+Nigeria', sub:'Serving clients across all Nigerian states' },
       { icon:'📘', label:'Facebook', val:'@jvgbusinesssolutionshroutsourcing', href:'https://www.facebook.com/jvgbusinesssolutionshroutsourcing', sub:'Daily job alerts & recruitment updates' },
     ];

     const faqs = [
       { q:'How quickly can you fill a role?', a:'For most positions, we can present pre-screened candidates within 3–7 business days. Urgent roles can often be filled faster thanks to our active talent pipeline.' },
       { q:'What industries do you recruit for?', a:'We recruit across all sectors — hospitality, finance, engineering, healthcare, marketing, administration, and more. If you need talent, we can find it.' },
       { q:'What locations do you cover?', a:'We operate nationwide. While our headquarters is in Abuja, we place candidates and serve clients across every Nigerian state including Lagos, Port Harcourt, Kano, and beyond.' },
       { q:'How does the recruitment process work?', a:'We start with a briefing call to understand your needs, then source and screen candidates, coordinate interviews, and support all the way through to onboarding.' },
     ];

     const [sent,    setSent]    = useState(false);
     const [sending, setSending] = useState(false);
     const [sendErr, setSendErr] = useState('');
     const [cvFile,  setCvFile]  = useState(null);
     const [cvErr,   setCvErr]   = useState('');
     const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', role:'', subject:'', message:'' });
     const formatSize = (b) => b<1024?`${b} B`:b<1048576?`${(b/1024).toFixed(1)} KB`:`${(b/1048576).toFixed(1)} MB`;
     const toBase64 = (file) => new Promise((res,rej) => { const r=new FileReader(); r.onload=()=>res(r.result.split(',')[1]); r.onerror=rej; r.readAsDataURL(file); });
     const isCvRequired = CV_REQUIRED_ROLES.includes(form.role);
     const handleChange = e => { setForm({...form,[e.target.name]:e.target.value}); if(e.target.name==='role') setCvErr(''); };
     const handleSubmit = async (e) => {
       e.preventDefault(); setSendErr(''); setCvErr('');
       if (isCvRequired && !cvFile) { setCvErr('Please attach your CV / Resume to continue.'); return; }
       setSending(true);
       try {
         let attachmentData='', attachmentName='';
         if (cvFile) { attachmentData = await toBase64(cvFile); attachmentName = cvFile.name; }
         const params = { from_name:`${form.firstName} ${form.lastName}`, from_email:form.email, phone:form.phone||'Not provided', role:form.role, subject:form.subject, message:form.message, cv_filename:attachmentName||'No CV attached', attachment_name:attachmentName, attachment:attachmentData };
         await Promise.all([emailjs.send(EMAILJS_SERVICE,EMAILJS_TEMPLATE,params),emailjs.send(EMAILJS_SERVICE_2,EMAILJS_TEMPLATE_2,params,EMAILJS_PUBLIC_KEY_2)]);
         if (form.role==='Employer / Hiring Manager'||form.role==='HR Professional') {
           const entry = { id:Date.now(), timestamp:new Date().toISOString(), firstName:form.firstName, lastName:form.lastName, email:form.email, phone:form.phone, role:form.role, subject:form.subject, message:form.message, cvFileName:cvFile?cvFile.name:null, cvFileSize:cvFile?formatSize(cvFile.size):null, read:false };
           saveEnquiries([entry,...loadEnquiries()]);
         }
         setSent(true); setForm({firstName:'',lastName:'',email:'',phone:'',role:'',subject:'',message:''}); setCvFile(null);
         setTimeout(()=>setSent(false),6000);
       } catch(err) { console.error('EmailJS error:',err); setSendErr('Something went wrong. Please try again or email us directly at info@jvgrecruitmentsolutions.com'); }
       finally { setSending(false); }
     };

     return (
       <div className="full-page">
         <div className="full-page-hero contact-page-hero">
           <div className="full-page-hero-bg">
             <div className="hero-orb hero-orb-1" style={{opacity:0.45}} />
             <div className="hero-orb hero-orb-2" style={{opacity:0.4}} />
             <StarField />
           </div>
           <div className="full-page-hero-content">
             <button className="back-btn" onClick={onBack}>← Back to Home</button>
             <div className="full-page-eyebrow">
               <span className="hero-eyebrow-line" />
               <span>We'd Love to Hear From You</span>
               <span className="hero-eyebrow-dot" />
             </div>
             <h1 className="full-page-title">
               Get In <em>Touch</em> With Us
             </h1>
             <p className="full-page-subtitle">
               Whether you're a business looking to hire, a professional seeking your next opportunity, or you want to explore HR outsourcing — our team is ready to help.
             </p>
             <div className="full-page-stats">
               <div className="full-page-stat"><strong>24hr</strong><span>Email Response</span></div>
               <div className="full-page-stat"><strong>36+</strong><span>States Covered</span></div>
               <div className="full-page-stat"><strong>96%</strong><span>Satisfaction Rate</span></div>
               <div className="full-page-stat"><strong>500+</strong><span>Placements Made</span></div>
             </div>
           </div>
         </div>

         <div className="contact-page-cards-section">
           <div className="full-page-container">
             <div className="reveal" ref={el=>ref(el,0)} style={{textAlign:'center',marginBottom:'56px'}}>
               <div className="section-label center" style={{display:'flex',justifyContent:'center',color:'var(--gold-mid)'}}>Reach Us Directly</div>
               <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(1.8rem,3vw,2.6rem)',color:'var(--ivory)',fontWeight:600,marginBottom:'12px'}}>Every Way to <em style={{color:'var(--gold-mid)',fontStyle:'italic'}}>Connect</em></h2>
               <p style={{color:'rgba(255,255,255,.45)',fontSize:'15px',maxWidth:'480px',margin:'0 auto',fontWeight:300}}>Pick the channel that works best for you — we're available and responsive across all of them.</p>
             </div>
             <div className="contact-page-cards-grid">
               {info.map((c, i) => (
                 <a key={c.label} href={c.href} target={c.href.startsWith('http')?'_blank':undefined} rel="noopener noreferrer"
                    className={`contact-page-card reveal reveal-d${(i%2)+1}`} ref={el=>ref(el,i+1)}>
                   <div className="contact-page-card-icon">{c.icon}</div>
                   <div className="contact-page-card-body">
                     <div className="contact-page-card-label">{c.label}</div>
                     <div className="contact-page-card-val">{c.val}</div>
                     <div className="contact-page-card-sub">{c.sub}</div>
                   </div>
                   <div className="contact-page-card-arrow">→</div>
                 </a>
               ))}
             </div>
           </div>
         </div>

         <div className="full-page-section" style={{background:'var(--ivory)',padding:'72px 6%'}}>
           <div className="full-page-container">
             <div className="contact-page-info-grid">
               <div className="reveal" ref={el=>ref(el,10)}>
                 <div className="section-label" style={{color:'var(--gold)'}}>Business Hours</div>
                 <h2 className="section-title dark" style={{marginBottom:'32px'}}>When We're <em>Available</em></h2>
                 <div className="contact-hours-list">
                   {[
                     { day:'Monday – Friday', hours:'8:00 AM – 6:00 PM WAT', open:true },
                     { day:'Saturday',        hours:'9:00 AM – 2:00 PM WAT', open:true },
                     { day:'Sunday',          hours:'Closed',                open:false },
                   ].map(h => (
                     <div key={h.day} className="contact-hours-row">
                       <span className="contact-hours-day">{h.day}</span>
                       <span className={`contact-hours-time ${h.open?'open':'closed'}`}>{h.hours}</span>
                     </div>
                   ))}
                 </div>
                 <div className="contact-hours-note">
                   <span>💬</span>
                   <p>WhatsApp messages are responded to outside business hours when possible. Urgent hiring needs? Send us a message and we'll prioritise your request.</p>
                 </div>
               </div>
               <div className="reveal reveal-d2" ref={el=>ref(el,11)}>
                 <div className="section-label" style={{color:'var(--gold)'}}>Our Reach</div>
                 <h2 className="section-title dark" style={{marginBottom:'32px'}}>We Serve <em>Nationwide</em></h2>
                 <div className="contact-reach-grid">
                   {['Abuja FCT','Lagos','Port Harcourt','Kano','Ibadan','Enugu','Kaduna','Benin City','Aba','Onitsha','Warri','Jos'].map(city => (
                     <div key={city} className="contact-reach-chip">
                       <span className="contact-reach-dot" />
                       {city}
                     </div>
                   ))}
                   <div className="contact-reach-chip contact-reach-more">+ All Nigerian States</div>
                 </div>
               </div>
             </div>
           </div>
         </div>

         <div className="full-page-section" style={{background:'var(--navy-deep)',padding:'72px 6%'}}>
           <div className="full-page-container">
             <div className="reveal" ref={el=>ref(el,20)} style={{textAlign:'center',marginBottom:'56px'}}>
               <div className="section-label center" style={{display:'flex',justifyContent:'center'}}>Quick Answers</div>
               <h2 className="section-title" style={{textAlign:'center'}}>Frequently Asked <em>Questions</em></h2>
             </div>
             <div className="contact-faq-grid">
               {faqs.map((faq, i) => (
                 <div key={faq.q} className={`contact-faq-card reveal reveal-d${(i%2)+1}`} ref={el=>ref(el,21+i)}>
                   <div className="contact-faq-q">{faq.q}</div>
                   <div className="contact-faq-a">{faq.a}</div>
                 </div>
               ))}
             </div>
           </div>
         </div>

         {/* ── Contact Form Section — light card on dark bg ── */}
         <div className="full-page-section" style={{background:'var(--navy-deep)',padding:'72px 6%'}} id="contact-form">
           <div className="full-page-container">
             <div className="contact-page-form-grid">
               <div className="reveal" ref={el=>ref(el,30)}>
                 <div className="section-label" style={{color:'var(--gold)'}}>Send a Message</div>
                 <h2 className="section-title" style={{marginBottom:'16px'}}>We'd Love to <em>Hear From You</em></h2>
                 <p style={{color:'rgba(255,255,255,.45)',fontSize:'14px',lineHeight:'1.8',marginBottom:'32px',fontWeight:300}}>Fill in the form and we'll get back to you within 24 hours. For urgent enquiries, WhatsApp us directly.</p>
                 <div className="contact-cta-links">
                   <a href="tel:+2347047453599" className="contact-cta-item">
                     <span>📞</span><span>+234 704 745 3599</span>
                   </a>
                   <a href="mailto:info@jvgrecruitmentsolutions.com" className="contact-cta-item">
                     <span>📧</span><span>info@jvgrecruitmentsolutions.com</span>
                   </a>
                   <a href="https://wa.me/2347047453599" target="_blank" rel="noopener noreferrer" className="contact-cta-item whatsapp">
                     <span>💬</span><span>WhatsApp Us Now</span>
                   </a>
                 </div>
               </div>

               {/* ── KEY FIX: use dark-form class (now renders as white card) — NO inline style override ── */}
               <div className="contact-form-wrap dark-form reveal reveal-d1" ref={el=>ref(el,31)}>
                 <div className="form-title">Send Us a Message</div>
                 <p className="form-sub">For job postings, CV submissions, or general enquiries — fill in the form below.</p>
                 {sendErr&&<div style={{background:'rgba(220,38,38,.12)',color:'#DC2626',border:'1px solid rgba(220,38,38,.2)',borderRadius:'4px',padding:'13px 16px',fontSize:'14px',marginBottom:'18px',lineHeight:'1.5'}}>⚠️ {sendErr}</div>}
                 <form onSubmit={handleSubmit} className="contact-form">
                   <div className="form-row">
                     <div className="form-group"><label>First Name</label><input type="text" name="firstName" placeholder="e.g. Chioma" value={form.firstName} onChange={handleChange} required /></div>
                     <div className="form-group"><label>Last Name</label><input type="text" name="lastName" placeholder="e.g. Obi" value={form.lastName} onChange={handleChange} required /></div>
                   </div>
                   <div className="form-group"><label>Email Address</label><input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required /></div>
                   <div className="form-group"><label>Phone Number</label><input type="tel" name="phone" placeholder="+234 XXX XXX XXXX" value={form.phone} onChange={handleChange} /></div>
                   <div className="form-group">
                     <label>I am a...</label>
                     <select name="role" value={form.role} onChange={handleChange} required>
                       <option value="">Select your role</option>
                       <option>Employer / Hiring Manager</option>
                       <option>Job Seeker / Candidate</option>
                       <option>HR Professional</option>
                       <option>Other</option>
                     </select>
                   </div>
                   <div className="form-group"><label>Subject</label><input type="text" name="subject" placeholder="e.g. Job Posting, CV Submission" value={form.subject} onChange={handleChange} required /></div>
                   <div className="form-group"><label>Message</label><textarea name="message" placeholder="Tell us what you're looking for..." value={form.message} onChange={handleChange} required /></div>
                   <div className="form-group">
                     <label>
                       Attach CV / Resume
                       {isCvRequired?<span style={{color:'#DC2626',marginLeft:'4px',fontWeight:'800'}}>*</span>:<span style={{color:'var(--grey-mid)',marginLeft:'6px',fontWeight:'400',fontSize:'11px',textTransform:'none',letterSpacing:0}}>(optional)</span>}
                     </label>
                     <CvUpload cvFile={cvFile} setCvFile={file=>{setCvFile(file);if(file)setCvErr('');}} required={isCvRequired} />
                     {cvErr&&<div style={{color:'#DC2626',fontSize:'12px',fontWeight:'600',marginTop:'6px',display:'flex',alignItems:'center',gap:'5px'}}>⚠️ {cvErr}</div>}
                   </div>
                   <button type="submit" className={`form-submit${sent?' success':''}${sending?' sending':''}`} disabled={sent||sending}>
                     {sent?'✅ Message Sent! We\'ll be in touch shortly.':sending?'⏳ Sending…':'📩 Send Message'}
                   </button>
                 </form>
               </div>
             </div>
           </div>
         </div>

         <div className="full-page-cta">
           <div className="full-page-container" style={{textAlign:'center'}}>
             <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(1.8rem,3.5vw,2.8rem)',color:'var(--ivory)',marginBottom:'16px'}}>We Look Forward to <em style={{color:'var(--gold-mid)'}}>Hearing From You</em></h2>
             <p style={{color:'rgba(255,255,255,.5)',marginBottom:'36px',fontSize:'16px',maxWidth:'440px',margin:'0 auto 36px'}}>Our team responds promptly. Reach out today and let's build something great together.</p>
             <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
               <button className="btn-primary" onClick={onBack}><span>← Back to Home</span></button>
               <a href="https://wa.me/2347047453599" target="_blank" rel="noopener noreferrer" className="btn-whatsapp-standalone">💬 WhatsApp Us Now</a>
             </div>
           </div>
         </div>
       </div>
     );
   }

   /* ══════════════════════════════════════════════════
      CONTACT (home page minimal section)
      ══════════════════════════════════════════════════ */
   function Contact({ onViewDetails }) {
     const ref = useReveal();
     return (
       <section className="contact-section-minimal" id="contact">
         <div className="contact-minimal-inner">
           <div className="reveal" ref={el=>ref(el,0)}>
             <div className="section-label" style={{textAlign:'center'}}>Get In Touch</div>
             <h2 className="section-title" style={{textAlign:'center',color:'var(--ivory)'}}>Let's <em>Work Together</em></h2>
             <p className="section-desc" style={{textAlign:'center',maxWidth:'520px',margin:'0 auto 40px'}}>
               Whether you're hiring, seeking your next opportunity, or exploring HR outsourcing — our team is ready. Reach out through the link below.
             </p>
           </div>
           <div className="contact-minimal-cards reveal reveal-d1" ref={el=>ref(el,1)}>
             <div className="contact-minimal-card">
               <div className="contact-minimal-icon">📧</div>
               <div className="contact-minimal-label">Email</div>
               <div className="contact-minimal-val">info@jvgrecruitmentsolutions.com</div>
             </div>
             <div className="contact-minimal-card">
               <div className="contact-minimal-icon">📞</div>
               <div className="contact-minimal-label">Call / WhatsApp</div>
               <div className="contact-minimal-val">+234 704 745 3599</div>
             </div>
             <div className="contact-minimal-card">
               <div className="contact-minimal-icon">📍</div>
               <div className="contact-minimal-label">Location</div>
               <div className="contact-minimal-val">Abuja, FCT, Nigeria</div>
             </div>
           </div>
           <div className="contact-minimal-cta reveal reveal-d2" ref={el=>ref(el,2)}>
             <button className="contact-open-btn" onClick={onViewDetails}>
               <div className="contact-open-btn-content">
                 <div className="contact-open-btn-icon">✉️</div>
                 <div className="contact-open-btn-text">
                   <span className="contact-open-btn-title">Open Full Contact Page</span>
                   <span className="contact-open-btn-sub">Send a message, view our details, hours &amp; FAQ</span>
                 </div>
               </div>
               <div className="contact-open-btn-arrow">
                 <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                   <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
             </button>
           </div>
         </div>
       </section>
     );
   }

   /* ══════════════════════════════════════════════════
      FOOTER
      ══════════════════════════════════════════════════ */
   function Footer({ secretTap }) {
     const cols = {
       'Our Services': [['Recruitment & Staffing','#services'],['HR Outsourcing','#services'],['Hotel Staffing','#services'],['Job Placement','#services'],['Post a Job','#contact']],
       'Quick Links':  [['About Us','#about'],['Why Choose JVG','#why-jvg'],['How It Works','#how-it-works'],['Job Openings','#jobs'],['Contact Us','#contact']],
       'Industries':   [['Hotels & Hospitality','#jobs'],['Finance & Banking','#jobs'],['Engineering','#jobs'],['Sales & Marketing','#jobs'],['Healthcare','#jobs']],
     };
     return (
       <footer className="footer">
         <div className="footer-grid">
           <div>
             <a href="#home" className="nav-logo" style={{marginBottom:'4px',display:'inline-flex'}}>
               <div className="nav-logo-mark">JVG</div>
               <div><span className="nav-logo-name">JVG Recruitment Solutions</span><span className="nav-logo-sub">Employment Solutions Nigeria</span></div>
             </a>
             <p className="footer-brand-desc">Connecting employers with performance-ready talent across Nigeria. Specialists in hotel staffing, corporate recruitment, and HR outsourcing for businesses that can't afford hiring mistakes.</p>
             <span className="footer-tagline">✦ Pre-Vetted Staff. Delivered in Days.</span>
           </div>
           {Object.entries(cols).map(([heading,links])=>(
             <div className="footer-col" key={heading}>
               <h6>{heading}</h6>
               <ul>{links.map(([label,href])=><li key={label}><a href={href}>{label}</a></li>)}</ul>
             </div>
           ))}
         </div>
         <div className="footer-bottom">
           <p>{secretTap} {new Date().getFullYear()} JVG Recruitment Solutions. All rights reserved.</p>
           <p>Recruitment Agency Nigeria <span className="gold-dot">·</span> Hotel Staffing Abuja <span className="gold-dot">·</span> HR Outsourcing Nigeria</p>
         </div>
       </footer>
     );
   }
   
   /* ══════════════════════════════════════════════════
      HIDDEN ADMIN ACCESS
      ══════════════════════════════════════════════════ */
   const SECRET_SEQUENCE = 'jvgadmin862';
   
   function useSecretAccess(onUnlock) {
     const bufferRef = useRef('');
     useEffect(() => {
       const checkHash = () => { if(window.location.hash==='#jvg-admin'){window.history.replaceState(null,'',window.location.pathname);onUnlock();} };
       checkHash();
       window.addEventListener('hashchange',checkHash);
       const handleKey = (e) => {
         if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
         bufferRef.current = (bufferRef.current+e.key).slice(-SECRET_SEQUENCE.length);
         if(bufferRef.current===SECRET_SEQUENCE){bufferRef.current='';onUnlock();}
       };
       window.addEventListener('keydown',handleKey);
       return ()=>{ window.removeEventListener('hashchange',checkHash); window.removeEventListener('keydown',handleKey); };
     },[onUnlock]);
   }
   
   function SecretTap({ onUnlock }) {
     const countRef = useRef(0);
     const timerRef = useRef(null);
     const handleClick = () => {
       countRef.current+=1;
       clearTimeout(timerRef.current);
       timerRef.current = setTimeout(()=>{countRef.current=0;},3000);
       if(countRef.current>=5){countRef.current=0;onUnlock();}
     };
     return <span onClick={handleClick} style={{cursor:'default',userSelect:'none'}} aria-hidden="true">©</span>;
   }
   
   /* ══════════════════════════════════════════════════
      ROOT APP
      ══════════════════════════════════════════════════ */
   function App() {
     const [jobs,      setJobs]      = useState(loadJobs);
     const [adminOpen, setAdminOpen] = useState(false);
     const [page,      setPage]      = useState('home'); // 'home' | 'jobs' | 'about' | 'contact'
     const openAdmin = useCallback(()=>setAdminOpen(true),[]);
     useSecretAccess(openAdmin);

     const goHome = () => { setPage('home'); window.scrollTo(0,0); };
     const goToContact = () => {
       setPage('contact');
       window.scrollTo(0,0);
       setTimeout(() => document.getElementById('contact-form')?.scrollIntoView({behavior:'smooth', block:'start'}), 350);
     };
     useEffect(() => { window.__goToContact = goToContact; return () => { delete window.__goToContact; }; }, []);
   
     if (page === 'jobs')    return <JobsPage jobs={jobs} onBack={goHome} />;
     if (page === 'about')   return <AboutPage onBack={goHome} />;
     if (page === 'contact') return <ContactPage onBack={goHome} />;

     return (
       <>
         <Navbar />
         <Hero />
         <Benefits />
         <About onViewMore={() => setPage('about')} />
         <Services />
         <HowItWorks />
         <Jobs jobs={jobs} onViewAll={() => setPage('jobs')} />
         <Testimonials />
         <CtaBanner />
         <Contact onViewDetails={() => setPage('contact')} />
         <Footer secretTap={<SecretTap onUnlock={openAdmin}/>} />
         {adminOpen&&<AdminPanel jobs={jobs} setJobs={setJobs} onClose={()=>setAdminOpen(false)}/>}
       </>
     );
   }
   
   const root = ReactDOM.createRoot(document.getElementById('root'));
   root.render(<App />);