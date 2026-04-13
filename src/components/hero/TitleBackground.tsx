import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/I18nProvider';

export function TitleBackground({ updateTimeLabel }: { updateTimeLabel: string }) {
  const { t } = useI18n();
  const titleRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const titleContainer = titleRef.current;
    const canvas = canvasRef.current;
    const starsContainer = starsRef.current;
    const particlesContainer = particlesRef.current;
    if (!titleContainer || !canvas || !starsContainer || !particlesContainer) return;

    const nodeCount = 15;
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];
    const maxDistance = 150;

    function resizeCanvas() {
      const t = titleRef.current;
      const c = canvasRef.current;
      if (!t || !c) return;
      const rect = t.getBoundingClientRect();
      c.width = rect.width;
      c.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    function drawNetwork() {
      const c = canvasRef.current;
      const context = c?.getContext('2d');
      if (!c || !context) return;
      context.clearRect(0, 0, c.width, c.height);
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > c.width) node.vx *= -1;
        if (node.y < 0 || node.y > c.height) node.vy *= -1;
        node.x = Math.max(0, Math.min(c.width, node.x));
        node.y = Math.max(0, Math.min(c.height, node.y));
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            context.strokeStyle = `rgba(34, 197, 94, ${opacity * 0.35})`;
            context.lineWidth = 0.5;
            context.beginPath();
            context.moveTo(nodes[i].x, nodes[i].y);
            context.lineTo(nodes[j].x, nodes[j].y);
            context.stroke();
          }
        }
      }
      nodes.forEach((node) => {
        context.fillStyle = 'rgba(34, 197, 94, 0.5)';
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fill();
      });
    }

    function createStars() {
      const sc = starsRef.current;
      if (!sc) return;
      const starCount = 20;
      sc.innerHTML = '';
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 3;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.animationDelay = delay + 's';
        star.style.animationDuration = Math.random() * 2 + 2 + 's';
        sc.appendChild(star);
      }
    }

    function createParticles() {
      const pc = particlesRef.current;
      if (!pc) return;
      const particleCount = 8;
      pc.innerHTML = '';
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 60 + 40;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        pc.appendChild(particle);
      }
    }

    createStars();
    createParticles();

    let raf = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      const animate = () => {
        drawNetwork();
        raf = requestAnimationFrame(animate);
      };
      animate();
    } else {
      drawNetwork();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={titleRef} className="text-center title-background">
      <canvas ref={canvasRef} className="network-canvas" />
      <div ref={starsRef} id="starsContainer" className="absolute inset-0 pointer-events-none z-[1]" />
      <div ref={particlesRef} id="particlesContainer" className="absolute inset-0 pointer-events-none z-[1]" />
      <div className="relative z-10">
        <h1 className="text-4xl sm:text-5xl font-mono font-bold text-slate-100">
          {t('heroTitleLead')}
          <span className="text-accent">{t('heroTitleAccent')}</span>
        </h1>
        <p id="updateTime" className="text-sm text-slate-500 mt-3">
          {updateTimeLabel}
        </p>
      </div>
    </div>
  );
}
