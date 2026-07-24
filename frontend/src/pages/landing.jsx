import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Users,
  Sparkles,
  Zap,
  Star,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Share2,
  Calendar,
  Lock,
  ArrowRight,
  Heart,
  PhoneCall,
  X,
  Play,
  CheckCircle2,
  Bot
} from "lucide-react";
import "../App.css";

// --------------------------------------------------------------------------
// Animated Count Up Component
// --------------------------------------------------------------------------
const CountUp = ({ end, duration = 2, suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const currentCount = progress * end;
      setCount(decimals > 0 ? parseFloat(currentCount.toFixed(decimals)) : Math.floor(currentCount));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, decimals]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Modals state
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [meetingCodeInput, setMeetingCodeInput] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  // Interactive controls mock state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Scroll listener for glass navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse move listener for background spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle instant meeting creation or join
  const handleJoinOrCreateMeeting = (codeToUse) => {
    const room = codeToUse || meetingCodeInput || Math.floor(100000 + Math.random() * 900000).toString();
    navigate(`/${room}`);
  };

  return (
    <div style={{ backgroundColor: "#09090B", color: "#F4F4F5", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      {/* --------------------------------------------------------------------
          Dynamic Mouse Spotlight & Ambient Aurora Blobs
         -------------------------------------------------------------------- */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.12), transparent 80%)`,
        }}
      />

      <div className="aurora-blob aurora-purple" style={{ top: "-100px", left: "-150px" }} />
      <div className="aurora-blob aurora-blue" style={{ top: "300px", right: "-100px" }} />
      <div className="aurora-blob aurora-pink" style={{ bottom: "200px", left: "20%" }} />

      {/* Grid Pattern Overlay */}
      <div className="bg-grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.6, pointerEvents: "none" }} />

      {/* --------------------------------------------------------------------
          Navigation Bar
         -------------------------------------------------------------------- */}
      <header
        className={`glass-nav`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: scrolled ? "0.9rem 2.5rem" : "1.3rem 2.5rem",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }} onClick={() => navigate("/")}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
            }}
          >
            <Video style={{ width: "22px", height: "22px", color: "#FFF" }} />
          </div>
          <span className="heading-font" style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFF", letterSpacing: "-0.02em" }}>
            MeetFlow <span style={{ color: "#8B5CF6" }}>AI</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav style={{ display: "flex", gap: "2.2rem", alignItems: "center" }} className="desktop-nav">
          {["Features", "Solutions", "Pricing", "Resources", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                color: "#A1A1AA",
                fontSize: "0.95rem",
                fontWeight: "500",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#FFF")}
              onMouseLeave={(e) => (e.target.style.color = "#A1A1AA")}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Header Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => navigate("/auth")}
            style={{
              background: "transparent",
              color: "#E4E4E7",
              border: "none",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
              padding: "0.6rem 1.1rem",
              borderRadius: "10px",
              transition: "color 0.2s ease",
            }}
          >
            Log in
          </button>
          <button
            onClick={() => setShowMeetingModal(true)}
            className="glow-btn-primary"
            style={{ padding: "0.75rem 1.4rem", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Sparkles style={{ width: "16px", height: "16px" }} />
            Start Meeting
          </button>
        </div>
      </header>

      {/* --------------------------------------------------------------------
          Hero Section
         -------------------------------------------------------------------- */}
      <section style={{ paddingTop: "9rem", paddingBottom: "5rem", position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", paddingInline: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "4rem", alignItems: "center" }}>
          {/* Left Column: Hero Copy & Actions */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            {/* Announcement Badge */}
            <div
              className="glass-pill"
              onClick={() => setShowMeetingModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.4rem 1.1rem",
                marginBottom: "1.8rem",
                cursor: "pointer",
                border: "1px solid rgba(139, 92, 246, 0.4)",
                boxShadow: "0 0 15px rgba(139, 92, 246, 0.2)",
              }}
            >
              <span style={{ background: "#8B5CF6", color: "#FFF", fontSize: "0.75rem", fontWeight: "700", padding: "0.15rem 0.6rem", borderRadius: "999px" }}>
                New
              </span>
              <span style={{ fontSize: "0.88rem", color: "#E4E4E7", fontWeight: "500" }}>
                MeetFlow 2.0 is here! Check out what's new
              </span>
              <ArrowRight style={{ width: "14px", height: "14px", color: "#A78BFA" }} />
            </div>

            {/* Main Headline */}
            <h1 className="heading-font" style={{ fontSize: "4rem", fontWeight: "800", lineHeight: "1.08", marginBottom: "1.5rem" }}>
              Meet, Connect, <br />
              <span className="animated-gradient-text">Create Together.</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: "1.15rem", color: "#A1A1AA", lineHeight: "1.7", marginBottom: "2.4rem", maxWidth: "560px" }}>
              The smartest AI meeting platform that makes collaboration effortless with instant video meetings, real-time AI summaries, live notes, and end-to-end encryption.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", marginBottom: "3rem" }}>
              <button
                onClick={() => handleJoinOrCreateMeeting()}
                className="glow-btn-primary"
                style={{ padding: "1rem 2rem", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}
              >
                <Video style={{ width: "20px", height: "20px" }} />
                Create Meeting
                <ArrowRight style={{ width: "18px", height: "18px" }} />
              </button>

              <button
                onClick={() => setShowMeetingModal(true)}
                className="glow-btn-secondary"
                style={{ padding: "1rem 2rem", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}
              >
                <Play style={{ width: "18px", height: "18px", color: "#A78BFA" }} />
                Join Meeting
              </button>
            </div>

            {/* User Avatars & 5-Star Social Proof */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
              <div style={{ display: "flex" }}>
                {["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg", "/avatar4.jpg"].map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="User"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "2px solid #09090B",
                      marginLeft: idx === 0 ? "0" : "-12px",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: "0.2rem", color: "#F59E0B", marginBottom: "0.25rem" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} style={{ width: "16px", height: "16px", fill: "#F59E0B" }} />
                  ))}
                </div>
                <p style={{ fontSize: "0.88rem", color: "#A1A1AA", fontWeight: "500" }}>
                  Loved by <strong style={{ color: "#FFF" }}>10K+</strong> users worldwide
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Reference-Inspired Floating Video Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative" }}
          >
            {/* Continuous Pulsing Heart Icon near Hero Video Frame */}
            <div
              className="heart-pulse"
              style={{
                position: "absolute",
                top: "-25px",
                left: "-25px",
                zIndex: 30,
                width: "52px",
                height: "52px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 30px rgba(236, 72, 153, 0.8)",
                cursor: "pointer",
              }}
            >
              <Heart style={{ width: "26px", height: "26px", color: "#FFF", fill: "#FFF" }} />
            </div>

            {/* Hand-drawn style Annotation: "Work from anywhere ✨" */}
            <div
              style={{
                position: "absolute",
                bottom: "-35px",
                right: "10px",
                zIndex: 30,
                color: "#A78BFA",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              className="animate-float"
            >
              <svg width="45" height="35" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "rotate(-15deg)" }}>
                <path d="M5 35 Q 25 5, 45 20" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M40 12 L 46 21 L 36 24" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span className="font-handwriting" style={{ fontSize: "1.1rem", fontWeight: "600", color: "#E4E4E7" }}>
                Work from anywhere ✨
              </span>
            </div>

            {/* Floating People Badge (Top Right of Frame matching reference image) */}
            <div
              className="glass-card animate-float-reverse"
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                zIndex: 25,
                padding: "0.7rem 1.2rem",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "rgba(124, 58, 237, 0.85)",
                boxShadow: "0 10px 25px rgba(124, 58, 237, 0.4)",
              }}
            >
              <Users style={{ width: "20px", height: "20px", color: "#FFF" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFF" }}>4 Active Peers</span>
            </div>

            {/* Floating AI Assistant Widget Card */}
            <div
              className="glass-card animate-float"
              style={{
                position: "absolute",
                top: "22%",
                left: "-45px",
                zIndex: 25,
                padding: "0.85rem 1.2rem",
                maxWidth: "240px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "rgba(18, 18, 28, 0.88)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #06B6D4, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot style={{ width: "20px", height: "20px", color: "#FFF" }} />
              </div>
              <div>
                <p style={{ fontSize: "0.78rem", color: "#8B5CF6", fontWeight: "700" }}>MeetFlow AI</p>
                <p style={{ fontSize: "0.82rem", color: "#FFF", fontWeight: "500" }}>Summary generated!</p>
              </div>
            </div>

            {/* Main Tablet Video Window (Reference Image Inspired) */}
            <div
              className="glass-card"
              style={{
                borderRadius: "28px",
                padding: "1rem",
                background: "rgba(15, 15, 23, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(139, 92, 246, 0.25)",
              }}
            >
              {/* Window Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: "0.6rem", marginBottom: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 10px #22C55E" }} />
                  <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#FFF" }}>Team Sync</span>
                  <span style={{ fontSize: "0.8rem", color: "#A1A1AA" }}>30:25</span>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#EF4444" }} />
                  <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F59E0B" }} />
                  <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }} />
                </div>
              </div>

              {/* 2x2 Grid Video Stream Participants (Matching reference images) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.8rem" }}>
                {/* Stream 1 */}
                <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", height: "180px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <img src="/avatar1.jpg" alt="Participant 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", padding: "0.25rem 0.7rem", borderRadius: "8px", backdropFilter: "blur(6px)", fontSize: "0.78rem", fontWeight: "600" }}>
                    Alex Chen
                  </div>
                </div>

                {/* Stream 2 */}
                <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", height: "180px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <img src="/avatar2.jpg" alt="Participant 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(236, 72, 153, 0.85)", padding: "0.25rem 0.6rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700" }}>
                    hello ✨
                  </div>
                  <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", padding: "0.25rem 0.7rem", borderRadius: "8px", backdropFilter: "blur(6px)", fontSize: "0.78rem", fontWeight: "600" }}>
                    Sarah Jenkins
                  </div>
                </div>

                {/* Stream 3 */}
                <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", height: "180px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <img src="/avatar3.jpg" alt="Participant 3" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", padding: "0.25rem 0.7rem", borderRadius: "8px", backdropFilter: "blur(6px)", fontSize: "0.78rem", fontWeight: "600" }}>
                    Mei Ling
                  </div>
                </div>

                {/* Stream 4 */}
                <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", height: "180px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <img src="/avatar4.jpg" alt="Participant 4" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.6)", padding: "0.25rem 0.7rem", borderRadius: "8px", backdropFilter: "blur(6px)", fontSize: "0.78rem", fontWeight: "600" }}>
                    Rohan Sharma
                  </div>
                </div>
              </div>

              {/* Bottom Control Bar */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.8rem", padding: "0.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "18px" }}>
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    border: "none",
                    background: isMicOn ? "rgba(255,255,255,0.12)" : "#EF4444",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isMicOn ? <Mic style={{ width: "18px", height: "18px" }} /> : <MicOff style={{ width: "18px", height: "18px" }} />}
                </button>

                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    border: "none",
                    background: isVideoOn ? "rgba(255,255,255,0.12)" : "#EF4444",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isVideoOn ? <Video style={{ width: "18px", height: "18px" }} /> : <VideoOff style={{ width: "18px", height: "18px" }} />}
                </button>

                <button style={{ width: "42px", height: "42px", borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.12)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Share2 style={{ width: "18px", height: "18px" }} />
                </button>

                <button style={{ width: "42px", height: "42px", borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.12)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <MessageSquare style={{ width: "18px", height: "18px" }} />
                </button>

                <button style={{ width: "48px", height: "42px", borderRadius: "20px", border: "none", background: "#EF4444", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <PhoneOff style={{ width: "20px", height: "20px" }} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Trusted Brands Logos Bar
         -------------------------------------------------------------------- */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBlock: "2.5rem", background: "rgba(0,0,0,0.4)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingInline: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.85rem", textTransform: "uppercase", tracking: "0.1em", color: "#71717A", fontWeight: "600", marginBottom: "1.8rem" }}>
            Trusted by modern teams at
          </p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "3.5rem", flexWrap: "wrap", opacity: 0.65 }}>
            {["Microsoft", "Google", "Spotify", "Airbnb", "Notion", "Slack"].map((brand) => (
              <span key={brand} className="heading-font" style={{ fontSize: "1.3rem", fontWeight: "700", color: "#D4D4D8", letterSpacing: "-0.02em" }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Statistics Cards Section (4 Glass Cards with Count-Up Numbers)
         -------------------------------------------------------------------- */}
      <section style={{ paddingBlock: "6rem", maxWidth: "1280px", margin: "0 auto", paddingInline: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.8rem" }}>
          {/* Card 1 */}
          <motion.div whileHover={{ y: -6 }} className="glass-card" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(139, 92, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Video style={{ width: "26px", height: "26px", color: "#8B5CF6" }} />
            </div>
            <div>
              <h3 className="heading-font" style={{ fontSize: "2.2rem", fontWeight: "800", color: "#FFF" }}>
                <CountUp end={500} suffix="K+" />
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#A1A1AA", fontWeight: "500" }}>Meetings Hosted</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div whileHover={{ y: -6 }} className="glass-card" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "rgba(6, 182, 212, 0.15)", border: "1px solid rgba(6, 182, 212, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users style={{ width: "26px", height: "26px", color: "#06B6D4" }} />
            </div>
            <div>
              <h3 className="heading-font" style={{ fontSize: "2.2rem", fontWeight: "800", color: "#FFF" }}>
                <CountUp end={10} suffix="K+" />
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#A1A1AA", fontWeight: "500" }}>Active Users</p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div whileHover={{ y: -6 }} className="glass-card" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap style={{ width: "26px", height: "26px", color: "#3B82F6" }} />
            </div>
            <div>
              <h3 className="heading-font" style={{ fontSize: "2.2rem", fontWeight: "800", color: "#FFF" }}>
                <CountUp end={99.9} decimals={1} suffix="%" />
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#A1A1AA", fontWeight: "500" }}>Uptime Guaranteed</p>
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div whileHover={{ y: -6 }} className="glass-card" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Star style={{ width: "26px", height: "26px", color: "#F59E0B" }} />
            </div>
            <div>
              <h3 className="heading-font" style={{ fontSize: "2.2rem", fontWeight: "800", color: "#FFF" }}>
                <CountUp end={4.9} decimals={1} suffix="★" />
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#A1A1AA", fontWeight: "500" }}>User Rating</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Floating Features Section ("Everything you need, in one beautiful place.")
         -------------------------------------------------------------------- */}
      <section id="features" style={{ paddingBlock: "6rem", maxWidth: "1280px", margin: "0 auto", paddingInline: "2rem", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <div className="glass-pill" style={{ display: "inline-flex", padding: "0.4rem 1.2rem", marginBottom: "1rem", color: "#8B5CF6", fontWeight: "600", fontSize: "0.88rem" }}>
            Why MeetFlow?
          </div>
          <h2 className="heading-font" style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1rem" }}>
            Everything you need, <br />
            in one <span className="animated-gradient-text">beautiful place.</span>
          </h2>
          <p style={{ color: "#A1A1AA", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            High-definition video calls, automated AI summaries, real-time collaboration, and zero friction.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>
          {[
            {
              icon: <Video style={{ width: "28px", height: "28px", color: "#8B5CF6" }} />,
              title: "HD Video Calls",
              desc: "Crystal clear 4K video and spatial audio for seamless conversations.",
            },
            {
              icon: <Share2 style={{ width: "28px", height: "28px", color: "#06B6D4" }} />,
              title: "Screen Sharing",
              desc: "Share your screen instantly with high frame rates and low latency.",
            },
            {
              icon: <MessageSquare style={{ width: "28px", height: "28px", color: "#EC4899" }} />,
              title: "Live Chat & Reactions",
              desc: "Real-time in-meeting messaging and emojis to keep everyone in the loop.",
            },
            {
              icon: <Bot style={{ width: "28px", height: "28px", color: "#3B82F6" }} />,
              title: "AI Meeting Notes",
              desc: "Automated summaries, key decisions, and action items generated instantly.",
            },
            {
              icon: <Lock style={{ width: "28px", height: "28px", color: "#10B981" }} />,
              title: "End-to-End Security",
              desc: "Your privacy is our priority with enterprise-grade AES-256 encryption.",
            },
            {
              icon: <Calendar style={{ width: "28px", height: "28px", color: "#F59E0B" }} />,
              title: "Smart Scheduling",
              desc: "Seamless Google & Outlook calendar sync with automatic room links.",
            },
          ].map((feature, idx) => (
            <motion.div key={idx} whileHover={{ y: -8 }} className="glass-card" style={{ padding: "2.2rem" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                {feature.icon}
              </div>
              <h3 className="heading-font" style={{ fontSize: "1.35rem", fontWeight: "700", color: "#FFF", marginBottom: "0.6rem" }}>
                {feature.title}
              </h3>
              <p style={{ color: "#A1A1AA", fontSize: "0.98rem", lineHeight: "1.6" }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Gen-Z Aesthetic Spotlight Card
         -------------------------------------------------------------------- */}
      <section style={{ paddingBlock: "5rem", maxWidth: "1280px", margin: "0 auto", paddingInline: "2rem" }}>
        <div
          className="glass-card"
          style={{
            padding: "4rem 3rem",
            background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.1) 100%)",
            border: "1px solid rgba(139,92,246,0.3)",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          <div>
            <h2 className="heading-font" style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "1.2rem", lineHeight: "1.2" }}>
              Built for the <br />
              <span className="animated-gradient-text">new generation.</span>
            </h2>
            <p style={{ color: "#A1A1AA", fontSize: "1.1rem", lineHeight: "1.7", marginBottom: "2rem" }}>
              Fast, flexible, and aesthetic. MeetFlow fits your vibe and helps you stay connected without the chaos of traditional corporate software.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {["No software download required — runs in browser", "Instant 1-click room creation", "Integrated AI Co-pilot for note taking"].map((item, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <CheckCircle2 style={{ width: "20px", height: "20px", color: "#10B981" }} />
                  <span style={{ color: "#E4E4E7", fontSize: "1rem", fontWeight: "500" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div className="glass-card" style={{ padding: "1.8rem", borderRadius: "24px", background: "rgba(10, 10, 15, 0.9)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Video style={{ width: "18px", height: "18px", color: "#FFF" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "#FFF" }}>Design Standup</h4>
                  <p style={{ fontSize: "0.78rem", color: "#A1A1AA" }}>Today, 10:00 AM</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button onClick={() => handleJoinOrCreateMeeting()} className="glow-btn-primary" style={{ width: "100%", padding: "0.8rem", fontSize: "0.92rem" }}>
                  Join Standup Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Footer
         -------------------------------------------------------------------- */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingBlock: "3.5rem", background: "#060608" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingInline: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Video style={{ width: "18px", height: "18px", color: "#FFF" }} />
            </div>
            <span className="heading-font" style={{ fontSize: "1.2rem", fontWeight: "700", color: "#FFF" }}>
              MeetFlow AI
            </span>
          </div>
          <p style={{ color: "#71717A", fontSize: "0.9rem" }}>
            © {new Date().getFullYear()} MeetFlow AI Inc. Crafted with ❤️ for modern teams.
          </p>
        </div>
      </footer>

      {/* --------------------------------------------------------------------
          Floating Contact Icon Button (Fixed Bottom-Right: 30px, 30px)
         -------------------------------------------------------------------- */}
      <div
        className="contact-bounce"
        onClick={() => setShowContactModal(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 99,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: "1px solid rgba(255,255,255,0.3)",
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      >
        <MessageSquare style={{ width: "26px", height: "26px", color: "#FFF" }} />
      </div>

      {/* --------------------------------------------------------------------
          Modal 1: Meeting Create / Join Modal
         -------------------------------------------------------------------- */}
      <AnimatePresence>
        {showMeetingModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-modal"
              style={{ width: "100%", maxWidth: "460px", padding: "2.2rem", position: "relative" }}
            >
              <button
                onClick={() => setShowMeetingModal(false)}
                style={{ position: "absolute", top: "18px", right: "18px", background: "transparent", border: "none", color: "#A1A1AA", cursor: "pointer" }}
              >
                <X style={{ width: "22px", height: "22px" }} />
              </button>

              <h3 className="heading-font" style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "0.5rem" }}>
                Start or Join Meeting
              </h3>
              <p style={{ color: "#A1A1AA", fontSize: "0.95rem", marginBottom: "1.8rem" }}>
                Enter a room code or generate an instant AI-enabled room.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Enter Meeting Code (e.g. 849201)"
                  value={meetingCodeInput}
                  onChange={(e) => setMeetingCodeInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.9rem 1.2rem",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#FFF",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />

                <button
                  onClick={() => handleJoinOrCreateMeeting()}
                  className="glow-btn-primary"
                  style={{ width: "100%", padding: "0.95rem", fontSize: "1.02rem" }}
                >
                  Join Room Now
                </button>

                <div style={{ display: "flex", alignItems: "center", marginBlock: "0.4rem" }}>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                  <span style={{ paddingInline: "0.8rem", color: "#71717A", fontSize: "0.8rem" }}>OR</span>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                </div>

                <button
                  onClick={() => handleJoinOrCreateMeeting(Math.floor(100000 + Math.random() * 900000).toString())}
                  className="glow-btn-secondary"
                  style={{ width: "100%", padding: "0.95rem", fontSize: "1.02rem" }}
                >
                  ✨ Create Instant Instant Room
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------
          Modal 2: Floating Contact Modal
         -------------------------------------------------------------------- */}
      <AnimatePresence>
        {showContactModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-modal"
              style={{ width: "100%", maxWidth: "480px", padding: "2.2rem", position: "relative" }}
            >
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setContactSubmitted(false);
                }}
                style={{ position: "absolute", top: "18px", right: "18px", background: "transparent", border: "none", color: "#A1A1AA", cursor: "pointer" }}
              >
                <X style={{ width: "22px", height: "22px" }} />
              </button>

              {!contactSubmitted ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PhoneCall style={{ width: "20px", height: "20px", color: "#FFF" }} />
                    </div>
                    <h3 className="heading-font" style={{ fontSize: "1.6rem", fontWeight: "800" }}>
                      Get in Touch
                    </h3>
                  </div>
                  <p style={{ color: "#A1A1AA", fontSize: "0.92rem", marginBottom: "1.6rem" }}>
                    Have questions about MeetFlow AI or enterprise plans? Drop us a line!
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                  >
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      style={{
                        padding: "0.85rem 1.1rem",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#FFF",
                        outline: "none",
                      }}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      style={{
                        padding: "0.85rem 1.1rem",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#FFF",
                        outline: "none",
                      }}
                    />
                    <textarea
                      required
                      rows={3}
                      placeholder="How can we help?"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      style={{
                        padding: "0.85rem 1.1rem",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#FFF",
                        outline: "none",
                      }}
                    />
                    <button type="submit" className="glow-btn-primary" style={{ padding: "0.9rem", marginTop: "0.4rem" }}>
                      Send Message
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: "center", paddingBlock: "1.5rem" }}>
                  <CheckCircle2 style={{ width: "54px", height: "54px", color: "#10B981", margin: "0 auto 1rem auto" }} />
                  <h3 className="heading-font" style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>
                    Message Sent!
                  </h3>
                  <p style={{ color: "#A1A1AA", fontSize: "0.95rem" }}>
                    Thank you! Our team will get back to you shortly.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}