const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let points = [];

canvas.addEventListener('mousedown', e => {
    // clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawing = true;
    points = [];
});

canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    points.push({ x, y });
    ctx.lineTo(x, y);
    ctx.stroke();

    if (points.length > 100) {
        checkCircle();
    }
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath(); // reset path for next draw
    alert('Points recorded. Count: ' + points.length);
});

function checkCircle() {
    // Find centroid
    const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    // Compute average radius
    const radii = points.map(p => Math.hypot(p.x - cx, p.y - cy));
    const avgRadius = radii.reduce((a, b) => a + b, 0) / radii.length;

    // Measure deviation
    const deviation = Math.sqrt(radii.reduce((sum, r) => sum + (r - avgRadius) ** 2, 0) / radii.length);

    // Score out of 100
    const score = Math.max(0, 100 - deviation);
    document.getElementById('score').textContent = `Score: ${score.toFixed(2)} / 100`;
}
