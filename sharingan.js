(function() {
    if (window.__animeEyesActive) return;
    window.__animeEyesActive = true;

    const c = document.createElement('canvas');
    c.id = 'ultraSharinganCanvas';
    c.style.position = 'fixed';
    c.style.top = '0';
    c.style.left = '0';
    c.style.width = '100vw';
    c.style.height = '100vh';
    c.style.zIndex = '9999999';
    c.style.background = '#020104';
    c.style.cursor = 'pointer';
    document.body.appendChild(c);

    const ctx = c.getContext('2d');
    let w, h, angle = 0;

    function resize() {
        w = c.width = window.innerWidth;
        h = c.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Draw Eye Socket Structure
    function drawEyeShape(centerX, centerY, eyeWidth, eyeHeight, isLeft) {
        ctx.save();
        ctx.translate(centerX, centerY);
        if (!isLeft) ctx.scale(-1, 1); // Mirror right eye outline

        ctx.beginPath();
        ctx.moveTo(-eyeWidth * 0.5, 0);
        // Upper Lid Curve
        ctx.bezierCurveTo(-eyeWidth * 0.2, -eyeHeight * 0.85, eyeWidth * 0.3, -eyeHeight * 0.7, eyeWidth * 0.5, 0);
        // Lower Lid Curve
        ctx.bezierCurveTo(eyeWidth * 0.2, eyeHeight * 0.5, -eyeWidth * 0.3, eyeHeight * 0.4, -eyeWidth * 0.5, 0);
        ctx.closePath();

        // Eye White (Sclera)
        ctx.fillStyle = '#eaeaea';
        ctx.fill();

        // Inner Shadow on Sclera for Depth
        const grad = ctx.createRadialGradient(0, 0, eyeWidth * 0.2, 0, 0, eyeWidth * 0.5);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.8, 'rgba(15,5,10,0.4)');
        grad.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.restore();
    }

    // Itachi Mangekyou Pattern
    function drawItachiPattern(r) {
        ctx.fillStyle = '#080808';
        for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.rotate((i * 2 * Math.PI) / 3);
            ctx.beginPath();
            ctx.arc(r * 0.32, 0, r * 0.38, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.48, 0, Math.PI * 2);
        ctx.fillStyle = '#d80c14';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = '#050505';
        ctx.fill();
    }

    // Kakashi/Obito Mangekyou Pattern
    function drawKamuiPattern(r) {
        ctx.fillStyle = '#080808';
        for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.rotate((i * 2 * Math.PI) / 3);
            ctx.beginPath();
            ctx.moveTo(r * 0.15, 0);
            ctx.quadraticCurveTo(r * 0.5, -r * 0.2, r * 0.95, 0);
            ctx.quadraticCurveTo(r * 0.4, r * 0.3, 0, 0);
            ctx.fill();
                
            ctx.beginPath();
            ctx.arc(r * 0.5, 0, r * 0.22, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#050505';
        ctx.fill();
    }

    function drawEyeLashes(centerX, centerY, eyeWidth, eyeHeight, isLeft) {
        ctx.save();
        ctx.translate(centerX, centerY);
        if (!isLeft) ctx.scale(-1, 1);

        // Upper Eyeline (Thick Anime Style)
        ctx.beginPath();
        ctx.moveTo(-eyeWidth * 0.52, eyeHeight * 0.05);
        ctx.bezierCurveTo(-eyeWidth * 0.2, -eyeHeight * 0.92, eyeWidth * 0.3, -eyeHeight * 0.75, eyeWidth * 0.53, -eyeHeight * 0.05);
        ctx.lineWidth = eyeHeight * 0.12;
        ctx.strokeStyle = '#08060a';
        ctx.stroke();

        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        const eyeDistance = Math.min(w * 0.28, 220);
        const eyeWidth = Math.min(w * 0.32, 240);
        const eyeHeight = eyeWidth * 0.48;
        const irisRadius = eyeHeight * 0.46;

        const leftEyeX = w / 2 - eyeDistance;
        const rightEyeX = w / 2 + eyeDistance;
        const eyeY = h / 2;

        // Background Atmosphere Glow
        const bgGlow = ctx.createRadialGradient(w/2, eyeY, eyeDistance*0.5, w/2, eyeY, eyeDistance*2.5);
        bgGlow.addColorStop(0, 'rgba(180, 10, 15, 0.15)');
        bgGlow.addColorStop(1, 'rgba(2, 1, 4, 1)');
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0,0,w,h);

        // 1. Draw Left Eye Base & Iris
        drawEyeShape(leftEyeX, eyeY, eyeWidth, eyeHeight, true);
        
        // Left Iris Clip & Draw
        ctx.save();
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, irisRadius, 0, Math.PI*2);
        ctx.fillStyle = '#d80c14';
        ctx.fill();
        ctx.lineWidth = irisRadius * 0.08;
        ctx.strokeStyle = '#0a0a0a';
        ctx.stroke();

        ctx.translate(leftEyeX, eyeY);
        ctx.rotate(angle);
        drawItachiPattern(irisRadius);
        ctx.restore();

        drawEyeLashes(leftEyeX, eyeY, eyeWidth, eyeHeight, true);

        // 2. Draw Right Eye Base & Iris
        drawEyeShape(rightEyeX, eyeY, eyeWidth, eyeHeight, false);

        // Right Iris Clip & Draw
        ctx.save();
        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY, irisRadius, 0, Math.PI*2);
        ctx.fillStyle = '#d80c14';
        ctx.fill();
        ctx.lineWidth = irisRadius * 0.08;
        ctx.strokeStyle = '#0a0a0a';
        ctx.stroke();

        ctx.translate(rightEyeX, eyeY);
        ctx.rotate(-angle); // Reverse rotation for opposite eye effect
        drawKamuiPattern(irisRadius);
        ctx.restore();

        drawEyeLashes(rightEyeX, eyeY, eyeWidth, eyeHeight, false);

        angle += 0.007; // Slow smooth rotation speed
        requestAnimationFrame(animate);
    }

    animate();

    c.onclick = () => {
        c.remove();
        window.__animeEyesActive = false;
    };
})();
