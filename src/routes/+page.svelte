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
	<meta
		name="description"
		content="Something powerful is coming. AMADEO STORE - Premium tech products."
	/>
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
	<canvas bind:this={canvas} class="pointer-events-none absolute inset-0"></canvas>

	<!-- Glow orbs -->
	<div
		class="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-[#00cc33] opacity-15 blur-[150px]"
	></div>
	<div
		class="absolute right-1/4 bottom-1/4 h-64 w-64 animate-pulse rounded-full bg-[#00cc33] opacity-10 blur-[120px] delay-1000"
	></div>

	<!-- Main content -->
	<div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
		<!-- Logo with glow effect -->
		<div class="group relative mb-12">
			<div
				class="absolute inset-0 rounded-full bg-[#00ff41] opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
			></div>
			<img
				src="/logo.png"
				alt="AMADEO STORE"
				class="animate-glow-pulse-light relative h-48 w-48 object-contain drop-shadow-[0_0_20px_rgba(0,180,50,0.3)] md:h-64 md:w-64"
			/>
		</div>

		<!-- Main title -->
		<h1
			class="mb-6 text-center text-4xl font-light tracking-[0.3em] text-gray-900 md:text-6xl lg:text-7xl"
			style="font-family: 'Inter', system-ui, sans-serif;"
		>
			<span class="font-extralight text-[#00ff41]">AMADEO</span> STORE
		</h1>

		<!-- Divider line -->
		<div class="mb-8 h-px w-24 bg-linear-to-r from-transparent via-[#00ff41] to-transparent"></div>

		<!-- Tagline -->
		<p
			class="mb-4 text-center text-lg font-light tracking-[0.15em] text-gray-600 md:text-xl lg:text-2xl"
			style="font-family: 'Inter', system-ui, sans-serif;"
		>
			Something powerful is coming
		</p>

		<!-- Spanish tagline -->
		<p
			class="text-center text-sm font-light tracking-widest text-gray-500 md:text-base"
			style="font-family: 'Inter', system-ui, sans-serif;"
		>
			Estamos preparando algo increíble
		</p>

		<!-- Decorative elements -->
		<div
			class="absolute bottom-12 left-1/2 flex -translate-x-1/2 transform flex-col items-center gap-3"
		>
			<div class="h-12 w-px bg-linear-to-b from-[#00cc33] to-transparent opacity-60"></div>
			<div class="h-2 w-2 animate-bounce rounded-full bg-[#00cc33]"></div>
		</div>
	</div>

	<!-- Corner accents -->
	<div class="absolute top-8 left-8 h-16 w-16 border-t border-l border-[#00cc33] opacity-30"></div>
	<div class="absolute top-8 right-8 h-16 w-16 border-t border-r border-[#00cc33] opacity-30"></div>
	<div
		class="absolute bottom-8 left-8 h-16 w-16 border-b border-l border-[#00cc33] opacity-30"
	></div>
	<div
		class="absolute right-8 bottom-8 h-16 w-16 border-r border-b border-[#00cc33] opacity-30"
	></div>
</div>

<style>
	@keyframes glow-pulse-light {
		0%,
		100% {
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
