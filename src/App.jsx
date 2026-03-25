import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// --- 1. THEME CONFIGURATION ---
const themes = {
  dark: {
    bg: "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #050508 100%)",
    cardBg: "rgba(20, 20, 32, 0.95)",
    text: "#ffffff",
    subText: "rgba(255, 255, 255, 0.6)",
    btnBase: "#0d0d16",
    btnHover: "#212135",
    border: "rgba(255, 255, 255, 0.12)",
    accent: "#ffffff",
    chartGrid: "#222"
  },
  light: {
    bg: "#ffffff",              // Pure white background
    cardBg: "#f2f2f7",          // Slightly darker "Apple-style" grey card
    text: "#1a1a2e",            // Deep navy text
    subText: "#4a4a68",         // Muted navy
    btnBase: "#ffffff",         // White buttons to stand out against the grey card
    btnHover: "#e5e5ea",
    border: "#d1d1d6",
    accent: "#000000",          // Pure black accent
    chartGrid: "#d1d1d6"
  }
};

// --- 2. UI COMPONENTS ---
const Card = ({ children, showProgress, progress, theme }) => (
  <div style={{
    background: theme.cardBg,
    backdropFilter: "blur(40px)",
    borderRadius: "32px", // Slightly smaller radius for mobile
    color: theme.text,
    width: "95%",
    maxWidth: "800px",
    // FIXED: Height is now dynamic
    minHeight: "500px",
    maxHeight: "90vh", 
    boxShadow: "0 50px 150px rgba(0,0,0,0.15)",
    border: `1px solid ${theme.border}`,
    position: "relative",
    overflowY: "auto", // Allows scrolling if the content is too long
    display: "flex",
    flexDirection: "column",
    transition: "all 0.4s ease",
    margin: "10px"
  }}>
    {showProgress && (
      <div style={{ height: "6px", width: "100%", background: "rgba(0,0,0,0.05)", position: "absolute", top: 0, zIndex: 10 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: theme.accent, transition: "width 0.6s ease" }} />
      </div>
    )}
    <div style={{ 
      // SMART PADDING: Less on mobile, more on desktop
      padding: window.innerWidth < 600 ? "40px 20px" : "60px 80px", 
      flex: 1, 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center" 
    }}>
      {children}
    </div>
  </div>
);

const Button = ({ children, onClick, theme, isFullWidth = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div style={{ 
      // This is the magic line that stretches the button
      gridColumn: isFullWidth ? "span 2" : "span 1" 
    }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "100%", 
          padding: "20px", 
          borderRadius: "20px", 
          cursor: "pointer",
          fontWeight: "600", 
          fontSize: "16px", 
          outline: "none",
          border: isHovered ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
          background: isHovered ? theme.btnHover : theme.btnBase,
          color: theme.text,
          transition: "all 0.2s ease",
          transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center"
        }}
      >
        {children}
      </button>
    </div>
  );
};

// --- 3. DATA ---
const questions = [
  {
    question: "Which of these do you enjoy most?",
    options: [
      { text: "Building and designing machines", type: "Mechanical / Aerospace", weight: 2 },
      { text: "Coding and problem solving", type: "Software Engineering", weight: 2 },
      { text: "Chemistry and materials", type: "Chemical Engineering", weight: 2 },
      { text: "Helping people and medicine", type: "Biomedical Engineering", weight: 2 },
      { text: "Optimizing systems and efficiency", type: "Industrial Engineering", weight: 2 },
      { text: "Working with circuits and chips", type: "Electrical / Computer", weight: 2 },
      { text: "All of the above", type: "Systems Design", weight: 2 }
    ]
  },
  {
    question: "Which subject interests you the most?",
    options: [
      { text: "Mechanics and Physics", type: "Mechanical / Aerospace", weight: 1 },
      { text: "Algorithms and Data", type: "Software Engineering", weight: 1 },
      { text: "Thermodynamics", type: "Chemical Engineering", weight: 1 },
      { text: "Human Biology", type: "Biomedical Engineering", weight: 1 },
      { text: "Statistics and Logic", type: "Industrial Engineering", weight: 1 },
      { text: "Electricity and Magnetism", type: "Electrical / Computer", weight: 1 },
      { text: "All of the above", type: "Systems Design", weight: 1 }
    ]
  },
  {
    question: "Which of these problems most excite you?",
    options: [
      { text: "Deep space or vehicle design", type: "Mechanical / Aerospace", weight: 2 },
      { text: "Building AI or Apps", type: "Software Engineering", weight: 2 },
      { text: "Sustainable energy fuels", type: "Chemical Engineering", weight: 2 },
      { text: "Prosthetics and health tech", type: "Biomedical Engineering", weight: 2 },
      { text: "Supply chain and factory flow", type: "Industrial Engineering", weight: 2 },
      { text: "Microprocessors and power", type: "Electrical / Computer", weight: 2 },
      { text: "Designing 'The Big Picture'", type: "Systems Design", weight: 2 }
    ]
  },
  {
    question: "Where would you prefer to spend your workday?",
    options: [
      { text: "A hangar or CAD studio", type: "Mechanical / Aerospace", weight: 1 },
      { text: "Remote or a tech hub", type: "Software Engineering", weight: 1 },
      { text: "A refinery or process plant", type: "Chemical Engineering", weight: 1 },
      { text: "A hospital", type: "Biomedical Engineering", weight: 1 },
      { text: "Managing complex operations", type: "Industrial Engineering", weight: 1 },
      { text: "A clean room or hardware lab", type: "Electrical / Computer", weight: 1 },
      { text: "All of the above", type: "Systems Design", weight: 1 }
    ]
  },
  {
    question: "Which of these sounds most interesting to you?",
    options: [
      { text: "Robotics and Drones", type: "Mechanical / Aerospace", weight: 2 },
      { text: "Software Systems", type: "Software Engineering", weight: 2 },
      { text: "Green Energy", type: "Chemical Engineering", weight: 2 },
      { text: "Healthcare Tech", type: "Biomedical Engineering", weight: 2 },
      { text: "Business Logistics", type: "Industrial Engineering", weight: 2 },
      { text: "Hardware Design", type: "Electrical / Computer", weight: 2 },
      { text: "Holistic Problem Solving", type: "Systems Design", weight: 2 }
    ]
  }
];

