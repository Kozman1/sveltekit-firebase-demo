<script>
    import { user } from '/src/app/stores/user.js';
</script> 


{#if !!$user}
<a class="navigation-profile" href={`/users/${$user.uid}`} sveltekit:prefetch>
    <div class="navigation-profile__text">{$user.displayName}</div>
    <img src="{$user.photoURL}" alt="profile">
</a>
{/if}


<style>
    .navigation-profile {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        text-decoration: none;
    }

    img {
        width: 40px;
        height: 40px;

        border-radius: 10px;
        overflow: hidden;
        object-fit: fill;
        object-position: 50% 50%;
    }

    .navigation-profile__text {
        margin-right: 20px;
        color: #fff;
    }

</style>