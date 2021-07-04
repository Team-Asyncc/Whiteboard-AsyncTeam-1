// constants and variables
const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("canvas")
);

const pencil = document.getElementById("cursor");
document.addEventListener("mousemove", (e) => {
  pencil.style.left = `${e.clientX}px`;
  pencil.style.top = `${e.clientY}px`;
});
const ctx = canvas.getContext("2d");
let painting = false;

const pen = {
  width: 5,
  color: "black",
};
//resizing
canvas.height = window.innerHeight - 56;
canvas.width = window.innerWidth - 5;

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

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);
