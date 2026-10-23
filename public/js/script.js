const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Function to resize the canvas to full window dimensions
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Reset the background to black on resize
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configure drawing properties
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// State variables
let drawing = false;
let currentColor = 'white';       // Default pencil color is white
let currentPencilSize = 2;        // Default pencil size
let currentEraserSize = 10;       // Default eraser size
let isErasing = false;
let lastX, lastY;

// UI elements
const colorPicker = document.getElementById('colorPicker');
const eraserBtn = document.getElementById('eraserBtn');
const pencilSizeSlider = document.getElementById('pencilSize');
const eraserSizeSlider = document.getElementById('eraserSize');

// Update drawing color from the picker
colorPicker.addEventListener('change', (e) => {
  currentColor = e.target.value;
  isErasing = false;                  // Disable eraser if a new color is picked
  eraserBtn.style.backgroundColor = ''; // Reset eraser button appearance
});

// Toggle eraser mode
eraserBtn.addEventListener('click', () => {
  isErasing = !isErasing;
  eraserBtn.style.backgroundColor = isErasing ? '#ddd' : '';
});

// Update pencil and eraser sizes from sliders
pencilSizeSlider.addEventListener('input', (e) => {
  currentPencilSize = parseInt(e.target.value, 10);
});
eraserSizeSlider.addEventListener('input', (e) => {
  currentEraserSize = parseInt(e.target.value, 10);
});

// Helper: get canvas-relative coordinates from mouse or touch event
function getCoords(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = e.clientX;
  const clientY = e.clientY;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

// Event Listeners for Mouse
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Event Listeners for Touch (Mobile/Tablet)
// { passive: false } is required so that e.preventDefault() actually works
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent tap highlight, long-press menu, and scroll
  startDrawing(e.touches[0]);
}, { passive: false });
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Prevent page scroll while drawing
  draw(e.touches[0]);
}, { passive: false });
canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  stopDrawing();
}, { passive: false });

function startDrawing(e) {
  drawing = true;
  const { x, y } = getCoords(e);
  lastX = x;
  lastY = y;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
}

function draw(e) {
  if (!drawing) return;
  const { x: currentX, y: currentY } = getCoords(e);
  ctx.lineTo(currentX, currentY);
  
  if (isErasing) {
    ctx.globalCompositeOperation = 'destination-out'; // Eraser mode
    ctx.lineWidth = currentEraserSize;
  } else {
    ctx.globalCompositeOperation = 'source-over';    // Standard drawing mode
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentPencilSize;
  }
  ctx.stroke();
  lastX = currentX;
  lastY = currentY;
}

function stopDrawing() {
  drawing = false;
  ctx.closePath();
}
