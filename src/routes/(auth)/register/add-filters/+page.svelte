<script lang="ts">
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
	import type { ActionData, PageData } from './$types';
    export let data: PageData;
    export let form: ActionData;
    let loading = false;
    const isAuth = $page.url.searchParams.get('auth') === 'true';
    type Form = { email: string, category: string | null, remove_from_inbox: boolean, word_filter: string };
    const emptyField: Form = {
        email: '',
        category: null,
        remove_from_inbox: false,
        word_filter: 'receipt, invoice'
    }
    let formArray: Form[] = [{...emptyField}]
    function handleAddField (e: Event) {
        e.preventDefault()
        formArray.push({...emptyField})
        formArray = formArray;
    }
    async function handleSubmit (e: Event) {
        loading = true;
        e.preventDefault();
        const formData = new FormData();
        const errors = formArray.filter(item => item.email === '')
        if (errors.length === 0) {
            formData.append('formArray', JSON.stringify(formArray));
            await fetch('/register/add-filters', {
                method: 'POST',
                body: formData,
            });
        }
    }
    function handleRemove (idx: number)  {
        formArray.splice(idx, 1);
        formArray = formArray;
    }
</script>

<section>
    {#if isAuth}
        <div class="prose text-center mt-3 mb-5 max-w-lg mx-auto">
            <h1>Setup Filters</h1>
            <p>This will automatically create filters to auto-forward receipts. Make sure filters are correct to ensure emails are sent correctly</p>
        </div>
        <div class="flex flex-col gap-2">
            {#each formArray as formItem, idx}
                <div class="flex flex-col gap-2 lg:gap-4 items-start border-2 rounded-md p-3 border-primary">
                    <div class="flex flex-col w-full">
                        <label class="label" for="senderEmail">Sender Email Address (required)</label>
                        <input class="input input-bordered" bind:value={formItem.email} name="senderEmail" />
                    </div>
                    <div class="flex flex-col w-full">
                        <label class="label justify-start" for="word_filter">
                            Subject Filters
                            <div class="tooltip" data-tip="Filters are used to filter email based on subject. Use comma space to separate values">
                                <i class="fa-solid fa-circle-info ml-1"></i>
                            </div>
                        </label>
                        <input class="input input-bordered" bind:value={formItem.word_filter} name="word_filter" />
                    </div>
                    <div class="flex flex-col w-full">
                        <label class="label justify-start" for="category">
                            Category (optional)
                            <div class="tooltip ml-1" data-tip="If set the category chosen will be used for all emails from this sender instead of values selected from AI">
                                <i class="fa-solid fa-circle-info"></i>
                            </div>
                        </label>
                        <select class="select select-bordered" bind:value={formItem.category} name="category">
                            {#each data.categories as cat}
                                <option value={cat.uuid}>{cat.value}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="flex flex-row items-center justify-between w-full">
                        <label class="label" for="remove_from_inbox">
                            Hide from Inbox?
                            <div class="tooltip ml-1" data-tip="If set it will not be shown on inbox but will not be deleted">
                                <i class="fa-solid fa-circle-info"></i>
                            </div>
                        </label>
                        <input class="checkbox" type="checkbox" bind:checked={formItem.remove_from_inbox} name="remove_from_inbox" />
                    </div>
                    <button class="btn btn-warning w-full" on:click={() => handleRemove(idx)}>remove<i class="fa-solid fa-x ml-2"></i></button>
                </div>
            {/each}
            <button class="btn btn-outline" on:click={(e) => handleAddField(e)}>Add Filter</button>
        </div>
    {:else}
        <a href={data.url}>
            <button class="btn w-full btn-outline"><i class="fa-regular fa-envelope"></i>Authorize Gmail</button>
        </a>
    {/if}
    {#if loading}
        <span class="loading loading-spinner loading-sm"></span>
    {:else}
        <form on:submit={handleSubmit}>
            <div class="flex flex-wrap w-full gap-2 justify-end mt-2">
                <button class="btn" type="submit">Save</button>
            </div>
        </form>
    {/if}
    {#if form?.error}
        <div class="alert alert-error mt-2">{form?.error}</div>
    {/if}
</section>