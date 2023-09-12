<script lang="ts">
	import ColorPicker from "$lib/components/ColorPicker.svelte";
	import type { PageData } from "./$types";
    export let data: PageData;
    let indexEdit: number | null;
</script>

<div class="flex justify-center">
    <div class="flex flex-col p-4 bg-base-200 w-fit rounded-box gap-2">
        <div class="text-sm breadcrumbs">
            <ul>
              <li><a href="/settings">Settings</a></li> 
              <li><a href="/settings/categories">Categories</a></li> 
            </ul>
        </div>
        <span class="text-xl font-bold">Edit Categories</span>
        {#each data.data || [] as cat, index}
            <div class="flex flex-row justify-between items-center gap-2">
                {#if indexEdit === index}
                    <form method="post" action="?/edit" class="flex gap-2 mx-auto flex-col md:flex-row self-center">
                        <input type="hidden" name="id" value={cat.uuid}>
                        <input name="value" value={cat.value} class="input input-bordered md:w-3/4 w-full" placeholder="Add a new Category" />
                        <div class="flex gap-2 justify-end">
                            <ColorPicker name="color" newColor={cat.color || ''} />
                            <button class="btn btn-outline" type="button" on:click={() => indexEdit = null}>Cancel</button>
                            <button class="btn btn-primary" type="submit">Edit</button>
                        </div>
                    </form>
                {:else}
                    <div class="rounded-full px-2 py-1 text-sm w-fit text-black h-fit" style={`background-color: ${cat.color};`}>
                        {cat.value}
                    </div>
                    <button class="btn btn-outline btn-sm" on:click={() => indexEdit = index}>Edit</button>
                {/if}
            </div>
        {/each}
        <form method="post" action="?/create" class="flex gap-2 mx-auto flex-col md:flex-row mt-5">
            <input name="value" class="input input-bordered md:w-3/4 w-full" placeholder="Add a new Category" />
            <div class="flex gap-2 justify-end">
                <ColorPicker name="color" />
                <button class="btn btn-primary" type="submit">Add</button>
            </div>
        </form>
    </div>
</div>