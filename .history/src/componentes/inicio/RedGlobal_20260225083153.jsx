import { useEffect, useRef, useCallback } from "react";

/*
  RedGlobal — Animated network background for ESIT hero
  ✓ Canvas-based particle network (like a global connection web)
  ✓ Lightweight (~60 particles, 60fps)
  ✓ Dark & light mode aware
  ✓ Responsive
  ✓ Zero external dependencies
*/

function useIsDark() {
  const ref = useRef(false);
  useEffect(() => {
    const check = () => {
      ref.current = document.documentElement.classList.contains("dark");
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function RedGlobal() {
  const canvasRef = useRef(null);
  const isDarkRef = useIsDark();
  const animRef = useRef(0);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const initParticles = useCallback((w, h) => {
    const count = Math.min(70, Math.floor((w * h) / 14000));
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.8,
        // Some particles are "hubs" (slightly bigger, brighter)
        hub: Math.random() < 0.15,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      initParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      const dark = isDarkRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      // Connection distance
      const maxDist = Math.min(160, w * 0.12);
      const mouseRadius = 180;

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouseRadius && mDist > 0) {
          const force = (1 - mDist / mouseRadius) * 0.8;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        // Dampen velocity
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > h) { p.y = h; p.vy *= -1; }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (dark ? 0.15 : 0.08);
            const color = dark ? `rgba(96, 165, 250, ${alpha})` : `rgba(12, 35, 64, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = (a.hub || b.hub) ? 0.8 : 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const baseAlpha = p.hub ? (dark ? 0.5 : 0.25) : (dark ? 0.25 : 0.12);

        // Glow for hubs
        if (p.hub) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = dark
            ? `rgba(96, 165, 250, 0.04)`
            : `rgba(37, 99, 235, 0.03)`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(147, 197, 253, ${baseAlpha})`
          : `rgba(12, 35, 64, ${baseAlpha})`;
        ctx.fill();
      }

      // Subtle center glow (simulates globe presence)
      const cx = w * 0.65;
      const cy = h * 0.45;
      const gr = Math.min(w, h) * 0.35;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
      if (dark) {
        glow.addColorStop(0, "rgba(37, 99, 235, 0.04)");
        glow.addColorStop(0.5, "rgba(37, 99, 235, 0.015)");
        glow.addColorStop(1, "rgba(37, 99, 235, 0)");
      } else {
        glow.addColorStop(0, "rgba(37, 99, 235, 0.03)");
        glow.addColorStop(0.5, "rgba(37, 99, 235, 0.01)");
        glow.addColorStop(1, "rgba(37, 99, 235, 0)");
      }
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initParticles, isDarkRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    />
  );
}