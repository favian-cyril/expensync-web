<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';

	export let form: ActionData;
	let loading = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			await applyAction(result);
			loading = false;
		};
	};
</script>

<section>
	<div class="container mx-auto w-fit border-solid border-2 border-primary px-7 py-5 rounded-md">
		<form class="flex flex-wrap mb-6 mx-auto justify-center" action="/?/signin-with-oauth" method="post" use:enhance={handleSubmit}>
			<button class="btn btn-outline" name="provider" value="google" type="submit">
				<i class="fa-brands fa-google mr-2"></i>
				Sign in with Google
			</button>
		</form>
		<div class="divider" />
		<h1 class="text-2xl font-bold text-center">Sign in to ExpenSync</h1>
		{#if form?.error}
			<div class="alert alert-error mt-2">{form?.error}</div>
		{/if}
		{#if $page.url.searchParams.get('auth-type') === 'magiclink'}
			<form action="?/send-magiclink" method="post" use:enhance={handleSubmit}>
				<label for="email" class="label">Email</label>
				<input
					id="email"
					name="email"
					value={form?.values?.email ?? ''}
					class="input input-bordered w-full"
					type="email"
					placeholder="Email"
					required
				/>
				<button disabled={loading} class="btn btn-outline btn-block mt-4 text-lg text-center">Send magic link</button>
			</form>

			<div class="mt-6">
				<p class="has-text-centered">
					<a href="/">Sign in with email and password</a>
				</p>
			</div>
		{:else if $page.url.searchParams.get('auth-type') === 'signup'}
		<form action="?/signup" method="post" use:enhance={handleSubmit}>
			<label for="email" class="label">Email</label>
			<input
				id="email"
				name="email"
				value={form?.values?.email ?? ''}
				class="input input-bordered w-full"
				type="email"
				placeholder="Email"
				required
			/>
			<label for="password" class="label">Password</label>
			<input
				id="password"
				name="password"
				class="input input-bordered w-full"
				type="password"
				placeholder="Password"
				required
			/>
			<label for="passwordconfirm" class="label">Confirm Password</label>
			<input
				id="passwordconfirm"
				name="passwordconfirm"
				class="input input-bordered w-full"
				type="password"
				placeholder="Confirm Password"
				required
			/>
			<button disabled={loading} class="btn btn-outline btn-block mt-4 text-lg text-center">Sign Up</button>
		</form>
		{:else}
			<!-- else content -->
			<form action="?/signin-with-password" method="post" use:enhance={handleSubmit}>
				<label for="email" class="label">Email</label>
				<input
					id="email"
					name="email"
					value={form?.values?.email ?? ''}
					class="input input-bordered w-full"
					type="email"
					placeholder="Email"
					required
				/>
				<label for="password" class="label">Password</label>
				<input
					id="password"
					name="password"
					class="input input-bordered w-full"
					type="password"
					placeholder="Password"
					required
				/>
				<button disabled={loading} class="btn btn-outline btn-block mt-4 text-lg text-center">Sign in</button>
			</form>
			<div class="mt-6">
				<p class="text-sm text-center">
					Sign in with <a href="?auth-type=magiclink" class="font-semibold">magiclink</a>
				</p>
				<p class="text-sm text-center">
					Don't have an account? <a href="?auth-type=signup" class="font-semibold">Sign up</a>
				</p>
			</div>
		{/if}
		{#if form?.emailSent}
			<div class="alert alert-success">Email sent successfully! Please check your inbox for the link.</div>
		{/if}
	</div>
</section>
