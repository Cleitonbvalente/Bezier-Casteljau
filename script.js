const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let points = [
  { x: 100, y: 300 },
  { x: 150, y: 100 },
  { x: 400, y: 100 },
  { x: 500, y: 300 }
];

let draggingPoint = null;

// ===============================
// LERP
// ===============================
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ===============================
// De Casteljau (recursivo)
// ===============================
function deCasteljau(points, t) {
  if (points.length === 1) return points[0];

  let newPoints = [];

  for (let i = 0; i < points.length - 1; i++) {
    newPoints.push({
      x: lerp(points[i].x, points[i + 1].x, t),
      y: lerp(points[i].y, points[i + 1].y, t)
    });
  }

  return deCasteljau(newPoints, t);
}

// ===============================
// Desenhar curva
// ===============================
function drawCurve() {
  ctx.beginPath();

  for (let t = 0; t <= 1; t += 0.01) {
    let p = deCasteljau(points, t);

    if (t === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ===============================
// Desenhar pontos e linhas guia
// ===============================
function drawPoints() {
  // linhas guia
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.strokeStyle = "#aaa";
  ctx.stroke();

  // pontos
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#4a6cff";
    ctx.fill();
  });
}

// ===============================
// Render
// ===============================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPoints();
  drawCurve();
}

// ===============================
// Eventos de mouse
// ===============================
canvas.addEventListener("mousedown", (e) => {
  const mouse = getMousePos(e);

  points.forEach(p => {
    if (distance(mouse, p) < 10) {
      draggingPoint = p;
    }
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (draggingPoint) {
    const mouse = getMousePos(e);
    draggingPoint.x = mouse.x;
    draggingPoint.y = mouse.y;
    draw();
  }
});

canvas.addEventListener("mouseup", () => {
  draggingPoint = null;
});

canvas.addEventListener("mouseleave", () => {
  draggingPoint = null;
});

// ===============================
// Utils
// ===============================
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// inicializa
draw();
