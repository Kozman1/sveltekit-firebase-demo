<script context="module">
    import { getDocs, getFirestore, doc, collection } from "firebase/firestore";


    export const load = async ({ params }) => {
        
        const uid = params?.uid || null;
        const db = getFirestore();
        let posts = [];

        if(!uid) {
            return {
                status: 301,
                redirect: '/'
            }
        }
        try {
            const docRef = doc(db, 'users', uid);
            const collectionRef = collection(docRef, 'posts');
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach(doc => {
                posts.push({ ...doc.data(), id: doc.id });
            });
        }
        catch(error) {
            return {
                status: 500,
                error: new Error(error.message)
            }
        }

        return {
            props: {
                posts
            }
        }
    }
</script>

<script>
    import PostCard from '$lib/postCard.svelte';
    import { user } from '/src/app/stores/user.js';
    import { goto } from '$app/navigation';
    import { browser } from "$app/env";
    

    export let posts;
    // TODO: autogenerate id for posts

    $: {
        if(browser && !$user) goto('/');
    }
</script>

<container>
    <div class="post-row">
        <h3>Your posts:</h3>
        <a href="/posts/myPosts/create" class="button">Create post</a>
    </div>
    {#if posts.length > 0}
        {#each posts as post}
            <PostCard { ...post }/>
        {/each}
    {:else} 
            <p>Looks like you don't have any posts yet! click here to create one:</p>
            <a href="/posts/myPosts/create" class="button">Create post</a>
    {/if}
</container>

<style>

</style>
