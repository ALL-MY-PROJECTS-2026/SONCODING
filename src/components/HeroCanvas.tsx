"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

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
 * a gently rotating particle field with meteors streaking in from outside and
 * falling inward (down + into the screen). Not interactive. Respects
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

    // ── Meteors: fat-line streaks with world-unit thickness (3D perspective) ─
    const METEORS = width < 640 ? 8 : 14;
    const meteorPos = new Float32Array(METEORS * 2 * 3);
    const meteorCol = new Float32Array(METEORS * 2 * 3);
    const meteorGeo = new LineSegmentsGeometry();
    const meteorMat = new LineMaterial({
      vertexColors: true,
      worldUnits: true,
      linewidth: 0.18,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false,
    });
    meteorMat.resolution.set(width, height);
    const meteorLines = new LineSegments2(meteorGeo, meteorMat);
    meteorLines.frustumCulled = false;
    scene.add(meteorLines);

    const C_HEAD = new THREE.Color(0x0ea5e9); // bright meteor head (sky-500)
    const C_TAIL = new THREE.Color(0xeaf2fb); // tail fades toward the light bg

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
      let seg = 0;
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
        if (fx * fx + fy * fy + fz * fz < 49 || m.y < -20) {
          spawn(m, Math.random() * 1);
          continue;
        }
        const tailX = m.x - m.dx * m.len;
        const tailY = m.y - m.dy * m.len;
        const tailZ = m.z - m.dz * m.len;
        const bh = depthBright(m.z);
        const o = seg * 6;
        // tail vertex (faded → bg)
        meteorPos[o] = tailX;
        meteorPos[o + 1] = tailY;
        meteorPos[o + 2] = tailZ;
        meteorCol[o] = C_TAIL.r;
        meteorCol[o + 1] = C_TAIL.g;
        meteorCol[o + 2] = C_TAIL.b;
        // head vertex (bright)
        meteorPos[o + 3] = m.x;
        meteorPos[o + 4] = m.y;
        meteorPos[o + 5] = m.z;
        meteorCol[o + 3] = C_TAIL.r + (C_HEAD.r - C_TAIL.r) * bh;
        meteorCol[o + 4] = C_TAIL.g + (C_HEAD.g - C_TAIL.g) * bh;
        meteorCol[o + 5] = C_TAIL.b + (C_HEAD.b - C_TAIL.b) * bh;
        seg++;
      }
      if (seg === 0) {
        meteorLines.visible = false;
      } else {
        meteorLines.visible = true;
        meteorGeo.setPositions(meteorPos.subarray(0, seg * 6));
        meteorGeo.setColors(meteorCol.subarray(0, seg * 6));
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
      meteorMat.resolution.set(width, height);
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
