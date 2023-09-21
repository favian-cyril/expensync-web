<script lang="ts">
    import stepone from '$lib/assets/step-1.png';
    import steptwo from '$lib/assets/step-2.png';
    import stepthree from '$lib/assets/step-3.png';
    import stepfour from '$lib/assets/step-4.png';
    import stepfive from '$lib/assets/step-5.png';
    import stepsix from '$lib/assets/step-6.png';
</script>
<section class="prose">
    <ul class="steps w-full mb-3">
        <li class="step step-primary">Personal Details</li>
        <li class="step step-primary">Add Categories</li>
        <li class="step step-primary">Add Forwarding Address</li>
        <li class="step">Setup Filters</li>
    </ul>
    <h2 class="text-center">Setting up forwarding email in Gmail</h2>
    <div class="grid grid-cols-2 gap-2 items-start">
        <div>
            <h2>Step 1:</h2>
            <p>Go to the upper right settings and click on See all settings</p>
        </div>
        <div>
            <img src={stepone} alt="Step One" />
        </div>
        <div>
            <h2>Step 2:</h2>
            <p>Go to the Forwarding and POP/IMAP tab</p>
        </div>
        <div>
            <img src={steptwo} alt="Step two" />
        </div>
        <div>
            <h2>Step 3:</h2>
            <p>Click on Add a forwarding address and a dialog will pop up. Enter the address invoice@expensync.com <button class="btn btn-circle btn-outline btn-sm" on:click={() => navigator.clipboard.writeText('invoice@expensync.com')}><i class="fa-regular fa-copy"></i></button> and click on next.</p>
        </div>
        <div>
            <img src={stepthree} alt="Step Three" />
        </div>
        <div>
            <h2>Step 4:</h2>
            <p>A Pop-up will appear to confirm the email address. Click on Proceed</p>
        </div>
        <div>
            <img src={stepfour} alt="Step Four" />
        </div>
        <div>
            <h2>Step 5:</h2>
            <p>It will show that an email will be sent to confirm the address. Refresh the page after a few moment</p>
        </div>
        <div>
            <img src={stepfive} alt="Step Five" />
        </div>
        <div>
            <h2>Step 6:</h2>
            <p>After refreshing the page it will show that the forwarding address has been save successfully.</p>
        </div>
        <div>
            <img src={stepsix} alt="Step Six" />
        </div>
    </div>
    <a href="/register/add-filters">
        <button class="btn btn-primary w-full">Proceed</button>
    </a>
</section>
