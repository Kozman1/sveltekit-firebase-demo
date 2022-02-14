<script>
    import Login from "$lib/auth/login.svelte";
    import Logout from "$lib/auth/logout.svelte";
    import NavProfile from "$lib/nav-profile.svelte";
    import { base } from '$app/paths';
</script>

<header class="header">
    <div class="navbar">
        <a class="logo-wrap" href="/">
            <img
                src="/assets/icons/company-logo-black.svg"
                alt="company logo"
                class=""
            />
        </a>
        <div class="links-navbar">
            <Login><div class="navbar__link">Login</div></Login>
            <Logout><div class="navbar__link">Logout</div></Logout>
            <NavProfile />
        </div>
    </div>
</header>

<style>
    header {
        height: 80px;
        padding: 0px 3vw;
        background-color: #ff3e00;
    }

    .navbar {
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .links-navbar {
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .navbar__link {
        height: 100%;
        margin-right: 15px;
        text-decoration: none;
        color: #fff;
        cursor: pointer;
        transition-property: background-color;
        transition-duration: 250ms;
    }

    .navbar__link:hover {
        background-color: #d23804;
    }
</style>
