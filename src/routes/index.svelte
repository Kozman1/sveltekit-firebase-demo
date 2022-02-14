<script>
    import { user } from '/src/app/stores/user.js';
</script>


<section>
    <container>
        <div class="homepage" >
            <h1>{!!$user ? `Hi, ${$user.displayName}!` : 'Homepage'}</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Exercitationem quasi ipsa pariatur, molestiae voluptates rem minus ex sed nemo sapiente, consectetur debitis laboriosam quidem laudantium odio illo. Qui aliquam laboriosam, itaque pariatur officia quas. Ratione cupiditate alias mollitia quasi, nobis, exercitationem doloribus deleniti dignissimos ducimus neque distinctio culpa officiis dolorum.</p>
        </div>
    </container>
</section>


<style>

    .homepage {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        text-align: center;
    }

    h1 {
        font-size: 13vw;
        line-height: 1.1em;
        margin-bottom: 40px;
        margin-top: 0px;
    }
    
    p {
        max-width: 600px;
        font-size: 24px;
        line-height: 1.1em;
    }

</style>





