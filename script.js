const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('textInput');
const bgColor = document.getElementById('bgColor');
const textColor = document.getElementById('textColor');
const fontSize = document.getElementById('fontSize');
const fontFamily = document.getElementById('fontFamily');
const textAlign = document.getElementById('textAlign');
const rotation = document.getElementById('rotation');

// Effect controls
const scribbleEffect = document.getElementById('scribbleEffect');
const gradientEffect = document.getElementById('gradientEffect');
const shadowEffect = document.getElementById('shadowEffect');
const outlineEffect = document.getElementById('outlineEffect');
const glitchEffect = document.getElementById('glitchEffect');
const neonEffect = document.getElementById('neonEffect');

// Effect parameters
const scribbleTimes = document.getElementById('scribbleTimes');
const shadowBlur = document.getElementById('shadowBlur');
const outlineWidth = document.getElementById('outlineWidth');

// Buttons
const downloadBtn = document.getElementById('downloadBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const themeToggle = document.getElementById('themeToggle');

// Value displays
const fontSizeValue = document.getElementById('fontSizeValue');
const rotationValue = document.getElementById('rotationValue');
const scribbleTimesValue = document.getElementById('scribbleTimesValue');
const shadowBlurValue = document.getElementById('shadowBlurValue');
const outlineWidthValue = document.getElementById('outlineWidthValue');

// Theme state
let isDarkTheme = false;

// Update value displays
function updateValueDisplays() {
    if (fontSizeValue) fontSizeValue.textContent = fontSize.value + 'px';
    if (rotationValue) rotationValue.textContent = rotation.value + '°';
    if (scribbleTimesValue) scribbleTimesValue.textContent = scribbleTimes.value;
    if (shadowBlurValue) shadowBlurValue.textContent = shadowBlur.value + 'px';
    if (outlineWidthValue) outlineWidthValue.textContent = outlineWidth.value + 'px';
}

// Show/hide effect controls
function toggleEffectControls() {
    document.getElementById('scribbleControls').style.display = 
        scribbleEffect.checked ? 'flex' : 'none';
    document.getElementById('shadowControls').style.display = 
        shadowEffect.checked ? 'flex' : 'none';
    document.getElementById('outlineControls').style.display = 
        outlineEffect.checked ? 'flex' : 'none';
}

// Enhanced scribble effect - IMPROVED VERSION
function drawScribbleText(text, x, y, font, color, times = 5, offset = 1.5) {
    ctx.save();
    ctx.font = font;
    ctx.textAlign = textAlign.value;
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.2;             // slightly more visible
    ctx.fillStyle = color;

    for (let i = 0; i < times; i++) {
        const angle = (Math.random() - 0.5) * 0.1;   // small angle variation
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        const dx = (Math.random() - 0.5) * offset * 2;
        const dy = (Math.random() - 0.5) * offset;
        ctx.fillText(text, dx, dy);
        ctx.restore();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
}

// Glitch effect
function drawGlitchText(text, x, y, font, color) {
    ctx.save();
    ctx.font = font;
    ctx.textAlign = textAlign.value;
    ctx.textBaseline = "middle";
    
    // Red channel
    ctx.fillStyle = '#ff0000';
    ctx.globalCompositeOperation = 'screen';
    ctx.fillText(text, x - 2, y);
    
    // Green channel
    ctx.fillStyle = '#00ff00';
    ctx.fillText(text, x + 1, y - 1);
    
    // Blue channel
    ctx.fillStyle = '#0000ff';
    ctx.fillText(text, x + 2, y + 1);
    
    // Main text
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    
    ctx.restore();
}

// Main drawing function
function drawBrat() {
    // Clear canvas
    ctx.fillStyle = bgColor.value || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const text = textInput.value || "BRAT";
    const padding = 40;
    const maxWidth = canvas.width - padding;
    const currentFontSize = parseInt(fontSize.value);
    const font = `bold ${currentFontSize}px ${fontFamily.value}`;
    
    ctx.save();
    
    // Apply rotation
    const rotationRad = (parseInt(rotation.value) * Math.PI) / 180;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotationRad);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    ctx.font = font;
    ctx.textAlign = textAlign.value;
    ctx.textBaseline = "middle";
    
    // Text wrapping
    const lineHeight = currentFontSize * 1.2;
    const words = text.split(' ');
    let line = '';
    const lines = [];
    
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
    
    const totalTextHeight = lines.length * lineHeight;
    let startY = (canvas.height - totalTextHeight) / 2 + (lineHeight / 2);
    
    // Determine text alignment position
    let alignX = canvas.width / 2;
    if (textAlign.value === 'left') alignX = padding / 2;
    if (textAlign.value === 'right') alignX = canvas.width - padding / 2;
    
    // Apply effects
    lines.forEach((line, index) => {
        const y = startY + (index * lineHeight);
        
        // Shadow effect
        if (shadowEffect.checked) {
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = parseInt(shadowBlur.value);
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
        }
        
        // Neon glow effect
        if (neonEffect.checked) {
            ctx.save();
            ctx.shadowColor = textColor.value;
            ctx.shadowBlur = 20;
            ctx.fillStyle = textColor.value;
            ctx.fillText(line, alignX, y);
            ctx.restore();
        }
        
        // Text outline
        if (outlineEffect.checked) {
            ctx.strokeStyle = isDarkTheme ? '#ffffff' : '#000000';
            ctx.lineWidth = parseInt(outlineWidth.value);
            ctx.strokeText(line, alignX, y);
        }
        
        // Set fill style
        let fillStyle = textColor.value;
        if (gradientEffect.checked) {
            const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
            grad.addColorStop(0, "#ff0080");
            grad.addColorStop(0.5, "#7928ca");
            grad.addColorStop(1, "#00ff80");
            fillStyle = grad;
        }
        ctx.fillStyle = fillStyle;
        
        // Draw text with effects
        if (glitchEffect.checked) {
            drawGlitchText(line, alignX, y, font, fillStyle);
        } else if (scribbleEffect.checked) {
            drawScribbleText(line, alignX, y, font, fillStyle, parseInt(scribbleTimes.value), 1.5);
            ctx.fillText(line, alignX, y);
        } else {
            ctx.fillText(line, alignX, y);
        }
        
        if (shadowEffect.checked) ctx.restore();
    });
    
    ctx.restore();
}

// Preset configurations
const presets = {
    classic: {
        bgColor: '#ffffff',
        textColor: '#000000',
        fontSize: 80,
        fontFamily: 'Arial',
        scribbleEffect: false,
        gradientEffect: false
    },
    neon: {
        bgColor: '#000000',
        textColor: '#00ff80',
        fontSize: 90,
        fontFamily: 'Impact',
        neonEffect: true,
        gradientEffect: true
    },
    minimal: {
        bgColor: '#f5f5f5',
        textColor: '#333333',
        fontSize: 60,
        fontFamily: 'Helvetica',
        outlineEffect: false
    },
    glitch: {
        bgColor: '#000000',
        textColor: '#ffffff',
        fontSize: 100,
        fontFamily: 'Courier New',
        glitchEffect: true
    }
};

// Apply preset
function applyPreset(presetName) {
    const preset = presets[presetName];
    if (!preset) return;
    
    // Reset all effects
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Apply preset values
    Object.keys(preset).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = preset[key];
            } else {
                element.value = preset[key];
            }
        }
    });
    
    toggleEffectControls();
    updateValueDisplays();
    drawBrat();
}

