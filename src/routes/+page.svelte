<script lang="ts">
	import { onMount } from 'svelte';

	let particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
	let canvas: HTMLCanvasElement;

	onMount(() => {
		// Generate static particles for initial render
		particles = Array.from({ length: 50 }, () => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 2 + 0.5,
			speed: Math.random() * 0.5 + 0.1,
			opacity: Math.random() * 0.5 + 0.2
		}));

		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const resize = () => {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			};
			resize();
			window.addEventListener('resize', resize);

			let animationId: number;
			const animate = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				particles.forEach((p) => {
					p.y -= p.speed;
					if (p.y < -5) p.y = 105;

					const px = (p.x / 100) * canvas.width;
					const py = (p.y / 100) * canvas.height;

					ctx.beginPath();
					ctx.arc(px, py, p.size, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(0, 255, 65, ${p.opacity})`;
					ctx.fill();
				});

				animationId = requestAnimationFrame(animate);
			};
			animate();

			return () => {
				window.removeEventListener('resize', resize);
				cancelAnimationFrame(animationId);
			};
		}
	});
</script>

<svelte:head>
	<title>AMADEO STORE — Coming Soon</title>
	<meta name="description" content="Something powerful is coming. AMADEO STORE - Premium tech products." />
</svelte:head>

<div class="relative min-h-screen w-full overflow-hidden bg-white">
	<!-- Animated gradient background -->
	<div class="absolute inset-0 bg-linear-to-br from-white via-white to-[#f0f5f0]"></div>

	<!-- Grid pattern overlay -->
	<div
		class="absolute inset-0 opacity-10"
		style="background-image: linear-gradient(rgba(0,180,50,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,50,0.15) 1px, transparent 1px); background-size: 60px 60px;"
	></div>

	<!-- Floating particles canvas -->
	<canvas bind:this={canvas} class="absolute inset-0 pointer-events-none"></canvas>

	<!-- Glow orbs -->
	<div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00cc33] rounded-full blur-[150px] opacity-15 animate-pulse"></div>
	<div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00cc33] rounded-full blur-[120px] opacity-10 animate-pulse delay-1000"></div>

	<!-- Main content -->
	<div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
		<!-- Logo with glow effect -->
		<div class="relative mb-12 group">
			<div
				class="absolute inset-0 bg-[#00ff41] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"
			></div>
			<img
				src="/logo.png"
				alt="AMADEO STORE"
				class="relative w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_20px_rgba(0,180,50,0.3)] animate-glow-pulse-light"
			/>
		</div>

		<!-- Main title -->
		<h1
			class="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.3em] text-gray-900 mb-6 text-center"
			style="font-family: 'Inter', system-ui, sans-serif;"
		>
			<span class="text-[#00ff41] font-extralight">AMADEO</span> STORE
		</h1>

		<!-- Divider line -->
		<div class="w-24 h-px bg-linear-to-r from-transparent via-[#00ff41] to-transparent mb-8"></div>

		<!-- Tagline -->
		<p
			class="text-lg md:text-xl lg:text-2xl font-light tracking-[0.15em] text-gray-600 mb-4 text-center"
			style="font-family: 'Inter', system-ui, sans-serif;"
		>
			Something powerful is coming
		</p>

		<!-- Spanish tagline -->
		<p
			class="text-sm md:text-base font-light tracking-widest text-gray-500 text-center"
			style="font-family: 'Inter', system-ui, sans-serif;"
		>
			Estamos preparando algo increíble
		</p>

		<!-- Decorative elements -->
		<div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3">
			<div class="w-px h-12 bg-linear-to-b from-[#00cc33] to-transparent opacity-60"></div>
			<div class="w-2 h-2 bg-[#00cc33] rounded-full animate-bounce"></div>
		</div>
	</div>

	<!-- Corner accents -->
	<div class="absolute top-8 left-8 w-16 h-16 border-l border-t border-[#00cc33] opacity-30"></div>
	<div class="absolute top-8 right-8 w-16 h-16 border-r border-t border-[#00cc33] opacity-30"></div>
	<div class="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-[#00cc33] opacity-30"></div>
	<div class="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[#00cc33] opacity-30"></div>
</div>

<style>
	@keyframes glow-pulse-light {
		0%, 100% {
			filter: drop-shadow(0 0 15px rgba(0, 180, 50, 0.3));
		}
		50% {
			filter: drop-shadow(0 0 30px rgba(0, 180, 50, 0.5));
		}
	}

	:global(.animate-glow-pulse-light) {
		animation: glow-pulse-light 4s ease-in-out infinite;
	}

	:global(.delay-1000) {
		animation-delay: 1s;
	}
</style>
