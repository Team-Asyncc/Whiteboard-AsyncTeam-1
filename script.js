// constants and variables
const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("canvas")
);
const ctx = canvas.getContext("2d");
let painting = false;

const pen = {
  width: 10,
  color: "black",
};
//resizing
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
function resizeCanvas() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  //   console.log("called");
}
window.addEventListener("resize", resizeCanvas);

//draw
function startPosition(e) {
  painting = true;
  draw(e);
}
function endPosition() {
  painting = false;
  ctx.beginPath();
}
function draw(e) {
  if (!painting) return;
  ctx.lineWidth = pen.width;
  ctx.lineCap = "round";
  ctx.strokeStyle = pen.color;

  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);
