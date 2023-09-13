<script lang="ts">
	import type { PageData } from "./$types";
    import dayjs from 'dayjs';
	import { formatDinero } from "$lib/utils/currency";
    import { add, dinero } from 'dinero.js'
	import { goto } from "$app/navigation";
    export let data: PageData;
    type FormItem = { uuid: string, category_id: string | null, email_content: string, SenderEmail: { email: string } | null, vendor: string | null, email_created: string | null, amount: number, other_amounts: number[] }
    let formData: FormItem[] = data.invoices?.map(({ uuid, category_id, email_content, SenderEmail, vendor, email_created, amount, other_amounts }) => ({ uuid, category_id, email_content, SenderEmail, vendor, email_created, amount, other_amounts })) || [];
    let deletedData: FormItem[] = [];
    let loading = false;
    let dialog: HTMLDialogElement;
    let textContent = '';
    function handleRemoveItem (index: number) {
        const deleted = formData.splice(index, 1);
        deletedData.push(deleted[0]);
        formData = formData;
        deletedData = deletedData;
    }
    function handleShowDialog (text: string) {
        dialog.showModal();
        textContent = text;
    }
    async function handleSubmit (e: Event) {
        loading = true;
        e.preventDefault();
        const body = new FormData();
        body.append('data', JSON.stringify(formData));
        body.append('deleted', JSON.stringify(deletedData));
        await fetch('/review', {
            method: 'POST',
            body
        })
        loading = false;
        goto('/dashboard');
    }
    $: total = formData.reduce((acc, cur) => cur.amount + acc, 0)
</script>

<div class="flex flex-col justify-center">
    <table class="table table-zebra table-compact">
        <thead>
            <tr>
                <th>Date</th>
                <th>Sender</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Amount</th>
                <th colspan={2} class="text-center">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each formData as invoice, index}
                <tr>
                    <td>{dayjs(invoice.email_created).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td>{invoice.SenderEmail?.email}</td>
                    <td><input class="input input-bordered" type="text" bind:value={invoice.vendor} /></td>
                    <td>
                        <select class="select select-bordered" bind:value={invoice.category_id} name="category">
                            {#each data.categories || [] as cat}
                                <option value={cat.uuid}>
                                    {cat.value}
                                </option>
                            {/each}
                        </select>
                    </td>
                    <td>
                        <select class="select select-bordered" bind:value={invoice.amount} name="amount">
                            <option value={invoice.amount}>{formatDinero(dinero({ amount: invoice.amount, currency: data.currency }))}</option>
                            {#each [...invoice.other_amounts] as otherAmounts}
                                <option value={otherAmounts}>
                                    {formatDinero(dinero({ amount: otherAmounts, currency: data.currency }))}
                                </option>
                            {/each}
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-outline btn-sm" on:click={() => handleShowDialog(invoice.email_content)}>View content</button>
                        
                    </td>
                    <td><button class="btn btn-accent btn-sm" on:click={() => handleRemoveItem(index)}>remove</button></td>
                </tr>
            {:else}
                <tr>
                    <td colspan={7} class="text-center">Nothing to review</td>
                </tr>
            {/each}
        </tbody>
        <tfoot>
            <tr>
                <td colspan={5} class="text-right text-lg font-semibold">Total: {formatDinero(dinero({ amount: total, currency: data.currency }))}</td>
                <td colspan={2} class="text-center">
                    {#if loading}
                        <button class="btn">
                            <span class="loading loading-spinner"></span>
                            loading
                        </button>
                    {:else}
                        <button class="btn" on:click={handleSubmit}>
                            Update Data
                        </button>
                    {/if}
                </td>
            </tr>
        </tfoot>
    </table>
    <dialog bind:this={dialog} class="rounded-md p-4 backdrop:bg-gray-600 backdrop:bg-opacity-50">
        <div class="text-xl font-bold">Email Content</div>
        <form method="dialog">
            <div class="whitespace-pre max-h-60 overflow-scroll bg-base-300">{textContent}</div>
            <div class="modal-action">
              <button class="btn">Close</button>
            </div>
          </form>
    </dialog>
</div>