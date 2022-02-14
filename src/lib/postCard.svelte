<script>
    export let id, name, body, createdAt, author, authorName;

    console.log(authorName);
</script>

<a class="post" href={`/posts/${id}`}>
    <div class="date-text">{createdAt.toDate().toISOString().split('T')[0]}</div>
    <div class="post-row">
        <div class="post-name"><bold>{name} {#if !!authorName}<span>by <a class="author-link" href="/users/{author}">{authorName}</a></span>{/if}</bold></div>
        <div class="cta-text">Go to post &#8594</div>
    </div>
    <p class="post-body">{body}</p>
</a>


<style>
    .post {
        display: block;
        margin-top: 20px;
        padding: 15px 30px;
        border-radius: 15px;
        box-shadow: 0px -2px 20px 0px rgba(0, 0, 0, 0.15);
        color: #000;
        text-decoration: none;
        transition-property: transform;
        transition-duration: 150ms;
        transition-timing-function: ease-in-out;
    }

    .post:hover {
        transform: translateY(-10px);
    }

    .date-text {
        font-size: 12px;
    }

    .author-link {
        color: #ff3e00;
    }

    .post-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .post-body {
        font-size: 12px;
    }

</style>