// constants and variables
const activeToolEl = document.getElementById('active-tool');
const downloadBtn = document.getElementById('download');

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
const undoTracker = [];
let index = -1;

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
  undoTracker.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  index += 1;

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
  activeToolEl.textContent = 'Pen Tool';
  penContainer.classList.toggle('display-pen-container');
  removelisteners(starterase, enderase, eraseit);
  removelisteners(startline, endline, drawline);
  removelisteners(circleStart, circleEnd, circleDraw);
  removelisteners(rectStart, rectEnd, rectDraw);

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
  activeToolEl.textContent = 'Eraser';
  canvas.addEventListener('mousedown', starterase);
  canvas.addEventListener('mouseup', enderase);
  canvas.addEventListener('mousemove', eraseit);
  removelisteners(circleStart, circleEnd, circleDraw);
  removelisteners(startPosition, endPosition, draw);
  removelisteners(startline, endline, drawline);
  removelisteners(rectStart, rectEnd, rectDraw);

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
  activeToolEl.textContent = 'Line';
  removelisteners(starterase, enderase, eraseit);
  removelisteners(startPosition, endPosition, draw);
  removelisteners(circleStart, circleEnd, circleDraw);
  removelisteners(rectStart, rectEnd, rectDraw);

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
  document.body.append(startpoint);
}

function endline(e) {
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  document.body.removeChild(document.getElementsByClassName('pointer')[0]);

  undoTracker.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  index += 1;
}

function drawline() {}

/* Undo  ------------------------------------*/
const undo = document.getElementById('undo');
undo.addEventListener('click', doUndo);

function doUndo() {
  activeToolEl.textContent = 'Undo';
  if (index <= 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  index -= 1;
  undoTracker.pop();
  if (index > -1) ctx.putImageData(undoTracker[index], 0, 0);
}

// control bar cursor hide
const controlBar = document.querySelector('.control-bar');
const icons = document.querySelectorAll('.icon');
controlBar.addEventListener('mouseover', () => {
  pencil.classList.add('hide');
});

controlBar.addEventListener('mouseout', () => {
  pencil.classList.remove('hide');
});

icons.forEach((icon) => {
  icon.addEventListener('mouseover', () => {
    pencil.classList.add('hide');
  });

  // icon.addEventListener('mouseou', ()=> {
  //   pencil.classList.add('hide');
  // })
});

//Circle Shape feature
const circleShape = document.getElementById('circleShape');
circleShape.addEventListener('click', () => {
  activeToolEl.textContent = 'Circle';
  console.log('shape clicked');
  removelisteners(startPosition, endPosition, draw);
  removelisteners(startline, endline, drawline);
  removelisteners(starterase, enderase, eraseit);
  removelisteners(rectStart, rectEnd, rectDraw);
  canvas.addEventListener('mousedown', circleStart);
  canvas.addEventListener('mouseup', circleEnd);
  canvas.addEventListener('mousemove', circleDraw);
});

let div, posY;
let makeShape = false;

function circleStart(e) {
  makeShape = true;
  div = document.createElement('div');
  div.classList.add('circle-shape');
  div.style.top = `${e.clientY}px`;
  div.style.left = `${e.clientX}px`;
  posY = e.clientY;
  document.body.append(div);
}

function circleDraw(e) {
  if (!makeShape) return;
  let coordinate = Math.abs(posY - e.clientY);
  div.style.height = `${coordinate}px`;
  div.style.width = `${coordinate}px`;
  div.style.background = `${pen.color}`;
}

function circleEnd() {
  removelisteners(circleStart, circleEnd, circleDraw);
  makeShape = false;
  ctx.beginPath();
  const cc = document.getElementsByClassName('circle-shape')[0];
  let left = window.getComputedStyle(cc).left.slice(0, -2);
  let top = window.getComputedStyle(cc).top.slice(0, -2);
  let width = window.getComputedStyle(cc).width.slice(0, -2);
  ctx.arc(left, top, width / 2, 0, 360);
  ctx.fillStyle = pen.color;
  document.body.removeChild(cc);
  ctx.fill();
  undoTracker.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  index += 1;
}
// shape box
const shapes = document.querySelector('#shapes');

shapes.addEventListener('click', () => {
  const cont = document.querySelector('.shape-container');
  console.log(cont);
  cont.classList.toggle('show-shapes');
});

//rectagle shape

const rectShape = document.getElementById('rectShape');
rectShape.addEventListener('click', () => {
  activeToolEl.textContent = 'Rectangle';
  console.log('shape clicked');
  removelisteners(startPosition, endPosition, draw);
  removelisteners(startline, endline, drawline);
  removelisteners(starterase, enderase, eraseit);
  removelisteners(circleStart, circleEnd, circleDraw);
  canvas.addEventListener('mousedown', rectStart);
  canvas.addEventListener('mouseup', rectEnd);
  canvas.addEventListener('mousemove', rectDraw);
});

let rectdiv, rectposY, rectposX;
let makerectShape = false;

function rectStart(e) {
  makerectShape = true;
  rectdiv = document.createElement('div');
  rectdiv.classList.add('rect-shape');
  rectdiv.style.top = `${e.clientY}px`;
  rectdiv.style.left = `${e.clientX}px`;
  rectposY = e.clientY;
  rectposX = e.clientX;
  document.body.append(rectdiv);
}

function rectDraw(e) {
  if (!makerectShape) return;
  let xcoordinate = Math.abs(rectposX - e.clientX);
  let ycoordinate = Math.abs(rectposY - e.clientY);
  rectdiv.style.background = `${pen.color}`;
  rectdiv.style.height = `${ycoordinate}px`;
  rectdiv.style.width = `${xcoordinate}px`;
}

function rectEnd() {
  removelisteners(rectStart, rectEnd, rectDraw);
  makeShape = false;
  ctx.beginPath();
  const cc = document.getElementsByClassName('rect-shape')[0];
  console.log(cc);
  let left = window.getComputedStyle(cc).left.slice(0, -2);
  let top = window.getComputedStyle(cc).top.slice(0, -2);
  let width = window.getComputedStyle(cc).width.slice(0, -2);
  let height = window.getComputedStyle(cc).height.slice(0, -2);
  ctx.fillStyle = pen.color;
  ctx.fillRect(left, top, width, height);
  document.body.removeChild(cc);
  undoTracker.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  index += 1;
}

function switchToPenTool() {
  isEraser = false;
  activeToolEl.textContent = 'Brush';
}

// Download Image
downloadBtn.addEventListener('click', () => {
  downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
  downloadBtn.download = 'whiteboard-snap.jpeg';
  // Active Tool
  activeToolEl.textContent = 'Image Saved';
  setTimeout(switchToPenTool, 1500);
});

//background feature
const bgBtn = document.querySelector('.backgroundBtn');
const bgList = document.querySelector('.backgroundList');
const dots = document.querySelector('#dots');
const grid = document.querySelector('#grid');
const plain = document.querySelector('#plain');

//background color feature
const bgColor1 = document.querySelector('#bgColor-red');
const bgColor2 = document.querySelector('#bgColor-blue');
const bgColor3 = document.querySelector('#bgColor-yellow');

bgColor1.addEventListener('click', () => {
  canvas.style.backgroundColor = '#38CC77';
});

bgColor2.addEventListener('click', () => {
  canvas.style.backgroundColor = '#000000';
});
bgColor3.addEventListener('click', () => {
  canvas.style.backgroundColor = '#ffffff';
});

const clear = document.querySelector('#clear');

clear.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
