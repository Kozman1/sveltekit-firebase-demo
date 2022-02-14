<script>
    export let uid, photoURL, displayName, createdAt, description;
</script>

<a class="user-card" href="/users/{uid}">
    <img src={photoURL} alt={displayName} class="user-picture">
    <div c>
        <div class="text-wrap">
            <div>{displayName}</div>
            <div>Member since: {createdAt.toDate().toISOString().split('T')[0]}</div>
        </div>
        <div class="text-wrap">
            <div>{description}</div>
            <div class="cta-text">View Profile &#8594</div>
        </div>
    </div>
</a>


<style>
    .user-card {
        display: block;
        margin-bottom: 20px;
        padding: 15px 30px;
        border-radius: 15px;
        box-shadow: 0px -2px 20px 0px rgba(0, 0, 0, 0.15);
        color: #000;
        text-decoration: none;
        transition-property: transform;
        transition-duration: 150ms;
        transition-timing-function: ease-in-out;
    }

    .user-card:hover {
        transform: translateY(-10px);
    }

    .user-picture {
        border-radius: 15px;
    }

    .text-wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 8px 0;
    }
    

</style>