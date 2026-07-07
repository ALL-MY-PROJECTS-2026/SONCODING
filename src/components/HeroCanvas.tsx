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
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

const PALETTE = [0x60a5fa, 0x818cf8, 0x22d3ee, 0xa78bfa];

/**
 * Generated three.js particle field behind the hero — zero external assets
 * (no copyright), and interactive: the field parallax-tilts toward the pointer
 * while it hovers the banner. Respects prefers-reduced-motion (static frame),
 * pauses when scrolled out of view, and cleans up fully.
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

    const count = width < 640 ? 280 : 560;
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
      size: 0.55,
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

    // Pointer parallax — only reacts while the cursor is over the banner.
    let pointerX = 0;
    let pointerY = 0;
    let curX = 0;
    let curY = 0;
    let spin = 0;
    let rafId = 0;
    let visible = true;

    const onPointerMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (inside) {
        pointerX = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointerY = ((e.clientY - r.top) / r.height) * 2 - 1;
      } else {
        pointerX = 0;
        pointerY = 0;
      }
    };

    const render = () => renderer.render(scene, camera);

    const animate = () => {
      if (!visible) return;
      curX += (pointerX - curX) * 0.05;
      curY += (pointerY - curY) * 0.05;
      spin += 0.0006;
      group.rotation.y = spin + curX * 0.55;
      group.rotation.x = curY * 0.4;
      render();
      rafId = requestAnimationFrame(animate);
    };

    if (reduce) {
      render();
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      animate();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduce) {
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
      render();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
}
