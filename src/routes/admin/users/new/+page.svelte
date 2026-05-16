<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	let isSubmitting = $state(false);
	let showPassword = $state(false);

	// Form validation
	let errors = $state({
		name: '',
		email: '',
		password: '',
		phone: ''
	});

	function validateForm(formData: FormData) {
		const newErrors = { name: '', email: '', password: '', phone: '' };
		let isValid = true;

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const phone = formData.get('phone') as string;

		// Name validation
		if (!name || name.trim().length < 2) {
			newErrors.name = 'El nombre debe tener al menos 2 caracteres';
			isValid = false;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email)) {
			newErrors.email = 'El email no es válido';
			isValid = false;
		}

		// Password validation
		if (!password || password.length < 6) {
			newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
			isValid = false;
		}

		// Phone validation (optional)
		if (phone && phone.trim().length > 0) {
			const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
			if (!phoneRegex.test(phone)) {
				newErrors.phone = 'El teléfono no es válido';
				isValid = false;
			}
		}

		errors = newErrors;
		return isValid;
	}

	function handleSubmit() {
		isSubmitting = true;
	}
</script>

<div class="px-4 py-6 sm:px-0">
	<div class="mb-8">
		<nav class="flex" aria-label="Breadcrumb">
			<ol class="flex items-center space-x-4">
				<li>
					<a href="/admin/users" class="text-gray-400 hover:text-gray-500"> ← Volver a Usuarios </a>
				</li>
			</ol>
		</nav>
		<h1 class="mt-4 text-2xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
		<p class="mt-2 text-gray-600">Completa los datos para crear un nuevo usuario en el sistema.</p>
	</div>

	<div class="max-w-2xl">
		<!-- Success/Error Messages -->
		{#if form?.success}
			<div class="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
				<div class="flex">
					<div class="shrink-0">
						<svg
							class="h-5 w-5 text-green-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-green-800">{form.message}</p>
					</div>
				</div>
			</div>
		{:else if form?.message}
			<div class="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
				<div class="flex">
					<div class="shrink-0">
						<svg
							class="h-5 w-5 text-red-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-red-800">{form.message}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Form -->
		<form
			method="POST"
			action="?/create"
			use:enhance={({ formData, cancel }) => {
				if (!validateForm(formData)) {
					cancel();
				}
				return async ({ result }) => {
					isSubmitting = false;
					if (result.type === 'success' && result.data?.success) {
						// Redirect to users list after successful creation
						goto('/admin/users');
					}
				};
			}}
			on:submit={handleSubmit}
			class="space-y-6"
		>
			<!-- Basic Information -->
			<div class="bg-white shadow sm:rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<h3 class="mb-4 text-lg leading-6 font-medium text-gray-900">Información Básica</h3>

					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div class="sm:col-span-2">
							<label for="name" class="block text-sm font-medium text-gray-700">
								Nombre Completo *
							</label>
							<input
								type="text"
								id="name"
								name="name"
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
								placeholder="Juan Pérez"
							/>
							{#if errors.name}
								<p class="mt-2 text-sm text-red-600">{errors.name}</p>
							{/if}
						</div>

						<div class="sm:col-span-2">
							<label for="email" class="block text-sm font-medium text-gray-700"> Email * </label>
							<input
								type="email"
								id="email"
								name="email"
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
								placeholder="juan@ejemplo.com"
							/>
							{#if errors.email}
								<p class="mt-2 text-sm text-red-600">{errors.email}</p>
							{/if}
						</div>

						<div>
							<label for="phone" class="block text-sm font-medium text-gray-700"> Teléfono </label>
							<input
								type="tel"
								id="phone"
								name="phone"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
								placeholder="+54 11 1234 5678"
							/>
							{#if errors.phone}
								<p class="mt-2 text-sm text-red-600">{errors.phone}</p>
							{/if}
						</div>

						<div>
							<label for="password" class="block text-sm font-medium text-gray-700">
								Contraseña *
							</label>
							<div class="relative mt-1">
								<input
									type={showPassword ? 'text' : 'password'}
									id="password"
									name="password"
									required
									minlength="6"
									class="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
									placeholder="Mínimo 6 caracteres"
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 flex items-center pr-3"
									on:click={() => (showPassword = !showPassword)}
								>
									<svg
										class="h-5 w-5 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										{#if showPassword}
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										{:else}
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
											/>
										{/if}
									</svg>
								</button>
							</div>
							{#if errors.password}
								<p class="mt-2 text-sm text-red-600">{errors.password}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Role and Status -->
			<div class="bg-white shadow sm:rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<h3 class="mb-4 text-lg leading-6 font-medium text-gray-900">Rol y Estado</h3>

					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div>
							<label for="role" class="block text-sm font-medium text-gray-700">
								Rol del Usuario
							</label>
							<select
								id="role"
								name="role"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
							>
								<option value="CUSTOMER">Cliente</option>
								<option value="ADMIN">Administrador</option>
							</select>
							<p class="mt-2 text-sm text-gray-500">
								CLIENTE: Puede comprar y ver sus pedidos<br />
								ADMINISTRADOR: Acceso completo al panel de administración
							</p>
						</div>

						<div>
							<label for="status" class="block text-sm font-medium text-gray-700">
								Estado del Usuario
							</label>
							<select
								id="status"
								name="status"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
							>
								<option value="ACTIVE">Activo</option>
								<option value="INACTIVE">Inactivo</option>
								<option value="BLOCKED">Bloqueado</option>
							</select>
							<p class="mt-2 text-sm text-gray-500">
								ACTIVO: Puede iniciar sesión<br />
								INACTIVE: No puede iniciar sesión<br />
								BLOQUEADO: Cuenta bloqueada permanentemente
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Form Actions -->
			<div class="flex justify-end space-x-3">
				<a
					href="/admin/users"
					class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				>
					Cancelar
				</a>
				<button
					type="submit"
					disabled={isSubmitting}
					class="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isSubmitting}
						<svg
							class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Creando...
					{:else}
						Crear Usuario
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
