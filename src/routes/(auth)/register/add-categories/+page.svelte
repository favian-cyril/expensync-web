<script lang="ts">
	import { goto } from '$app/navigation';
    import ColorPicker from '$lib/components/ColorPicker.svelte';
    import colors from 'tailwindcss/colors';
	import type { ActionData } from './$types';
    export let form: ActionData;
    let categories: {value:string, color:string}[] = [
        { value: 'Transportation', color: colors.cyan[500] },
        { value: 'Rent', color: colors.emerald[500] },
        { value: 'Food', color: colors.indigo[500] },
        { value: 'Groceries', color: colors.rose[500] }
    ];
    let loading = false;
    let error = '';
    let newCat = '';
    let newColor = '';
    function addCategory() {
        if (newCat.trim() !== ''
        && categories.findIndex(cat => cat.value.toLowerCase() === newCat.toLowerCase()) === -1
        && newColor !== '') {
            categories = [...categories, { value: newCat.trim(), color: newColor }]; // Add new tag to the array
            newCat = ''; // Clear the input field
        } else {
            error = 'Cannot add category. Please check if the category already exists';
        }
    }
    function deleteTag(category: string) {        
        const temp = categories.filter(cat => cat.value !== category);
        categories = temp;
    }
    async function handleSubmit (e: Event) {
        loading = true;
        e.preventDefault();
        const formData = new FormData();
        formData.append('categories', JSON.stringify(categories));
        const res = await fetch('/register/add-categories', {
            method: 'POST',
            body: formData,
        });
        const response = await res.json();
        if (response?.error) {
            error = response.error
        } else {
            goto('/register/setup-email');
        }
    }
</script>

<section>
    <div class="prose text-center mt-3 mb-5 max-w-lg mx-auto">
        <h1>Setup your Categories</h1>
        <p>Categories are required and are used to differentiate receipts. <br /> Please use simple terms that the AI can understand to ensure that receipts are labeled accordingly. <br />Here are a few examples that you can use to start:</p>
    </div>
    <div class="flex flex-wrap gap-2 justify-center mb-3 w-full">
        {#each categories as cat}
            <div class="rounded-full px-2 py-1 text-sm w-fit text-black" style={`background-color: ${cat.color};`}>
                {cat.value}
                <button on:click={() => deleteTag(cat.value)} class="btn btn-xs btn-circle btn-ghost"><i class="fa-solid fa-x text-xs text-black"></i></button>
            </div>
        {/each}
    </div>
    <div class="flex gap-2 mx-auto flex-col md:flex-row mt-5">
        <input bind:value={newCat} class="input input-bordered md:w-3/4 w-full" placeholder="Add a new Category" />
        <div class="flex gap-2 justify-end">
            <ColorPicker bind:newColor={newColor} />

            <button class="btn btn-primary" on:click={addCategory} type="button">Add</button>
        </div>
    </div>
    <form on:submit={handleSubmit}>
        <div class="flex flex-wrap w-full gap-2 justify-end mt-5">
            <button class="btn btn-primary" disabled={categories.length === 0 || loading} type="submit">Save and next</button>
        </div>
    </form>
    {#if form?.error || error.length}
        <div class="alert alert-error mt-2">{form?.error || error}</div>
    {/if}
</section>
