<script>
    import { signOut } from 'firebase/auth';
    import { user } from '/src/app/stores/user.js';
    import { auth } from '/src/app/stores/auth.js';

    const logout = async () => {
        await signOut($auth);
    }
</script>

{#if !!$user}
<div on:click={logout}>
    <slot/>
</div>
{/if}

