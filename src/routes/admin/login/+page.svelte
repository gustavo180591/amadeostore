<script lang="ts">
	let showPassword = $state(false);
</script>

<div class="min-h-screen bg-gray-50">
	<main
		class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
	>
		<div class="w-full max-w-md space-y-8">
			<div class="text-center">
				<div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
					<img
						src="/logo.png"
						alt="AMADEO STORE"
						class="h-18.75 w-18.75 object-contain"
					/>
				</div>
				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
				<p class="mt-2 text-center text-sm text-gray-600">Panel de Administración - AMADEO STORE</p>
			</div>
			<form method="POST" class="mt-8 space-y-6">
				<div class="-space-y-px rounded-md shadow-sm">
					<div>
						<label for="email" class="sr-only">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Email administrativo"
						/>
					</div>
					<div class="relative">
						<label for="password" class="sr-only">Contraseña</label>
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							autocomplete="current-password"
							required
							class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Contraseña"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
							onclick={() => showPassword = !showPassword}
							aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
						>
							{#if showPassword}
								<!-- Eye icon (visible) -->
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							{:else}
								<!-- Eye slash icon (hidden) -->
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
								</svg>
							{/if}
						</button>
					</div>
				</div>
				<!-- Error messages from the server can be added here if needed -->
				<div>
					<button
						type="submit"
						class="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						Iniciar Sesión
					</button>
				</div>
			</form>
			<div class="mt-6 text-center">
				<p class="text-xs text-gray-500"></p>
			</div>
			<div class="mt-6 text-center">
				<a href="/" class="text-sm font-medium text-green-600 hover:text-green-500" rel="external"
					>← Volver a la tienda</a
				>
			</div>
		</div>
	</main>
</div>
