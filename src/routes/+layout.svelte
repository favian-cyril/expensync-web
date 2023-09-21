<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { navigating } from '$app/stores';
    import NProgress from 'nprogress';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import '../app.css';
	import { themeChange } from 'theme-change';
	import 'nprogress/nprogress.css';

	export let data: LayoutData;

	$: ({ supabase, session } = data);
    navigating.subscribe((val) => {
        if (val) NProgress.start()
        else NProgress.done()
    })
	onMount(() => {
		themeChange(false)
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Expensync</title>
</svelte:head>

<slot />
