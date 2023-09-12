<script lang="ts">
    import { getAll } from 'currency-library';
    const data = getAll();
</script>

<section>
    <form method="POST">
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
        <select class="select select-bordered w-full" name="currency">
            {#each data as currency}
                <option value={currency.isoCode}>{currency.name}</option>
            {/each}
        </select>
        <button class="btn btn-outline btn-block mt-4 text-lg text-center">Register</button>
    </form>
</section>
