// Create a Clifford Algebra with 2,0,1 metric.
const graph =
Algebra(3,0,1,()=>{

  // in 3D PGA, grade-1 elements or vectors (e0,e1,e2) represent
  // reflections AND planes (the invariant of a reflection)
  var plane = (a, b, c, d) => a * 1e1 + b * 1e2 + c * 1e3 + d * 1e0;
  var line = (...plucker) => plucker * [1e01, 1e02, 1e03, 1e12, 1e13, 1e23];
  var point = (x, y, z) => !(1e0 + x * 1e1 + y * 1e2 + z * 1e3);

  const scaleP = (P, s) => point(-(1e1 | !P) * s, -(1e2 | !P) * s, -(1e3 | !P) * s);

  const normalizeP = (P) => scaleP(P, 1 / (!P).Length);
  const x0plane = plane(1, 0, 0, 0);
  const y0plane = plane(0, 1, 0, 0);
  const z0plane = plane(0, 0, 1, 0);
  const xAxis = y0plane ^ z0plane;
  const yAxis = z0plane ^ x0plane;
  const zAxis = x0plane ^ y0plane;
  const A = point(-0.5, 0.8, 0.7), B = point(-1.1, 0.65, 0.7), O = point(0, 0, 0);
  // const A = point(-0.5, 1, 0.9), B = point(-1.1, 0.5, 1), O = point(0, 0, 0);
  const An = () => normalizeP(A), Bn = () => normalizeP(B);
  const proj = (P, on) => () => (on << P) / on;
  const rej = (P, off) => (off << P);
  const parall = (line, P) => () => line << P / P;
  const coord = (P) => [1e1, 1e2, 1e3].map(e => {
    const c = -(e | (!P)) / P.Length;
    return c[0].toFixed(3);
  }).join(' ');


  const Anx = () => proj(An, xAxis);
  const An0y = () => proj(An, y0plane);
  const [Bnx, Bny, Bnz] = [xAxis, yAxis, zAxis].map((axis) => proj(Bn, axis));

  const ob = () => O & B;

  const projx = proj(Anx, ob);
  const topz = () => parall(Anx & proj(Anx,ob), An0y) ^ (zAxis & Bn);
  const projz = proj(An0y, ob);
  const topy =  () => parall(An0y & projz, An) ^ (yAxis & Bn);
  const projy = proj(An, ob);
  return this.graph(()=>{

    return [
      `Drag A or B`,
      // light grey lines
      0xAABBBB,
      xAxis, 'x',  yAxis, 'y', zAxis, 'z',
      // light grey surfaces
      0xDDDDDD, [projz,topz,An0y], [projy,topy,An],
      // magenta surfaces
      0xFFCCFF, [O, Bn, Bnx], [O, Anx, projx],
      // green surfaces
      0xDDFFCC, [O, Bn, Bnz], [projz, projx, topz],
      // blue surfaces
      0xCCFFFF, [O, Bn, Bny], [projz, projy, topy],
      0xFFAAAA,// light pink
      // grey lines
      0x888888,
      [Anx, An0y], [An0y, projz],
      [An0y, topz],
      [An0y, An], [An, projy],
      [An, topy],
      0x000000, [O,  An], [O,  A], [O,  B],[O,  Bn],
      // blue lines
      0x00DDDD,
      [projz, projy], [projy, topy], [topy, projz],
      [Bn, Bny], [Bny, O],
      0xFF00FF, //magenta
      [O, Anx], [Anx, projx],[projx,O],
      [Bn, Bnx], [Bnx, O],
      0x11EE00, //green
      [projz, projx], [projx, topz], [topz, projz],
      [Bn, Bnz], [Bnz, O],
      // black points
      0x000000, O, 'O',  An, "An", Bn, "Bn",
      // blue points
      0x224488, A,"A",B,"B",
    ]
  },{
    grid        : true, // Display a grid
    labels      : true, // Label the grid
    h           : 0.8,  // Heading
    p           : -0.35,// Pitching
    lineWidth   : 2,    // Custom lineWidth (default=1)
    pointRadius : 1,    // Custon point radius (default=1)
    fontSize    : 1,    // Custom font size (default=1)
    scale       : 2,    // Custom scale (default=1), mousewheel.
    // animate: true,
  });

});
document.body.appendChild(graph);
