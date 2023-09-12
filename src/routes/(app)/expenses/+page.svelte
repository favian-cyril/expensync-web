<script lang="ts">
	import { formatDinero } from "$lib/utils/currency";
	import dayjs from "dayjs";
	import { dinero } from "dinero.js";
	import type { PageData } from "./$types";
    import { queryParam, queryParameters, ssp } from "sveltekit-search-params";

    export let data: PageData;
    
    let vendorInput: string;
    const currentPage = queryParam('p', ssp.number(1))
    const sortBy = queryParam('sortby', ssp.string('date'))
    const asc = queryParam('asc', ssp.boolean(false))
    const start_date = queryParam('start_date', ssp.string())
    const end_date = queryParam('end_date', ssp.string())
    const filters = queryParameters({
        category: {
            encode: (val: string[]) => JSON.stringify(val),
            decode: (val: string | null) => val ? JSON.parse(val) : [],
            defaultValue: [],
        },
        sender: {
            encode: (val: string[]) => JSON.stringify(val),
            decode: (val: string | null) => val ? JSON.parse(val) : [],
            defaultValue: [],
        },
    });
    function handleClickSort (sort: string) {
        if ($sortBy === sort) {
            $asc = !$asc;
        } else {
            $sortBy = sort;
        }
    }
    function handleSetPage (page: number) {
        $currentPage = page;
    }
    function handleFilters (name: string, value: string) {
        $filters[name] = value;
    }
    function clearFilter (name: string) {
        $filters[name] = undefined;
    }
    function handleArrayFilters (name: string, value: string, isRemove: boolean) {
        if (isRemove) {
            $filters[name] = $filters[name].filter((val: string) => val !== value)
        } else {
            $filters[name] = [...$filters[name], value]
        }
    }
    function clearArrayFilter (name: string) {
        $filters[name] = [];
    }
    
    $: pages = new Array(data.pages);
</script>

<div class="mx-auto flex justify-center flex-col w-fit">
    <table class="table table-zebra table-auto">
        <thead>
            <tr>
                <th>
                    <div class="flex flex-row justify-between">
                        <button
                            on:click={() => handleClickSort('date')}
                            class="btn btn-ghost pl-0"
                        >
                            Date
                            <i class={`fa-solid ${$asc ? 'fa-arrow-down-1-9' : 'fa-arrow-up-1-9'} ${$sortBy === 'date' ? '' : 'hidden'}`}></i>
                        </button>
                        <details class="dropdown dropdown-end dropdown-bottom">
                            <summary
                                class="btn btn-ghost"
                            >
                                <i class="fa-solid fa-filter"></i>
                            </summary>
                            <div class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-fit">
                                <label for="startDate">Start Date</label>
                                <input bind:value={$start_date} class="input" type="datetime-local" name="startDate" />
                                <label for="endDate">End Date</label>
                                <input bind:value={$end_date} class="input" type="datetime-local" name="endDate" />
                            </div>
                        </details>
                    </div>

                </th>
                <th class="text-sm">
                    <div class="flex flex-row justify-between">
                        <span class="py-4">Sender</span>
                        <details class="dropdown dropdown-end dropdown-bottom">
                            <summary
                                class="btn btn-ghost"
                            >
                                <i class="fa-solid fa-filter"></i>
                            </summary>
                            <div class="dropdown-content  z-[1] bg-base-100 rounded-box p-2 shadow">
                                <ul class="menu max-h-28 overflow-x-scroll flex-nowrap mb-2">
                                    {#each data.senderEmails || [] as sender}
                                        <li class="border-b-2 border-black">
                                            <button on:click={() => handleArrayFilters('sender', sender.email, $filters?.sender.includes(sender.email))} class={`px-2 py-1 text-sm w-full ${$filters?.sender.includes(sender.email) ? 'bg-gray-200' : ''}`}>
                                                {sender.email}
                                            </button>
                                        </li>
                                    {/each}
                                </ul>
                                <div class="flex flex-row justify-end gap-1">
                                    <button on:click={() => clearArrayFilter('sender')} class="btn btn-outline btn-sm">Clear</button>
                                </div>
                            </div>
                        </details>
                    </div>
                </th>
                <th>
                    <div class="flex flex-row justify-between">
                        <button on:click={() => handleClickSort('vendor')} class="btn btn-ghost pl-0">Vendor<i class={`fa-solid ${$asc ? 'fa-arrow-up-a-z' : 'fa-arrow-down-a-z'} ${$sortBy === 'vendor' ? '' : 'hidden'}`}></i></button>
                        <details class="dropdown dropdown-end dropdown-bottom">
                            <summary
                                class="btn btn-ghost"
                            >
                                <i class="fa-solid fa-filter"></i>
                            </summary>
                            <ul class="p-3 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-fit">
                                <input bind:value={vendorInput} class="input input-bordered mb-2" type="text" />
                                <div class="flex flex-row justify-end gap-1">
                                    <button on:click={() => handleFilters('vendor', vendorInput)} class="btn btn-outline btn-sm">Submit</button>
                                    <button on:click={() => clearFilter('vendor')} class="btn btn-outline btn-sm">Clear</button>
                                </div>
                            </ul>
                        </details>
                    </div>
                </th>
                <th class="text-sm">
                    <div>
                        <span>Category</span>
                        <details class="dropdown dropdown-end dropdown-bottom">
                            <summary
                                class="btn btn-ghost"
                            >
                                <i class="fa-solid fa-filter"></i>
                            </summary>
                            <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                                {#each data.categories || [] as cat}
                                    <li class="p-1">
                                        <button on:click={() => handleArrayFilters('category', cat.value, $filters?.category.includes(cat.value))} class={`text-black px-2 py-1 text-sm w-full ${$filters?.category.includes(cat.value) ? 'border-2 border-zinc-950' : ''}`} style={`background-color: ${cat.color};`}>
                                            {cat.value}
                                        </button>
                                    </li>
                                {/each}
                                <div class="flex flex-row justify-end gap-1">
                                    <button on:click={() => clearArrayFilter('category')} class="btn btn-outline btn-sm">Clear</button>
                                </div>
                            </ul>
                        </details>
                    </div>
                </th>
                <th><button on:click={() => handleClickSort('amount')} class="btn btn-ghost pl-0">Amount<i class={`fa-solid ${$asc ? 'fa-arrow-down-1-9' : 'fa-arrow-up-1-9'} ${$sortBy === 'amount' ? '' : 'hidden'}`}></i></button></th>
            </tr>
        </thead>
        <tbody>
            {#each data.invoices || [] as invoice}
                <tr>
                    <td>{dayjs(invoice.email_created).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td>{invoice.sender_email}</td>
                    <td class="max-w-sm w-36 max-h-40 h-20 break-word truncate">{invoice.vendor}</td>
                    <td>
                        <div class="rounded-full px-2 py-1 text-sm w-fit text-black" style={`background-color: ${invoice.color};`}>
                            {invoice.category}
                        </div>
                    </td>
                    <td>{formatDinero(dinero({ amount: invoice.amount, currency: data.currency }))}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    <div class="join mx-auto mt-4 mb-5">
        {#each pages as _, index}
            <button on:click={() => handleSetPage(index + 1)} class={`join-item btn ${$currentPage === (index+1) ? 'btn-active' : 'btn-outline'}`}>{index + 1}</button>
        {/each}
    </div>
</div>  