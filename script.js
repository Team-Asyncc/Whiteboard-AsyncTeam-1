// constants and variables
const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("canvas")
);
const ctx = canvas.getContext("2d");
const penSlider = document.getElementById("penSlider");
const pen = {
  width: 10,
  color: "black",
};
const penColor = document.querySelectorAll(".pen-color");

///////////////
const pickAColor = document.getElementById("pickAColor");
console.log(pickAColor);
pickAColor.addEventListener("change", (e) => {
  console.log(e.target.value);
  pen.color = e.target.value;
});

////
let painting = false;

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
  pen.width = penSlider.value;
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

//pen color change
// console.log(penColor);
penColor.forEach((pcolor) => {
  pcolor.addEventListener("click", changePenColor);
});
function changePenColor() {
  // console.log(this.value);
  pen.color = this.value;
}
// pickAColor.onChange((e) => {
//   console.log(e);
//   pen.color = e.value;
// });
// console.log(pickAColor.onclick());
