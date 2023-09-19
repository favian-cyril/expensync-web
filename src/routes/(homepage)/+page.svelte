<script lang="ts">
	import { onMount } from 'svelte'
    import chatgpt from '$lib/assets/icons8-chatgpt-192.svg';
    import email from '$lib/assets/envelope-regular.svg';
    import csv from '$lib/assets/file-csv-solid.svg';
    import pie from '$lib/assets/chart-pie-solid.svg';
    import database from '$lib/assets/database-solid.svg';
    import hero1 from '$lib/assets/hero-1.png';
    import hero2 from '$lib/assets/hero-2.png';

    onMount(() => {
        const ctx = canvas.getContext('2d');

        const iconSize = 75;
        const iconSpacing = 200;
        const numIcons = 3;
        const pipelineColor = '#000';
        const dotSize = 5;
        const dotSpacing = 10;
        const animationSpeed = 1.2;
        const iconThreshold = 300;
        const chatgptIcon = new Image();
        chatgptIcon.src = chatgpt;
        const emailIcon = new Image();
        emailIcon.src = email;
        const csvIcon = new Image();
        csvIcon.src = csv;
        const pieIcon = new Image();
        pieIcon.src = pie;
        const dbIcon = new Image();
        dbIcon.src = database;

        let dotPosition = 0;
        let iconTimer = 0
        
        function draw() {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = true;
            
            const generateIcon = (timer: number) => {
                if (timer < iconThreshold / 3) {
                    return csvIcon;
                } else if (timer < iconThreshold * 2 / 3) {
                    return pieIcon;
                } else {
                    return dbIcon;
                }
            }
            const icons = [
                { x: 50, y: canvas.height / 2 - iconSize / 2, src: emailIcon },
                { x: 50 + iconSpacing, y: canvas.height / 2 - iconSize / 2, src: chatgptIcon },
                { x: 50 + 2 * iconSpacing, y: canvas.height / 2 - iconSize / 2, src: generateIcon(iconTimer) }
            ];
            // Draw icons
            icons.forEach((icon) => {
                ctx.drawImage(icon.src, icon.x, icon.y, iconSize, iconSize);
            });
            
            // Draw pipeline
            ctx.strokeStyle = pipelineColor;
            ctx.lineWidth = dotSize;

            for (let i = 0; i < numIcons - 1; i++) {
                const startX = icons[i].x + iconSize;
                const endX = icons[i + 1].x + 5;
                const startY = icons[i].y + iconSize / 2;
                const endY = icons[i + 1].y + iconSize / 2;

                ctx.beginPath();
                ctx.setLineDash([dotSize, dotSpacing]);
                ctx.moveTo(startX + dotPosition, startY);
                ctx.lineTo(endX - dotPosition, endY);
                ctx.stroke();
            }

            // Update dot position
            dotPosition += animationSpeed;
            iconTimer += animationSpeed;

            if (iconTimer > iconThreshold) {
                iconTimer = 0;
            }
            if (dotPosition > dotSpacing) {
                dotPosition = -5;
            }

            requestAnimationFrame(draw);
        }

        draw(); // Start the animation loop
	})
    let canvas: HTMLCanvasElement;

</script>


<div class="hero min-h-[75vh] bg-base-200">
    <div class="hero-content lg:flex-row flex-col-reverse">
      <div class="max-w-3xl">
        <h1 class="text-5xl font-bold">Automate Your Inbox.</h1>
        <p class="py-6">Effortlessly extract receipts, invoices, and more. Save time, whether it's for personal or business use. Works with any email client, with any template.</p>
        <a class="btn btn-primary" href="/login?auth-type=signup">Get Started</a>
      </div>
      <div>
        <canvas bind:this={canvas} width="600" height="200"></canvas>
      </div>
    </div>
</div>
<div class="h-40 bg-base-100"></div>
<div class="hero min-h-[75vh] bg-base-200">
    <div class="hero-content lg:flex-row flex-col-reverse">
        <div class="max-w-3xl">
            <img src={hero1} alt="analytics" class="rounded-md shadow-md" />
        </div>
        <div class="max-w-3xl">
          <h1 class="text-5xl font-bold">Analyze your spending.</h1>
          <p class="py-6">Real-time data analytics makes it easy to track your spending.</p>
        </div>
      </div>
</div>
<div class="hero min-h-[75vh] bg-base-200">
    <div class="hero-content lg:flex-row flex-col-reverse">
        <div class="max-w-3xl">
            <h1 class="text-5xl font-bold">Track your data.</h1>
            <p class="py-6">Intuitive and familiar UI to manage your own data.</p>
        </div>
        <div class="max-w-3xl">
            <img src={hero2} alt="analytics" class="shadow-md" />
        </div>
    </div>
</div>
<div class="bg-base-100 flex justify-center p-10">
    <div class="max-w-xl w-full">
        <a class="btn btn-primary w-full" href="/login?auth-type=signup">Get Started</a>
    </div>
</div>
