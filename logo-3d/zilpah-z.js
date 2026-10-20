// Glossy 3D Zilpah "Z", held still, with a stream of sand flowing the
// infinity loop hidden in the letter: down the diagonal, round the bottom,
// back up through the crossing and round the top. Renders on a transparent canvas.
// Usage: <canvas data-zilpah-z></canvas> + <script type="module" src="zilpah-z.js">
import * as THREE from './vendor/three.module.min.js';

// Outline traced from the logo (1264px artboard): outer edge, then the two counters.
const D = 'M 309 183 C 305 185 278 200 274 202 C 270 206 269 217 273 225 C 274 226 277 234 279 241 C 295 288 301 337 299 400 C 298 414 298 434 297 444 L 297 460 299 464 C 300 465 306 470 312 474 C 318 479 328 486 335 491 C 342 496 352 504 358 508 C 373 519 418 551 427 558 C 431 560 440 567 448 572 C 455 578 465 585 470 589 C 476 593 484 599 488 602 C 491 604 501 612 510 617 C 532 634 533 635 533 639 C 533 642 533 643 489 714 C 482 726 474 739 472 742 C 469 746 462 758 456 768 C 450 778 440 793 435 802 C 430 811 425 819 424 821 C 421 825 407 847 403 854 C 395 867 355 935 338 962 C 311 1006 283 1052 263 1086 L 258 1094 258 1102 C 257 1109 257 1113 258 1115 L 260 1118 272 1123 L 284 1128 326 1128 C 349 1128 398 1127 436 1127 C 474 1126 579 1126 670 1125 C 760 1124 865 1124 902 1123 L 969 1122 972 1120 C 975 1116 976 1112 972 1092 C 961 1023 958 984 961 907 L 962 876 961 872 C 959 869 956 866 949 861 C 944 857 930 847 919 839 C 899 824 873 805 851 789 C 845 785 831 774 819 765 C 806 756 794 747 790 744 C 786 741 770 729 754 717 C 737 704 718 690 712 686 L 700 677 700 674 C 700 671 703 666 712 651 C 719 640 731 621 739 608 C 747 595 770 558 789 526 C 809 495 833 456 843 440 C 870 396 886 371 889 367 C 891 363 916 323 926 306 C 930 299 940 283 947 271 C 988 205 984 213 984 200 C 984 191 984 190 982 188 L 980 186 879 186 C 823 185 693 185 589 184 C 485 183 381 183 356 182 C 321 182 312 182 309 183 M 519 248 C 410 252 372 288 361 399 C 359 420 360 428 362 431 C 363 433 373 441 384 449 C 394 457 406 466 409 468 C 412 470 418 475 422 478 C 427 481 437 488 445 494 C 453 501 466 510 474 516 C 482 522 496 532 505 539 C 575 591 569 588 576 576 C 579 571 583 564 586 560 C 596 543 603 533 639 474 C 649 457 662 435 668 426 C 682 403 681 405 711 356 C 725 333 743 302 753 287 C 770 258 772 253 769 250 C 766 248 567 246 519 248 M 655 742 C 651 748 640 767 629 784 C 619 800 607 820 603 827 C 589 848 574 873 557 901 C 554 905 551 910 550 912 C 548 915 545 920 543 922 C 533 940 512 974 506 982 C 494 1002 481 1024 481 1025 C 481 1025 480 1027 478 1029 C 475 1033 465 1050 459 1060 C 457 1063 456 1067 456 1068 L 456 1072 470 1071 C 477 1071 535 1071 598 1071 C 732 1070 752 1069 780 1062 C 842 1047 875 997 884 906 C 886 887 887 888 861 870 C 853 863 838 853 829 846 C 820 840 806 830 798 824 C 775 807 755 792 742 783 C 736 779 726 772 721 768 C 716 765 702 754 691 746 C 673 733 669 730 666 730 L 662 730 655 742';
const LOOP_SECONDS = 6;
const GRAINS = 6000;
const HANDFULS = 3; // pours of sand on the loop, each with a dense front and a thinning tail

function zShape() {
  const path = new THREE.ShapePath();
  const n = D.match(/[MCLZ]|-?\d+(\.\d+)?/g);
  const p = () => [+n[i++], -n[i++]]; // flip SVG y-down to y-up
  let i = 0, cmd;
  while (i < n.length) {
    if (/[MCLZ]/.test(n[i])) cmd = n[i++];
    if (cmd === 'M') { path.moveTo(...p()); cmd = 'L'; }
    else if (cmd === 'L') path.lineTo(...p());
    else if (cmd === 'C') path.bezierCurveTo(...p(), ...p(), ...p());
    else cmd = null;
  }
  const [outer, ...holes] = path.subPaths; // first contour is the outline
  const shape = new THREE.Shape(outer.getPoints());
  shape.holes = holes;
  return shape;
}

