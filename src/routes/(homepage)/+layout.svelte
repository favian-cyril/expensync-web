<script lang="ts">
	import type { LayoutData } from './$types';
	export let data: LayoutData;

	$: ({ session } = data);
</script>

<div class="navbar bg-base-100 shadow-sm px-10 sticky top-0 z-10">
    <div class="flex-1 gap-10">
      <a class="btn btn-ghost normal-case text-xl" href="/">ExpenSync</a>
      <a href="/privacy">Privacy</a>
      <a href="/faq">FAQ</a>
    </div>
    <div class="flex-none gap-10">
        <label class="swap swap-rotate">
            <input type="checkbox" data-toggle-theme="dark,lofi">
            <i class="swap-off fa-solid text-xl w-5 text-center fa-moon"></i>
            <i class="swap-on fa-solid text-xl w-5 text-center fa-sun"></i>
        </label>
        {#if session}
            <a class="btn btn-primary btn-md" href="/dashboard">Go to Dashboard</a>
        {:else}
            <a class="btn btn-primary btn-md" href="/login">Login</a>
        {/if}
    </div>
</div>
<slot />
<footer class="footer p-10 bg-neutral text-neutral-content justify-evenly">
    <nav>
      <header class="footer-title">About Us</header> 
      <!-- <a class="link link-hover" >About us</a> -->
      <a class="link link-hover" href="mailto:support@expensync.com">Contact</a>
    </nav> 
    <nav>
      <header class="footer-title">Legal</header> 
      <a class="link link-hover" href="/tnc">Terms of use</a>
      <a class="link link-hover" href="/privacy">Privacy policy</a>
      <!-- <a class="link link-hover">Cookie policy</a> -->
    </nav>
  </footer>