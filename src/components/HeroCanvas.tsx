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
    const lineGeometry = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePositions, 3).setUsage(
      THREE.DynamicDrawUsage,
    );
    const lineColAttr = new THREE.BufferAttribute(lineColors, 3).setUsage(
      THREE.DynamicDrawUsage,
    );
    lineGeometry.setAttribute("position", linePosAttr);
    lineGeometry.setAttribute("color", lineColAttr);
    lineGeometry.setDrawRange(0, 0);
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

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
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
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

    // Pulse state.
    const DURATION = 3400; // ms for the signal front to reach the farthest node (slow)
    const TRAIL = 0.16; // bright pulse length behind the head, as a fraction of spread
    const AFTERGLOW = 0.3; // fraction of spread over which a passed link fades out
    const C_HEAD = new THREE.Color(0x0ea5e9); // bright signal head
    const C_TAIL = new THREE.Color(0x7dd3fc); // just behind the head
    const C_GLOW = new THREE.Color(0x38bdf8); // freshly-lit link
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
    let maxDist = 1;
    let sourceValid = false;

    // Pick the node nearest the cursor on screen and start a pulse from it.
    const emitFrom = (now: number) => {
      group.updateMatrixWorld(true);
      const aspect = width / height;
      let src = 0;
      let bestD = Infinity;
      for (let i = 0; i < count; i++) {
        wp.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
          .applyMatrix4(group.matrixWorld)
          .project(camera);
        const d = Math.hypot((wp.x - ndcX) * aspect, wp.y - ndcY);
        if (d < bestD) {
          bestD = d;
          src = i;
        }
      }
      computeWave(src);
      let mx = 1;
      for (let i = 0; i < count; i++) {
        const dd = nodeDist[i];
        if (dd !== Infinity && dd > mx) mx = dd;
      }
      maxDist = mx;
      waveStart = now;
      sourceValid = true;
    };

    const updateLines = (now: number) => {
      let seg = 0;
      if (pointerActive && sourceValid) {
        group.updateMatrixWorld(true);
        const front = ((now - waveStart) / DURATION) * maxDist;
        const trailLen = maxDist * TRAIL;
        const glowSpan = maxDist * AFTERGLOW;
        for (let e = 0; e < edgeCount && seg < MAX_SEG; e++) {
          const da = nodeDist[edgeA[e]];
          const db = nodeDist[edgeB[e]];
          if (da === Infinity && db === Infinity) continue;
          // Orient the edge outward: near endpoint is closer to the source.
          const near = da <= db ? edgeA[e] : edgeB[e];
          const far = da <= db ? edgeB[e] : edgeA[e];
          const dNear = da <= db ? da : db;
          const len = edgeLen[e];
          const dFar = dNear + len;
          if (front < dNear) continue; // signal hasn't reached this link yet
          if (front - glowSpan > dFar) continue; // afterglow already faded out
          wpNear
            .set(positions[near * 3], positions[near * 3 + 1], positions[near * 3 + 2])
            .applyMatrix4(group.matrixWorld);
          wpFar
            .set(positions[far * 3], positions[far * 3 + 1], positions[far * 3 + 2])
            .applyMatrix4(group.matrixWorld);
          const o = seg * 6;
          if (front <= dFar) {
            // Bright signal currently travelling along this link (tail → head).
            let tHead = (front - dNear) / len;
            if (tHead > 1) tHead = 1;
            let tTail = (front - trailLen - dNear) / len;
            if (tTail < 0) tTail = 0;
            const ztail = wpNear.z + (wpFar.z - wpNear.z) * tTail;
            const zhead = wpNear.z + (wpFar.z - wpNear.z) * tHead;
            const bt = depthBright(ztail);
            const bh = depthBright(zhead);
            linePositions[o] = wpNear.x + (wpFar.x - wpNear.x) * tTail;
            linePositions[o + 1] = wpNear.y + (wpFar.y - wpNear.y) * tTail;
            linePositions[o + 2] = ztail;
            linePositions[o + 3] = wpNear.x + (wpFar.x - wpNear.x) * tHead;
            linePositions[o + 4] = wpNear.y + (wpFar.y - wpNear.y) * tHead;
            linePositions[o + 5] = zhead;
            lineColors[o] = C_BG.r + (C_TAIL.r - C_BG.r) * bt;
            lineColors[o + 1] = C_BG.g + (C_TAIL.g - C_BG.g) * bt;
            lineColors[o + 2] = C_BG.b + (C_TAIL.b - C_BG.b) * bt;
            lineColors[o + 3] = C_BG.r + (C_HEAD.r - C_BG.r) * bh;
            lineColors[o + 4] = C_BG.g + (C_HEAD.g - C_BG.g) * bh;
            lineColors[o + 5] = C_BG.b + (C_HEAD.b - C_BG.b) * bh;
          } else {
            // Signal has passed: the whole link glows, then fades to background,
            // so the network reads as "filling in" behind the front.
            const age = (front - dFar) / glowSpan; // 0 just lit → 1 faded
            const r = C_GLOW.r + (C_BG.r - C_GLOW.r) * age;
            const g = C_GLOW.g + (C_BG.g - C_GLOW.g) * age;
            const bl = C_GLOW.b + (C_BG.b - C_GLOW.b) * age;
            const bn = depthBright(wpNear.z);
            const bf = depthBright(wpFar.z);
            linePositions[o] = wpNear.x;
            linePositions[o + 1] = wpNear.y;
            linePositions[o + 2] = wpNear.z;
            linePositions[o + 3] = wpFar.x;
            linePositions[o + 4] = wpFar.y;
            linePositions[o + 5] = wpFar.z;
            lineColors[o] = C_BG.r + (r - C_BG.r) * bn;
            lineColors[o + 1] = C_BG.g + (g - C_BG.g) * bn;
            lineColors[o + 2] = C_BG.b + (bl - C_BG.b) * bn;
            lineColors[o + 3] = C_BG.r + (r - C_BG.r) * bf;
            lineColors[o + 4] = C_BG.g + (g - C_BG.g) * bf;
            lineColors[o + 5] = C_BG.b + (bl - C_BG.b) * bf;
          }
          seg++;
        }
      }
      lineGeometry.setDrawRange(0, seg * 2);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;
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
        // Re-emit the next pulse once the previous one's afterglow has faded.
        if (!sourceValid || (now - waveStart) / DURATION > 1 + AFTERGLOW) emitFrom(now);
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
