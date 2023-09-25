<script lang="ts">
	import type { LayoutData } from './$types';
	export let data: LayoutData;

	$: ({ session } = data);
</script>

<div class="navbar bg-base-100 shadow-sm lg:px-10 pl-5 pr-0 sticky top-0 z-10 justify-between">
    <a class="btn btn-ghost normal-case text-xl" href="/">ExpenSync</a>
    <div class="flex-1 gap-10 hidden lg:flex">
      <!-- <a href="/about">About</a> -->
      <a href="/faq">FAQ</a>
    </div>
    <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
            <i class="fa-solid fa-bars"></i>
        </label>
        <ul tabindex="0" class="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-screen">
          <li><a href="/faq" class="w-full btn btn-ghost">FAQ</a></li>
          <li>
            <label class="swap swap-rotate">
                <input type="checkbox" data-toggle-theme="dark,lofi">
                <i class="swap-off fa-solid text-xl w-5 text-center fa-moon"></i>
                <i class="swap-on fa-solid text-xl w-5 text-center fa-sun"></i>
            </label>
          </li>
          <li>
            {#if session}
                <a class="btn btn-primary btn-md text-neutral-content" href="/dashboard">Go to Dashboard</a>
            {:else}
                <a class="btn btn-primary btn-md text-neutral-content" href="/login">Login</a>
            {/if}
          </li>
        </ul>
      </div>
    <div class="flex-none gap-10 hidden lg:flex">
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
<footer class="footer grid-flow-col p-10 bg-neutral text-neutral-content justify-evenly">
    <nav>
      <header class="footer-title">About Us</header> 
      <!-- <a class="link link-hover" href="/about" >About</a> -->
      <a class="link link-hover" href="mailto:support@expensync.com">Contact</a>
    </nav> 
    <nav>
      <header class="footer-title">Legal</header> 
      <a class="link link-hover" href="/tnc">Terms of use</a>
      <a class="link link-hover" href="/privacy">Privacy policy</a>
      <!-- <a class="link link-hover">Cookie policy</a> -->
    </nav>
  </footer>