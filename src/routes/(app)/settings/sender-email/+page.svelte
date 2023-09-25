<script lang="ts">
	import type { PageData } from "./$types";
	import Category from "$lib/components/Category.svelte";

    let indexEdit: number | null;
    export let data: PageData;

</script>

<div class="flex justify-center">
    <div class="p-4 bg-base-200 min-w-fit w-2/3 rounded-box gap-2">
        <div class="text-sm breadcrumbs">
            <ul>
              <li><a href="/settings">Settings</a></li> 
              <li><a href="/settings/sender-email">Sender Email</a></li> 
            </ul>
        </div>
        {#if data.url}
            <a href={data.url}>
                <button class="btn w-full btn-outline my-5"><i class="fa-regular fa-envelope mr-1"></i>Authorize Gmail</button>
            </a>
            {:else}
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

        {/if}
    </div>
</div>