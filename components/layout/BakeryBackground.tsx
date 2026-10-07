"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BakeryBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let cleanupListeners: (() => void) | null = null;

    try {
      initThreeJSScene(canvas);
    } catch (err) {
      console.warn("WebGLRenderer failed, switching to 2D Canvas fallback:", err);
      const parent = canvas.parentNode;
      if (parent) {
        const freshCanvas = document.createElement("canvas");
        freshCanvas.id = canvas.id;
        freshCanvas.className = canvas.className;
        freshCanvas.style.cssText = canvas.style.cssText;
        parent.replaceChild(freshCanvas, canvas);
        initCanvas2DFallback(freshCanvas);
      }
    }

    // ── Procedural 3D Bakery Geometries ──────────────────────────────────

    function create3DDonut(
      glazeColor: number,
      sprinkleColors: number[]
    ): THREE.Group {
      const group = new THREE.Group();

      // Dough Torus
      const doughGeo = new THREE.TorusGeometry(1.2, 0.55, 16, 32);
      const doughMat = new THREE.MeshStandardMaterial({
        color: 0xd87d38,
        roughness: 0.5,
        metalness: 0.08,
      });
      const dough = new THREE.Mesh(doughGeo, doughMat);
      group.add(dough);

      // Glaze Torus
      const glazeGeo = new THREE.TorusGeometry(1.22, 0.42, 16, 32);
      const glazeMat = new THREE.MeshStandardMaterial({
        color: glazeColor,
        roughness: 0.18,
        metalness: 0.1,
      });
      const glaze = new THREE.Mesh(glazeGeo, glazeMat);
      glaze.position.z = 0.08;
      glaze.scale.set(0.98, 0.98, 0.9);
      group.add(glaze);

      // Sprinkles
      const sprinkleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8);
      for (let i = 0; i < 12; i++) {
        const sprColor = sprinkleColors[i % sprinkleColors.length];
        const sprMat = new THREE.MeshStandardMaterial({
          color: sprColor,
          roughness: 0.3,
        });
        const spr = new THREE.Mesh(sprinkleGeo, sprMat);

        const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const radius = 1.2 + (Math.random() - 0.5) * 0.3;
        spr.position.x = Math.cos(angle) * radius;
        spr.position.y = Math.sin(angle) * radius;
        spr.position.z = 0.42;

        spr.rotation.x = Math.random() * Math.PI;
        spr.rotation.y = Math.random() * Math.PI;
        spr.rotation.z = Math.random() * Math.PI;

        group.add(spr);
      }

      return group;
    }

    function create3DCupcake(
      linerColor: number,
      frostingColor: number
    ): THREE.Group {
      const group = new THREE.Group();

      // Liner
      const linerGeo = new THREE.CylinderGeometry(0.85, 0.65, 0.9, 18);
      const linerMat = new THREE.MeshStandardMaterial({
        color: linerColor,
        roughness: 0.4,
        metalness: 0.1,
      });
      const liner = new THREE.Mesh(linerGeo, linerMat);
      liner.position.y = -0.45;
      group.add(liner);

      // Sponge Base
      const spongeGeo = new THREE.CylinderGeometry(0.92, 0.85, 0.35, 18);
      const spongeMat = new THREE.MeshStandardMaterial({
        color: 0xd87d38,
        roughness: 0.6,
      });
      const sponge = new THREE.Mesh(spongeGeo, spongeMat);
      sponge.position.y = 0.1;
      group.add(sponge);

      // Frosting Swirl Tier 1
      const f1Geo = new THREE.TorusGeometry(0.55, 0.28, 12, 24);
      const fMat = new THREE.MeshStandardMaterial({
        color: frostingColor,
        roughness: 0.2,
        metalness: 0.05,
      });
      const f1 = new THREE.Mesh(f1Geo, fMat);
      f1.rotation.x = Math.PI / 2;
      f1.position.y = 0.32;
      group.add(f1);

      // Frosting Tier 2
      const f2Geo = new THREE.SphereGeometry(0.52, 16, 16);
      const f2 = new THREE.Mesh(f2Geo, fMat);
      f2.position.y = 0.58;
      f2.scale.set(1.0, 0.7, 1.0);
      group.add(f2);

      // Frosting Peak
      const f3Geo = new THREE.ConeGeometry(0.38, 0.55, 16);
      const f3 = new THREE.Mesh(f3Geo, fMat);
      f3.position.y = 0.85;
      group.add(f3);

      // Berry Cherry
      const cherryGeo = new THREE.SphereGeometry(0.24, 14, 14);
      const cherryMat = new THREE.MeshStandardMaterial({
        color: 0xa81c3f,
        roughness: 0.1,
        metalness: 0.2,
      });
      const cherry = new THREE.Mesh(cherryGeo, cherryMat);
      cherry.position.y = 1.18;
      group.add(cherry);

      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.32, 6);
      const stemMat = new THREE.MeshStandardMaterial({
        color: 0x2e7d32,
        roughness: 0.5,
      });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(0.08, 1.34, 0);
      stem.rotation.z = -0.4;
      group.add(stem);

      return group;
    }

    function create3DTieredCake(baseColor: number, topColor: number): THREE.Group {
      const group = new THREE.Group();

      // Bottom Tier
      const bGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.85, 24);
      const bMat = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.25 });
      const bottomTier = new THREE.Mesh(bGeo, bMat);
      bottomTier.position.y = -0.42;
      group.add(bottomTier);

      // Gold Ring Trim
      const ringGeo = new THREE.TorusGeometry(1.42, 0.09, 12, 24);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.3,
        metalness: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.82;
      group.add(ring);

      // Top Tier
      const tGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.75, 24);
      const tMat = new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.2 });
      const topTier = new THREE.Mesh(tGeo, tMat);
      topTier.position.y = 0.38;
      group.add(topTier);

      // Topping Cream Dollops
      const creamGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const creamMat = new THREE.MeshStandardMaterial({ color: 0xfff3e0, roughness: 0.1 });
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const c = new THREE.Mesh(creamGeo, creamMat);
        c.position.x = Math.cos(angle) * 0.7;
        c.position.z = Math.sin(angle) * 0.7;
        c.position.y = 0.78;
        group.add(c);
      }

      // Strawberry Topper
      const strawGeo = new THREE.ConeGeometry(0.26, 0.48, 12);
      const strawMat = new THREE.MeshStandardMaterial({ color: 0xa81c3f, roughness: 0.3 });
      const straw = new THREE.Mesh(strawGeo, strawMat);
      straw.position.y = 0.98;
      straw.rotation.x = Math.PI;
      group.add(straw);

      return group;
    }

    function create3DMacaron(shellColor: number, creamColor: number): THREE.Group {
      const group = new THREE.Group();

      const shellMat = new THREE.MeshStandardMaterial({
        color: shellColor,
        roughness: 0.3,
        metalness: 0.05,
      });
      const creamMat = new THREE.MeshStandardMaterial({
        color: creamColor,
        roughness: 0.2,
      });

      const topGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.32, 20);
      const topShell = new THREE.Mesh(topGeo, shellMat);
      topShell.position.y = 0.22;
      group.add(topShell);

      const bottomShell = new THREE.Mesh(topGeo, shellMat);
      bottomShell.position.y = -0.22;
      group.add(bottomShell);

      const fillGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.2, 20);
      const fill = new THREE.Mesh(fillGeo, creamMat);
      fill.position.y = 0;
      group.add(fill);

      return group;
    }

    // ── Three.js Scene Setup ─────────────────────────────────────────────

    function initThreeJSScene(targetCanvas: HTMLCanvasElement) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 32;

      renderer = new THREE.WebGLRenderer({
        canvas: targetCanvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xfff5ed, 1.0);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight1.position.set(30, 40, 25);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x962854, 0.7);
      dirLight2.position.set(-25, -25, 20);
      scene.add(dirLight2);

      const masterGroup = new THREE.Group();
      scene.add(masterGroup);

      const items: Array<{
        group: THREE.Group;
        rotSpeedX: number;
        rotSpeedY: number;
        rotSpeedZ: number;
        floatSpeedY: number;
        floatOffset: number;
      }> = [];

      const glazeColors = [
        0xefa898, 0xeab888, 0xd68ba0, 0xba6b85, 0xc46b7f, 0xfff5ee,
      ];
      const sprinkleColors = [
        0xefa898, 0xf5c77e, 0xd68ba0, 0xe5c384, 0xba6b85, 0xfff9f5,
      ];
      const linerColors = [0xba6b85, 0xd88e5e, 0xefa898, 0xd68ba0, 0x9d465c];
      const macaronColors = [0xd68ba0, 0xefa898, 0xeab888, 0xba6b85, 0xc97d92];

      for (let i = 0; i < 32; i++) {
        let meshGroup: THREE.Group;
        const randType = Math.random();

        if (randType < 0.32) {
          const glaze = glazeColors[Math.floor(Math.random() * glazeColors.length)];
          meshGroup = create3DDonut(glaze, sprinkleColors);
        } else if (randType < 0.62) {
          const liner = linerColors[Math.floor(Math.random() * linerColors.length)];
          const frosting = glazeColors[Math.floor(Math.random() * glazeColors.length)];
          meshGroup = create3DCupcake(liner, frosting);
        } else if (randType < 0.82) {
          const shell = macaronColors[Math.floor(Math.random() * macaronColors.length)];
          meshGroup = create3DMacaron(shell, 0xfff3e0);
        } else {
          const baseC = 0xfff0e6;
          const topC = linerColors[Math.floor(Math.random() * linerColors.length)];
          meshGroup = create3DTieredCake(baseC, topC);
        }

        meshGroup.position.x = (Math.random() - 0.5) * 65;
        meshGroup.position.y = (Math.random() - 0.5) * 65;
        meshGroup.position.z = (Math.random() - 0.5) * 35;

        meshGroup.rotation.x = Math.random() * Math.PI;
        meshGroup.rotation.y = Math.random() * Math.PI;
        meshGroup.rotation.z = Math.random() * Math.PI;

        const scale = 0.65 + Math.random() * 0.7;
        meshGroup.scale.set(scale, scale, scale);

        masterGroup.add(meshGroup);

        items.push({
          group: meshGroup,
          rotSpeedX: (Math.random() - 0.5) * 0.01,
          rotSpeedY: (Math.random() - 0.5) * 0.012,
          rotSpeedZ: (Math.random() - 0.5) * 0.007,
          floatSpeedY: 0.005 + Math.random() * 0.008,
          floatOffset: Math.random() * Math.PI * 2,
        });
      }

      // Dust Particles
      const particlesCount = 120;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 85;
        posArray[i + 1] = (Math.random() - 0.5) * 85;
        posArray[i + 2] = (Math.random() - 0.5) * 45;
      }

      particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.5,
        color: 0xd68ba0,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Mouse Parallax Interaction
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.008;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.008;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          mouseX = (e.touches[0].clientX - window.innerWidth / 2) * 0.008;
          mouseY = (e.touches[0].clientY - window.innerHeight / 2) * 0.008;
        }
      };

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        if (renderer) {
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("resize", handleResize);

      cleanupListeners = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("resize", handleResize);
      };

      const clock = new THREE.Clock();

      function animate() {
        animFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        masterGroup.rotation.y = targetX * 0.3 + elapsedTime * 0.025;
        masterGroup.rotation.x = -targetY * 0.3;

        particleSystem.rotation.y = -elapsedTime * 0.015;

        items.forEach((item) => {
          item.group.rotation.x += item.rotSpeedX;
          item.group.rotation.y += item.rotSpeedY;
          item.group.rotation.z += item.rotSpeedZ;
          item.group.position.y += Math.sin(elapsedTime * 1.4 + item.floatOffset) * 0.008;
        });

        if (renderer) {
          renderer.render(scene, camera);
        }
      }

      animate();
    }

    // ── 2D Canvas Fallback ───────────────────────────────────────────────

    function initCanvas2DFallback(targetCanvas: HTMLCanvasElement) {
      const ctx = targetCanvas.getContext("2d");
      if (!ctx) return;

      let width = (targetCanvas.width = window.innerWidth);
      let height = (targetCanvas.height = window.innerHeight);

      const handleResize = () => {
        width = targetCanvas.width = window.innerWidth;
        height = targetCanvas.height = window.innerHeight;
      };

      window.addEventListener("resize", handleResize);

      cleanupListeners = () => {
        window.removeEventListener("resize", handleResize);
      };

      const items: Array<{
        x: number;
        y: number;
        size: number;
        type: string;
        color: string;
        vx: number;
        vy: number;
        rot: number;
        vRot: number;
      }> = [];

      const types = ["donut", "cupcake", "macaron"];
      const colors = ["#E25B45", "#D87D38", "#C23B68", "#962854", "#A81C3F"];

      for (let i = 0; i < 35; i++) {
        items.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 16 + 14,
          type: types[Math.floor(Math.random() * types.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.4 - 0.15,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.02,
        });
      }

      function draw2D() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        items.forEach((item) => {
          item.x += item.vx;
          item.y += item.vy;
          item.rot += item.vRot;

          if (item.y < -30) item.y = height + 30;
          if (item.x < -30) item.x = width + 30;
          if (item.x > width + 30) item.x = -30;

          ctx.save();
          ctx.translate(item.x, item.y);
          ctx.rotate(item.rot);
          ctx.globalAlpha = 0.35;

          if (item.type === "donut") {
            ctx.beginPath();
            ctx.arc(0, 0, item.size, 0, Math.PI * 2);
            ctx.fillStyle = "#D87D38";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, 0, item.size * 0.85, 0, Math.PI * 2);
            ctx.fillStyle = item.color;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, 0, item.size * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = "#FFF9F5";
            ctx.fill();
          } else if (item.type === "cupcake") {
            ctx.beginPath();
            ctx.moveTo(-item.size * 0.6, item.size * 0.4);
            ctx.lineTo(item.size * 0.6, item.size * 0.4);
            ctx.lineTo(item.size * 0.8, -item.size * 0.1);
            ctx.lineTo(-item.size * 0.8, -item.size * 0.1);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, -item.size * 0.2, item.size * 0.7, Math.PI, 0);
            ctx.fillStyle = "#C23B68";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, -item.size * 0.8, item.size * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = "#A81C3F";
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.ellipse(0, 0, item.size, item.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = item.color;
            ctx.fill();
          }

          ctx.restore();
        });

        animFrameId = requestAnimationFrame(draw2D);
      }

      draw2D();
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      if (cleanupListeners) {
        cleanupListeners();
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="bg-3d-canvas"
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
        style={{ opacity: 0.18 }}
        aria-hidden="true"
      />

      {/* Ambient Floating Bakery Confectionery Layer */}
      <div className="bakery-bg-layer pointer-events-none" aria-hidden="true">
        {/* Tiered Birthday Cake */}
        <div className="bakery-bg-item tone-rose bakery-drift-1 top-[14%] left-[3%]">
          <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M4 19h16v3H4zM6 14h12v5H6zM8 9h8v5H8zM12 4v5M12 2a1 1 0 0 1 1 1c0 .7-.5 1.2-1 2-.5-.8-1-1.3-1-2a1 1 0 0 1 1-1z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Floating Cupcake */}
        <div className="bakery-bg-item tone-berry bakery-drift-2 top-[32%] right-[5%]">
          <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6 10c0-3.3 2.7-6 6-6s6 2.7 6 6M5 10h14l-2 10H7L5 10zM12 1v3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Warm Croissant */}
        <div className="bakery-bg-item tone-caramel bakery-drift-3 top-[68%] left-[6%]">
          <svg className="w-16 h-16 sm:w-18 sm:h-18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M3 15c2-6 8-11 15-9 3 1 4 4 3 7-1 3-4 6-7 7-4 1-9-1-11-5z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 11c2-3 5-5 9-4M9 14c2-2 4-3 7-2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Glazed Donut */}
        <div className="bakery-bg-item tone-coral bakery-drift-4 top-[78%] right-[6%]">
          <svg className="w-14 h-14 sm:w-18 sm:h-18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3.5" />
            <path d="M7 9h.01M16 8h.01M17 14h.01M8 15h.01M12 6h.01M12 18h.01" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Artisanal Macaron */}
        <div className="bakery-bg-item tone-amber bakery-drift-5 top-[52%] left-[2%]">
          <svg className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M4 10c0-2.5 3.6-4 8-4s8 1.5 8 4-3.6 4-8 4-8-1.5-8-4zM4 14c0 2.5 3.6 4 8 4s8-1.5 8-4M4 11h16M4 13h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Bakery Sparkle Star */}
        <div className="bakery-bg-item tone-rose bakery-drift-6 top-[20%] left-[45%]">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2l2.4 6.6L21 11l-5.6 4.4L17 22l-5-4-5 4 1.6-6.6L3 11l6.6-2.4L12 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Floating Sugar Particles */}
        <span className="sugar-particle sugar-float-1 w-2.5 h-2.5 bg-[#E6C184] top-[18%] left-[12%]" />
        <span className="sugar-particle sugar-float-2 w-3 h-3 bg-[#962854] top-[42%] right-[16%]" />
        <span className="sugar-particle sugar-float-3 w-2 h-2 bg-[#FAF0EB] top-[65%] left-[20%]" />
        <span className="sugar-particle sugar-float-1 w-2.5 h-2.5 bg-[#E6C184] top-[85%] right-[25%]" />
        <span className="sugar-particle sugar-float-2 w-2 h-2 bg-[#962854] top-[55%] right-[35%]" />
      </div>
    </>
  );
}