// The figure-eight the Z already draws, down the middle of its stroke: top bar,
// diagonal, bottom bar, back up through the crossing and round the top again.
const EIGHT = [[330,215],[640,212],[900,212],[760,420],[617,655],[470,880],[330,1095],
  [620,1100],[900,1098],[945,990],[930,870],[790,770],[617,655],[470,555],[330,460],[322,330]];

function grainTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.6, 'rgba(255,255,255,.9)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

function mount(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 6.4);

  // Studio reflections: a few soft boxes, one in the brand cream.
  const studio = new THREE.Scene();
  const box = (c, s, x, y, z) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(...s), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); studio.add(m);
  };
  box(0xffffff, [8, 1.5], 0, 5, 3);
  box(0xf6f0dc, [1.5, 9], -5, 0, 2);
  box(0xffffff, [1.5, 9], 5, 1, 1);
  box(0x777777, [12, 2], 0, -5, 3);
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(studio, 0.03).texture;
  scene.add(new THREE.AmbientLight(0xffffff, 0.15));

  const geo = new THREE.ExtrudeGeometry(zShape(), {
    depth: 70, bevelEnabled: true, bevelThickness: 14, bevelSize: 9, bevelSegments: 5, curveSegments: 20,
  });
  geo.computeBoundingBox();
  const c = geo.boundingBox.getCenter(new THREE.Vector3()); // artboard units, y up
  geo.center();
  geo.scale(1 / 470, 1 / 470, 1 / 470);
  const z = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0a, metalness: 0.2, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05,
  }));
  z.rotation.set(0.1, 0.3, 0); // fixed three-quarter view
  scene.add(z);

  // Sand: grains spread across the stroke, each at its own point along the loop,
  // sampled from a lookup table of the loop so a frame costs little.
  const N = 1024;
  const flow = new THREE.CatmullRomCurve3(
    EIGHT.map(([x, y]) => new THREE.Vector3((x - c.x) / 470, (-y - c.y) / 470, 0)), true, 'centripetal');
  const samples = flow.getSpacedPoints(N);
  const normals = samples.map((p, i) => { const q = samples[(i + 1) % N]; return new THREE.Vector2(p.y - q.y, q.x - p.x).normalize(); });
  const along = new Float32Array(GRAINS), across = new Float32Array(GRAINS), lift = new Float32Array(GRAINS);
  const pos = new Float32Array(GRAINS * 3), col = new Float32Array(GRAINS * 3);
  const cream = new THREE.Color(0xf6f0dc), ochre = new THREE.Color(0xe8b94a);
  for (let i = 0; i < GRAINS; i++) {
    along[i] = i % 5 < 2 ? Math.random()
      : (Math.floor(Math.random() * HANDFULS) / HANDFULS - Math.random() * Math.random() * 0.22 + 1) % 1;
    across[i] = (Math.random() + Math.random() + Math.random() - 1.5) * 0.045; // denser mid-stroke
    lift[i] = 0.11 + Math.random() * 0.03; // just above the front face
    cream.clone().lerp(ochre, Math.random()).toArray(col, i * 3);
  }
  const grains = new THREE.BufferGeometry();
  grains.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  grains.setAttribute('color', new THREE.BufferAttribute(col, 3));
  z.add(new THREE.Points(grains, new THREE.PointsMaterial({
    size: 0.05, map: grainTexture(), vertexColors: true, transparent: true, depthWrite: false, toneMapped: false,
  })));

  function render(t) {
    const shift = (t / LOOP_SECONDS) % 1;
    for (let i = 0; i < GRAINS; i++) {
      const u = ((along[i] + shift) % 1) * N, k = u | 0, f = u - k;
      const p = samples[k], q = samples[k + 1], n = normals[k];
      pos[i * 3] = p.x + (q.x - p.x) * f + n.x * across[i];
      pos[i * 3 + 1] = p.y + (q.y - p.y) * f + n.y * across[i];
      pos[i * 3 + 2] = lift[i];
    }
    grains.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const t0 = performance.now();
  const tick = () => { if (!canvas.dataset.manual) render(still.matches ? 0 : (performance.now() - t0) / 1000); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  return { render, resize, loopSeconds: LOOP_SECONDS };
}

document.querySelectorAll('canvas[data-zilpah-z]').forEach((c) => { c.zilpahZ = mount(c); });
