"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Soft round sprite so points render as glowing dots rather than squares.
function makeDotTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const PALETTE = [0x60a5fa, 0x818cf8, 0x22d3ee, 0xa78bfa];

type Meteor = {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
  speed: number;
  len: number;
  delay: number;
};

/**
 * Generated three.js hero background — zero external assets (no copyright):
 * a gently rotating particle field with meteors — trails of glowing dots that
 * converge inward toward the centre. Not interactive. Respects
 * prefers-reduced-motion (static frame), pauses when scrolled out of view, and
 * cleans up fully.
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
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 24;

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

    // ── Ambient particle field (slowly rotating) ───────────────────────────
    const count = width < 640 ? 260 : 520;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 48;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 26;
      color.setHex(PALETTE[(Math.random() * PALETTE.length) | 0]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const texture = makeDotTexture();
    const material = new THREE.PointsMaterial({
      size: 0.5,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const group = new THREE.Group();
    group.add(new THREE.Points(geometry, material));
    scene.add(group);

    // ── Meteors: a trail of glowing DOTS streaking inward to the centre ──────
    const METEORS = width < 640 ? 8 : 13;
    const DPM = 11; // dots per meteor trail
    const maxDots = METEORS * DPM;
    const meteorPos = new Float32Array(maxDots * 3);
    const meteorCol = new Float32Array(maxDots * 3);
    const meteorSize = new Float32Array(maxDots);
    const meteorGeo = new THREE.BufferGeometry();
    const mPosAttr = new THREE.BufferAttribute(meteorPos, 3).setUsage(THREE.DynamicDrawUsage);
    const mColAttr = new THREE.BufferAttribute(meteorCol, 3).setUsage(THREE.DynamicDrawUsage);
    const mSizeAttr = new THREE.BufferAttribute(meteorSize, 1).setUsage(THREE.DynamicDrawUsage);
    meteorGeo.setAttribute("position", mPosAttr);
    meteorGeo.setAttribute("color", mColAttr);
    meteorGeo.setAttribute("size", mSizeAttr);
    meteorGeo.setDrawRange(0, 0);
    // Custom point shader so each dot has its OWN size — a big bright head that
    // tapers to small faint tail dots (a comet of points), with depth scaling.
    const pr = Math.min(2, window.devicePixelRatio || 1);
    const meteorMat = new THREE.ShaderMaterial({
      uniforms: { uTex: { value: texture }, uScale: { value: height * 0.5 * pr } },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uScale;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (uScale / max(-mv.z, 0.1));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTex;
        varying vec3 vColor;
        void main() {
          float a = texture2D(uTex, gl_PointCoord).a;
          if (a < 0.01) discard;
          gl_FragColor = vec4(vColor, a);
        }
      `,
    });
    const meteorDots = new THREE.Points(meteorGeo, meteorMat);
    meteorDots.frustumCulled = false;
    scene.add(meteorDots);

    const C_HEAD = new THREE.Color(0x0ea5e9); // bright meteor head (sky-500)
    const C_TAIL = new THREE.Color(0xeaf2fb); // tail dots fade toward the light bg

    // Depth cue: brighter/crisper when closer to the camera.
    const camZ = camera.position.z;
    const depthBright = (wz: number) => {
      const f = (40 - (camZ - wz)) / 28;
      return 0.5 + 0.5 * (f < 0 ? 0 : f > 1 ? 1 : f);
    };

    // Meteors converge toward a focus point near the centre (slightly low and
    // into the screen), so they read as "falling inward to the middle".
    const FOCUS = new THREE.Vector3(0, -3, -5);
    const spawn = (m: Meteor, delay: number) => {
      // Start out on the upper/outer region.
      m.x = (Math.random() - 0.5) * 74;
      m.y = 16 + Math.random() * 24;
      m.z = (Math.random() - 0.5) * 20;
      // Aim at the focus (with a little jitter) → the shower converges centrally.
      let dx = FOCUS.x + (Math.random() - 0.5) * 10 - m.x;
      let dy = FOCUS.y + (Math.random() - 0.5) * 10 - m.y;
      let dz = FOCUS.z + (Math.random() - 0.5) * 10 - m.z;
      const L = Math.hypot(dx, dy, dz) || 1;
      m.dx = dx / L;
      m.dy = dy / L;
      m.dz = dz / L;
      m.speed = 14 + Math.random() * 14;
      m.len = 16 + Math.random() * 12; // long trails so streaks read continuous
      m.delay = delay;
    };

    const meteors: Meteor[] = [];
    for (let i = 0; i < METEORS; i++) {
      const m: Meteor = { x: 0, y: 0, z: 0, dx: 0, dy: 0, dz: 0, speed: 0, len: 0, delay: 0 };
      spawn(m, 0); // initial batch is live immediately (respawns get a delay)
      // Advance each one a random distance so the shower is already populated.
      const adv = Math.random() * 34;
      m.x += m.dx * adv;
      m.y += m.dy * adv;
      m.z += m.dz * adv;
      meteors.push(m);
    }

    let rafId = 0;
    let visible = true;
    let last = -1;

    const drawMeteors = (dt: number) => {
      let d = 0; // dot index
      for (let i = 0; i < METEORS; i++) {
        const m = meteors[i];
        if (m.delay > 0) {
          m.delay -= dt;
          continue;
        }
        m.x += m.dx * m.speed * dt;
        m.y += m.dy * m.speed * dt;
        m.z += m.dz * m.speed * dt;
        // Respawn once it reaches the central focus (or drops past the bottom).
        const fx = m.x - FOCUS.x;
        const fy = m.y - FOCUS.y;
        const fz = m.z - FOCUS.z;
        if (fx * fx + fy * fy + fz * fz < 36 || m.y < -20) {
          spawn(m, Math.random() * 0.9);
          continue;
        }
        // Lay the trail as a line of dots behind the head; each dot fades toward
        // the tail so it reads as a comet of points heading inward.
        const step = m.len / (DPM - 1);
        for (let j = 0; j < DPM; j++) {
          const px = m.x - m.dx * step * j;
          const py = m.y - m.dy * step * j;
          const pz = m.z - m.dz * step * j;
          const o = d * 3;
          meteorPos[o] = px;
          meteorPos[o + 1] = py;
          meteorPos[o + 2] = pz;
          const head = 1 - j / (DPM - 1); // 1 at head → 0 at tail
          // Bright head dot tapering to small faint tail dots.
          meteorSize[d] = 0.25 + head * head * 1.5;
          const b = depthBright(pz) * (0.25 + head * 0.75);
          meteorCol[o] = C_TAIL.r + (C_HEAD.r - C_TAIL.r) * b;
          meteorCol[o + 1] = C_TAIL.g + (C_HEAD.g - C_TAIL.g) * b;
          meteorCol[o + 2] = C_TAIL.b + (C_HEAD.b - C_TAIL.b) * b;
          d++;
        }
      }
      if (d === 0) {
        meteorDots.visible = false;
      } else {
        meteorDots.visible = true;
        meteorGeo.setDrawRange(0, d);
        mPosAttr.needsUpdate = true;
        mColAttr.needsUpdate = true;
        mSizeAttr.needsUpdate = true;
      }
    };

    const render = () => renderer.render(scene, camera);

    const animate = (ts?: number) => {
      if (!visible) return;
      const now = ts ?? 0;
      if (last < 0) last = now;
      const dt = Math.min((now - last) / 1000, 0.05); // clamp after tab throttling
      last = now;
      group.rotation.y += dt * 0.04;
      drawMeteors(dt);
      render();
      rafId = requestAnimationFrame(animate);
    };

    if (reduce) {
      // Static frame: place meteors mid-flight so there's something to see.
      for (let i = 0; i < METEORS; i++) {
        meteors[i].delay = 0;
        meteors[i].y = (Math.random() - 0.5) * 24;
      }
      drawMeteors(0);
      render();
    } else {
      animate();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduce) {
          last = -1;
          cancelAnimationFrame(rafId);
          animate();
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 },
    );
    io.observe(mount);

    const onResize = () => {
      width = mount.clientWidth || 1;
      height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      meteorMat.uniforms.uScale.value = height * 0.5 * pr;
      render();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      meteorGeo.dispose();
      meteorMat.dispose();
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
}
