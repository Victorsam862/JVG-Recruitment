/* ═══════════════════════════════════════════════════════════
   JVG Recruitment Solutions — app.jsx
   Single React file: all components + admin panel
   ═══════════════════════════════════════════════════════════ */

   const { useState, useEffect, useRef, useCallback } = React;

   /* ─── ADMIN CREDENTIALS (change these) ─── */
   const ADMIN_PASSWORD = 'jvgadmin';
   
   /* ─── DEFAULT JOB DATA ─── */
   const DEFAULT_JOBS = [
     { id: 1, icon: '💼', badge: 'full-time',  title: 'Sales Executive',           location: 'Abuja, FCT',       industry: 'FMCG / Retail',    salary: '₦120,000 – ₦180,000/mo', description: 'Drive sales growth and manage client relationships in our Abuja territory.', active: true  },
     { id: 2, icon: '🗂️', badge: 'full-time',  title: 'Office Administrator',      location: 'Lagos, Nigeria',   industry: 'Corporate / Admin', salary: '₦90,000 – ₦130,000/mo',  description: 'Manage daily office operations, scheduling, and administrative tasks.', active: true  },
     { id: 3, icon: '⚙️', badge: 'contract',   title: 'Civil Engineer',            location: 'Port Harcourt',    industry: 'Construction',      salary: '₦350,000 – ₦500,000/mo', description: 'Lead civil engineering projects on major construction sites.', active: true  },
     { id: 4, icon: '📊', badge: 'full-time',  title: 'Accountant',                location: 'Abuja, FCT',       industry: 'Finance / Banking', salary: '₦150,000 – ₦220,000/mo', description: 'Handle financial reporting, auditing, and tax compliance.', active: true  },
     { id: 5, icon: '💻', badge: 'remote',     title: 'Digital Marketing Officer', location: 'Remote / Lagos',   industry: 'Marketing',         salary: '₦100,000 – ₦160,000/mo', description: 'Manage social media, campaigns, SEO and digital strategy.', active: true  },
     { id: 6, icon: '🏥', badge: 'full-time',  title: 'Registered Nurse',          location: 'Abuja, FCT',       industry: 'Healthcare',        salary: '₦130,000 – ₦200,000/mo', description: 'Provide professional nursing care in a leading healthcare facility.', active: true  },
   ];
   
   const BADGE_OPTIONS = [
     { value: 'full-time',  label: 'Full-Time'  },
     { value: 'contract',   label: 'Contract'   },
     { value: 'remote',     label: 'Remote'     },
     { value: 'part-time',  label: 'Part-Time'  },
   ];
   
   const ICON_OPTIONS = ['💼','🗂️','⚙️','📊','💻','🏥','🏗️','🎓','📦','🔧','🧪','🎨','📞','🏦','✈️','🌿','🔬','📱'];
   
   /* ─── STORAGE HELPERS ─── */
   function loadJobs() {
     try {
       const saved = localStorage.getItem('jvg_jobs');
       return saved ? JSON.parse(saved) : DEFAULT_JOBS;
     } catch { return DEFAULT_JOBS; }
   }
   function saveJobs(jobs) {
     try { localStorage.setItem('jvg_jobs', JSON.stringify(jobs)); } catch {}
   }
   
   /* ─── ENQUIRIES STORAGE ─── */
   function loadEnquiries() {
     try {
       const saved = localStorage.getItem('jvg_enquiries');
       return saved ? JSON.parse(saved) : [];
     } catch { return []; }
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
         { threshold: 0.1 }
       );
       refs.current.forEach(el => el && observer.observe(el));
       return () => observer.disconnect();
     }, []);
     const ref = useCallback((el, i = refs.current.length) => { refs.current[i] = el; }, []);
     return ref;
   }
   
   /* ── Star particles component ── */
   function StarField() {
     const stars = Array.from({ length: 55 }, (_, i) => ({
       id: i,
       top:   `${Math.random() * 100}%`,
       left:  `${Math.random() * 100}%`,
       dur:   `${2 + Math.random() * 4}s`,
       delay: `${Math.random() * 5}s`,
       size:  Math.random() > 0.85 ? '3px' : '2px',
       opacity: 0.3 + Math.random() * 0.5,
     }));
     return (
       <div className="hero-stars">
         {stars.map(s => (
           <div key={s.id} className="star" style={{
             top: s.top, left: s.left,
             '--dur': s.dur, '--delay': s.delay,
             width: s.size, height: s.size,
             opacity: s.opacity,
           }} />
         ))}
       </div>
     );
   }
   
   /* ══════════════════════════════════════════════════
      NAVBAR
      ══════════════════════════════════════════════════ */
   function Navbar() {
     const [scrolled, setScrolled] = useState(false);
     const [menuOpen, setMenuOpen] = useState(false);
   
     useEffect(() => {
       const fn = () => setScrolled(window.scrollY > 50);
       window.addEventListener('scroll', fn);
       return () => window.removeEventListener('scroll', fn);
     }, []);
   
     const links = ['About','Services','Jobs','How It Works','Contact'];
   
     return (
       <>
         <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
           <a href="#home" className="nav-logo">
             <div className="nav-logo-icon">JVG</div>
             <div>
               <span className="nav-logo-name">JVG Recruitment</span>
               <span className="nav-logo-sub">Solutions</span>
             </div>
           </a>
   
           <div className="nav-links">
             {links.map(l => (
               <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`}>{l}</a>
             ))}
             <a href="#contact" className="nav-cta">Post a Job</a>
           </div>
   
           <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
             <span /><span /><span />
           </button>
         </nav>
   
         <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
           {links.map(l => (
             <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`} onClick={() => setMenuOpen(false)}>{l}</a>
           ))}
           <a href="#contact" className="m-cta" onClick={() => setMenuOpen(false)}>📋 Post a Job</a>
         </div>
       </>
     );
   }
   
   /* ══════════════════════════════════════════════════
      HERO — LUXURIOUS DEEP BLUE
      ══════════════════════════════════════════════════ */
   function Hero() {
     const stats = [
       { num:'500+', label:'Placements Made'  },
       { num:'80+',  label:'Employer Clients' },
       { num:'15+',  label:'Industries Served'},
       { num:'96%',  label:'Satisfaction Rate'},
     ];
     return (
       <section className="hero" id="home">
         <div className="hero-bg">
           <div className="hero-orb hero-orb-1" />
           <div className="hero-orb hero-orb-2" />
           <div className="hero-orb hero-orb-3" />
           <div className="hc hc1" />
           <div className="hc hc2" />
           <div className="hc hc3" />
           <div className="hdots" />
           <div className="hero-beam" />
           <div className="hero-beam-2" />
           <div className="hero-scanline" />
           <StarField />
           <div className="hero-glow" />
         </div>
         <div className="hero-bottom-glow" />
   
         <div className="hero-content">
           <div className="hero-badge"><span className="hero-badge-dot" />Nigeria's Trusted Recruitment Partner</div>
           <h1 className="hero-title">
             Professional Recruitment &amp; <em>HR Outsourcing</em> Services in Nigeria
           </h1>
           <p className="hero-sub">
             Match your business with top talent — quickly, efficiently and reliably.
             We help employers build winning teams and support job seekers in securing meaningful careers across Abuja, Lagos and all states in Nigeria.
           </p>
           <div className="hero-btns">
             <a href="#contact" className="btn-primary">📋 Post a Job</a>
             <a href="#jobs"    className="btn-secondary">🔍 Browse Openings</a>
             <a href="#contact" className="btn-secondary">📄 Submit Your Resume</a>
           </div>
           <div className="hero-stats">
             {stats.map(s => (
               <div key={s.label}>
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
      ABOUT
      ══════════════════════════════════════════════════ */
   function About() {
     const ref = useReveal();
     const features = [
       { icon:'🎯', title:'Our Mission',              desc:"To bridge the gap between qualified talent and forward-thinking employers across Nigeria — creating lasting value for businesses and careers alike." },
       { icon:'🌍', title:'Our Vision',               desc:"To be Nigeria's most trusted and results-driven recruitment agency — known for integrity, speed, and the quality of every placement we make." },
       { icon:'⚡', title:'Cross-Industry Expertise', desc:"From finance and engineering to sales, hospitality and administration — we recruit across all sectors with deep market knowledge." },
     ];
     return (
       <section className="about-section" id="about">
         <div className="about-grid">
           <div className="about-visual">
             <div className="about-visual-icon">🤝</div>
             <p className="about-visual-text">Connecting talent with opportunity across Nigeria — from Abuja to Lagos and beyond.</p>
             <div className="about-stat-row">
               <div className="about-stat-pill"><strong>10+</strong><span>Years Experience</span></div>
               <div className="about-stat-pill"><strong>500+</strong><span>Placements</span></div>
             </div>
             <div className="about-float">🏆 Trusted Staffing Agency Abuja</div>
           </div>
           <div>
             <div className="reveal" ref={el => ref(el, 0)}>
               <div className="section-label">About JVG Recruitment Solutions</div>
               <h2 className="section-title">Your Strategic <em>Recruitment Partner</em> in Nigeria</h2>
               <p className="section-desc">We provide recruitment, staffing, and HR outsourcing solutions — helping businesses find the perfect match for their workforce needs while supporting job seekers to secure meaningful employment across Abuja, Lagos, Port Harcourt and all Nigerian states.</p>
             </div>
             <div className="about-features">
               {features.map((f, i) => (
                 <div key={f.title} className={`about-feature reveal reveal-d${i+1}`} ref={el => ref(el, i+1)}>
                   <div className="about-feature-icon">{f.icon}</div>
                   <div><h4>{f.title}</h4><p>{f.desc}</p></div>
                 </div>
               ))}
             </div>
             <a href="#contact" className={`btn-primary reveal reveal-d3`} ref={el => ref(el, 4)}>🚀 Work With Us</a>
           </div>
         </div>
       </section>
     );
   }
   
   /* ══════════════════════════════════════════════════
      SERVICES
      ══════════════════════════════════════════════════ */
   function Services() {
     const ref = useReveal();
     const services = [
       { num:'01', icon:'👥', title:'Recruitment & Staffing',
         desc:'We source, screen, and deliver qualified candidates tailored precisely to your role requirements — from entry-level to executive positions across Nigeria.',
         items:['Permanent & contract placements','Executive search & headhunting','Volume recruitment campaigns','Skills-based candidate matching'] },
       { num:'02', icon:'🏢', title:'HR Outsourcing',
         desc:"Let us handle your HR functions so you can focus on growing your business. From sourcing to onboarding — we've got it covered.",
         items:['Candidate sourcing & screening','Interview coordination','Onboarding process management','HR administration support'] },
       { num:'03', icon:'🎓', title:'Job Placement for Candidates',
         desc:'We support job seekers throughout the entire employment journey — from resume crafting to interview prep and placement follow-up.',
         items:['Resume review & optimisation','Job matching & application support','Interview preparation coaching','Post-placement follow-up'] },
     ];
     return (
       <section className="services-section" id="services">
         <div className="section-header center reveal" ref={el => ref(el, 0)}>
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
       { n:'01', e:'📋', t:'Post Your Job',          d:'Share your role requirements, team culture, and ideal candidate profile with our consultants.' },
       { n:'02', e:'🔍', t:'Candidate Sourcing',      d:'We search our talent pool and networks to identify and screen the best-fit candidates for you.' },
       { n:'03', e:'📅', t:'Interview Coordination',  d:'We manage the entire interview process — scheduling, briefing candidates, and gathering feedback.' },
       { n:'04', e:'🎉', t:'Successful Placement',    d:'We facilitate the offer, onboarding, and follow up to ensure a smooth, successful hire.' },
     ];
     const seeker = [
       { n:'01', e:'✍️', t:'Register with Us',  d:'Create your profile and submit your CV. Tell us your experience, skills, and career goals.' },
       { n:'02', e:'👀', t:'Browse Openings',   d:'Explore our live job listings and get matched to roles that align with your background.' },
       { n:'03', e:'📤', t:'Apply Online',      d:"Submit applications with ease. We'll advocate for you directly with our employer clients." },
       { n:'04', e:'🌟', t:'Follow-Up Support', d:"We guide you through interviews, negotiations, and onboarding — until you're fully settled in." },
     ];
     const steps = tab === 'employers' ? employer : seeker;
     return (
       <section className="how-section" id="how-it-works">
         <div className="how-grid-bg" />
         <div className="how-inner">
           <div className="section-header center reveal" ref={el => ref(el, 0)}>
             <div className="section-label center">Simple Process</div>
             <h2 className="section-title">How <em>It Works</em></h2>
             <p className="section-desc">Whether you're hiring or job hunting — our streamlined process makes it easy to get results fast.</p>
           </div>
           <div className="how-tabs">
             <button className={`how-tab${tab==='employers'?' active':''}`} onClick={() => setTab('employers')}>For Employers</button>
             <button className={`how-tab${tab==='seekers'?' active':''}`}   onClick={() => setTab('seekers')}>For Job Seekers</button>
           </div>
           <div className="how-steps">
             {steps.map(s => (
               <div key={s.n} className="how-step">
                 <div className="how-bubble"><span className="how-num">{s.n}</span><span className="how-emoji">{s.e}</span></div>
                 <h4>{s.t}</h4><p>{s.d}</p>
               </div>
             ))}
           </div>
         </div>
       </section>
     );
   }

   /* ══════════════════════════════════════════════════
      CV UPLOAD COMPONENT
      ══════════════════════════════════════════════════ */
   function CvUpload({ cvFile, setCvFile, required }) {
     const [dragOver, setDragOver] = useState(false);
     const inputRef = useRef(null);

     const handleFile = (file) => {
       if (!file) return;
       const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
       if (!allowed.includes(file.type)) {
         alert('Please upload a PDF or Word document (.pdf, .doc, .docx)');
         return;
       }
       if (file.size > 5 * 1024 * 1024) {
         alert('File size must be under 5MB.');
         return;
       }
       setCvFile(file);
     };

     const onDrop = (e) => {
       e.preventDefault(); setDragOver(false);
       const file = e.dataTransfer.files[0];
       handleFile(file);
     };

     const formatSize = (bytes) => {
       if (bytes < 1024) return `${bytes} B`;
       if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`;
       return `${(bytes/(1024*1024)).toFixed(1)} MB`;
     };

     return (
       <div
         className={`cv-upload-zone${cvFile ? ' has-file' : ''}${dragOver ? ' drag-over' : ''}`}
         onDragOver={e => { e.preventDefault(); setDragOver(true); }}
         onDragLeave={() => setDragOver(false)}
         onDrop={onDrop}
         onClick={() => !cvFile && inputRef.current?.click()}
       >
         <input
           ref={inputRef}
           type="file"
           accept=".pdf,.doc,.docx"
           onChange={e => handleFile(e.target.files[0])}
           style={{display:'none'}}
         />
         {cvFile ? (
           <>
             <div className="cv-upload-icon">✅</div>
             <div className="cv-file-name">
               📄 {cvFile.name}
               <button
                 type="button"
                 className="cv-remove-btn"
                 onClick={e => { e.stopPropagation(); setCvFile(null); if(inputRef.current) inputRef.current.value=''; }}
                 title="Remove file"
               >✕</button>
             </div>
             <div className="cv-file-size">{formatSize(cvFile.size)} — ready to submit</div>
           </>
         ) : (
           <>
             <div className="cv-upload-icon">📎</div>
             <div className="cv-upload-title">
               {required ? 'Attach Your CV / Resume (Required)' : 'Attach Your CV / Resume'}
             </div>
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
     const [authed,     setAuthed]     = useState(false);
     const [password,   setPassword]   = useState('');
     const [loginErr,   setLoginErr]   = useState('');
     const [adminTab,   setAdminTab]   = useState('enquiries');
     const [editJob,    setEditJob]    = useState(null);
     const [notice,     setNotice]     = useState('');
     const [noticeErr,  setNoticeErr]  = useState(false);
     const [enquiries,  setEnquiries]  = useState(loadEnquiries);
     const [expanded,   setExpanded]   = useState(null);
     const [search,     setSearch]     = useState('');
     const [emailSearch,setEmailSearch]= useState('');
     const [copied,     setCopied]     = useState('');
     const [emailFilter,setEmailFilter]= useState('all');
   
     const blankForm = { icon:'💼', badge:'full-time', title:'', location:'', industry:'', salary:'', description:'' };
     const [form, setForm] = useState(blankForm);
   
     const showNotice = (msg, err=false) => {
       setNotice(msg); setNoticeErr(err);
       setTimeout(() => setNotice(''), 3500);
     };
   
     const markRead = id => {
       const updated = enquiries.map(e => e.id === id ? { ...e, read: true } : e);
       setEnquiries(updated); saveEnquiries(updated);
     };
     const deleteEnquiry = id => {
       if (!window.confirm('Delete this enquiry?')) return;
       const updated = enquiries.filter(e => e.id !== id);
       setEnquiries(updated); saveEnquiries(updated);
       if (expanded === id) setExpanded(null);
       showNotice('Enquiry deleted.');
     };
     const clearAllEnquiries = () => {
       if (!window.confirm('Clear ALL enquiries? This cannot be undone.')) return;
       setEnquiries([]); saveEnquiries([]);
       setExpanded(null);
       showNotice('All enquiries cleared.');
     };
     const toggleExpand = id => {
       setExpanded(prev => prev === id ? null : id);
       markRead(id);
     };
     const formatDate = iso => {
       const d = new Date(iso);
       return d.toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' }) +
              ' · ' + d.toLocaleTimeString('en-NG', { hour:'2-digit', minute:'2-digit' });
     };
   
     const unreadCount = enquiries.filter(e => !e.read).length;
     const filteredEnquiries = enquiries.filter(e => {
       const q = search.toLowerCase();
       return !q || (e.email||'').toLowerCase().includes(q) ||
              `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
              (e.subject||'').toLowerCase().includes(q);
     });
   
     const employerEmails = [...new Set(
       enquiries.filter(e => e.role === 'Employer / Hiring Manager').map(e => e.email).filter(Boolean)
     )];
     const hrEmails = [...new Set(
       enquiries.filter(e => e.role === 'HR Professional').map(e => e.email).filter(Boolean)
     )];
     const allEmails = [...new Set([...employerEmails, ...hrEmails])];
   
     const getDisplayEmails = () => {
       const pool = emailFilter === 'employer' ? employerEmails : emailFilter === 'hr' ? hrEmails : allEmails;
       const q = emailSearch.trim().toLowerCase();
       return q ? pool.filter(em => em.toLowerCase().includes(q)) : pool;
     };
   
     const copyEmails = (type) => {
       const list = type === 'employer' ? employerEmails : type === 'hr' ? hrEmails : allEmails;
       const text = list.join(', ');
       if (!text) return;
       navigator.clipboard.writeText(text).catch(() => {
         const ta = document.createElement('textarea');
         ta.value = text; document.body.appendChild(ta); ta.select();
         document.execCommand('copy'); document.body.removeChild(ta);
       });
       setCopied(type);
       setTimeout(() => setCopied(''), 2500);
     };
   
     const downloadCSV = (type) => {
       const source = type === 'employer'
         ? enquiries.filter(e => e.role === 'Employer / Hiring Manager')
         : type === 'hr'
           ? enquiries.filter(e => e.role === 'HR Professional')
           : enquiries.filter(e => e.role === 'Employer / Hiring Manager' || e.role === 'HR Professional');
       if (!source.length) { showNotice('No records to download.', true); return; }
       const headers = ['First Name','Last Name','Email','Phone','Role','Subject','Message','Date'];
       const rows = source.map(e => [
         `"${(e.firstName||'').replace(/"/g,'""')}"`,
         `"${(e.lastName||'').replace(/"/g,'""')}"`,
         `"${(e.email||'').replace(/"/g,'""')}"`,
         `"${(e.phone||'').replace(/"/g,'""')}"`,
         `"${(e.role||'').replace(/"/g,'""')}"`,
         `"${(e.subject||'').replace(/"/g,'""')}"`,
         `"${(e.message||'').replace(/"/g,'""').replace(/\n/g,' ')}"`,
         `"${formatDate(e.timestamp)}"`,
       ].join(','));
       const csv = [headers.join(','), ...rows].join('\n');
       const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
       const url  = URL.createObjectURL(blob);
       const a    = document.createElement('a');
       a.href     = url;
       a.download = `jvg-${type}-emails-${new Date().toISOString().slice(0,10)}.csv`;
       a.click();
       URL.revokeObjectURL(url);
       showNotice('CSV downloaded successfully!');
     };
   
     const toggleJob = id => { const u = jobs.map(j => j.id===id?{...j,active:!j.active}:j); setJobs(u); saveJobs(u); showNotice('Job visibility updated.'); };
     const deleteJob = id => { if(!window.confirm('Delete this job posting?')) return; const u=jobs.filter(j=>j.id!==id); setJobs(u); saveJobs(u); showNotice('Job deleted.'); };
     const openEdit  = job => { setEditJob(job.id); setForm({icon:job.icon,badge:job.badge,title:job.title,location:job.location,industry:job.industry,salary:job.salary,description:job.description||''}); setAdminTab('edit'); };
     const openAdd   = () => { setEditJob(null); setForm(blankForm); setAdminTab('add'); };
     const saveJob   = e => {
       e.preventDefault();
       if (!form.title.trim()||!form.location.trim()||!form.salary.trim()) { showNotice('Please fill in Title, Location and Salary.',true); return; }
       let u;
       if (editJob!==null) { u=jobs.map(j=>j.id===editJob?{...j,...form}:j); showNotice('Job updated successfully!'); }
       else { u=[...jobs,{...form,id:Date.now(),active:true}]; showNotice('New job added successfully!'); }
       setJobs(u); saveJobs(u); setAdminTab('list'); setForm(blankForm); setEditJob(null);
     };
   
     const activeCount = jobs.filter(j => j.active).length;
   
     if (!authed) return (
       <div className="admin-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
         <div className="admin-panel">
           <div className="admin-header">
             <div><h2>🔐 Admin Access</h2><p>JVG Recruitment Solutions — Admin Panel</p></div>
             <button className="admin-close-btn" onClick={onClose}>✕</button>
           </div>
           <div className="admin-login">
             <h3>Administrator Login</h3>
             <p>Enter your admin password to manage job postings and view employer enquiries.</p>
             <form className="admin-login-form" onSubmit={e => { e.preventDefault(); password===ADMIN_PASSWORD?(setAuthed(true),setLoginErr('')):setLoginErr('Incorrect password. Please try again.'); }}>
               {loginErr && <div className="admin-login-error">⚠️ {loginErr}</div>}
               <div className="form-group">
                 <label>Password</label>
                 <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter admin password" autoFocus />
               </div>
               <button type="submit" className="btn-save" style={{width:'100%',justifyContent:'center'}}>🔓 Login</button>
               <div className="admin-login-hint">💡 Default password: <strong>jvg@admin2025</strong></div>
             </form>
           </div>
         </div>
       </div>
     );
   
     const displayEmails = getDisplayEmails();
   
     return (
       <div className="admin-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
         <div className="admin-panel">
           <div className="admin-header">
             <div>
               <h2>⚙️ Admin Panel</h2>
               <p>Manage job postings and view employer &amp; HR enquiries.</p>
             </div>
             <button className="admin-close-btn" onClick={onClose}>✕</button>
           </div>
           <div className="admin-body">
             {notice && <div className={`admin-notice${noticeErr?' error':''}`}>{noticeErr?'⚠️':'✅'} {notice}</div>}
             <div className="admin-stats">
               <div className="admin-stat-card">
                 <strong>{enquiries.filter(e=>e.role==='Employer / Hiring Manager').length}</strong>
                 <span>Employer Enquiries</span>
               </div>
               <div className="admin-stat-card">
                 <strong>{enquiries.filter(e=>e.role==='HR Professional').length}</strong>
                 <span>HR Enquiries</span>
               </div>
               <div className="admin-stat-card" style={unreadCount>0?{borderColor:'var(--gold)',background:'rgba(200,155,60,.06)'}:{}}>
                 <strong style={unreadCount>0?{color:'var(--gold)'}:{}}>{unreadCount}</strong>
                 <span>Unread</span>
               </div>
               <div className="admin-stat-card"><strong>{activeCount}</strong><span>Active Jobs</span></div>
             </div>
             <div className="admin-tabs">
               <button className={`admin-tab${adminTab==='enquiries'?' active':''}`} onClick={() => setAdminTab('enquiries')}>
                 📬 All Enquiries {unreadCount > 0 && <span className="enq-badge">{unreadCount}</span>}
               </button>
               <button className={`admin-tab${adminTab==='emails'?' active':''}`} onClick={() => setAdminTab('emails')}>
                 📧 Email Lists
                 {allEmails.length > 0 && <span className="enq-badge" style={{background:'var(--gold)',color:'var(--navy)'}}>{allEmails.length}</span>}
               </button>
               <button className={`admin-tab${adminTab==='list'?' active':''}`} onClick={() => setAdminTab('list')}>📋 Job Listings</button>
               <button className={`admin-tab${adminTab==='add'||adminTab==='edit'?' active':''}`} onClick={openAdd}>
                 {adminTab==='edit'?'✏️ Editing Job':'➕ Add New Job'}
               </button>
             </div>
   
             {/* ALL ENQUIRIES TAB */}
             {adminTab === 'enquiries' && (
               <div className="enq-panel">
                 <div className="enq-toolbar">
                   <div className="enq-search-wrap">
                     <span className="enq-search-icon">🔍</span>
                     <input
                       className="enq-search"
                       type="text"
                       placeholder="Search by name, email or subject…"
                       value={search}
                       onChange={e => setSearch(e.target.value)}
                     />
                     {search && <button className="enq-search-clear" onClick={() => setSearch('')}>✕</button>}
                   </div>
                   {enquiries.length > 0 && (
                     <button className="enq-clear-all" onClick={clearAllEnquiries}>🗑️ Clear All</button>
                   )}
                 </div>
                 {filteredEnquiries.length === 0 && (
                   <div className="enq-empty">
                     <div className="enq-empty-icon">{search ? '🔍' : '📭'}</div>
                     <p>{search ? 'No enquiries match your search.' : 'No enquiries yet.'}</p>
                     <span>{search ? 'Try a different search term.' : 'When employers or HR professionals fill the contact form, their details will appear here.'}</span>
                   </div>
                 )}
                 <div className="enq-list">
                   {filteredEnquiries.map(enq => (
                     <div key={enq.id} className={`enq-card${!enq.read?' enq-unread':''}${expanded===enq.id?' enq-expanded':''}`}>
                       <div className="enq-card-header" onClick={() => toggleExpand(enq.id)}>
                         <div className="enq-avatar">
                           {enq.firstName?.[0]?.toUpperCase()}{enq.lastName?.[0]?.toUpperCase()}
                         </div>
                         <div className="enq-card-info">
                           <div className="enq-name">
                             {enq.firstName} {enq.lastName}
                             {!enq.read && <span className="enq-new-dot" title="New">●</span>}
                             {enq.role && (
                               <span className={`enq-role-tag ${enq.role==='HR Professional'?'enq-role-hr':'enq-role-employer'}`}>
                                 {enq.role==='HR Professional' ? '🧑‍💼 HR' : '🏢 Employer'}
                               </span>
                             )}
                           </div>
                           <div className="enq-email-preview">📧 {enq.email}</div>
                           <div className="enq-meta-row">
                             <span className="enq-subject">📌 {enq.subject || '(no subject)'}</span>
                             <span className="enq-date">🕐 {formatDate(enq.timestamp)}</span>
                           </div>
                         </div>
                         <div className="enq-chevron">{expanded===enq.id ? '▲' : '▼'}</div>
                       </div>
                       {expanded === enq.id && (
                         <div className="enq-card-body">
                           <div className="enq-detail-grid">
                             <div className="enq-detail-row">
                               <span className="enq-detail-label">Full Name</span>
                               <span className="enq-detail-value">{enq.firstName} {enq.lastName}</span>
                             </div>
                             <div className="enq-detail-row">
                               <span className="enq-detail-label">Email Address</span>
                               <span className="enq-detail-value">
                                 <a href={`mailto:${enq.email}`} className="enq-email-link">{enq.email}</a>
                               </span>
                             </div>
                             {enq.phone && (
                               <div className="enq-detail-row">
                                 <span className="enq-detail-label">Phone</span>
                                 <span className="enq-detail-value">
                                   <a href={`tel:${enq.phone}`} className="enq-email-link">{enq.phone}</a>
                                 </span>
                               </div>
                             )}
                             {enq.role && (
                               <div className="enq-detail-row">
                                 <span className="enq-detail-label">Role</span>
                                 <span className="enq-detail-value">{enq.role}</span>
                               </div>
                             )}
                             {enq.cvFileName && (
                               <div className="enq-detail-row">
                                 <span className="enq-detail-label">CV Attached</span>
                                 <span className="enq-detail-value">📄 {enq.cvFileName} ({enq.cvFileSize})</span>
                               </div>
                             )}
                             <div className="enq-detail-row">
                               <span className="enq-detail-label">Subject</span>
                               <span className="enq-detail-value">{enq.subject || '—'}</span>
                             </div>
                             <div className="enq-detail-row enq-detail-full">
                               <span className="enq-detail-label">Message</span>
                               <div className="enq-message-box">{enq.message}</div>
                             </div>
                             <div className="enq-detail-row">
                               <span className="enq-detail-label">Submitted</span>
                               <span className="enq-detail-value">{formatDate(enq.timestamp)}</span>
                             </div>
                           </div>
                           <div className="enq-card-actions">
                             <a href={`mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject||'')}`} className="btn-reply">
                               ✉️ Reply by Email
                             </a>
                             {enq.phone && (
                               <a href={`https://wa.me/${enq.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                                 💬 WhatsApp
                               </a>
                             )}
                             <button className="btn-icon delete" title="Delete enquiry" onClick={() => deleteEnquiry(enq.id)}>🗑️</button>
                           </div>
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
             )}
   
             {/* EMAIL LISTS TAB */}
             {adminTab === 'emails' && (
               <div className="email-lists-panel">
                 <div className="email-summary-row">
                   <div className={`email-summary-card${emailFilter==='employer'?' active':''}`} onClick={() => setEmailFilter('employer')}>
                     <span className="email-summary-icon">🏢</span>
                     <strong>{employerEmails.length}</strong>
                     <span>Employer Emails</span>
                   </div>
                   <div className={`email-summary-card${emailFilter==='hr'?' active':''}`} onClick={() => setEmailFilter('hr')}>
                     <span className="email-summary-icon">🧑‍💼</span>
                     <strong>{hrEmails.length}</strong>
                     <span>HR Professional Emails</span>
                   </div>
                   <div className={`email-summary-card${emailFilter==='all'?' active':''}`} onClick={() => setEmailFilter('all')}>
                     <span className="email-summary-icon">📋</span>
                     <strong>{allEmails.length}</strong>
                     <span>All Combined</span>
                   </div>
                 </div>
                 <div className="enq-search-wrap" style={{marginBottom:'14px'}}>
                   <span className="enq-search-icon">🔍</span>
                   <input
                     className="enq-search"
                     type="text"
                     placeholder={`Search ${emailFilter === 'all' ? 'all' : emailFilter} email addresses…`}
                     value={emailSearch}
                     onChange={e => setEmailSearch(e.target.value)}
                   />
                   {emailSearch && <button className="enq-search-clear" onClick={() => setEmailSearch('')}>✕</button>}
                 </div>
   
                 {(emailFilter === 'employer' || emailFilter === 'all') && (
                   <div className="email-group">
                     <div className="email-group-header">
                       <div className="email-group-title">
                         <span>🏢</span>
                         <strong>Employer / Hiring Managers</strong>
                         <span className="email-count-badge">{employerEmails.length} email{employerEmails.length!==1?'s':''}</span>
                       </div>
                       {employerEmails.length > 0 && (
                         <div className="email-group-actions">
                           <button className="btn-email-action copy" onClick={() => copyEmails('employer')}>{copied==='employer' ? '✅ Copied!' : '📋 Copy'}</button>
                           <button className="btn-email-action download" onClick={() => downloadCSV('employer')}>⬇️ CSV</button>
                           <a href={`mailto:?bcc=${employerEmails.join(',')}&subject=Update from JVG Recruitment Solutions`} className="btn-email-action mailto">✉️ Email All</a>
                         </div>
                       )}
                     </div>
                     {employerEmails.length === 0 ? (
                       <div className="email-empty">📭 No employer emails collected yet.</div>
                     ) : (
                       <div className="email-chip-list">
                         {(emailSearch ? employerEmails.filter(em => em.toLowerCase().includes(emailSearch.toLowerCase())) : employerEmails).map(em => (
                           <div key={em} className="email-chip employer-chip">
                             <span className="email-chip-dot" />
                             {em}
                             <button className="email-chip-copy" title="Copy this email" onClick={() => { navigator.clipboard.writeText(em).catch(()=>{}); showNotice(`Copied: ${em}`); }}>📋</button>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 )}
   
                 {(emailFilter === 'hr' || emailFilter === 'all') && (
                   <div className="email-group" style={{marginTop: emailFilter==='all' ? '20px' : '0'}}>
                     <div className="email-group-header">
                       <div className="email-group-title">
                         <span>🧑‍💼</span>
                         <strong>HR Professionals</strong>
                         <span className="email-count-badge" style={{background:'rgba(168,85,247,.15)',color:'#A855F7',borderColor:'rgba(168,85,247,.25)'}}>{hrEmails.length} email{hrEmails.length!==1?'s':''}</span>
                       </div>
                       {hrEmails.length > 0 && (
                         <div className="email-group-actions">
                           <button className="btn-email-action copy" onClick={() => copyEmails('hr')}>{copied==='hr' ? '✅ Copied!' : '📋 Copy'}</button>
                           <button className="btn-email-action download" onClick={() => downloadCSV('hr')}>⬇️ CSV</button>
                           <a href={`mailto:?bcc=${hrEmails.join(',')}&subject=Update from JVG Recruitment Solutions`} className="btn-email-action mailto">✉️ Email All</a>
                         </div>
                       )}
                     </div>
                     {hrEmails.length === 0 ? (
                       <div className="email-empty">📭 No HR professional emails collected yet.</div>
                     ) : (
                       <div className="email-chip-list">
                         {(emailSearch ? hrEmails.filter(em => em.toLowerCase().includes(emailSearch.toLowerCase())) : hrEmails).map(em => (
                           <div key={em} className="email-chip hr-chip">
                             <span className="email-chip-dot" style={{background:'#A855F7'}} />
                             {em}
                             <button className="email-chip-copy" title="Copy this email" onClick={() => { navigator.clipboard.writeText(em).catch(()=>{}); showNotice(`Copied: ${em}`); }}>📋</button>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 )}
   
                 {emailFilter === 'all' && allEmails.length > 0 && (
                   <div className="email-combined-actions">
                     <div className="email-combined-label">⚡ Combined Actions (All {allEmails.length} emails)</div>
                     <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                       <button className="btn-email-action copy" style={{padding:'10px 18px'}} onClick={() => copyEmails('all')}>{copied==='all' ? '✅ Copied All!' : '📋 Copy All Emails'}</button>
                       <button className="btn-email-action download" style={{padding:'10px 18px'}} onClick={() => downloadCSV('all')}>⬇️ Download Full CSV</button>
                       <a href={`mailto:?bcc=${allEmails.join(',')}&subject=Update from JVG Recruitment Solutions`} className="btn-email-action mailto" style={{padding:'10px 18px'}}>✉️ Email Everyone</a>
                     </div>
                   </div>
                 )}
                 {allEmails.length === 0 && (
                   <div className="enq-empty" style={{marginTop:'20px'}}>
                     <div className="enq-empty-icon">📭</div>
                     <p>No emails collected yet.</p>
                     <span>When employers or HR professionals submit the contact form, their emails will appear here.</span>
                   </div>
                 )}
               </div>
             )}
   
             {/* JOB LIST TAB */}
             {adminTab === 'list' && (
               <>
                 <div className="admin-job-list">
                   {jobs.length === 0 && <div style={{textAlign:'center',padding:'32px',color:'var(--grey-mid)'}}>No jobs yet. Click "Add New Job" to create one.</div>}
                   {jobs.map(job => (
                     <div key={job.id} className="admin-job-row" style={{opacity:job.active?1:0.5}}>
                       <div className="admin-job-row-icon">{job.icon}</div>
                       <div className="admin-job-row-info">
                         <div className="admin-job-row-title">{job.title}</div>
                         <div className="admin-job-row-meta">
                           📍 {job.location} &nbsp;·&nbsp; 🏢 {job.industry} &nbsp;·&nbsp; 💰 {job.salary}
                           &nbsp;·&nbsp; <span className={`job-badge ${job.badge}`} style={{fontSize:'10px'}}>{job.badge}</span>
                           &nbsp;·&nbsp; {job.active?<span style={{color:'var(--green)',fontWeight:700}}>● Visible</span>:<span style={{color:'var(--grey-mid)',fontWeight:700}}>● Hidden</span>}
                         </div>
                       </div>
                       <div className="admin-job-row-actions">
                         <button className={`btn-icon toggle${!job.active?' off':''}`} title={job.active?'Hide':'Show'} onClick={() => toggleJob(job.id)}>{job.active?'👁️':'🙈'}</button>
                         <button className="btn-icon edit" title="Edit" onClick={() => openEdit(job)}>✏️</button>
                         <button className="btn-icon delete" title="Delete" onClick={() => deleteJob(job.id)}>🗑️</button>
                       </div>
                     </div>
                   ))}
                 </div>
                 <button className="btn-add-job" onClick={openAdd}>➕ Add New Job Posting</button>
               </>
             )}
   
             {/* ADD / EDIT TAB */}
             {(adminTab==='add'||adminTab==='edit') && (
               <form className="job-form" onSubmit={saveJob}>
                 <h4>{adminTab==='edit'?'✏️ Edit Job Posting':'➕ Add New Job Posting'}</h4>
                 <div className="form-grid">
                   <div className="form-group">
                     <label>Icon</label>
                     <select value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})}>
                       {ICON_OPTIONS.map(ico=><option key={ico} value={ico}>{ico} {ico}</option>)}
                     </select>
                   </div>
                   <div className="form-group">
                     <label>Job Type</label>
                     <select value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}>
                       {BADGE_OPTIONS.map(b=><option key={b.value} value={b.value}>{b.label}</option>)}
                     </select>
                   </div>
                   <div className="form-group full">
                     <label>Job Title *</label>
                     <input type="text" placeholder="e.g. Senior Accountant" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
                   </div>
                   <div className="form-group">
                     <label>Location *</label>
                     <input type="text" placeholder="e.g. Abuja, FCT" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required />
                   </div>
                   <div className="form-group">
                     <label>Industry / Department</label>
                     <input type="text" placeholder="e.g. Finance / Banking" value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})} />
                   </div>
                   <div className="form-group full">
                     <label>Salary / Compensation *</label>
                     <input type="text" placeholder="e.g. ₦150,000 – ₦220,000/mo" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} required />
                   </div>
                   <div className="form-group full">
                     <label>Job Description</label>
                     <textarea placeholder="Brief description of the role and responsibilities..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
                   </div>
                 </div>
                 <div className="form-actions">
                   <button type="submit" className="btn-save">💾 {adminTab==='edit'?'Save Changes':'Add Job'}</button>
                   <button type="button" className="btn-cancel" onClick={()=>{setAdminTab('list');setForm(blankForm);setEditJob(null);}}>Cancel</button>
                   {adminTab==='edit' && (
                     <button type="button" className="btn-icon delete" style={{width:'auto',padding:'0 14px',borderRadius:'8px',fontSize:'13px',gap:'6px',display:'flex',alignItems:'center'}}
                       onClick={()=>{deleteJob(editJob);setAdminTab('list');}}>
                       🗑️ Delete Job
                     </button>
                   )}
                 </div>
               </form>
             )}
           </div>
         </div>
       </div>
     );
   }
   
   /* ══════════════════════════════════════════════════
      JOBS SECTION (PUBLIC)
      ══════════════════════════════════════════════════ */
   function Jobs({ jobs }) {
     const ref = useReveal();
     const visible = jobs.filter(j => j.active);
     const scroll  = () => document.getElementById('contact')?.scrollIntoView({ behavior:'smooth' });
   
     return (
       <section className="jobs-section" id="jobs">
         <div className="section-header reveal" ref={el => ref(el, 0)}>
           <div className="section-label">Live Opportunities</div>
           <h2 className="section-title">Featured <em>Job Openings</em></h2>
           <p className="section-desc">Explore our current vacancies across Nigeria. New roles added regularly — follow us on Facebook for instant job alerts.</p>
         </div>
         <div className="jobs-grid">
           {visible.length === 0 ? (
             <div className="jobs-empty">
               <div className="jobs-empty-icon">🔍</div>
               <p>No job openings at the moment.<br />Check back soon or follow us on Facebook for alerts.</p>
             </div>
           ) : visible.map((job, i) => (
             <div key={job.id} className={`job-card reveal reveal-d${(i%3)+1}`} ref={el => ref(el, i+1)}>
               <div className="job-card-top">
                 <div className="job-icon">{job.icon}</div>
                 <span className={`job-badge ${job.badge}`}>{BADGE_OPTIONS.find(b=>b.value===job.badge)?.label || job.badge}</span>
               </div>
               <div className="job-title">{job.title}</div>
               <div className="job-meta">
                 <span className="job-meta-item">📍 {job.location}</span>
                 <span className="job-meta-item">🏢 {job.industry}</span>
               </div>
               {job.description && <div className="job-desc-text">{job.description}</div>}
               <div className="job-salary">{job.salary}</div>
               <button className="job-apply-btn" onClick={scroll}>Apply Now →</button>
             </div>
           ))}
         </div>
         <div className="jobs-footer" ref={el => ref(el, visible.length+1)}>
           <p>More openings posted daily. Follow us on Facebook for instant alerts.</p>
           <div className="jobs-footer-btns">
             <a href="https://www.facebook.com/jvgbusinesssolutionshroutsourcing" target="_blank" rel="noopener noreferrer" className="fb-btn">
               📘 Follow on Facebook
             </a>
             <a href="#contact" className="btn-primary">📄 Submit Your CV</a>
           </div>
         </div>
       </section>
     );
   }
   
   /* ══════════════════════════════════════════════════
      TESTIMONIALS
      ══════════════════════════════════════════════════ */
   function Testimonials() {
     const ref = useReveal();
     const list = [
       { init:'AO', name:'Adaeze Okafor',  role:'HR Manager, FinTech Startup — Lagos',       quote:'JVG Recruitment Solutions filled three critical roles for us in under two weeks. The quality of candidates was exceptional and their professionalism throughout was outstanding.' },
       { init:'TI', name:'Tobi Ibrahim',   role:'Placed Candidate — Sales Executive, Abuja', quote:'After months of searching on my own, JVG matched me with my dream job within three weeks. They guided me through every step — from my CV to the final interview. Forever grateful!' },
       { init:'EM', name:'Emmanuel Musa',  role:'Operations Director, Construction Firm',     quote:'We outsourced our entire hiring process for our Abuja expansion to JVG. They recruited 12 qualified staff in 30 days. Seamless, efficient, and worth every naira.' },
     ];
     return (
       <section className="testi-section" id="testimonials">
         <div className="section-header center reveal" ref={el => ref(el, 0)}>
           <div className="section-label center">Success Stories</div>
           <h2 className="section-title">What Our <em>Clients Say</em></h2>
           <p className="section-desc">Trusted by employers and job seekers across Nigeria. Here's what they have to say about working with us.</p>
         </div>
         <div className="testi-grid">
           {list.map((t, i) => (
             <div key={t.name} className={`testi-card reveal reveal-d${i+1}`} ref={el => ref(el, i+1)}>
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
           <h2>Ready to Find the <em>Right Talent</em>?</h2>
           <p>Post a vacancy or submit your resume today. Our team is ready to connect the right people with the right opportunities across Nigeria.</p>
           <div className="cta-btns">
             <a href="#contact" className="btn-primary">📋 Post a Job Vacancy</a>
             <a href="#contact" className="btn-secondary">📄 Submit Your Resume</a>
           </div>
         </div>
       </div>
     );
   }
   
   /* ══════════════════════════════════════════════════
      CONTACT — EMAILJS + CV REQUIRED FOR JOB SEEKERS
      ══════════════════════════════════════════════════ */

   /* ─── EmailJS — Account 1 (samsonvictor863@gmail.com) ─── */
   const EMAILJS_SERVICE  = 'service_oai19oi';
   const EMAILJS_TEMPLATE = 'template_5yoz7uv';
   /* ─── EmailJS — Account 2 (jvgbizsolutionshr@gmail.com) ─── */
   const EMAILJS_SERVICE_2  = 'service_thy1736';
   const EMAILJS_TEMPLATE_2 = 'template_b05p02z';
   const EMAILJS_PUBLIC_KEY_2 = 'd26MprEm9Q41eC6-g';

   const CV_REQUIRED_ROLES = ['Job Seeker / Candidate'];

   function Contact() {
     const ref = useReveal();
     const [sent,     setSent]     = useState(false);
     const [sending,  setSending]  = useState(false);
     const [sendErr,  setSendErr]  = useState('');
     const [cvFile,   setCvFile]   = useState(null);
     const [cvErr,    setCvErr]    = useState('');
     const [form, setForm] = useState({
       firstName:'', lastName:'', email:'', phone:'', role:'', subject:'', message:''
     });

     const info = [
       { icon:'📧', label:'Email Us',        val:'info@jvgrecruitmentsolutions.com' },
       { icon:'📞', label:'Call / WhatsApp', val:'+234 704 745 3599 JVG JOBS'       },
       { icon:'📍', label:'Location',        val:'Abuja, Federal Capital Territory, Nigeria' },
     ];

     const formatSize = (bytes) => {
       if (bytes < 1024) return `${bytes} B`;
       if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`;
       return `${(bytes/(1024*1024)).toFixed(1)} MB`;
     };

     const toBase64 = (file) => new Promise((resolve, reject) => {
       const reader = new FileReader();
       reader.onload  = () => resolve(reader.result.split(',')[1]);
       reader.onerror = reject;
       reader.readAsDataURL(file);
     });

     const isCvRequired = CV_REQUIRED_ROLES.includes(form.role);

     const handleChange = e => {
       setForm({ ...form, [e.target.name]: e.target.value });
       if (e.target.name === 'role') setCvErr('');
     };

     const handleSubmit = async (e) => {
       e.preventDefault();
       setSendErr('');
       setCvErr('');

       if (isCvRequired && !cvFile) {
         setCvErr('Please attach your CV / Resume to continue.');
         document.querySelector('.cv-upload-zone')?.scrollIntoView({ behavior:'smooth', block:'center' });
         return;
       }

       setSending(true);

       try {
         let attachmentData  = '';
         let attachmentName  = '';
         if (cvFile) {
           attachmentData = await toBase64(cvFile);
           attachmentName = cvFile.name;
         }

         const templateParams = {
           from_name:       `${form.firstName} ${form.lastName}`,
           from_email:      form.email,
           phone:           form.phone || 'Not provided',
           role:            form.role,
           subject:         form.subject,
           message:         form.message,
           cv_filename:     attachmentName || 'No CV attached',
           attachment_name: attachmentName,
           attachment:      attachmentData,
         };

         /* ─── Fire BOTH EmailJS accounts simultaneously ───
          * Account 1 uses the globally-initialised public key.
          * Account 2 passes its own public key as the 4th arg.
          * Promise.all ensures we wait for both before proceeding.
          * If one fails the catch block still handles the error.  */
         await Promise.all([
           emailjs.send(EMAILJS_SERVICE,   EMAILJS_TEMPLATE,   templateParams),
           emailjs.send(EMAILJS_SERVICE_2, EMAILJS_TEMPLATE_2, templateParams, EMAILJS_PUBLIC_KEY_2),
         ]);

         if (form.role === 'Employer / Hiring Manager' || form.role === 'HR Professional') {
           const entry = {
             id:         Date.now(),
             timestamp:  new Date().toISOString(),
             firstName:  form.firstName,
             lastName:   form.lastName,
             email:      form.email,
             phone:      form.phone,
             role:       form.role,
             subject:    form.subject,
             message:    form.message,
             cvFileName: cvFile ? cvFile.name     : null,
             cvFileSize: cvFile ? formatSize(cvFile.size) : null,
             read:       false,
           };
           saveEnquiries([entry, ...loadEnquiries()]);
         }

         setSent(true);
         setForm({ firstName:'', lastName:'', email:'', phone:'', role:'', subject:'', message:'' });
         setCvFile(null);
         setTimeout(() => setSent(false), 6000);

       } catch (err) {
         console.error('EmailJS error:', err);
         setSendErr('Something went wrong sending your message. Please try again or email us directly at info@jvgrecruitmentsolutions.com');
       } finally {
         setSending(false);
       }
     };

     return (
       <section className="contact-section" id="contact">
         <div className="contact-grid">
           <div>
             <div className="reveal" ref={el => ref(el,0)}>
               <div className="section-label">Get In Touch</div>
               <h2 className="section-title">Let's <em>Connect</em></h2>
               <p className="section-desc">Whether you're hiring, looking for work, or exploring HR outsourcing — our team is here and ready to help.</p>
             </div>
             <div className="contact-cards reveal reveal-d1" ref={el => ref(el,1)}>
               {info.map(c => (
                 <div key={c.label} className="contact-card">
                   <div className="contact-icon">{c.icon}</div>
                   <div><h5>{c.label}</h5><p>{c.val}</p></div>
                 </div>
               ))}
             </div>
             <div className="contact-social reveal reveal-d2" ref={el => ref(el,2)}>
               <h5>🔔 Follow for Daily Job Alerts</h5>
               <a href="https://www.facebook.com/jvgbusinesssolutionshroutsourcing" target="_blank" rel="noopener noreferrer" className="fb-btn">
                 📘 @jvgbusinesssolutionshroutsourcing
               </a>
             </div>
           </div>

           <div className="contact-form reveal reveal-d1" ref={el => ref(el,3)}>
             <div className="form-title">Send Us a Message</div>
             <p className="form-sub">For job postings, CV submissions, or general enquiries — fill in the form below.</p>

             {sendErr && (
               <div style={{
                 background:'#FEE2E2', color:'#DC2626', border:'1.5px solid rgba(220,38,38,.2)',
                 borderRadius:'10px', padding:'13px 16px', fontSize:'14px',
                 fontWeight:'500', marginBottom:'18px', lineHeight:'1.5'
               }}>
                 ⚠️ {sendErr}
               </div>
             )}

             <form onSubmit={handleSubmit}>
               <div className="form-row">
                 <div className="form-group">
                   <label>First Name</label>
                   <input type="text" name="firstName" placeholder="e.g. Chioma" value={form.firstName} onChange={handleChange} required />
                 </div>
                 <div className="form-group">
                   <label>Last Name</label>
                   <input type="text" name="lastName" placeholder="e.g. Obi" value={form.lastName} onChange={handleChange} required />
                 </div>
               </div>
               <div className="form-group">
                 <label>Email Address</label>
                 <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
               </div>
               <div className="form-group">
                 <label>Phone Number</label>
                 <input type="tel" name="phone" placeholder="+234 XXX XXX XXXX" value={form.phone} onChange={handleChange} />
               </div>
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
               <div className="form-group">
                 <label>Subject</label>
                 <input type="text" name="subject" placeholder="e.g. Job Posting, CV Submission" value={form.subject} onChange={handleChange} required />
               </div>
               <div className="form-group">
                 <label>Message</label>
                 <textarea name="message" placeholder="Tell us what you're looking for..." value={form.message} onChange={handleChange} required />
               </div>

               <div className="form-group">
                 <label>
                   Attach CV / Resume
                   {isCvRequired
                     ? <span style={{color:'var(--red)',marginLeft:'4px',fontWeight:'800'}}>*</span>
                     : <span style={{color:'var(--grey-mid)',marginLeft:'6px',fontWeight:'400',fontSize:'11px',textTransform:'none',letterSpacing:0}}>(optional)</span>
                   }
                 </label>
                 <CvUpload cvFile={cvFile} setCvFile={file => { setCvFile(file); if(file) setCvErr(''); }} required={isCvRequired} />
                 {cvErr && (
                   <div style={{
                     color:'var(--red)', fontSize:'12px', fontWeight:'600',
                     marginTop:'6px', display:'flex', alignItems:'center', gap:'5px'
                   }}>
                     ⚠️ {cvErr}
                   </div>
                 )}
                 {isCvRequired && !cvFile && (
                   <div style={{
                     fontSize:'11px', color:'var(--grey-mid)', marginTop:'5px',
                     fontStyle:'italic'
                   }}>
                     A CV is required for Job Seeker / Candidate applications.
                   </div>
                 )}
               </div>

               <button
                 type="submit"
                 className={`form-submit${sent?' success':''}${sending?' sending':''}`}
                 disabled={sent || sending}
               >
                 {sent
                   ? "✅ Message Sent! We'll be in touch shortly."
                   : sending
                     ? '⏳ Sending...'
                     : '📩 Send Message'
                 }
               </button>
             </form>
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
       'Our Services': [['Recruitment & Staffing','#services'],['HR Outsourcing','#services'],['Job Placement','#services'],['Post a Job','#contact'],['Submit CV','#contact']],
       'Quick Links':  [['About Us','#about'],['How It Works','#how-it-works'],['Job Openings','#jobs'],['Testimonials','#testimonials'],['Contact Us','#contact']],
       'Industries':   [['Finance & Banking','#jobs'],['Engineering','#jobs'],['Sales & Marketing','#jobs'],['Healthcare','#jobs'],['Administration','#jobs']],
     };
     return (
       <footer className="footer">
         <div className="footer-grid">
           <div>
             <a href="#home" className="nav-logo" style={{marginBottom:'4px',display:'inline-flex'}}>
               <div className="nav-logo-icon">JVG</div>
               <div><span className="nav-logo-name">JVG Recruitment Solutions</span><span className="nav-logo-sub">Employment Solutions Nigeria</span></div>
             </a>
             <p className="footer-brand-desc">Connecting employers with the right talent across Nigeria. We provide recruitment, staffing, and HR outsourcing solutions to help businesses and job seekers succeed.</p>
             <span className="footer-tagline">✦ Connecting Employers with the Right Talent</span>
           </div>
           {Object.entries(cols).map(([heading, links]) => (
             <div className="footer-col" key={heading}>
               <h6>{heading}</h6>
               <ul>{links.map(([label,href]) => <li key={label}><a href={href}>{label}</a></li>)}</ul>
             </div>
           ))}
         </div>
         <div className="footer-bottom">
           <p>{secretTap} {new Date().getFullYear()} JVG Recruitment Solutions. All rights reserved.</p>
           <p>Recruitment Agency Nigeria &nbsp;|&nbsp; HR Outsourcing &nbsp;|&nbsp; Staffing Agency Abuja</p>
         </div>
       </footer>
     );
   }
   
   /* ══════════════════════════════════════════════════
      HIDDEN ADMIN ACCESS
      ══════════════════════════════════════════════════ */
   const SECRET_SEQUENCE = 'jvgadmin';
   
   function useSecretAccess(onUnlock) {
     const bufferRef = useRef('');
     useEffect(() => {
       const checkHash = () => {
         if (window.location.hash === '#jvg-admin') {
           window.history.replaceState(null, '', window.location.pathname);
           onUnlock();
         }
       };
       checkHash();
       window.addEventListener('hashchange', checkHash);
       const handleKey = (e) => {
         if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
         bufferRef.current = (bufferRef.current + e.key).slice(-SECRET_SEQUENCE.length);
         if (bufferRef.current === SECRET_SEQUENCE) { bufferRef.current = ''; onUnlock(); }
       };
       window.addEventListener('keydown', handleKey);
       return () => {
         window.removeEventListener('hashchange', checkHash);
         window.removeEventListener('keydown', handleKey);
       };
     }, [onUnlock]);
   }
   
   function SecretTap({ onUnlock }) {
     const countRef = useRef(0);
     const timerRef = useRef(null);
     const handleClick = () => {
       countRef.current += 1;
       clearTimeout(timerRef.current);
       timerRef.current = setTimeout(() => { countRef.current = 0; }, 3000);
       if (countRef.current >= 5) { countRef.current = 0; onUnlock(); }
     };
     return (
       <span onClick={handleClick} style={{ cursor:'default', userSelect:'none' }} aria-hidden="true">©</span>
     );
   }
   
   /* ══════════════════════════════════════════════════
      ROOT APP
      ══════════════════════════════════════════════════ */
   function App() {
     const [jobs,      setJobs]      = useState(loadJobs);
     const [adminOpen, setAdminOpen] = useState(false);
     const openAdmin = useCallback(() => setAdminOpen(true), []);
     useSecretAccess(openAdmin);
   
     return (
       <>
         <Navbar />
         <Hero />
         <About />
         <Services />
         <HowItWorks />
         <Jobs jobs={jobs} />
         <Testimonials />
         <CtaBanner />
         <Contact />
         <Footer secretTap={<SecretTap onUnlock={openAdmin} />} />
         {adminOpen && (
           <AdminPanel
             jobs={jobs}
             setJobs={setJobs}
             onClose={() => setAdminOpen(false)}
           />
         )}
       </>
     );
   }
   
   const root = ReactDOM.createRoot(document.getElementById('root'));
   root.render(<App />);