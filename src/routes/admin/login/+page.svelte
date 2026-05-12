<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);

	const error = $derived($page.form?.error);

	// Auto-focus email field on mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			const emailInput = document.getElementById('email') as HTMLInputElement;
			if (emailInput) emailInput.focus();
		}
	});
</script>

<svelte:head>
	<title>Login - Admin | AMADEO STORE</title>
	<meta name="description" content="Panel de administración de AMADEO STORE" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<!-- Header -->
		<div>
			<div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
				<svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
				</svg>
			</div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Iniciar Sesión
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Panel de Administración - AMADEO STORE
			</p>
		</div>

		<!-- Login Form -->
		<form 
			method="POST" 
			use:enhance={() => {
				isLoading = true;
				return async () => {
					isLoading = false;
					// No need for goto() - server handles redirect with throw redirect()
				};
			}}
			class="mt-8 space-y-6"
		>
			<div class="rounded-md shadow-sm -space-y-px">
				<!-- Email Field -->
				<div>
					<label for="email" class="sr-only">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
						placeholder="Email administrativo"
						bind:value={email}
					/>
				</div>
				<!-- Password Field -->
				<div>
					<label for="password" class="sr-only">Contraseña</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
						placeholder="Contraseña"
						bind:value={password}
					/>
				</div>
			</div>

			<!-- Error Message -->
			{#if error}
				<div class="rounded-md bg-red-50 p-4">
					<div class="flex">
						<div class="shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm font-medium text-red-800">{error}</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Submit Button -->
			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{#if isLoading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Iniciando sesión...
					{:else}
						Iniciar Sesión
					{/if}
				</button>
			</div>
		</form>

		<!-- Demo Credentials Info -->
		<div class="mt-6 text-center">
			<p class="text-xs text-gray-500">
				Para desarrollo: admin@amadeostore.com / admin123
			</p>
		</div>

		<!-- Back to Store -->
		<div class="mt-6 text-center">
			<a
			href="/"
			class="font-medium text-green-600 hover:text-green-500 text-sm"
			rel="external"
		>
			← Volver a la tienda
		</a>
		</div>
	</div>
</div>

<style>
	/* Custom animations */
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
