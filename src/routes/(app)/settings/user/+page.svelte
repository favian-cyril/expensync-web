<script lang="ts">
    import type { ActionData, PageData } from './$types';
    
    export let data: PageData;
    export let form: ActionData;
    let loading = false;

</script>

<div class="flex justify-center">
    <div class="p-4 bg-base-200 min-w-fit w-2/3 rounded-box gap-2">
        <div class="text-sm breadcrumbs">
            <ul>
              <li><a href="/settings">Settings</a></li> 
              <li><a href="/settings/sender-email">Sender Email</a></li> 
            </ul>
        </div>
        <form method="POST">
            <label class="label" for="firstName">
                First Name
            </label>
            <input class="input input-bordered w-full" name="firstName" type="text" required value={data.userData?.first_name}>
            <label class="label" for="lastName">
                Last Name
            </label>
            <input class="input input-bordered w-full" name="lastName" type="text" required value={data.userData?.last_name}>
            <label class="label" for="currency">
                Currency
            </label>
            <input class="input input-bordered w-full" name="lastName" type="text" disabled value={data.userData?.currency} />
            <label class="label justify-start">
                <input class="checkbox" type="checkbox" name="save_email_content" checked={data.userData?.save_email_content}>
                <span class="ml-2">Store email content to review email content and improve accuracy.</span>
            </label>
            <div class="flex justify-end mt-2">
                <button disabled={loading} class="btn btn-primary mt-4 text-lg text-center">Update</button>
            </div>
    
        </form>
        {#if form?.error}
            <div class="alert alert-error mt-2">{form?.error}</div>
        {/if}
    </div>
</div>