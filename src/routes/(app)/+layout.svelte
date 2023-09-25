<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	let minimize = false;	
	onMount(() => {
		themeChange(false)
	})
</script>

<svelte:head>
	<title>ExpenSync Dashboard</title>
</svelte:head>

<main>
	<div class="flex flex-row h-max min-h-screen">
		<ul class={`p-0 menu bg-base-200 ${minimize ? 'w-14' : 'md:w-1/6 w-14'} border-r-2 border-primary transition-width duration-300 ease-in-out`}>
			<div class="flex-row justify-between p-2 shadow-md lg:flex hidden">
				<div class={minimize ? 'hidden' : "text-lg"}>ExpenSync</div>
				<button on:click={() => {minimize = !minimize}} class="btn btn-ghost btn-sm"><i class={minimize ? "fa-solid fa-chevron-right" : "fa-solid fa-chevron-left"}></i></button>
			</div>
			<li class="border-solid border-primary border-b-1">
				<a class={`flex justify-between ${$page.url.pathname === '/dashboard' ? 'active' : ''}`} href="/dashboard?range=week">
					<div class={minimize ? 'hidden' : 'text-md hidden md:block'}>Home</div>
					<i class="fa-solid fa-house text-xl text-center w-5 mx-auto md:mx-0"></i>
				</a>
			</li>
			<li class="border-solid border-primary border-b-1">
				<a class={`flex justify-between ${$page.url.pathname === '/expenses' ? 'active' : ''}`} href="/expenses?p=1">
					<div class={minimize ? 'hidden' : 'text-md hidden md:block'}>Expenses</div>
					<i class="fa-solid fa-file-invoice-dollar w-5 text-center text-xl mx-auto md:mx-0"></i>
				</a>
			</li>
			<li class="border-solid border-primary border-b-1">
				<a class={`flex justify-between ${$page.url.pathname.includes('/settings') ? 'active' : ''}`} href="/settings">
					<div class={minimize ? 'hidden' : 'text-md hidden md:block'}>Settings</div>
					<i class="fa-solid fa-gear text-xl w-5 text-center mx-auto md:mx-0"></i>
				</a>
			</li>
			<div class="flex justify-end p-4">
				<label class="swap swap-rotate">
					<input type="checkbox" data-toggle-theme="dark,lofi">
					<i class="swap-off fa-solid text-xl w-5 text-center fa-moon"></i>
					<i class="swap-on fa-solid text-xl w-5 text-center fa-sun"></i>
				</label>
			</div>	
		</ul>
		<div class="w-full flex-wrap pt-5 	bg-base-300">
			<slot />
		</div>
	</div>
</main>
