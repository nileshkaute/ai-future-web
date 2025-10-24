import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function App() {
  const calculateTimeLeft = () => {
    const target = new Date("2050-01-01T00:00:00").getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [activeSection, setActiveSection] = useState("home");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trailDots, setTrailDots] = useState([]);
  const [stats, setStats] = useState({
    aiParameters: 0,
    adoption: 0,
    countries: 0,
    jobs: 0
  });
  const [timelineYear, setTimelineYear] = useState(2025);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [particles, setParticles] = useState([]);
  const [hoveredYear, setHoveredYear] = useState(null);
  const [aiNews, setAiNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    technologies: useRef(null),
    services: useRef(null),
    predictions: useRef(null),
    contact: useRef(null)
  };

  // Framer Motion scroll animations
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Fetch AI News from free API
  useEffect(() => {
    const fetchAiNews = async () => {
      try {
        setLoadingNews(true);
        const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
        
        if (!apiKey) {
          throw new Error('API key not found');
        }

        const response = await fetch(
          `https://gnews.io/api/v4/search?q=artificial%20intelligence&lang=en&max=6&apikey=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        setAiNews(data.articles || []);
      } catch (error) {
        console.error("Error fetching AI news:", error);
        // Fallback news data
        setAiNews([
          {
            title: "AI Breakthrough: New Model Achieves Human-Level Reasoning",
            description: "Researchers announce major progress in artificial general intelligence capabilities.",
            source: { name: "AI Research Journal" },
            publishedAt: new Date().toISOString(),
            url: "#"
          },
          {
            title: "Global AI Summit Addresses Ethical Development",
            description: "World leaders collaborate on establishing guidelines for responsible AI advancement.",
            source: { name: "Tech News Daily" },
            publishedAt: new Date().toISOString(),
            url: "#"
          },
          {
            title: "Quantum Computing Accelerates AI Training Times",
            description: "New quantum algorithms reduce AI model training from weeks to hours.",
            source: { name: "Future Tech Review" },
            publishedAt: new Date().toISOString(),
            url: "#"
          }
        ]);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchAiNews();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animate statistics counter
  useEffect(() => {
    const targets = {
      aiParameters: 1750,
      adoption: 340,
      countries: 195,
      jobs: 97
    };

    const duration = 2500;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setStats({
        aiParameters: Math.floor(targets.aiParameters * progress),
        adoption: Math.floor(targets.adoption * progress),
        countries: Math.floor(targets.countries * progress),
        jobs: Math.floor(targets.jobs * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const newDot = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now() + Math.random()
      };
      setTrailDots((dots) => [...dots.slice(-10), newDot]);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      document.querySelectorAll(".parallax").forEach(el => {
        const speed = parseFloat(el.getAttribute("data-speed")) || 0.4;
        el.style.transform = `translateY(${y * speed}px)`;
      });

      const scrollPosition = window.scrollY + 100;
      Object.entries(sectionRefs).forEach(([section, ref]) => {
        if (ref.current && 
            ref.current.offsetTop <= scrollPosition && 
            ref.current.offsetTop + ref.current.offsetHeight > scrollPosition) {
          setActiveSection(section);
        }
      });

      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (section) => {
    sectionRefs[section].current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(section);
  };

  const timelineData = {
    2025: { title: "AI Integration", desc: "AI assistants in every workplace, smart homes become standard, autonomous delivery widespread." },
    2030: { title: "Smart Cities", desc: "Urban centers fully integrated with AI systems for optimal resource management and traffic flow." },
    2035: { title: "Medical AI", desc: "AI diagnoses diseases before symptoms, personalized medicine becomes the norm." },
    2040: { title: "Brain-AI Interface", desc: "Direct neural connections allowing thought-to-machine communication become commercial." },
    2045: { title: "AGI Achieved", desc: "First true Artificial General Intelligence emerges, matching human cognition." },
    2050: { title: "Human-AI Symbiosis", desc: "Seamless integration between human and artificial intelligence, enhanced cognition." },
    2060: { title: "Space AI", desc: "AI-managed habitats on Mars and Moon, autonomous deep space exploration." },
    2080: { title: "Post-Scarcity", desc: "AI automation creates abundance, work becomes optional and creative." },
    2100: { title: "Digital Consciousness", desc: "Consciousness uploading reality, humans exist in both physical and digital realms." }
  };

  const handleTimelineChange = (e) => {
    setTimelineYear(parseInt(e.target.value));
    
    // Create particle explosion effect
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1
    }));
    setParticles(newParticles);
    
    setTimeout(() => setParticles([]), 1000);
  };

  // Generate year milestones for interactive dots
  const yearMilestones = [2025, 2030, 2035, 2040, 2045, 2050, 2060, 2080, 2100];

  return (
    <div className="app mono-theme">
     
      <div className="bg-dots layer layer-fast" aria-hidden="true"></div>
      <div className="bg-dots layer layer-mid" aria-hidden="true"></div>
      <div className="bg-dots layer layer-slow" aria-hidden="true"></div>

      <div className="cursor-trail">
        {trailDots.map((dot, index) => (
          <div
            key={dot.id}
            className="cursor-trail-dot"
            style={{
              left: dot.x,
              top: dot.y,
              opacity: 1 - (index / trailDots.length),
              transform: `translate(-50%, -50%) scale(${0.5 + (index / trailDots.length) * 0.5})`
            }}
          ></div>
        ))}
      </div>

      <div 
        className="cursor-dot" 
        style={{ left: mousePosition.x, top: mousePosition.y }}
      ></div>
      <div 
        className="cursor-outline" 
        style={{ left: mousePosition.x, top: mousePosition.y }}
      ></div>

      <header className="nav-wrap">
        <nav className="nav container">
          <div className="brand">AI FUTURE</div>
          <ul className="nav-links">
            <li 
              className={activeSection === "home" ? "active" : ""}
              onClick={() => scrollToSection("home")}
            >Home</li>
            <li 
              className={activeSection === "about" ? "active" : ""}
              onClick={() => scrollToSection("about")}
            >Vision</li>
            <li 
              className={activeSection === "technologies" ? "active" : ""}
              onClick={() => scrollToSection("technologies")}
            >Tech</li>
            <li 
              className={activeSection === "services" ? "active" : ""}
              onClick={() => scrollToSection("services")}
            >Timeline</li>
            <li 
              className={activeSection === "predictions" ? "active" : ""}
              onClick={() => scrollToSection("predictions")}
            >Insights</li>
            <li 
              className={activeSection === "contact" ? "active" : ""}
              onClick={() => scrollToSection("contact")}
            >Connect</li>
          </ul>
        </nav>
      </header>

      <section className="hero container" ref={sectionRefs.home}>
        <div className="hero-left-eye">
          <div className="cyber-eye-container">
            <div className="cyber-eye">
              <div className="eye-outer-ring">
                <div className="eye-middle-ring">
                  <div className="eye-iris">
                    <div className="eye-pupil"></div>
                    <div className="eye-glow"></div>
                    <div className="eye-reflections">
                      <div className="reflection reflection-1"></div>
                      <div className="reflection reflection-2"></div>
                      <div className="reflection reflection-3"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="eye-circuits">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="circuit-line"></div>
                ))}
              </div>
              <div className="eye-particles">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="eye-particle"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          className="hero-center parallax" 
          data-speed="0.28"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="hero-title glitch-layers" data-text="THE AGE OF ARTIFICIAL INTELLIGENCE">
            <span>THE AGE OF</span>
            <span>ARTIFICIAL</span>
            <span>INTELLIGENCE</span>
          </h1>
          <p className="hero-subtitle">Exploring the horizon where human consciousness meets machine intelligence</p>
        </motion.div>

        <div className="hero-right-eye">
          <div className="cyber-eye-container">
            <div className="cyber-eye">
              <div className="eye-outer-ring">
                <div className="eye-middle-ring">
                  <div className="eye-iris">
                    <div className="eye-pupil"></div>
                    <div className="eye-glow"></div>
                    <div className="eye-reflections">
                      <div className="reflection reflection-1"></div>
                      <div className="reflection reflection-2"></div>
                      <div className="reflection reflection-3"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="eye-circuits">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="circuit-line"></div>
                ))}
              </div>
              <div className="eye-particles">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="eye-particle"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section 
        className="future container" 
        ref={sectionRefs.about}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title glitch-lite" data-text="The AI Revolution">The AI Revolution</h2>
        <motion.p 
          className="lead typewriter"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Artificial Intelligence is no longer science fiction—it's reshaping every aspect of human existence. 
          From quantum computing that processes information at unprecedented speeds to neural networks that understand 
          human emotions, we stand at the threshold of a new era. AGI (Artificial General Intelligence) will transform 
          industries, cure diseases, solve climate change, and perhaps even unlock the mysteries of consciousness itself. 
          The question isn't if AI will change everything—it's how we'll adapt to a world where machines think, learn, 
          and create alongside us.
        </motion.p>
      </motion.section>

      <motion.section 
        className="countdown container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="count-title">Countdown to the AI Singularity Era</h3>
        <div className="count-holder">
          {timeLeft ? (
            <>
              <motion.div 
                className="count-circle interactive-card"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="count-inner">
                  <div className="num">{String(timeLeft.days).padStart(2, "0")}</div>
                  <div className="label">Days</div>
                </div>
              </motion.div>
              <motion.div 
                className="count-circle interactive-card"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="count-inner">
                  <div className="num">{String(timeLeft.hours).padStart(2, "0")}</div>
                  <div className="label">Hours</div>
                </div>
              </motion.div>
              <motion.div 
                className="count-circle interactive-card"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="count-inner">
                  <div className="num">{String(timeLeft.minutes).padStart(2, "0")}</div>
                  <div className="label">Minutes</div>
                </div>
              </motion.div>
              <motion.div 
                className="count-circle interactive-card"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="count-inner">
                  <div className="num">{String(timeLeft.seconds).padStart(2, "0")}</div>
                  <div className="label">Seconds</div>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="arrival">Welcome to the Singularity</div>
          )}
        </div>
      </motion.section>

      {/* AI News Section */}
      <motion.section 
        className="ai-news container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{padding: '80px 0', borderBottom: '1px solid var(--line)'}}
      >
        <h3 className="section-title">Latest AI News</h3>
        <p className="typewriter" style={{marginBottom: '60px'}}>
          Stay updated with the latest developments in artificial intelligence
        </p>
        
        {loadingNews ? (
          <div style={{textAlign: 'center', color: 'var(--muted)'}}>
            Loading latest AI news...
          </div>
        ) : (
          <motion.div 
            className="news-grid"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              marginTop: '40px'
            }}
          >
            {aiNews.map((article, index) => (
              <motion.article
                key={index}
                className="news-card interactive-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '30px',
                  transition: 'all 0.3s ease'
                }}
              >
                <h4 style={{
                  fontSize: '1.2rem',
                  color: 'var(--fg)',
                  marginBottom: '15px',
                  lineHeight: '1.4'
                }}>
                  {article.title}
                </h4>
                <p style={{
                  color: 'var(--muted)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  marginBottom: '15px'
                }}>
                  {article.description}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--muted)'
                }}>
                  <span>{article.source.name}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </motion.section>

      <motion.section 
        className="ai-stats container" 
        style={{padding: '80px 0', borderBottom: '1px solid var(--line)'}}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="section-title">AI in Numbers</h3>
        <motion.p 
          className="typewriter" 
          style={{marginBottom: '60px'}}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          The exponential growth of artificial intelligence is reshaping our world at an unprecedented pace
        </motion.p>
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginTop: '40px'
        }}>
          <motion.div 
            className="stat-card interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{fontSize: 'clamp(2.5rem, 4rem, 4.5rem)', fontWeight: '900', color: 'var(--fg)', marginBottom: '12px'}}>
              {stats.aiParameters}B+
            </div>
            <div style={{fontSize: '1rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>
              AI Parameters Trained
            </div>
            <div style={{fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px', fontStyle: 'italic'}}>
              Leading models worldwide
            </div>
          </motion.div>

          <motion.div 
            className="stat-card interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{fontSize: 'clamp(2.5rem, 4rem, 4.5rem)', fontWeight: '900', color: 'var(--fg)', marginBottom: '12px'}}>
              {stats.adoption}%
            </div>
            <div style={{fontSize: '1rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>
              Increase in AI Adoption
            </div>
            <div style={{fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px', fontStyle: 'italic'}}>
              Enterprise sector growth
            </div>
          </motion.div>

          <motion.div 
            className="stat-card interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{fontSize: 'clamp(2.5rem, 4rem, 4.5rem)', fontWeight: '900', color: 'var(--fg)', marginBottom: '12px'}}>
              {stats.countries}
            </div>
            <div style={{fontSize: '1rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>
              Countries Leading AI
            </div>
            <div style={{fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px', fontStyle: 'italic'}}>
              Global AI research hubs
            </div>
          </motion.div>

          <motion.div 
            className="stat-card interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{fontSize: 'clamp(2.5rem, 4rem, 4.5rem)', fontWeight: '900', color: 'var(--fg)', marginBottom: '12px'}}>
              {stats.jobs}M+
            </div>
            <div style={{fontSize: '1rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px'}}>
              Jobs Created by AI
            </div>
            <div style={{fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px', fontStyle: 'italic'}}>
              New opportunities emerging
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="interactive-timeline container" 
        style={{padding: '80px 0', borderBottom: '1px solid var(--line)', textAlign: 'center'}}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="section-title">Interactive AI Timeline</h3>
        <motion.p 
          className="typewriter" 
          style={{marginBottom: '60px'}}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Slide through time to explore AI's evolution from today to 2100
        </motion.p>
        
        <div style={{maxWidth: '900px', margin: '0 auto', padding: '0 20px'}}>
          <motion.div 
            style={{
              background: 'var(--panel)',
              padding: '60px 40px',
              borderRadius: '20px',
              border: '1px solid var(--line)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
            whileHover={{ boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}
          >
            {/* Animated background particles */}
            {particles.map(particle => (
              <div
                key={particle.id}
                style={{
                  position: 'absolute',
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: '4px',
                  height: '4px',
                  background: 'var(--fg)',
                  borderRadius: '50%',
                  opacity: particle.life,
                  pointerEvents: 'none',
                  animation: 'particleFade 1s ease-out forwards'
                }}
              />
            ))}
            
            <motion.div 
              style={{
                fontSize: 'clamp(3rem, 5rem, 6rem)',
                fontWeight: '900',
                color: 'var(--fg)',
                marginBottom: '20px',
                textShadow: '0 0 30px rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                transform: hoveredYear ? 'scale(1.05)' : 'scale(1)'
              }}
              key={timelineYear}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {timelineYear}
            </motion.div>
            
            <motion.div 
              style={{
                fontSize: 'clamp(1.5rem, 2rem, 2.5rem)',
                fontWeight: '700',
                color: 'var(--fg)',
                marginBottom: '16px',
                transition: 'all 0.3s ease'
              }}
              key={timelineYear + 'title'}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {timelineData[timelineYear]?.title || "The Future Unfolds"}
            </motion.div>
            
            <motion.div 
              style={{
                fontSize: 'clamp(1rem, 1.1rem, 1.2rem)',
                color: 'var(--muted)',
                lineHeight: '1.8',
                marginBottom: '40px',
                minHeight: '80px',
                transition: 'all 0.3s ease'
              }}
              key={timelineYear + 'desc'}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {timelineData[timelineYear]?.desc || "Exploring the unknown..."}
            </motion.div>

            {/* Visual progress indicator */}
            <div style={{
              width: '100%',
              height: '4px',
              background: 'var(--line)',
              borderRadius: '2px',
              marginBottom: '30px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((timelineYear - 2025) / 75) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--fg), var(--muted))',
                transition: 'width 0.3s ease',
                boxShadow: '0 0 10px rgba(255,255,255,0.5)'
              }}></div>
            </div>

            {/* Interactive milestone dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '30px',
              padding: '0 10px',
              position: 'relative'
            }}>
              {yearMilestones.map(year => (
                <motion.div
                  key={year}
                  onClick={() => setTimelineYear(year)}
                  onMouseEnter={() => setHoveredYear(year)}
                  onMouseLeave={() => setHoveredYear(null)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: timelineYear === year ? 'var(--fg)' : 'var(--line)',
                    border: '2px solid var(--fg)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: hoveredYear === year ? 'scale(1.5)' : timelineYear === year ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: timelineYear === year ? '0 0 20px rgba(255,255,255,0.8)' : 'none',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap',
                    opacity: hoveredYear === year ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    fontWeight: '600'
                  }}>
                    {year}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div style={{position: 'relative', padding: '20px 0'}}>
              <input
                type="range"
                min="2025"
                max="2100"
                step="5"
                value={timelineYear}
                onChange={handleTimelineChange}
                style={{
                  width: '100%',
                  height: '8px',
                  background: `linear-gradient(to right, var(--fg) 0%, var(--fg) ${((timelineYear - 2025) / 75) * 100}%, var(--line) ${((timelineYear - 2025) / 75) * 100}%, var(--line) 100%)`,
                  outline: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                  appearance: 'none'
                }}
              />
              <style>{`
                @keyframes particleFade {
                  from {
                    opacity: 1;
                    transform: translate(0, 0) scale(1);
                  }
                  to {
                    opacity: 0;
                    transform: translate(var(--particle-x, 0), var(--particle-y, 0)) scale(0);
                  }
                }
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 28px;
                  height: 28px;
                  background: var(--fg);
                  cursor: pointer;
                  border-radius: 50%;
                  box-shadow: 0 0 15px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.3);
                  transition: all 0.3s ease;
                  border: 3px solid rgba(0,0,0,0.8);
                }
                input[type="range"]::-webkit-slider-thumb:hover {
                  transform: scale(1.4);
                  box-shadow: 0 0 25px rgba(255,255,255,0.9), 0 0 50px rgba(255,255,255,0.5);
                }
                input[type="range"]::-webkit-slider-thumb:active {
                  transform: scale(1.2);
                  box-shadow: 0 0 30px rgba(255,255,255,1), 0 0 60px rgba(255,255,255,0.7);
                }
                input[type="range"]::-moz-range-thumb {
                  width: 28px;
                  height: 28px;
                  background: var(--fg);
                  cursor: pointer;
                  border-radius: 50%;
                  border: 3px solid rgba(0,0,0,0.8);
                  box-shadow: 0 0 15px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.3);
                  transition: all 0.3s ease;
                }
                input[type="range"]::-moz-range-thumb:hover {
                  transform: scale(1.4);
                  box-shadow: 0 0 25px rgba(255,255,255,0.9), 0 0 50px rgba(255,255,255,0.5);
                }
                input[type="range"]::-moz-range-thumb:active {
                  transform: scale(1.2);
                  box-shadow: 0 0 30px rgba(255,255,255,1), 0 0 60px rgba(255,255,255,0.7);
                }
              `}</style>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '16px',
                fontSize: '0.9rem',
                color: 'var(--muted)',
                fontWeight: '600'
              }}>
                <span style={{
                  padding: '4px 12px',
                  background: timelineYear <= 2030 ? 'var(--panel-strong)' : 'transparent',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}>2025</span>
                <span style={{
                  padding: '4px 12px',
                  background: timelineYear >= 2045 && timelineYear <= 2055 ? 'var(--panel-strong)' : 'transparent',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}>2050</span>
                <span style={{
                  padding: '4px 12px',
                  background: timelineYear >= 2095 ? 'var(--panel-strong)' : 'transparent',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}>2100</span>
              </div>
            </div>

            {/* Fun fact indicator */}
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              fontSize: '0.9rem',
              color: 'var(--muted)',
              fontStyle: 'italic',
              lineHeight: '1.6'
            }}>
              💡 <strong style={{color: 'var(--fg)'}}>Did you know?</strong> You're exploring {Math.floor((timelineYear - 2025) / 75 * 100)}% into the future timeline. Keep sliding to discover what awaits humanity!
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="timeline container" 
        ref={sectionRefs.technologies}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="section-title">Breakthrough AI Technologies</h3>
        <div className="timeline-grid">
          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.12"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">AGI</span>
            <h4>General Intelligence</h4>
            <p>AI systems with human-level reasoning across all cognitive tasks, capable of learning any intellectual task humans can perform.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.18"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">Quantum</span>
            <h4>Quantum AI</h4>
            <p>Quantum computers running AI algorithms, solving previously impossible problems in cryptography, drug discovery, and optimization.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.22"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">Neural</span>
            <h4>Brain-Computer Interface</h4>
            <p>Direct neural connections allowing thought-to-machine communication, memory enhancement, and consciousness expansion.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">Bio-AI</span>
            <h4>Biological Intelligence</h4>
            <p>AI-designed proteins and organisms, synthetic biology creating living computers and biological nanomachines.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.14"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">Swarm</span>
            <h4>Collective Intelligence</h4>
            <p>Millions of AI agents working together, creating emergent intelligence greater than the sum of its parts.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.20"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">Emotional</span>
            <h4>Empathetic AI</h4>
            <p>AI systems that genuinely understand and respond to human emotions, revolutionizing therapy, education, and companionship.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.15"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">Creative</span>
            <h4>Artistic Intelligence</h4>
            <p>AI creating original art, music, literature, and scientific theories that push boundaries of human creativity.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.19"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">Molecular</span>
            <h4>Nano-AI</h4>
            <p>Microscopic AI-powered robots operating at cellular level, revolutionizing medicine and material science.</p>
          </motion.article>
        </div>
      </motion.section>

      <motion.section 
        className="timeline container" 
        ref={sectionRefs.services}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="section-title">Timeline of AI Evolution</h3>
        <div className="timeline-grid">
          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.12"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">2025-2030</span>
            <h4>AI Everywhere</h4>
            <p>AI assistants become ubiquitous, autonomous vehicles dominate roads, and personalized AI tutors transform education globally.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.18"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">2030-2035</span>
            <h4>Medical Revolution</h4>
            <p>AI diagnoses diseases before symptoms appear, designs personalized treatments, and extends human lifespan by decades.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.22"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">2035-2040</span>
            <h4>Climate Solutions</h4>
            <p>AI-designed carbon capture systems reverse climate change, optimize global energy grids, and restore ecosystems.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">2040-2045</span>
            <h4>AGI Emergence</h4>
            <p>First true Artificial General Intelligence emerges, capable of matching human cognition across all domains.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.14"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">2045-2050</span>
            <h4>Human-AI Symbiosis</h4>
            <p>Brain-computer interfaces merge human and artificial intelligence, creating hybrid consciousness and enhanced cognition.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.20"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">2050-2060</span>
            <h4>Space Colonization</h4>
            <p>AI-managed habitats on Mars and Moon, autonomous spacecraft exploring distant stars, mining asteroids for resources.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.15"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">2060-2080</span>
            <h4>Post-Scarcity Economy</h4>
            <p>AI automation creates abundance, universal basic income becomes global standard, work becomes optional and creative.</p>
          </motion.article>

          <motion.article 
            className="timeline-card interactive-card parallax" 
            data-speed="0.19"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">2080-2100</span>
            <h4>Digital Immortality</h4>
            <p>Consciousness uploading becomes reality, humans exist simultaneously in physical and digital realms, death becomes optional.</p>
          </motion.article>
        </div>
      </motion.section>

      <motion.section 
        className="voices container" 
        ref={sectionRefs.predictions}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="section-title">Visionary Insights</h3>
        <div className="quotes-grid">
          <motion.div 
            className="quote interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="quote-text">"The development of full artificial intelligence could spell the end of the human race or the beginning of our greatest chapter."</div>
            <div className="quote-author">— Stephen Hawking</div>
          </motion.div>
          <motion.div 
            className="quote interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="quote-text">"AI is probably the most important thing humanity has ever worked on. I think of it as something more profound than electricity or fire."</div>
            <div className="quote-author">— Sundar Pichai</div>
          </motion.div>
          <motion.div 
            className="quote interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="quote-text">"The question isn't whether AI will change humanity. The question is: will we use it to become more human, or less?"</div>
            <div className="quote-author">— AI Ethics Council</div>
          </motion.div>
          <motion.div 
            className="quote interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="quote-text">"By 2050, AI won't replace humans. Instead, humans will merge with AI, creating a new form of augmented intelligence."</div>
            <div className="quote-author">— Ray Kurzweil</div>
          </motion.div>
          <motion.div 
            className="quote interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <div className="quote-text">"The real risk with AI isn't malice but competence. A super-intelligent AI will be extremely good at accomplishing its goals."</div>
            <div className="quote-author">— Nick Bostrom</div>
          </motion.div>
          <motion.div 
            className="quote interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <div className="quote-text">"We're creating gods. We can only hope they're benevolent ones."</div>
            <div className="quote-author">— Elon Musk</div>
          </motion.div>
          <motion.div 
            className="quote interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{ y: -5 }}
          >
            <div className="quote-text">"The key question about AI is not whether it will be smarter than humans, but whether humans will be wise enough to stay in control."</div>
            <div className="quote-author">— Yuval Noah Harari</div>
          </motion.div>
          <motion.div 
            className="quote interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <div className="quote-text">"Machine intelligence is the last invention that humanity will ever need to make. From that point forward, AI will create everything we need."</div>
            <div className="quote-author">— Nick Bostrom</div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="future container" 
        style={{borderBottom: '1px solid var(--line)', paddingBottom: '100px'}}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title">AI Transformation Across Industries</h2>
        <div className="timeline-grid" style={{marginTop: '60px'}}>
          <motion.article 
            className="timeline-card interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">🏥</span>
            <h4>Healthcare</h4>
            <p>Personalized medicine, early disease detection, AI surgeons, drug discovery at lightning speed, and mental health support available 24/7.</p>
          </motion.article>
          <motion.article 
            className="timeline-card interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">🎓</span>
            <h4>Education</h4>
            <p>Adaptive learning systems, AI tutors for every student, instant language translation, and education accessible to everyone globally.</p>
          </motion.article>
          <motion.article 
            className="timeline-card interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">🌾</span>
            <h4>Agriculture</h4>
            <p>Precision farming, crop optimization, vertical farms in cities, and AI solving food scarcity for 10 billion people.</p>
          </motion.article>
          <motion.article 
            className="timeline-card interactive-card"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -10 }}
          >
            <span className="year">⚖️</span>
            <h4>Justice</h4>
            <p>Predictive crime prevention, bias-free legal analysis, faster court proceedings, and rehabilitation programs that actually work.</p>
          </motion.article>
        </div>
      </motion.section>

      <motion.section 
        className="contact container" 
        ref={sectionRefs.contact}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="section-title">Join the AI Revolution</h3>
        <div className="contact-grid">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4>Shape Tomorrow Together</h4>
            <p>Whether you're a researcher, developer, entrepreneur, or simply fascinated by AI's potential, we want to hear from you. Let's collaborate to ensure AI benefits all of humanity.</p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <span>Global Digital Network</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>future@ai-revolution.io</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <span>AI Research Community</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="contact-form interactive-card"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div>
              <div className="form-group">
                <input type="text" placeholder="Your Name" />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Area of Interest (AI Research, Development, Ethics, etc.)" />
              </div>
              <div className="form-group">
                <textarea placeholder="Share your vision for AI's future..." rows="4"></textarea>
              </div>
              <motion.button 
                type="button" 
                className="submit-btn" 
                onClick={() => alert('Thank you for connecting!')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Connect With Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.footer 
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="brand">AI FUTURE</div>
            <p>Pioneering the responsible development of artificial intelligence for humanity's benefit.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h5>Navigate</h5>
              <ul>
                <li onClick={() => scrollToSection("home")}>Home</li>
                <li onClick={() => scrollToSection("about")}>Vision</li>
                <li onClick={() => scrollToSection("technologies")}>Technologies</li>
                <li onClick={() => scrollToSection("services")}>Timeline</li>
                <li onClick={() => scrollToSection("predictions")}>Insights</li>
                <li onClick={() => scrollToSection("contact")}>Connect</li>
              </ul>
            </div>
            <div className="footer-column">
              <h5>Resources</h5>
              <ul>
                <li>AI Research Papers</li>
                <li>Ethics Guidelines</li>
                <li>Developer APIs</li>
                <li>Learning Center</li>
                <li>Community Forum</li>
              </ul>
            </div>
            <div className="footer-column">
              <h5>Follow</h5>
              <ul>
                <li>GitHub</li>
                <li>Research Blog</li>
                <li>LinkedIn</li>
                <li>Twitter/X</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© {new Date().getFullYear()} AI FUTURE — Building tomorrow's intelligence, responsibly. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;