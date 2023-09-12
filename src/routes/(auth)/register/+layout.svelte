<script lang="ts">
    import { navigating, page } from '$app/stores';
	import { beforeUpdate, onMount } from 'svelte';

    // Get the current subroute segments from the $page store
    const subrouteSegments = $page.route.id?.split('/')
    const currentRoute = subrouteSegments?.at(-1);
    let stepState = {first: false, second: false, third: false, fourth: false}
    const updateState = () => {
        switch (currentRoute) {
            case 'register':
                stepState = {
                    ...stepState,
                    first: true,
                }
                break;
            case 'add-categories':
                stepState = {
                    ...stepState,
                    first: true,
                    second: true,
                }
                break;
            case 'setup-email':
                stepState = {
                    ...stepState,
                    first: true,
                    second: true,
                    third: true,
                }
                break;
            default:
                stepState = {
                    ...stepState,
                    first: true,
                    second: true,
                    third: true,
                    fourth: true,
                }
                break;
        }
    }
    $: { updateState(); }
    onMount(() => {
        updateState();
    })
    beforeUpdate(() => {
        updateState();
    })
</script>

<div class="container mx-auto w-fit border-solid border-2 border-primary px-7 py-5 rounded-md md:mt-10">
    <ul class="steps w-full mb-3">
        <li class={`step ${stepState.first ? 'step-primary' : ''}`}>Personal Details</li>
        <li class={`step ${stepState.second ? 'step-primary' : ''}`}>Add Categories</li>
        <li class={`step ${stepState.third ? 'step-primary' : ''}`}>Add Forwarding Address</li>
        <li class={`step ${stepState.fourth ? 'step-primary' : ''}`}>Setup Filters</li>
    </ul>
    <slot />
</div>