const descriptions = {
  "Mechanical / Aerospace": "You thrive in the physical world. From engines to aircraft, you enjoy the mechanics of how things move and function.",
  "Software Engineering": "You speak the language of logic. You enjoy building virtual systems, apps, and artificial intelligence.",
  "Chemical Engineering": "You are a process thinker. You enjoy turning raw materials into useful products like energy or medicine.",
  "Biomedical Engineering": "You want to bridge the gap between engineering and the human body to save lives and improve health.",
  "Industrial Engineering": "You are an optimizer. You love making systems faster, cheaper, and more efficient.",
  "Electrical / Computer": "You are fascinated by the flow of energy and information through hardware and circuits.",
  "Systems Design": "You are a Systems thinker. You want to understand how all engineering fields interact to solve complex problems."
};

// --- 4. MAIN APP ---
export default function App() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState({});
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState("dark");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const theme = themes[mode];

  const handleAnswer = (type, weight) => {
    setHistory([...history, { current, scores: { ...scores } }]);
    const newScores = { ...scores };
    newScores[type] = (newScores[type] || 0) + weight;
    setScores(newScores);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      // Start the fake "loading" process
      setIsAnalyzing(true);
      
      const best = Object.keys(newScores).reduce((a, b) => (newScores[a] > newScores[b] ? a : b));
      
      // Wait 2 seconds, then show the result and stop loading
      setTimeout(() => {
        setResult(best);
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const handleShare = async () => {
    const siteUrl = window.location.href;
    const shareText = `I just took the Engineering Quiz and got ${result}! 🛠️ Find your match here: ${siteUrl}`;

    // 1. Try the native Mobile Share Menu (iPhone/Android)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Engineering Career Quiz',
          text: `I got ${result}! Find your engineering match:`,
          url: siteUrl,
        });
        return; // Success!
      } catch (err) {
        console.log("Share menu closed or failed, falling back to clipboard.");
      }
    }

    // 2. Fallback: Manually copy to clipboard (Desktop/Laptops)
    try {
      await navigator.clipboard.writeText(shareText);
      alert("Result copied to clipboard!");
    } catch (err) {
      // 3. Last resort: If clipboard fails (older browsers)
      console.error("Clipboard failed", err);
      alert(`Your result: ${result}! Copy this link to share: ${siteUrl}`);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setCurrent(prev.current);
      setScores(prev.scores);
      setHistory(history.slice(0, -1));
    } else {
      setStarted(false);
    }
  };

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div style={{
      width: "100vw", height: "100vh", background: theme.bg,
      display: "flex", justifyContent: "center", alignItems: "center",
      position: "fixed", top: 0, left: 0, fontFamily: "'Inter', sans-serif",
      transition: "background 0.5s ease"
    }}>
      {/* Theme Toggle Button */}
      <button 
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        style={{
          position: "absolute", top: "30px", right: "30px", padding: "12px 20px",
          borderRadius: "12px", border: `1px solid ${theme.border}`, background: theme.cardBg,
          color: theme.text, cursor: "pointer", fontWeight: "700", zIndex: 100
        }}
      >
        {mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <Card showProgress={started && !result} progress={progress} theme={theme}>
        {!started ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            {/* Title: Shrinks on mobile so it doesn't break into awkward lines */}
            <h1 style={{ 
              fontSize: window.innerWidth < 600 ? "2.8rem" : "4.5rem", 
              fontWeight: "900", 
              margin: "0 0 20px 0", 
              letterSpacing: window.innerWidth < 600 ? "-1px" : "-4px", 
              lineHeight: "1", 
              color: theme.text 
            }}>
                Engineering Quiz
            </h1>

            {/* Subtext: Adjusted for better readability on narrow screens */}
            <p style={{ 
              fontSize: window.innerWidth < 600 ? "1.1rem" : "1.4rem", 
              color: theme.subText, 
              marginBottom: "40px", 
              maxWidth: "550px", 
              margin: "0 auto 40px auto", 
              lineHeight: "1.5" 
            }}>
              Explore your interests and discover which engineering discipline fits you best.
            </p>

            {/* Start Button: Full width on mobile, fixed width on desktop */}
            <div style={{ 
              width: window.innerWidth < 600 ? "100%" : "280px", 
              margin: "0 auto" 
            }}>
                <Button onClick={() => setStarted(true)} theme={theme} isFullWidth={window.innerWidth < 600}>
                  Start
                </Button>
            </div>
            
            {/* Small Footer: Adds a bit of professional polish */}
            <p style={{ 
              marginTop: "30px", 
              fontSize: "12px", 
              color: theme.subText, 
              opacity: 0.5,
              letterSpacing: "1px" 
            }}>
              matthewhamilton3141
            </p>
          </div>
        ) : isAnalyzing ? (
          <div style={{ textAlign: "center" }}>
            {/* The Spinning Ring */}
            <div style={{ 
              width: "60px", height: "60px", 
              border: `4px solid ${theme.border}`, 
              borderTop: `4px solid ${theme.accent}`, 
              borderRadius: "50%", 
              margin: "0 auto 30px auto", 
              animation: "spin 1s linear infinite" 
            }} />
            
            <h2 style={{ fontSize: "2rem", fontWeight: "800", color: theme.text, marginBottom: "10px" }}>
              Analyzing Results...
            </h2>
            <p style={{ color: theme.subText, fontSize: "1.1rem" }}>
              Matching your profile to engineering disciplines.
            </p>

            {/* Hidden CSS for the spinning animation */}
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>

        ) : !result ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header: Back Button and Step Counter */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "30px" 
            }}>
              <button 
                onClick={handleBack} 
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: theme.subText, 
                  cursor: "pointer", 
                  fontSize: "14px", 
                  fontWeight: "700",
                  padding: "10px 0" 
                }}
              >
                ← BACK
              </button>
              <span style={{ 
                fontSize: "12px", 
                color: theme.accent, 
                fontWeight: "800", 
                letterSpacing: "2px",
                opacity: 0.8
              }}>
                STEP {current + 1} / {questions.length}
              </span>
            </div>

            {/* Question Text */}
            <h2 style={{ 
              textAlign: "center", 
              marginBottom: "40px", 
              fontSize: window.innerWidth < 600 ? "1.6rem" : "2.2rem", 
              fontWeight: "800", 
              lineHeight: "1.2", 
              color: theme.text 
            }}>
                {questions[current].question}
            </h2>
            
            {/* Responsive Grid: 1 column on mobile, 2 on desktop */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: window.innerWidth < 600 ? "1fr" : "1fr 1fr", 
              gap: "12px",
              // Ensures the grid doesn't overflow the card on small screens
              overflowY: "visible" 
            }}>
              {questions[current].options.map((opt, i) => (
                <Button 
                  key={i} 
                  onClick={() => handleAnswer(opt.type, opt.weight)} 
                  theme={theme}
                  // If there's an odd number of buttons (like 7), the last one spans full width
                  isFullWidth={window.innerWidth < 600 || i === 6} 
                >
                  {opt.text}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          /* --- THIS IS THE START OF YOUR NEW PUBLIC ELSE BLOCK --- */
          <div style={{ textAlign: "center" }}>
            
            {/* 1. The Result Title */}
            <h1 style={{ 
              color: theme.text, 
              margin: "0 0 20px 0", 
              fontSize: "3.5rem", 
              fontWeight: "900",
              lineHeight: "1" 
            }}>
              {result}
            </h1>

            {/* 2. The Description */}
            <p style={{ 
              fontSize: "1.2rem", 
              lineHeight: "1.6", 
              color: theme.subText, 
              marginBottom: "40px", 
              maxWidth: "500px", 
              margin: "0 auto 40px auto" 
            }}>
              {descriptions[result]}
            </p>

            {/* 3. The Action Buttons */}
            <div style={{ 
              maxWidth: "300px", 
              margin: "0 auto", 
              display: "flex", 
              flexDirection: "column", 
              gap: "15px" 
            }}>
                <Button onClick={handleShare} theme={theme} isFullWidth={true}>
                  Share My Result 🔗
                </Button>

                <Button onClick={() => window.location.reload()} theme={theme}>
                  Retake Quiz
                </Button>
            </div>

            <p style={{ marginTop: "40px", fontSize: "14px", color: theme.subText, opacity: 0.5 }}>
              Which engineering path are you?
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}