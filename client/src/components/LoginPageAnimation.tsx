// import React from "react";
// import { motion } from "framer-motion";

// const LoginPageAnimation: React.FC = () => {
//   return (

//     <div className="relative w-full flex justify-center items-center p-4 max-w-md">
// <motion.div
//   // Contained ambient glow layer
//   className="absolute w-full h-full rounded-full opacity-60 blur-[65px] pointer-events-none z-0"
//   style={{
//     rotate:180, 
//     background: "radial-gradient(circle at center, #EAECEC 0%, #000000 40%, #eeeeee 70%, transparent 100%)",
//   }}
//   animate={{
//     scale: [0.95, 1.05, 0.95],
//     opacity: [0.25, 0.55, 0.25], // Subtle breathing pulse
//   }}
//   transition={{
//     duration: 8,
//     repeat: Infinity,
//     ease: "easeInOut",
//   }}
// />

//     <div className="relative z-10 w-full max-w-2xl bg-transparent rounded-3xl flex items-center h-100 min-h-1/4  overflow-hidden shadow-2xl border-3 border-[#EAECEC]/40">
//       <img
//         src="/collaborating_people.gif"
//         alt="collaboration gif"
//         className="w-full block h-full object-contain rounded-3xl "
//       />

//       {/* left side gradient */}
//       <div className="absolute inset-y-0 left-0 bg-linear-to-r from-black/80 to-transparent pointer-events-none w-1/4 "></div>
//       {/* right side gradient */}
//       <div className="absolute inset-y-0 right-0 bg-linear-to-r to-black/80 from-transparent pointer-events-none w-1/4 "></div>

//       <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_0_0_2px_#000]"></div>

//       {/* inner overlay */}
//       <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>
//     </div>
//     </div>
//   );
// };

// export default LoginPageAnimation;



// import React from "react";
// import { motion } from "framer-motion";

// const LoginPageAnimation: React.FC = () => {
//   return (

//     <div className="relative w-full flex justify-center items-center p-4 max-w-md">

//     </div>
//   );
// };

// export default LoginPageAnimation;

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LoginPageAnimation: React.FC = () => {
  const [stage, setStage] = useState<"tracing" | "flash" | "shimmer">("tracing");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas particle spark effect for Marvel-style ignite sequence
  useEffect(() => {
    if (stage !== "flash" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
    }> = [];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        alpha: 0.9,
        life: 0.015 + Math.random() * 0.02,
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.alpha > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.life;

          ctx.fillStyle = `rgba(226, 232, 240, ${Math.max(p.alpha, 0)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [stage]);

  return (
    <div className="relative flex justify-center items-center w-full min-h-[400px]">
      
      {/* Background Spark Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* Main Container */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex justify-center items-center">
        
        {/* PHASE 1: Slow Marvel Line Trace */}
        <motion.div
          className="absolute inset-0 w-full h-full z-10"
          style={{
            WebkitMaskImage: "url('/logo.png')",
            maskImage: "url('/logo.png')",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        >
          {/* Base Dark Chrome Logo Silhouette */}
          <img
            src="/logo.png"
            alt="Silver Chrome Logo"
            className="w-full h-full object-contain filter brightness-70 contrast-125"
          />

          {/* Slow Radial Wipe Reveal (4.5s duration) */}
          <motion.div
            className="absolute inset-0 bg-slate-200/30"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{
              clipPath: [
                "circle(0% at 50% 50%)",
                "circle(25% at 50% 50%)",
                "circle(65% at 50% 50%)",
                "circle(100% at 50% 50%)",
              ],
            }}
            transition={{
              duration: 4.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onAnimationComplete={() => setStage("flash")}
          />

          {/* Subtle Silver Sheen Streamer during tracing */}
          <motion.div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, transparent 35%, rgba(226,232,240,0.4) 50%, transparent 65%)",
            }}
            initial={{ x: "-120%", y: "-120%" }}
            animate={{ x: ["-120%", "120%"], y: ["-120%", "120%"] }}
            transition={{
              duration: 3.5,
              delay: 0.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* PHASE 2: Complete Silver Reveal & Repeating Lens Sheen */}
        <motion.div
          className="relative w-full h-full z-10 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{
            opacity: stage !== "tracing" ? 1 : 0,
            scale: stage !== "tracing" ? 1 : 0.96,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          onAnimationComplete={() => stage === "flash" && setStage("shimmer")}
        >
          {/* Final Sharp Metallic Logo */}
          <img
            src="/logo.png"
            alt="Silver Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          />

          {/* Reflection restricted strictly to logo surface */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              WebkitMaskImage: "url('/logo.png')",
              maskImage: "url('/logo.png')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          >
            {/* Periodic Metallic Sweep */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{
                background:
                  "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
              }}
              initial={{ x: "-150%" }}
              animate={
                stage === "shimmer"
                  ? { x: ["-150%", "150%"] }
                  : { x: "-150%" }
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Subtle Ambient Radial Light behind center */}
        <motion.div
          className="absolute w-44 h-44 rounded-full blur-[70px] pointer-events-none z-0"
          style={{ background: "#ffffff" }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: stage !== "tracing" ? [0.05, 0.12, 0.05] : 0,
            scale: [0.9, 1.08, 0.9],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default LoginPageAnimation;