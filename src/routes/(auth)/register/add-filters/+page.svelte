<script lang="ts">
	import { goto } from '$app/navigation';
	import Category from '$lib/components/Category.svelte';
	import type { ActionData, PageData } from './$types';
    import GoogleIcon from '$lib/assets/btn_google_light_normal_ios.svg'
    export let data: PageData;
    export let form: ActionData;
    let indexEdit: number | null;
</script>

<section>
    <ul class="steps w-full mb-3">
        <li class="step step-primary">Personal Details</li>
        <li class="step step-primary">Add Categories</li>
        <li class="step step-primary">Add Forwarding Address</li>
        <li class="step step-primary">Setup Filters</li>
    </ul>
    {#if data.url}
        <a href={data.url} class="w-fit mx-auto block">
            <button class="btn pl-0 my-5 border-0 shadow-md bg-white normal-case text-gray-500 rounded-none font-semibold"><img src={GoogleIcon} alt="google" />Sign in with Google</button>
        </a>
    {:else if data.error}
    <div class="flex flex-col justify-items-center text-center">
        <p class="text-red-500">Error: {data.error}</p>
        <a class="btn btn-link" href="/register/setup-email" target="_blank">Click here to see instructions</a>
    </div>
    {:else}
        <div class="prose text-center mt-3 mb-5 max-w-lg mx-auto">
            <h1>Setup Filters</h1>
            <p>This will automatically create filters to auto-forward receipts. Make sure filters are correct to ensure emails are sent correctly</p>
        </div>
        <form method="post">
        <table class="table table-zebra table-sm">
            <thead>
                <tr>
                    <td></td>
                    <td>Email Address</td>
                    <td>
                        Category
                        <div class="tooltip font-light normal-case whitespace-break-spaces" data-tip="If set the category chosen will be used for all emails from this sender instead of values selected from AI">
                            <i class="fa-solid fa-circle-info"></i>
                        </div>
                    </td>
                    <td>
                        Hide Inbox
                        <div class="tooltip font-light normal-case whitespace-break-spaces" data-tip="If set it will not be shown on inbox but will not be deleted">
                            <i class="fa-solid fa-circle-info"></i>
                        </div>
                    </td>
                    <td>
                        Subject Filters
                        <div class="tooltip font-light normal-case whitespace-break-spaces" data-tip="Filters are used to filter email based on subject. Use comma space to separate values">
                            <i class="fa-solid fa-circle-info ml-1"></i>
                        </div>
                    </td>
                    <td>Edit</td>
                </tr>
            </thead>
            <tbody>
                {#each data.senderData || [] as sender, index}
                    {#if indexEdit === index}
                            <input type="hidden" name="id" value={sender.uuid}>
                            <input type="hidden" name="filter_id" value={sender.filter_id}>
                            <tr>
                                <td><button class="btn btn-warning btn-sm" type="submit" formaction="?/delete">Delete</button></td>
                                <td><input class="input input-bordered input-sm" type="text" name="email" value={sender.email} /></td>
                                <td>
                                    <select class="select select-sm" name="category" value={sender.category_id}>
                                        <option value={null}>Automatic</option>
                                        {#each data.categoriesData || [] as cat}
                                            <option value={cat.uuid}>{cat.value}</option>
                                        {/each}
                                    </select>
                                </td>
                                <td><input class="checkbox" type="checkbox" name="remove_from_inbox" checked={sender.remove_from_inbox}></td>
                                <td><input class="input input-bordered input-sm" type="text" name="word_filter" value={sender.word_filter?.join(', ')}></td>
                                <td>
                                    <button class="btn btn-primary btn-sm" type="submit" formaction="?/edit">Save</button>
                                    <button class="btn btn-outline btn-sm" on:click={() => indexEdit = null}>Cancel</button>
                                </td>
                            </tr>
                    {:else}
                        <tr>
                            <td></td>
                            <td>{sender.email}</td>
                            <td>
                                {#if sender.Category}
                                    <Category val={sender.Category} />
                                {:else}
                                    <span>Automatic</span>
                                {/if}
                            </td>
                            <td>{sender.remove_from_inbox ? 'Hide from Inbox' : 'Show in Inbox'}</td>
                            <td>{sender.word_filter?.join(', ')}</td>
                            <td><button class="btn btn-outline btn-sm" on:click={() => indexEdit = index}>Edit</button></td>
                        </tr>
                    {/if}
                {/each}
                <tr>
                    <td></td>
                    <td><input class="input input-bordered input-sm" type="text" name="new_email" placeholder="Add new email address" /></td>
                    <td>
                        <select class="select select-sm" name="new_category">
                            <option value={null}>Automatic</option>
                            {#each data.categoriesData || [] as cat}
                                <option value={cat.uuid}>{cat.value}</option>
                            {/each}
                        </select>
                    </td>
                    <td><input class="checkbox" type="checkbox" name="new_remove_from_inbox"></td>
                    <td><input class="input input-bordered input-sm" type="text" name="new_word_filter" value="receipt, invoice"></td>
                    <td>
                        <button class="btn btn-primary btn-sm" type="submit" formaction="?/create">Add</button>
                    </td>
                </tr>
            </tbody>
        </table>
        </form>
        <div class="flex justify-end mt-2">
            <button class="btn btn-primary" on:click={() => goto('/dashboard')}>Finish</button>
        </div>
    {/if}
    {#if form?.error}
        <div class="alert alert-error mt-2">{form?.error}</div>
    {/if}
</section>