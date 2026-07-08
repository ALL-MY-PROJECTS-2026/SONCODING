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
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

const PALETTE = [0x60a5fa, 0x818cf8, 0x22d3ee, 0xa78bfa];

/**
 * Generated three.js particle field behind the hero — zero external assets
 * (no copyright), and interactive: the field parallax-tilts toward the pointer,
 * and light "signals" pulse outward from the node nearest the cursor along a
 * sparse comm-network, spreading far like fiber-optic transmission. Respects
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

    // Interactive comm-network pulses: light signals race along a precomputed
    // sparse graph, outward from the cursor. Buffers hold the currently-lit
    // pulse segments; drawRange controls how many are live each frame.
    const MAX_SEG = 600;
    const linePositions = new Float32Array(MAX_SEG * 2 * 3);
    const lineColors = new Float32Array(MAX_SEG * 2 * 3);
    // Fat lines (LineSegments2) with world-unit thickness, so links get real
    // 3D perspective — near links render thick, far links thin.
    const lineGeometry = new LineSegmentsGeometry();
    const lineMaterial = new LineMaterial({
      vertexColors: true,
      worldUnits: true,
      linewidth: 0.16,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false,
    });
    lineMaterial.resolution.set(width, height);

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

    // Pulse segments are computed in world space (endpoints ride the rotating
    // field), so the LineSegments lives in the scene root, not the group.
    const lineSegments = new LineSegments2(lineGeometry, lineMaterial);
    lineSegments.frustumCulled = false;
    scene.add(lineSegments);

    // Pointer state. ndc* is the pointer in normalized device coords (up = +1),
    // used for the parallax tilt and to anchor the cursor lines.
    let pointerActive = false;
    let ndcX = 0;
    let ndcY = 0;
    let curX = 0;
    let curY = 0;
    let spin = 0;
    let rafId = 0;
    let visible = true;

    const onPointerMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      pointerActive = inside;
      if (inside) {
        ndcX = ((e.clientX - r.left) / r.width) * 2 - 1;
        ndcY = -(((e.clientY - r.top) / r.height) * 2 - 1);
      }
    };
    const onWinBlur = () => {
      pointerActive = false;
    };

    // Scratch vectors reused each frame (no per-frame allocation).
    const wp = new THREE.Vector3();
    const wpNear = new THREE.Vector3();
    const wpFar = new THREE.Vector3();

    // ── Precomputed sparse comm-network ─────────────────────────────────────
    // Each node links to its K nearest neighbours (deduped). Signals travel
    // along these links — we deliberately don't connect everything.
    const K = width < 640 ? 2 : 3;
    const edgeA: number[] = [];
    const edgeB: number[] = [];
    const edgeLen: number[] = [];
    {
      const order = new Int32Array(count);
      const d2 = new Float32Array(count);
      const seenEdge = new Set<number>();
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          d2[j] = i === j ? Infinity : dx * dx + dy * dy + dz * dz;
          order[j] = j;
        }
        for (let k = 0; k < K; k++) {
          let mk = k;
          for (let j = k + 1; j < count; j++) if (d2[order[j]] < d2[order[mk]]) mk = j;
          const swap = order[k];
          order[k] = order[mk];
          order[mk] = swap;
          const j = order[k];
          const a = i < j ? i : j;
          const b = i < j ? j : i;
          const key = a * count + b;
          if (!seenEdge.has(key)) {
            seenEdge.add(key);
            edgeA.push(a);
            edgeB.push(b);
            edgeLen.push(Math.sqrt(d2[j]));
          }
        }
      }
    }
    const edgeCount = edgeA.length;
    const adj: number[][] = Array.from({ length: count }, () => []);
    for (let e = 0; e < edgeCount; e++) {
      adj[edgeA[e]].push(e);
      adj[edgeB[e]].push(e);
    }

    // Graph distance from a source node (Dijkstra, recomputed once per pulse).
    const nodeDist = new Float32Array(count);
    const nodeDone = new Uint8Array(count);
    const computeWave = (source: number) => {
      nodeDist.fill(Infinity);
      nodeDone.fill(0);
      nodeDist[source] = 0;
      for (let iter = 0; iter < count; iter++) {
        let u = -1;
        let best = Infinity;
        for (let v = 0; v < count; v++) {
          if (!nodeDone[v] && nodeDist[v] < best) {
            best = nodeDist[v];
            u = v;
          }
        }
        if (u === -1) break;
        nodeDone[u] = 1;
        const list = adj[u];
        for (let t = 0; t < list.length; t++) {
          const e = list[t];
          const nb = edgeA[e] === u ? edgeB[e] : edgeA[e];
          const nd = nodeDist[u] + edgeLen[e];
          if (nd < nodeDist[nb]) nodeDist[nb] = nd;
        }
      }
    };

    // Depth-sweep state: a front sweeps along z from the outer side (toward the
    // camera) into the screen; each link extends inward as the front passes it.
    const DURATION = 2200; // ms for the front to sweep the full depth range
    const AFTERGLOW = 0.3; // depth-span fraction over which a finished link fades
    const GROWWIN = 3.5; // depth units over which a link extends to full length
    const C_HEAD = new THREE.Color(0x0ea5e9); // bright advancing tip
    const C_GLOW = new THREE.Color(0x38bdf8); // settled, freshly-drawn link
    const C_BG = new THREE.Color(0xeaf2fb); // fades toward the light bg
    let waveStart = 0;

    // Depth cue: fade a line vertex toward the background by its distance from
    // the camera, so the links read with real 3D perspective (near = crisp,
    // far = washed out). Returns a brightness multiplier in [0.2, 1].
    const camZ = camera.position.z;
    const DEPTH_NEAR = 12;
    const DEPTH_FAR = 40;
    const depthBright = (wz: number) => {
      const f = (DEPTH_FAR - (camZ - wz)) / (DEPTH_FAR - DEPTH_NEAR);
      return 0.2 + 0.8 * (f < 0 ? 0 : f > 1 ? 1 : f);
    };
    let maxDist = 1; // depth span of the field (set per emit)
    let sourceValid = false;
    const zWorld = new Float32Array(count); // world-space z of each node, per emit
    let zOuter = 0; // z of the outermost node — the front starts here

    // Pick the node nearest the cursor (to define the lit sub-network), snapshot
    // node depths, and start a depth sweep from the outer side inward.
    const emitFrom = (now: number) => {
      group.updateMatrixWorld(true);
      const aspect = width / height;
      let src = 0;
      let bestD = Infinity;
      let zMax = -Infinity;
      let zMin = Infinity;
      for (let i = 0; i < count; i++) {
        wp.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]).applyMatrix4(
          group.matrixWorld,
        );
        const z = wp.z;
        zWorld[i] = z;
        if (z > zMax) zMax = z;
        if (z < zMin) zMin = z;
        wp.project(camera);
        const d = Math.hypot((wp.x - ndcX) * aspect, wp.y - ndcY);
        if (d < bestD) {
          bestD = d;
          src = i;
        }
      }
      computeWave(src);
      zOuter = zMax;
      maxDist = Math.max(zMax - zMin, 1);
      waveStart = now;
      sourceValid = true;
    };

    const updateLines = (now: number) => {
      let seg = 0;
      if (pointerActive && sourceValid) {
        group.updateMatrixWorld(true);
        const front = ((now - waveStart) / DURATION) * maxDist;
        const glowSpan = maxDist * AFTERGLOW;
        for (let e = 0; e < edgeCount && seg < MAX_SEG; e++) {
          const a = edgeA[e];
          const b = edgeB[e];
          if (nodeDist[a] === Infinity && nodeDist[b] === Infinity) continue;
          // Outer endpoint = larger z (toward the camera). Each link is anchored
          // at its outer node and EXTENDS inward (into the screen) as the depth
          // front passes, so the network reaches out from the outside in and the
          // segments always stay attached to their nodes (properly connected).
          const za = zWorld[a];
          const zb = zWorld[b];
          const outer = za >= zb ? a : b;
          const inner = za >= zb ? b : a;
          const dOuter = zOuter - (za >= zb ? za : zb);
          if (front < dOuter) continue; // front hasn't reached this link yet
          const age = front - dOuter - GROWWIN; // <0 extending, ≥0 fully drawn
          if (age > glowSpan) continue; // afterglow faded out
          const grow = age < 0 ? (front - dOuter) / GROWWIN : 1; // 0→1 extension
          wpNear
            .set(positions[outer * 3], positions[outer * 3 + 1], positions[outer * 3 + 2])
            .applyMatrix4(group.matrixWorld);
          wpFar
            .set(positions[inner * 3], positions[inner * 3 + 1], positions[inner * 3 + 2])
            .applyMatrix4(group.matrixWorld);
          const tipX = wpNear.x + (wpFar.x - wpNear.x) * grow;
          const tipY = wpNear.y + (wpFar.y - wpNear.y) * grow;
          const tipZ = wpNear.z + (wpFar.z - wpNear.z) * grow;
          const gl = age < 0 ? 0 : age / glowSpan; // 0 fresh → 1 faded
          // Settled colour for the outer end (and the tip once fully grown).
          const sr = C_GLOW.r + (C_BG.r - C_GLOW.r) * gl;
          const sg = C_GLOW.g + (C_BG.g - C_GLOW.g) * gl;
          const sb = C_GLOW.b + (C_BG.b - C_GLOW.b) * gl;
          // The advancing tip glows bright while the link is still extending.
          const tr = age < 0 ? C_HEAD.r : sr;
          const tg = age < 0 ? C_HEAD.g : sg;
          const tb = age < 0 ? C_HEAD.b : sb;
          const bo = depthBright(wpNear.z);
          const bt = depthBright(tipZ);
          const o = seg * 6;
          linePositions[o] = wpNear.x;
          linePositions[o + 1] = wpNear.y;
          linePositions[o + 2] = wpNear.z;
          linePositions[o + 3] = tipX;
          linePositions[o + 4] = tipY;
          linePositions[o + 5] = tipZ;
          lineColors[o] = C_BG.r + (sr - C_BG.r) * bo;
          lineColors[o + 1] = C_BG.g + (sg - C_BG.g) * bo;
          lineColors[o + 2] = C_BG.b + (sb - C_BG.b) * bo;
          lineColors[o + 3] = C_BG.r + (tr - C_BG.r) * bt;
          lineColors[o + 4] = C_BG.g + (tg - C_BG.g) * bt;
          lineColors[o + 5] = C_BG.b + (tb - C_BG.b) * bt;
          seg++;
        }
      }
      if (seg === 0) {
        lineSegments.visible = false;
      } else {
        lineSegments.visible = true;
        lineGeometry.setPositions(linePositions.subarray(0, seg * 6));
        lineGeometry.setColors(lineColors.subarray(0, seg * 6));
      }
    };

    const render = () => renderer.render(scene, camera);

    const animate = (ts?: number) => {
      if (!visible) return;
      const now = ts ?? 0;
      const tx = pointerActive ? ndcX : 0;
      const ty = pointerActive ? ndcY : 0;
      curX += (tx - curX) * 0.05;
      curY += (ty - curY) * 0.05;
      spin += 0.0006;
      group.rotation.y = spin + curX * 0.55;
      group.rotation.x = -curY * 0.4;
      if (pointerActive) {
        // Re-emit once the previous sweep (grow + afterglow) has fully faded.
        if (!sourceValid || (now - waveStart) / DURATION > 1 + AFTERGLOW + 0.2) emitFrom(now);
      } else {
        sourceValid = false;
      }
      updateLines(now);
      render();
      rafId = requestAnimationFrame(animate);
    };

    if (reduce) {
      render();
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("blur", onWinBlur);
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
      lineMaterial.resolution.set(width, height);
      render();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onWinBlur);
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
}
