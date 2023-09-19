<script lang="ts">
	import { navigating, page } from '$app/stores';
    import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { onMount } from 'svelte'
	import { themeChange } from 'theme-change'

	onMount(() => {
		themeChange(false)
	})

    navigating.subscribe((val) => {
        if (val) NProgress.start()
        else NProgress.done()
    })
	let minimize = false;	
</script>

<svelte:head>
	<title>Email and Password Demo - Supabase Auth Helpers</title>
</svelte:head>

<main>
	<div class="flex flex-row h-max min-h-screen">
		<ul class={`menu bg-base-200 ${minimize ? 'w-14' : 'w-1/6'} border-r-2 border-primary transition-width ease-out duration-200`}>
			<div class="flex flex-row justify-between p-2 shadow-md">
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
				<a class={`flex justify-between ${$page.url.pathname === '/settings' ? 'active' : ''}`} href="/settings">
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
