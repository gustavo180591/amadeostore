<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let isLoading = $state(false);
	let activeTab = $state('store');
	let showPasswordForm = $state(false);
	let showDeleteConfirm = $state(false);

	const error = $derived($page.form?.error);
	const success = $derived($page.form?.success);
	const data = $derived($page.data);
	const settings = $derived(data?.settings);
	const adminUser = $derived(data?.adminUser);

	// Form states
	let storeName = $state(settings?.storeName || '');
	let storeEmail = $state(settings?.storeEmail || '');
	let storePhone = $state(settings?.storePhone || '');
	let storeAddress = $state(settings?.storeAddress || '');
	let storeDescription = $state(settings?.storeDescription || '');
	let logoUrl = $state(settings?.logoUrl || '');
	let faviconUrl = $state(settings?.faviconUrl || '');

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	// Auto-focus first field on mount
	$effect(() => {
		if (typeof window !== 'undefined') {
			const firstInput = document.getElementById('storeName') as HTMLInputElement;
			if (firstInput) firstInput.focus();
		}
	});

	// Update form values when settings load
	$effect(() => {
		if (settings) {
			storeName = settings.storeName || '';
			storeEmail = settings.storeEmail || '';
			storePhone = settings.storePhone || '';
			storeAddress = settings.storeAddress || '';
			storeDescription = settings.storeDescription || '';
			logoUrl = settings.logoUrl || '';
			faviconUrl = settings.faviconUrl || '';
		}
	});

	// Password validation
	const passwordsMatch = $derived(() => {
		if (!newPassword && !confirmPassword) return true;
		return newPassword === confirmPassword;
	});

	const passwordValid = $derived(() => {
		if (!newPassword) return true;
		return newPassword.length >= 8;
	});
</script>

