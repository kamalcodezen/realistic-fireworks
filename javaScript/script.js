const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* ---------- CANVAS ---------- */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ---------- UTILS ---------- */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function randomColor() {
  return `hsl(${Math.floor(rand(0,360))},100%,60%)`;
}

/* ---------- ROCKET ---------- */
class Rocket {
  constructor(x) {
    this.x = x;
    this.y = canvas.height - 5;
    this.vy = rand(-8, -11);
    this.color = randomColor();
    this.trail = [];
    this.exploded = false;
  }

  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 10) this.trail.shift();

    this.y += this.vy;
    this.vy += 0.1;

    if (this.vy >= 0 && !this.exploded) {
      this.exploded = true;
      explode(this.x, this.y);
    }
  }

  draw() {
    // fire trail
    this.trail.forEach((p, i) => {
      ctx.globalAlpha = i / this.trail.length;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // rocket
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ---------- PARTICLE ---------- */
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = rand(-4, 4);
    this.vy = rand(-4, 4);
    this.alpha = 1;
    this.color = randomColor();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.alpha -= 0.01;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let rockets = [];
let particles = [];

/* ---------- EXPLOSION ---------- */
function explode(x, y) {
  for (let i = 0; i < 120; i++) {
    particles.push(new Particle(x, y));
  }
}

/* ---------- CLICK / TOUCH ONLY ---------- */
function launch(x) {
  let count = 0;
  const interval = setInterval(() => {
    count++;
    for (let i = 0; i < 4; i++) {
      rockets.push(new Rocket(x + rand(-120,120)));
    }
    if (count === 5) clearInterval(interval);
  }, 700);
}

canvas.addEventListener("click", e => launch(e.clientX));
canvas.addEventListener("touchstart", e => {
  launch(e.touches[0].clientX);
});

/* ---------- NAME ANIMATION ---------- */
const name = "KamalUddin";
const subtitle = "Creative Developer";
let text = "";
let idx = 0;
let glow = 0;

setInterval(() => {
  if (idx < name.length) {
    text += name[idx];
    idx++;
  }
}, 150);

function drawName() {
  glow += 0.05;
  ctx.save();
  ctx.textAlign = "center";

  ctx.font = "28px serif";
  ctx.fillStyle = "white";
  ctx.shadowBlur = 20 + Math.sin(glow) * 10;
  ctx.shadowColor = "white";
  ctx.fillText(text, canvas.width/2, canvas.height - 40);

  ctx.font = "16px serif";
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText(subtitle, canvas.width/2, canvas.height - 20);

  ctx.restore();
}

/* ---------- LOOP ---------- */
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  rockets.forEach((r,i)=>{
    r.update();
    r.draw();
    if(r.exploded) rockets.splice(i,1);
  });

  particles.forEach((p,i)=>{
    p.update();
    p.draw();
    if(p.alpha <= 0) particles.splice(i,1);
  });

  drawName();
  requestAnimationFrame(animate);
}
animate();
