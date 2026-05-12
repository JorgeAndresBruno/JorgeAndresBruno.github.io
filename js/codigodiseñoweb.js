 // ── Reloj ──
        function actualizarReloj() {
            const ahora = new Date();
            const opcionesFecha = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
            const fechaTexto = ahora.toLocaleDateString('es-AR', opcionesFecha);
            document.getElementById('fecha').textContent =
                fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1);
            const hh = String(ahora.getHours()).padStart(2, '0');
            const mm = String(ahora.getMinutes()).padStart(2, '0');
            const ss = String(ahora.getSeconds()).padStart(2, '0');
            document.getElementById('hora').textContent = hh + ':' + mm + ':' + ss;
        }
        actualizarReloj();
        setInterval(actualizarReloj, 1000);

        // ── Red animada del header ──
        const canvas = document.getElementById('net-canvas');
        const ctx = canvas.getContext('2d');
        const header = document.querySelector('header');

        function resize() {
            canvas.width  = header.offsetWidth;
            canvas.height = header.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const NODE_COUNT = 18;
        const nodes   = [];
        const PACKETS  = [];
        const MAX_PACKETS = 8;
        const DIST = 160;
        let frame = 0;

        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x:  Math.random() * canvas.width,
                y:  Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                r:  3 + Math.random() * 3,
            });
        }

        function spawnPacket(a, b) {
            if (PACKETS.length >= MAX_PACKETS) return;
            PACKETS.push({ from: a, to: b, t: 0, speed: 0.012 + Math.random() * 0.01 });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const n of nodes) {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
            }

            frame++;
            if (frame % 60 === 0) {
                const a = nodes[Math.floor(Math.random() * nodes.length)];
                const b = nodes[Math.floor(Math.random() * nodes.length)];
                if (a !== b) spawnPacket(a, b);
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const d  = Math.sqrt(dx * dx + dy * dy);
                    if (d < DIST) {
                        const alpha = (1 - d / DIST) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            for (const n of nodes) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0,0,0,0.35)';
                ctx.fill();
            }

            for (let i = PACKETS.length - 1; i >= 0; i--) {
                const p = PACKETS[i];
                p.t += p.speed;
                if (p.t >= 1) { PACKETS.splice(i, 1); continue; }
                const x = p.from.x + (p.to.x - p.from.x) * p.t;
                const y = p.from.y + (p.to.y - p.from.y) * p.t;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#ca5b8f';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, 7, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(202,91,143,0.25)';
                ctx.fill();
            }

            requestAnimationFrame(draw);
        }
        draw();

        // ── Formulario ──
        function formularioEnviado() {
            setTimeout(function() {
                document.querySelector('.formulario form').style.display = 'none';
                document.getElementById('gracias').style.display = 'block';
            }, 800);
        }