<svelte:head>
	<title>Configuración - Admin | AMADEO STORE</title>
	<meta name="description" content="Configuración del panel de administración de AMADEO STORE" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b border-gray-200">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<h1 class="text-lg font-semibold text-gray-900">Configuración</h1>
				</div>
				<a href="/admin" class="text-sm text-gray-500 hover:text-gray-700 transition-colors" rel="external">
					← Volver al panel
				</a>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<main class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
		<!-- Success/Error Messages -->
		{#if success}
			<div class="mb-6 rounded-md bg-green-50 p-4">
				<div class="flex">
					<div class="shrink-0">
						<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-green-800">{success}</p>
					</div>
				</div>
			</div>
		{/if}

		{#if error}
			<div class="mb-6 rounded-md bg-red-50 p-4">
				<div class="flex">
					<div class="shrink-0">
						<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-red-800">{error}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Tabs -->
		<div class="bg-white shadow rounded-lg">
			<div class="border-b border-gray-200">
				<nav class="flex -mb-px">
					<button
						type="button"
						class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'store' 
							? 'border-green-500 text-green-600' 
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						onclick={() => activeTab = 'store'}
					>
						Configuración de Tienda
					</button>
					<button
						type="button"
						class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'account' 
							? 'border-green-500 text-green-600' 
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						onclick={() => activeTab = 'account'}
					>
						Cuenta Admin
					</button>
					<button
						type="button"
						class="py-4 px-6 border-b-2 font-medium text-sm {activeTab === 'advanced' 
							? 'border-green-500 text-green-600' 
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						onclick={() => activeTab = 'advanced'}
					>
						Configuración Avanzada
					</button>
				</nav>
			</div>

			<!-- Tab Content -->
			<div class="p-6">
				{#if activeTab === 'store'}
					<!-- Store Settings -->
					<form
						method="POST"
						action="?/store"
						use:enhance={() => {
							isLoading = true;
							return async () => {
								isLoading = false;
							};
						}}
						class="space-y-6"
					>
						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div class="sm:col-span-2">
								<label for="storeName" class="block text-sm font-medium text-gray-700 mb-2">
									Nombre de la Tienda
								</label>
								<input
									id="storeName"
									name="storeName"
									type="text"
									bind:value={storeName}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
									placeholder="AMADEO STORE"
								/>
							</div>

							<div>
								<label for="storeEmail" class="block text-sm font-medium text-gray-700 mb-2">
									Email de Contacto
								</label>
								<input
									id="storeEmail"
									name="storeEmail"
									type="email"
									bind:value={storeEmail}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
									placeholder="contacto@amadeostore.com"
								/>
							</div>

							<div>
								<label for="storePhone" class="block text-sm font-medium text-gray-700 mb-2">
									Teléfono de Contacto
								</label>
								<input
									id="storePhone"
									name="storePhone"
									type="tel"
									bind:value={storePhone}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
									placeholder="+54 9 11 1234-5678"
								/>
							</div>

							<div class="sm:col-span-2">
								<label for="storeAddress" class="block text-sm font-medium text-gray-700 mb-2">
									Dirección
								</label>
								<input
									id="storeAddress"
									name="storeAddress"
									type="text"
									bind:value={storeAddress}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
									placeholder="Av. Principal 123, Ciudad, País"
								/>
							</div>

							<div class="sm:col-span-2">
								<label for="storeDescription" class="block text-sm font-medium text-gray-700 mb-2">
									Descripción de la Tienda
								</label>
								<textarea
									id="storeDescription"
									name="storeDescription"
									rows="4"
									bind:value={storeDescription}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
									placeholder="Describe tu tienda y lo que ofreces..."
								></textarea>
							</div>

							<div>
								<label for="logoUrl" class="block text-sm font-medium text-gray-700 mb-2">
									URL del Logo
								</label>
								<input
									id="logoUrl"
									name="logoUrl"
									type="url"
									bind:value={logoUrl}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
									placeholder="https://ejemplo.com/logo.png"
								/>
								{#if logoUrl}
									<div class="mt-2">
										<img src={logoUrl} alt="Logo preview" class="h-12 w-auto rounded" onerror={(event) => event.currentTarget.style.display = 'none'} />
									</div>
								{/if}
							</div>

							<div>
								<label for="faviconUrl" class="block text-sm font-medium text-gray-700 mb-2">
									URL del Favicon
								</label>
								<input
									id="faviconUrl"
									name="faviconUrl"
									type="url"
									bind:value={faviconUrl}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
									placeholder="https://ejemplo.com/favicon.ico"
								/>
							</div>
						</div>

						<div class="flex justify-end">
							<button
								type="submit"
								disabled={isLoading}
								class="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{#if isLoading}
									<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Guardando...
								{:else}
									Guardar Configuración
								{/if}
							</button>
						</div>
					</form>

				{:else if activeTab === 'account'}
					<!-- Account Settings -->
					<div class="space-y-6">
						{#if adminUser}
							<div class="bg-gray-50 rounded-lg p-4">
								<h3 class="text-lg font-medium text-gray-900 mb-2">Información de la Cuenta</h3>
								<div class="space-y-2">
									<p><span class="font-medium">Nombre:</span> {adminUser.name}</p>
									<p><span class="font-medium">Email:</span> {adminUser.email}</p>
									<p><span class="font-medium">Rol:</span> Administrador</p>
									<p><span class="font-medium">Estado:</span> Activo</p>
								</div>
							</div>
						{/if}

						<!-- Change Password -->
						<div class="border-t pt-6">
							<h3 class="text-lg font-medium text-gray-900 mb-4">Cambiar Contraseña</h3>
							
							{#if !showPasswordForm}
								<button
									type="button"
									onclick={() => showPasswordForm = true}
									class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
								>
									Cambiar Contraseña
								</button>
							{:else}
								<form
									method="POST"
									action="?/password"
									use:enhance={() => {
										isLoading = true;
										return async () => {
											isLoading = false;
											if ($page.form?.success) {
												showPasswordForm = false;
												currentPassword = '';
												newPassword = '';
												confirmPassword = '';
											}
										};
									}}
									class="space-y-4"
								>
									<div>
										<label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
											Contraseña Actual
										</label>
										<input
											id="currentPassword"
											name="currentPassword"
											type="password"
											bind:value={currentPassword}
											required
											class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
											placeholder="Ingresa tu contraseña actual"
										/>
									</div>

									<div>
										<label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
											Nueva Contraseña
										</label>
										<input
											id="newPassword"
											name="newPassword"
											type="password"
											bind:value={newPassword}
											required
											class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
											placeholder="Mínimo 8 caracteres"
										/>
										{#if newPassword && !passwordValid}
											<p class="mt-1 text-sm text-red-600">La contraseña debe tener al menos 8 caracteres</p>
										{/if}
									</div>

									<div>
										<label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
											Confirmar Nueva Contraseña
										</label>
										<input
											id="confirmPassword"
											name="confirmPassword"
											type="password"
											bind:value={confirmPassword}
											required
											class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
											placeholder="Repite la nueva contraseña"
										/>
										{#if confirmPassword && !passwordsMatch}
											<p class="mt-1 text-sm text-red-600">Las contraseñas no coinciden</p>
										{/if}
									</div>

									<div class="flex space-x-3">
										<button
											type="button"
											onclick={() => {
												showPasswordForm = false;
												currentPassword = '';
												newPassword = '';
												confirmPassword = '';
											}}
											class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
										>
											Cancelar
										</button>
										<button
											type="submit"
											disabled={isLoading || !passwordValid || !passwordsMatch}
											class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											{#if isLoading}
												<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
													<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												Actualizando...
											{:else}
												Actualizar Contraseña
											{/if}
										</button>
									</div>
								</form>
							{/if}
						</div>

						<!-- Danger Zone -->
						<div class="border-t pt-6">
							<h3 class="text-lg font-medium text-red-600 mb-4">Zona de Peligro</h3>
							<div class="bg-red-50 border border-red-200 rounded-lg p-4">
								<p class="text-sm text-red-800 mb-4">
									Estas acciones son irreversibles. Ten cuidado al proceder.
								</p>
								<button
									type="button"
									onclick={() => showDeleteConfirm = true}
									class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
								>
									Eliminar Cuenta
								</button>
							</div>
						</div>
					</div>

				{:else if activeTab === 'advanced'}
					<!-- Advanced Settings -->
					<div class="space-y-6">
						<div>
							<h3 class="text-lg font-medium text-gray-900 mb-4">Configuración Avanzada</h3>
							<div class="bg-gray-50 rounded-lg p-4">
								<p class="text-sm text-gray-600">
									Esta sección está en desarrollo. Pronto podrás configurar opciones avanzadas como:
								</p>
								<ul class="mt-2 text-sm text-gray-600 list-disc list-inside">
									<li>Configuración de envíos</li>
									<li>Métodos de pago</li>
									<li>Impuestos y configuración fiscal</li>
									<li>Integraciones con terceros</li>
									<li>Configuración de emails</li>
								</ul>
							</div>
						</div>

						<div>
							<h3 class="text-lg font-medium text-gray-900 mb-4">Información del Sistema</h3>
							<div class="bg-gray-50 rounded-lg p-4">
								<dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<dt class="text-sm font-medium text-gray-500">Versión de SvelteKit</dt>
										<dd class="text-sm text-gray-900">2.0</dd>
									</div>
									<div>
										<dt class="text-sm font-medium text-gray-500">Versión de Node.js</dt>
										<dd class="text-sm text-gray-900">{typeof process !== 'undefined' ? process.version : 'N/A'}</dd>
									</div>
									<div>
										<dt class="text-sm font-medium text-gray-500">Base de Datos</dt>
										<dd class="text-sm text-gray-900">PostgreSQL</dd>
									</div>
									<div>
										<dt class="text-sm font-medium text-gray-500">Entorno</dt>
										<dd class="text-sm text-gray-900">Development</dd>
									</div>
								</dl>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</main>

	<!-- Delete Confirmation Modal -->
	{#if showDeleteConfirm}
		<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
			<div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
				<div class="mt-3">
					<div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
						<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
						</svg>
					</div>
					<div class="mt-2 text-center">
						<h3 class="text-lg leading-6 font-medium text-gray-900">Eliminar Cuenta</h3>
						<div class="mt-2 px-7 py-3">
							<p class="text-sm text-gray-500">
								¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y eliminará todos tus datos permanentemente.
							</p>
						</div>
					</div>
					<div class="flex justify-center space-x-3 mt-4">
						<button
							type="button"
							onclick={() => showDeleteConfirm = false}
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
						>
							Cancelar
						</button>
						<button
							type="button"
							onclick={() => {
								// TODO: Implement delete account functionality
								console.log('Delete account');
								showDeleteConfirm = false;
							}}
							class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
						>
							Eliminar Cuenta
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
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
