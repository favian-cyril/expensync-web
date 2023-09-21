<script lang="ts">
</script>

<div class="flex justify-center">
    <ul class="menu bg-base-200 w-2/5 rounded-box">
        <li><a href="/settings/user">User Settings<i class="fa-regular fa-circle-user"></i></a></li>
        <li><a href="/settings/categories">Categories<i class="fa-solid fa-tags"></i></a></li>
        <li><span>User Email<i class="fa-regular fa-envelope"></i></span></li>
        <li><a href="/settings/sender-email">Sender Email<i class="fa-solid fa-at"></i></a></li>
        <form action="/logout" method="post">
            <li>
                <button type="submit">Sign Out<i class="fa-solid fa-arrow-right-from-bracket"></i></button>
            </li>
        </form>
      </ul>
</div>