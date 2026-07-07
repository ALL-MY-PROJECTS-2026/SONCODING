"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Soft round sprite so nodes render as glowing dots rather than squares.
function makeDotTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.8)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const PALETTE = [0x2563eb, 0x6366f1, 0x0ea5e9, 0x8b5cf6];

/**
 * Generated three.js particle NETWORK behind the hero — nodes drift and are
 * linked with lines when close; nodes near the pointer light up and connect to
 * the cursor. Zero external assets (no copyright). Respects reduced-motion,
 * pauses off-screen, and cleans up fully.
 */
export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = mount.clientWidth || 1;
    let height = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    const camZ = 22;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = camZ;
    const vFOV = THREE.MathUtils.degToRad(60);
    let halfH = Math.tan(vFOV / 2) * camZ;
    let halfW = halfH * (width / height);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
    });
    mount.appendChild(renderer.domElement);

    const isMobile = width < 640;
    const N = isMobile ? 44 : 88;

    // Node state
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 2);
    const nodeColors = new Float32Array(N * 3);
    const c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * halfW;
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * halfH;
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * 3;
      vel[i * 2] = (Math.random() * 2 - 1) * 0.02;
      vel[i * 2 + 1] = (Math.random() * 2 - 1) * 0.02;
      c.setHex(PALETTE[(Math.random() * PALETTE.length) | 0]);
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));
    const dotTex = makeDotTexture();
    const nodeMat = new THREE.PointsMaterial({
      size: 0.5,
      map: dotTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(nodeGeo, nodeMat);
    scene.add(points);

    // Line pool (segments rebuilt each frame). Normal blending + color fade so
    // the network stays visible on the light hero background.
    const maxSeg = N * 8;
    const linePos = new Float32Array(maxSeg * 2 * 3);
    const lineCol = new Float32Array(maxSeg * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineCol, 3).setUsage(THREE.DynamicDrawUsage));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const bg = new THREE.Color(0xeef2f8);
    const linkColor = new THREE.Color(0x2563eb);
    const mouseColor = new THREE.Color(0x06b6d4);
    const mix = new THREE.Color();

    const connectDist = halfH * 0.34;
    const mouseDist = halfH * 0.5;
    let mx = 1e9;
    let my = 1e9;

    let seg = 0;
    const addSeg = (
      ax: number, ay: number, az: number,
      bx: number, by: number, bz: number,
      alpha: number, target: THREE.Color,
    ) => {
      if (seg >= maxSeg) return;
      mix.copy(bg).lerp(target, Math.max(0, Math.min(1, alpha)));
      const p = seg * 6;
      linePos[p] = ax; linePos[p + 1] = ay; linePos[p + 2] = az;
      linePos[p + 3] = bx; linePos[p + 4] = by; linePos[p + 5] = bz;
      lineCol[p] = mix.r; lineCol[p + 1] = mix.g; lineCol[p + 2] = mix.b;
      lineCol[p + 3] = mix.r; lineCol[p + 4] = mix.g; lineCol[p + 5] = mix.b;
      seg++;
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (inside) {
        mx = (((e.clientX - r.left) / r.width) * 2 - 1) * halfW;
        my = -(((e.clientY - r.top) / r.height) * 2 - 1) * halfH;
      } else {
        mx = 1e9;
        my = 1e9;
      }
    };

    const render = () => renderer.render(scene, camera);

    const step = (drift: boolean) => {
      if (drift) {
        for (let i = 0; i < N; i++) {
          pos[i * 3] += vel[i * 2];
          pos[i * 3 + 1] += vel[i * 2 + 1];
          if (pos[i * 3] < -halfW || pos[i * 3] > halfW) vel[i * 2] *= -1;
          if (pos[i * 3 + 1] < -halfH || pos[i * 3 + 1] > halfH) vel[i * 2 + 1] *= -1;
        }
        nodeGeo.attributes.position.needsUpdate = true;
      }

      seg = 0;
      const cd2 = connectDist * connectDist;
      for (let i = 0; i < N; i++) {
        const xi = pos[i * 3], yi = pos[i * 3 + 1], zi = pos[i * 3 + 2];
        for (let j = i + 1; j < N; j++) {
          const dx = xi - pos[j * 3];
          const dy = yi - pos[j * 3 + 1];
          const d2 = dx * dx + dy * dy;
          if (d2 < cd2) {
            const a = (1 - Math.sqrt(d2) / connectDist) * 0.55;
            addSeg(xi, yi, zi, pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2], a, linkColor);
          }
        }
        // link to cursor
        if (mx < 1e8) {
          const dmx = xi - mx, dmy = yi - my;
          const dm = Math.sqrt(dmx * dmx + dmy * dmy);
          if (dm < mouseDist) {
            addSeg(xi, yi, zi, mx, my, 0, (1 - dm / mouseDist) * 0.9, mouseColor);
          }
        }
      }
      lineGeo.setDrawRange(0, seg * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      render();
    };

    let rafId = 0;
    let visible = true;
    const animate = () => {
      if (!visible) return;
      step(true);
      rafId = requestAnimationFrame(animate);
    };

    if (reduce) {
      step(false);
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      animate();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(rafId);
        if (visible && !reduce) animate();
      },
      { threshold: 0 },
    );
    io.observe(mount);

    const onResize = () => {
      width = mount.clientWidth || 1;
      height = mount.clientHeight || 1;
      halfW = halfH * (width / height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      step(false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      dotTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
}
