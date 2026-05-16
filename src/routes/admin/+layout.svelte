<script lang="ts">
	import AdminSidebar from '$lib/components/AdminSidebar.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	let sidebarWidth = 256; // 16rem in pixels

	onMount(() => {
		// Add custom styles for admin layout
		const style = document.createElement('style');
		style.textContent = `
			.admin-layout {
				padding-left: 256px;
				transition: padding-left 0.3s ease;
			}
			@media (max-width: 768px) {
				.admin-layout {
					padding-left: 0;
				}
			}
		`;
		document.head.appendChild(style);
		
		return () => {
			document.head.removeChild(style);
		};
	});
</script>

<AdminSidebar />

<div class="admin-layout min-h-screen bg-gray-100">
	<div class="p-6">
		{@render children()}
	</div>
</div>
