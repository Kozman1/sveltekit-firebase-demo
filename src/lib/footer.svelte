<script>
    import Login from '$lib/auth/login.svelte';
    import Logout from '$lib/auth/logout.svelte';
    import { user } from '/src/app/stores/user.js';
</script>

<footer class="footer">
    <nav class="footer__nav">
        <Login><div class="footer__link">Login</div></Login>      
        {#if $user}
            <a href="/users" class="footer__link" sveltekit:prefetch>Browse Users</a>
            <a href="/posts/myPosts/{$user.uid}" class="footer__link" sveltekit:prefetch>Your Posts</a>
            <a href="/posts" class="footer__link" sveltekit:prefetch>All Posts</a>
            <a href="/chat" class="footer__link" sveltekit:prefetch>Chat With Other Users!</a>
        {/if}
        <a href="/comparison" class="footer__link">Firebase vs Airtable</a>
        <Logout><div class="footer__link">Logout</div></Logout>
        
    </nav>
    <p class="copyright">Made with <span class="strikethrough">love</span> keyboard.</p>
</footer>



<style>
    .footer {
        margin-top: 20px;
        padding: 20px 3vw 5px 3vw;
        background-color: #ff3e00
    }

    .footer__nav {
        display: flex;
        flex-direction: column;
        justify-content: space-between; 
        align-items: center;
        cursor: pointer;

    }

    .footer__link {
        margin-bottom: 15px;
        text-decoration: none;
        color: #fff;
        transition-property: background-color;
        transition-duration: 250ms;
    }

    .footer__link:hover {
        background-color: #d23804;
    }

    p {
        margin-top: 20px;
        font-size: 8px;
        color: #fff;
        text-align: center;
    }

    .strikethrough {
        text-decoration: line-through;
    }
</style>