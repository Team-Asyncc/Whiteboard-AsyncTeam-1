// constants and variables
const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById('canvas')
);

const pencil = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
  pencil.style.left = `${e.clientX}px`;
  pencil.style.top = `${e.clientY}px`;
});
const ctx = canvas.getContext('2d');
const penSlider = document.getElementById('penSlider');
const pen = {
  width: 5,
  color: 'black',
};
const penColor = document.querySelectorAll('.pen-color');

let painting = false;

//resizing
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

//draw
function startPosition(e) {
  painting = true;
  pen.width = penSlider.value;
  ctx.beginPath();
  draw(e);
}
function endPosition() {
  painting = false;
  ctx.beginPath();
}
function draw(e) {
  if (!painting) return;
  ctx.lineWidth = pen.width;
  ctx.lineCap = 'round';
  ctx.strokeStyle = pen.color;
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

//pen color change
// console.log(penColor);
penColor.forEach((pcolor) => {
  pcolor.addEventListener('click', changePenColor);
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

const penIcon = document.getElementById('pen-icon');
const penContainer = document.getElementsByClassName('pen-container')[0];

penIcon.addEventListener('click', () => {
  penContainer.classList.toggle('display-pen-container');
  removelisteners(starterase, enderase, eraseit);
  removelisteners(startline, endline, drawline);
  canvas.addEventListener('mousedown', startPosition);
  canvas.addEventListener('mouseup', endPosition);
  canvas.addEventListener('mousemove', draw);
});

const colorPickerBtn = document.getElementById('colorPickerBtn');

const pickr = Pickr.create({
  el: '.color-picker',
  theme: 'classic',

  swatches: [
    'rgba(244, 67, 54, 1)',
    'rgba(233, 30, 99, 0.95)',
    'rgba(156, 39, 176, 0.9)',
    'rgba(103, 58, 183, 0.85)',
    'rgba(63, 81, 181, 0.8)',
    'rgba(33, 150, 243, 0.75)',
    'rgba(3, 169, 244, 0.7)',
    'rgba(0, 188, 212, 0.7)',
    'rgba(0, 150, 136, 0.75)',
    'rgba(76, 175, 80, 0.8)',
    'rgba(139, 195, 74, 0.85)',
    'rgba(205, 220, 57, 0.9)',
    'rgba(255, 235, 59, 0.95)',
    'rgba(255, 193, 7, 1)',
  ],

  components: {
    preview: true,
    opacity: true,
    hue: true,

    interaction: {
      hex: true,
      rgba: true,
      hsla: true,
      hsva: true,
      cmyk: true,
      input: true,
      clear: true,
      save: true,
    },
  },
});

pickr.on('change', (...args) => {
  let color = args[0].toRGBA();
  pen.color = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
});

//Erase feature--------------------------------------------
const eraserBtn = document.getElementById('eraser');
const eraseSlider = document.getElementById('eraserSlider');
let erase = false;
const eraser = {
  height: 50,
  width: 50,
};
function starterase(e) {
  erase = true;
  eraser.width = eraseSlider.value;
  eraser.height = eraseSlider.value;
  draw(e);
}
function enderase() {
  erase = false;
  ctx.beginPath();
}
function eraseit(e) {
  if (!erase) return;
  ctx.clearRect(
    e.clientX - canvas.offsetLeft,
    e.clientY - canvas.offsetTop,
    eraser.height,
    eraser.width
  );
}
eraserBtn.addEventListener('click', () => {
  canvas.addEventListener('mousedown', starterase);
  canvas.addEventListener('mouseup', enderase);
  canvas.addEventListener('mousemove', eraseit);
  removelisteners(startPosition, endPosition, draw);
  removelisteners(startline, endline, drawline);
  document
    .getElementsByClassName('slidecontainerforeraser')[0]
    .classList.toggle('display-pen-container');
});

function removelisteners(a, b, c) {
  canvas.removeEventListener('mousedown', a);
  canvas.removeEventListener('mouseup', b);
  canvas.removeEventListener('mousemove', c);
}
// line drawing feature ------------------------------
const linedraw = document.getElementById('line');
linedraw.addEventListener('click', () => {
  removelisteners(starterase, enderase, eraseit);
  removelisteners(startPosition, endPosition, draw);
  canvas.addEventListener('mousedown', startline);
  canvas.addEventListener('mouseup', endline);
  canvas.addEventListener('mousemove', drawline);
});

function startline(e) {
  makeline = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  let startpoint = new Image();
  startpoint.src = './Images/startpoint.png';
  startpoint.classList.add('pointer');
  startpoint.style.top = `${e.clientY}px`;
  startpoint.style.left = `${e.clientX}px`;
  console.log(startpoint);
  document.body.append(startpoint);
}

function endline(e) {
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  document.body.removeChild(document.getElementsByClassName('pointer')[0]);
}
function drawline() {}
