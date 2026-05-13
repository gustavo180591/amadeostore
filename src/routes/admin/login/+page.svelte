<script lang="ts"></script>

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
						class="h-[4.6875rem] w-[4.6875rem] object-contain"
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
					<div>
						<label for="password" class="sr-only">Contraseña</label>
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							placeholder="Contraseña"
						/>
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