// Randomize function
function randomize() {
    const colors = ['#ff0080', '#7928ca', '#00ff80', '#ff4500', '#1e90ff', '#ffd700'];
    const fonts = ['Arial', 'Impact', 'Helvetica', 'Georgia', 'Courier New'];
    
    bgColor.value = colors[Math.floor(Math.random() * colors.length)];
    textColor.value = colors[Math.floor(Math.random() * colors.length)];
    fontSize.value = Math.floor(Math.random() * 100) + 50;
    fontFamily.value = fonts[Math.floor(Math.random() * fonts.length)];
    rotation.value = Math.floor(Math.random() * 31) - 15;
    
    // Random effects
    scribbleEffect.checked = Math.random() > 0.5;
    gradientEffect.checked = Math.random() > 0.7;
    shadowEffect.checked = Math.random() > 0.6;
    
    toggleEffectControls();
    updateValueDisplays();
    drawBrat();
}

// Reset function
function reset() {
    applyPreset('classic');
    textInput.value = 'BRAT';
    rotation.value = 0;
    textAlign.value = 'center';
}

// Theme toggle
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme');
    themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
}

// Copy to clipboard
async function copyToClipboard() {
    try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        
        // Visual feedback
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

// Event Listeners
[textInput, bgColor, textColor, fontSize, fontFamily, textAlign, rotation,
 scribbleEffect, gradientEffect, shadowEffect, outlineEffect, glitchEffect, neonEffect,
 scribbleTimes, shadowBlur, outlineWidth].forEach(el => {
    if (el) el.addEventListener('input', () => {
        updateValueDisplays();
        drawBrat();
    });
});

// Effect control toggles
[scribbleEffect, shadowEffect, outlineEffect].forEach(el => {
    if (el) el.addEventListener('change', toggleEffectControls);
});

// Button events
if (downloadBtn) downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'brat-generator.png';
    link.href = canvas.toDataURL();
    link.click();
});

if (randomizeBtn) randomizeBtn.addEventListener('click', randomize);
if (resetBtn) resetBtn.addEventListener('click', reset);
if (copyBtn) copyBtn.addEventListener('click', copyToClipboard);
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

// Preset buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        applyPreset(btn.dataset.preset);
    });
});

// Initialize
updateValueDisplays();
toggleEffectControls();
drawBrat();
