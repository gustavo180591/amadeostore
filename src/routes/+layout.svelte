<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navbar />

<main class="min-h-screen bg-gray-50">
	{@render children()}
</main>
