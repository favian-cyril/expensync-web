<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { goto } from '$app/navigation';
    import { getAll } from 'currency-library';
	import type { ActionData } from './$types';
    const data = getAll();
    export let form: ActionData;
    let loading = false;

    const handleSubmit: SubmitFunction = () => {
        loading = true;
        return async ({ result }) => {
            await applyAction(result);
            loading = false;
            if (!form?.error) goto('/register/add-categories');
        };
    };
</script>

<section>
    <form method="POST" use:enhance={handleSubmit}>
        <label class="label" for="firstName">
            First Name
        </label>
        <input class="input input-bordered w-full" name="firstName" type="text" required>
        <label class="label" for="lastName">
            Last Name
        </label>
        <input class="input input-bordered w-full" name="lastName" type="text" required>
        <label class="label" for="currency">
            Currency
        </label>
        <select class="select select-bordered w-full" name="currency" value="IDR">
            {#each data as currency}
                <option value={currency.isoCode}>{currency.name}</option>
            {/each}
        </select>
        <label class="label justify-start">
            <input class="checkbox" type="checkbox" id="termsCheckbox" name="termsCheckbox" required>
            <span class="ml-2">I agree to the <a class="btn-link" href="/tnc" target="_blank">Terms and Conditions</a> and <a class="btn-link" href="/privacy" target="_blank">Privacy Policy</a>.</span>
        </label>
        <div class="flex justify-end mt-2">
            <button disabled={loading} class="btn btn-primary mt-4 text-lg text-center">Register</button>
        </div>

    </form>
    {#if form?.error}
        <div class="alert alert-error mt-2">{form?.error}</div>
    {/if}
</section>
