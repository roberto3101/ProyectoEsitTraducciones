import { useEffect, useRef, useCallback } from "react";

/*
  RedGlobal v3 — VISIBLE animated network for ESIT hero
  - Bright, clearly visible particles
  - Thick connection lines
  - Pulsing hub nodes
  - Mouse interactivity
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
    const count = Math.min(90, Math.floor((w * h) / 9000));
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 1.2,
        hub: Math.random() < 0.18,
        pulse: Math.random() * Math.PI * 2,
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
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

      const maxDist = Math.min(200, w * 0.16);
      const mouseRadius = 200;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulse += 0.02;

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouseRadius && mDist > 0) {
          const force = (1 - mDist / mouseRadius) * 1.5;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
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
            const strength = 1 - dist / maxDist;
            const alpha = dark
              ? strength * 0.45
              : strength * 0.18;

            ctx.strokeStyle = dark
              ? `rgba(100, 180, 255, ${alpha})`
              : `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = (a.hub || b.hub) ? strength * 2 : strength * 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulseScale = 1 + Math.sin(p.pulse) * 0.3;

        // Hub glow
        if (p.hub) {
          const glowR = p.r * 10 * pulseScale;
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          if (dark) {
            glow.addColorStop(0, "rgba(96, 165, 250, 0.2)");
            glow.addColorStop(1, "rgba(96, 165, 250, 0)");
          } else {
            glow.addColorStop(0, "rgba(37, 99, 235, 0.12)");
            glow.addColorStop(1, "rgba(37, 99, 235, 0)");
          }
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (p.hub ? pulseScale : 1), 0, Math.PI * 2);
        if (dark) {
          ctx.fillStyle = p.hub
            ? `rgba(147, 197, 253, 0.9)`
            : `rgba(147, 197, 253, 0.55)`;
        } else {
          ctx.fillStyle = p.hub
            ? `rgba(37, 99, 235, 0.5)`
            : `rgba(37, 99, 235, 0.25)`;
        }
        ctx.fill();

        // Bright core for hubs
        if (p.hub) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = dark
            ? "rgba(220, 235, 255, 0.8)"
            : "rgba(37, 99, 235, 0.5)";
          ctx.fill();
        }
      }

      // Mouse attraction glow
      if (mouse.x > 0 && mouse.y > 0) {
        const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        if (dark) {
          mg.addColorStop(0, "rgba(96, 165, 250, 0.06)");
          mg.addColorStop(1, "rgba(96, 165, 250, 0)");
        } else {
          mg.addColorStop(0, "rgba(37, 99, 235, 0.04)");
          mg.addColorStop(1, "rgba(37, 99, 235, 0)");
        }
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ambient glow right side
      const cx = w * 0.72;
      const cy = h * 0.4;
      const gr = Math.min(w, h) * 0.45;
      const ambGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
      if (dark) {
        ambGlow.addColorStop(0, "rgba(37, 99, 235, 0.08)");
        ambGlow.addColorStop(0.5, "rgba(37, 99, 235, 0.03)");
        ambGlow.addColorStop(1, "rgba(37, 99, 235, 0)");
      } else {
        ambGlow.addColorStop(0, "rgba(37, 99, 235, 0.05)");
        ambGlow.addColorStop(0.5, "rgba(37, 99, 235, 0.02)");
        ambGlow.addColorStop(1, "rgba(37, 99, 235, 0)");
      }
      ctx.fillStyle = ambGlow;
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