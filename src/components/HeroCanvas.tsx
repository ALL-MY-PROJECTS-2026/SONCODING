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
      linewidth: 0.22,
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

    // Graph distance + predecessor edge from a source (Dijkstra, per shot). The
    // predecessor edges form a shortest-path TREE we draw as growing branches.
    const nodeDist = new Float32Array(count);
    const nodeDone = new Uint8Array(count);
    const nodePred = new Int32Array(count); // edge used to reach the node, -1 = none
    const computeWave = (source: number) => {
      nodeDist.fill(Infinity);
      nodeDone.fill(0);
      nodePred.fill(-1);
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
          if (nd < nodeDist[nb]) {
            nodeDist[nb] = nd;
            nodePred[nb] = e;
          }
        }
      }
    };

    // Two-phase "shot": a straight beam fires from the outer side (large z,
    // toward the camera) into the node nearest the cursor, then the impact
    // ripples outward through the network to the other points.
    const BEAM_MS = 420; // beam flight time to the impact node
    const RIPPLE_MS = 1500; // time for branches to grow out to the farthest node
    const HOLD_MS = 500; // fully-connected network held before it fades
    const FADE_MS = 650; // whole network fades out together (stays connected)
    const BEAM_OUT = 22; // how far out along +z the beam starts
    const BEAM_UP = 7; // slight upward offset of the beam origin
    const C_BEAM = new THREE.Color(0x0891b2); // bright incoming beam (cyan-600)
    const C_HEAD = new THREE.Color(0x1d4ed8); // ripple advancing tip (blue-700)
    const C_GLOW = new THREE.Color(0x3b82f6); // settled, freshly-lit link (blue-500)
    const C_FADE = new THREE.Color(0x93c5fd); // depth-fade base — still visible (blue-300)
    const C_BG = new THREE.Color(0xeaf2fb); // afterglow disappears toward this
    let waveStart = 0;

    // Depth cue: fade a line vertex toward the background by its distance from
    // the camera, so the links read with real 3D perspective (near = crisp,
    // far = washed out). Returns a brightness multiplier in [0.2, 1].
    const camZ = camera.position.z;
    const DEPTH_NEAR = 12;
    const DEPTH_FAR = 40;
    const depthBright = (wz: number) => {
      const f = (DEPTH_FAR - (camZ - wz)) / (DEPTH_FAR - DEPTH_NEAR);
      return 0.55 + 0.45 * (f < 0 ? 0 : f > 1 ? 1 : f);
    };
    let maxDist = 1; // max graph distance from the impact node (set per emit)
    let sourceValid = false;
    let srcIndex = 0; // impact node (nearest the cursor)
    const impactPos = new THREE.Vector3(); // beam target (live), reused per frame
    const anchorPos = new THREE.Vector3(); // beam origin (outer), reused per frame

    // Pick the impact node nearest the cursor and compute graph distances for the
    // ripple that spreads out from it.
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
      srcIndex = src;
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

    // Write one segment (p0 → p1) with per-vertex colours into the buffers.
    const putSeg = (
      s: number,
      x0: number, y0: number, z0: number,
      x1: number, y1: number, z1: number,
      r0: number, g0: number, b0: number,
      r1: number, g1: number, b1: number,
    ) => {
      const o = s * 6;
      linePositions[o] = x0;
      linePositions[o + 1] = y0;
      linePositions[o + 2] = z0;
      linePositions[o + 3] = x1;
      linePositions[o + 4] = y1;
      linePositions[o + 5] = z1;
      lineColors[o] = r0;
      lineColors[o + 1] = g0;
      lineColors[o + 2] = b0;
      lineColors[o + 3] = r1;
      lineColors[o + 4] = g1;
      lineColors[o + 5] = b1;
      return s + 1;
    };

    const updateLines = (now: number) => {
      let seg = 0;
      if (pointerActive && sourceValid) {
        group.updateMatrixWorld(true);
        const elapsed = now - waveStart;

        // Impact node (live) and the outer anchor the beam is fired from.
        impactPos
          .set(positions[srcIndex * 3], positions[srcIndex * 3 + 1], positions[srcIndex * 3 + 2])
          .applyMatrix4(group.matrixWorld);
        anchorPos.set(impactPos.x, impactPos.y + BEAM_UP, impactPos.z + BEAM_OUT);

        // ── Phase A: straight beam flies in from outer z to the impact node ──
        if (elapsed < BEAM_MS) {
          const p = elapsed / BEAM_MS;
          const tail = Math.max(0, p - 0.4);
          const dx = impactPos.x - anchorPos.x;
          const dy = impactPos.y - anchorPos.y;
          const dz = impactPos.z - anchorPos.z;
          const hz = anchorPos.z + dz * p;
          const tz = anchorPos.z + dz * tail;
          const bh = depthBright(hz);
          const btl = depthBright(tz) * 0.5;
          seg = putSeg(
            seg,
            anchorPos.x + dx * tail, anchorPos.y + dy * tail, tz,
            anchorPos.x + dx * p, anchorPos.y + dy * p, hz,
            C_FADE.r + (C_BEAM.r - C_FADE.r) * btl,
            C_FADE.g + (C_BEAM.g - C_FADE.g) * btl,
            C_FADE.b + (C_BEAM.b - C_FADE.b) * btl,
            C_FADE.r + (C_BEAM.r - C_FADE.r) * bh,
            C_FADE.g + (C_BEAM.g - C_FADE.g) * bh,
            C_FADE.b + (C_BEAM.b - C_FADE.b) * bh,
          );
        }

        // ── Phase B: branches grow out along the shortest-path tree and stay
        // connected (parent → child), then the whole network fades together. ──
        if (elapsed >= BEAM_MS) {
          const rt = elapsed - BEAM_MS;
          const front = Math.min(rt / RIPPLE_MS, 1) * maxDist;
          // Global fade: 1 while growing/holding, ramps to 0 during the fade.
          let gf = 1;
          if (rt > RIPPLE_MS + HOLD_MS) {
            gf = 1 - (rt - RIPPLE_MS - HOLD_MS) / FADE_MS;
            if (gf < 0) gf = 0;
          }
          for (let n = 0; n < count && seg < MAX_SEG; n++) {
            const pe = nodePred[n];
            if (pe < 0) continue; // source node or unreached
            const parent = edgeA[pe] === n ? edgeB[pe] : edgeA[pe];
            const dParent = nodeDist[parent];
            if (front < dParent) continue; // branch hasn't reached the parent yet
            const len = edgeLen[pe]; // = nodeDist[n] - dParent along the tree
            const grow = Math.min((front - dParent) / len, 1); // parent → child
            wpNear
              .set(positions[parent * 3], positions[parent * 3 + 1], positions[parent * 3 + 2])
              .applyMatrix4(group.matrixWorld);
            wpFar
              .set(positions[n * 3], positions[n * 3 + 1], positions[n * 3 + 2])
              .applyMatrix4(group.matrixWorld);
            const tipX = wpNear.x + (wpFar.x - wpNear.x) * grow;
            const tipY = wpNear.y + (wpFar.y - wpNear.y) * grow;
            const tipZ = wpNear.z + (wpFar.z - wpNear.z) * grow;
            // Parent end settled; the advancing tip glows brighter while growing.
            const tipCol = grow < 1 ? C_HEAD : C_GLOW;
            const bo = depthBright(wpNear.z);
            const bt = depthBright(tipZ);
            // depth-fade toward the still-visible C_FADE, then global gf → C_BG.
            const nr = C_FADE.r + (C_GLOW.r - C_FADE.r) * bo;
            const ng = C_FADE.g + (C_GLOW.g - C_FADE.g) * bo;
            const nb = C_FADE.b + (C_GLOW.b - C_FADE.b) * bo;
            const trr = C_FADE.r + (tipCol.r - C_FADE.r) * bt;
            const tgg = C_FADE.g + (tipCol.g - C_FADE.g) * bt;
            const tbb = C_FADE.b + (tipCol.b - C_FADE.b) * bt;
            seg = putSeg(
              seg,
              wpNear.x, wpNear.y, wpNear.z, tipX, tipY, tipZ,
              C_BG.r + (nr - C_BG.r) * gf,
              C_BG.g + (ng - C_BG.g) * gf,
              C_BG.b + (nb - C_BG.b) * gf,
              C_BG.r + (trr - C_BG.r) * gf,
              C_BG.g + (tgg - C_BG.g) * gf,
              C_BG.b + (tbb - C_BG.b) * gf,
            );
          }
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
        // Re-emit once the previous shot (beam + grow + hold + fade) has ended.
        if (!sourceValid || now - waveStart > BEAM_MS + RIPPLE_MS + HOLD_MS + FADE_MS + 120)
          emitFrom(now);
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
