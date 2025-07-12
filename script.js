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
  ctx.fillStyle = bgColor.value || "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = textColor.value || "#000000";
  const text = textInput.value || "BRAT";
  // Calculate auto font size
  const autoFontSize = getAutoFontSize(
    text,
    fontFamily.value,
    canvas.width,
    parseInt(fontSize.value)
  );
  const font = `bold ${autoFontSize}px ${fontFamily.value}`;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let fillStyle = ctx.fillStyle;
  if (gradientEffect && gradientEffect.checked) {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, "#ff0080");
    grad.addColorStop(1, "#7928ca");
    fillStyle = grad;
  }
  ctx.fillStyle = fillStyle;
  if (scribbleEffect && scribbleEffect.checked) {
    drawScribbleText(
      text,
      canvas.width / 2,
      canvas.height / 2,
      font,
      ctx.fillStyle,
      scribbleTimes ? parseInt(scribbleTimes.value) : 7,
      scribbleOffset ? parseInt(scribbleOffset.value) : 4
    );
  } else {
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
}

function getAutoFontSize(text, fontFamily, maxWidth, maxFontSize, minFontSize = 10, padding = 40) {
  let fontSize = maxFontSize;
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  while (ctx.measureText(text).width > (maxWidth - padding) && fontSize > minFontSize) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
  }
  return fontSize;
}

[
  textInput,
  bgColor,
  textColor,
  fontSize,
  fontFamily,
  scribbleEffect,
  scribbleTimes,
  scribbleOffset
].forEach(el => el && el.addEventListener('input', drawBrat));

if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'brat.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

drawBrat();