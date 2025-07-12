const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('textInput');
const bgColor = document.getElementById('bgColor');
const textColor = document.getElementById('textColor');
const fontSize = document.getElementById('fontSize');
const fontFamily = document.getElementById('fontFamily');
const scribbleEffect = document.getElementById('scribbleEffect');
const downloadBtn = document.getElementById('downloadBtn');
const scribbleTimes = document.getElementById('scribbleTimes');
const scribbleOffset = document.getElementById('scribbleOffset');
const gradientEffect = document.getElementById('gradientEffect');

function drawScribbleText(text, x, y, font, color, times = 5, offset = 2) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = 0.18; // Lower opacity for scribble layers
  for (let i = 0; i < times; i++) {
    const dx = (Math.random() - 0.5) * offset;
    const dy = (Math.random() - 0.5) * offset;
    ctx.fillText(text, x + dx, y + dy);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawBrat() {
  // 1. Setup Canvas and Styles
  ctx.fillStyle = bgColor.value || "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = textColor.value || "#000000";

  const text = textInput.value || "BRAT";
  const padding = 40;
  const maxWidth = canvas.width - padding;

  // 2. Set Font Size to a fixed value from the input, preventing it from shrinking
  const currentFontSize = parseInt(fontSize.value);
  const font = `bold ${currentFontSize}px ${fontFamily.value}`;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lineHeight = currentFontSize * 1.2;
  const words = text.split(' ');
  let line = '';
  const lines = [];

  // 3. Logic to wrap text into lines based on maxWidth
  words.forEach(word => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && line !== '') {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  });
  lines.push(line.trim());

  // 4. Calculate starting Y to center the text block vertically
  const totalTextHeight = lines.length * lineHeight;
  let startY = (canvas.height - totalTextHeight) / 2 + (lineHeight / 2);

  // 5. Set up fill style (for solid color or gradient)
  let fillStyle = ctx.fillStyle;
  if (gradientEffect && gradientEffect.checked) {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, "#ff0080");
    grad.addColorStop(1, "#7928ca");
    fillStyle = grad;
  }
  ctx.fillStyle = fillStyle;

  // 6. Draw each line
  lines.forEach((line, index) => {
    const y = startY + (index * lineHeight);
    if (scribbleEffect && scribbleEffect.checked) {
      drawScribbleText(
        line,
        canvas.width / 2,
        y,
        font,
        ctx.fillStyle,
        scribbleTimes ? parseInt(scribbleTimes.value) : 7,
        scribbleOffset ? parseInt(scribbleOffset.value) : 4
      );
    } else {
      ctx.fillText(line, canvas.width / 2, y);
    }
  });
}

// The getAutoFontSize function has been removed as it is no longer needed.


// --- Event Listeners ---
[
  textInput,
  bgColor,
  textColor,
  fontSize,
  fontFamily,
  scribbleEffect,
  scribbleTimes,
  scribbleOffset,
  gradientEffect
].forEach(el => el && el.addEventListener('input', drawBrat));

if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'brat.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

// Initial draw
drawBrat();