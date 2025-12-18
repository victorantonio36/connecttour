import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

const AnimatedHeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const timeRef = useRef(0);

  // Angola ConnecTour Official Colors
  const colors = {
    turquoise: { r: 122, g: 206, b: 211 }, // #7ACED3
    deepTeal: { r: 47, g: 119, b: 120 },   // #2F7778
    goldenBeige: { r: 227, g: 206, b: 170 }, // #E3CEAA
  };

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 15000));
    
    const colorKeys = Object.keys(colors) as Array<keyof typeof colors>;
    
    for (let i = 0; i < particleCount; i++) {
      const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      const color = colors[colorKey];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: `rgba(${color.r}, ${color.g}, ${color.b}, `,
      });
    }
    return particles;
  }, []);

  const drawGradientLayers = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    scrollOffset: number
  ) => {
    // Layer 1: Deep animated gradient background
    const gradient1 = ctx.createLinearGradient(
      0,
      0 + scrollOffset * 0.1,
      width,
      height + scrollOffset * 0.1
    );
    
    const phase1 = Math.sin(time * 0.0005) * 0.5 + 0.5;
    const phase2 = Math.cos(time * 0.0003) * 0.5 + 0.5;
    
    gradient1.addColorStop(0, `rgba(47, 119, 120, ${0.95 - phase1 * 0.1})`);
    gradient1.addColorStop(0.3 + phase2 * 0.1, `rgba(122, 206, 211, ${0.85 - phase1 * 0.15})`);
    gradient1.addColorStop(0.7 - phase1 * 0.1, `rgba(47, 119, 120, ${0.9})`);
    gradient1.addColorStop(1, `rgba(35, 90, 91, 0.98)`);
    
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, width, height);

    // Layer 2: Radial glow effects with parallax
    const centerX = width * 0.7 + Math.sin(time * 0.0002) * 50;
    const centerY = height * 0.3 + Math.cos(time * 0.0003) * 30 - scrollOffset * 0.2;
    
    const radialGlow = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.min(width, height) * 0.6
    );
    
    const glowIntensity = 0.15 + Math.sin(time * 0.001) * 0.08;
    radialGlow.addColorStop(0, `rgba(227, 206, 170, ${glowIntensity + 0.1})`);
    radialGlow.addColorStop(0.3, `rgba(122, 206, 211, ${glowIntensity})`);
    radialGlow.addColorStop(0.7, `rgba(47, 119, 120, ${glowIntensity * 0.5})`);
    radialGlow.addColorStop(1, "rgba(47, 119, 120, 0)");
    
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // Layer 3: Secondary glow (bottom left)
    const glow2X = width * 0.2 + Math.cos(time * 0.00025) * 40;
    const glow2Y = height * 0.7 + Math.sin(time * 0.00035) * 25 - scrollOffset * 0.15;
    
    const radialGlow2 = ctx.createRadialGradient(
      glow2X, glow2Y, 0,
      glow2X, glow2Y, Math.min(width, height) * 0.5
    );
    
    const glow2Intensity = 0.12 + Math.cos(time * 0.0008) * 0.06;
    radialGlow2.addColorStop(0, `rgba(227, 206, 170, ${glow2Intensity})`);
    radialGlow2.addColorStop(0.4, `rgba(122, 206, 211, ${glow2Intensity * 0.7})`);
    radialGlow2.addColorStop(1, "rgba(47, 119, 120, 0)");
    
    ctx.fillStyle = radialGlow2;
    ctx.fillRect(0, 0, width, height);
  }, []);

  const drawParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    particles: Particle[],
    width: number,
    height: number,
    time: number,
    scrollOffset: number
  ) => {
    particles.forEach((particle, index) => {
      // Update position with parallax depth based on size
      const depthFactor = particle.size / 4;
      particle.x += particle.speedX + Math.sin(time * 0.001 + index) * 0.1;
      particle.y += particle.speedY - scrollOffset * 0.001 * depthFactor;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      
      // Pulsing opacity
      const pulseOpacity = particle.opacity + Math.sin(time * 0.002 + index * 0.5) * 0.15;
      
      // Draw particle with glow
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${Math.max(0.1, pulseOpacity)})`;
      ctx.fill();
      
      // Add subtle glow around larger particles
      if (particle.size > 2) {
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        glowGradient.addColorStop(0, `${particle.color}${pulseOpacity * 0.3})`);
        glowGradient.addColorStop(1, `${particle.color}0)`);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }
    });
  }, []);

  const drawWaveLayers = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    scrollOffset: number
  ) => {
    // Subtle wave overlay for depth
    ctx.globalCompositeOperation = "soft-light";
    
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      const waveAmplitude = 20 + i * 10;
      const waveFrequency = 0.003 - i * 0.0005;
      const waveSpeed = time * (0.0003 + i * 0.0001);
      const yOffset = height * (0.7 + i * 0.1) - scrollOffset * 0.1 * (i + 1);
      
      for (let x = 0; x <= width; x += 5) {
        const y = yOffset + Math.sin(x * waveFrequency + waveSpeed) * waveAmplitude;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(width, height);
      ctx.closePath();
      
      const waveGradient = ctx.createLinearGradient(0, yOffset - waveAmplitude, 0, height);
      waveGradient.addColorStop(0, `rgba(122, 206, 211, ${0.05 - i * 0.01})`);
      waveGradient.addColorStop(1, `rgba(47, 119, 120, ${0.02})`);
      
      ctx.fillStyle = waveGradient;
      ctx.fill();
    }
    
    ctx.globalCompositeOperation = "source-over";
  }, []);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (!canvas || !ctx || !isVisible) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    timeRef.current = timestamp;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw layers
    drawGradientLayers(ctx, width, height, timestamp, scrollY);
    drawWaveLayers(ctx, width, height, timestamp, scrollY);
    drawParticles(ctx, particlesRef.current, width, height, timestamp, scrollY);

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isVisible, scrollY, drawGradientLayers, drawParticles, drawWaveLayers]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      particlesRef.current = initParticles(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // GPU optimization
    if (canvas.style) {
      canvas.style.willChange = "transform";
      canvas.style.transform = "translateZ(0)";
      canvas.style.backfaceVisibility = "hidden";
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [initParticles]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
      {/* Overlay gradient for text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90"
        style={{ pointerEvents: "none" }}
      />
      {/* Noise texture overlay for premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default AnimatedHeroBackground;
