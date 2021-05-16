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


  const [Anx, Any, Anz] = [xAxis, yAxis, zAxis].map((axis) => proj(An, axis));
  const [Bnx, Bny, Bnz] = [xAxis, yAxis, zAxis].map((axis) => proj(Bn, axis));
  const Bn0y = proj(Bn, y0plane);
  // const An0y = proj(An, y0plane);
  const [An0x, An0y, An0z] = [x0plane, y0plane, z0plane].map((p) => proj(An, p));

  const ob = () => O & B;
  const projAnOb = () => proj(An, ob);
  const P = projAnOb;
  const planeObvertical = () => ob & proj(Bn, y0plane);
  const planeAnPerpOb = () => ob << An;
  const linePPerpOb = () => planeAnPerpOb ^ planeObvertical;
  const AnOBv = () => proj(An, O & Bn & Bn0y);
  const AnOBv0y = () => proj(AnOBv, y0plane);
  const P1 = () => proj(AnOBv0y, ob);
const T1top = parall(ob, Any) ^ rej(P1, (O&Bn0y));
  const corner1 = proj(AnOBv0y, linePPerpOb);
  const lineAn0yPerpOb = () => An0y & AnOBv0y;

  const corner2 = proj(Anx, lineAn0yPerpOb);
  const AnxOB0y = () => proj(Anx, O & Bn0y);
  const P2 = proj(AnxOB0y, ob);
  const planeAzPllOBvert = parall(O & Bn0y & B, Anz);
  const T2top0y = () => planeAzPllOBvert ^ (An0y & corner2);
  const planeP2T2Top = () => P2 & AnxOB0y & T2top0y;
  const T2top = () => planeAzPllOBvert ^ (Anz & ob) ^ planeP2T2Top;
  const liftedCorner2 = () => proj(T2top,ob & Bn0y);
  return this.graph(()=>{

    return [
      `Drag A or B`,
      0xFFCCFF, [O, Bn, Bnx],
      0xDDFFCC, [O, Bn, Bnz],
      0xCCFFFF, [O, Bn, Bny],
      0xAABBBB,
      xAxis, 'x',  yAxis, 'y', zAxis, 'z',
      0x000000,
      O, 'O',  An, "An", Bn, "Bn",
      0xFFAAAA,// light pink
      0x888888,
      //[An,An0y],
      [An,P], //[An, AnOBv],
      [O, Bn0y], [ Bn, Bn0y],
      //[AnOBv, AnOBv0y],
      [AnOBv0y, P1],
      //[AnOBv0y,corner1], [AnOBv,corner1],
      // [An0y, An],
      [An, An0z], [An0z, Anx],[Any, An0z], [Any, O],
      [An0y, AnOBv0y],//[Anx, corner2],[corner2, An0y],
      [An, An0x],[An0x, Anz], [An0x, Any],
      [Anx, AnxOB0y], [AnxOB0y, P2],
      [O, Anz],
      [O, Bnx], [Bnx, Bn],
      [O, Bny], [Bny, Bn],
      [O, Bnz], [Bnz, Bn],
      [Anz, T2top0y],[T2top0y, An0y],//[An0y, Anz],
      [T2top0y, AnxOB0y],
      [T2top, T2top0y],
      [Any, T1top],
      //[P2, liftedCorner2], [liftedCorner2, T2top],
      0x000000, [O,  An], [O,  A], [O,  B],[O,  Bn],
      0x00DDDD,
      //[AnOBv, AnOBv0y], [AnOBv0y, corner1],[corner1, AnOBv],
      [P, P1],[P1, T1top],[T1top,P],
      0xFF00FF,
      [O, Anx], [Anx, P2],[P2,O],
      0x11EE00,
      [P1,P2], [P2, T2top], [T2top, P1],
      0x224488, A,"A",B,"B",
      0x8884400, P, 'P'
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
