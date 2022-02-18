<script context="module">
    import { getFirestore, query, collectionGroup, getDocs, getDoc, doc,  } from "firebase/firestore";


    export const load = async () => {
        const db = getFirestore();
        let posts = [];

        try {
            const postsQuery = query(collectionGroup(db, 'posts'));
            const querySnapshot = await getDocs(postsQuery);
            
            querySnapshot.forEach(doc => {
                 posts.push(doc.data());
            });
        }
        catch(error) {
            console.error(new Error(error.message));
            return {
                status: 400,
                error: error.message
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
    import { browser } from '$app/env';
    import { goto } from '$app/navigation';
    import { user } from '/src/app/stores/user.js';

    export let posts;

    $: {
        if(browser && !$user) goto('/');
    }

    const authors = {};
    const db = getFirestore();

    const getAuthor = async (authorID) => {  
        return new Promise(async (resolve, reject) => {
            if(authors?.authorID) resolve(authors[authorID]);
            let authorData;
            try {
                const docSnap = await getDoc(doc(db, 'users', authorID));
                if(docSnap.exists()) { 
                    authorData = docSnap.data(); 
                }
                else {
                    throw new Error('Could not retrieve author');
                }
            }
            catch(error) {
                reject(error.message);
            }

            authors[authorID] = authorData;
            resolve(authorData);
        });
    }

</script>


<container>
    {#each posts as post}
        {#await getAuthor(post.author)}
            <div></div>
        {:then author} 
            <PostCard { ...post } authorName={author.displayName}/>
        {/await}
    {/each}
</container>