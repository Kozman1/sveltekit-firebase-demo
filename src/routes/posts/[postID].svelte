<script context="module">
    import { collection, collectionGroup, getFirestore, doc, query, where, getDocs, getDoc } from "firebase/firestore";




    export const load = async ({ params }) => {
        
        const id = params.postID;
        const db = getFirestore();
        let postData;

        try {
            const postsQuery = query(collectionGroup(db, 'posts'), where('id', '==', `${id}`));
            const querySnapshot = await getDocs(postsQuery);
            
            querySnapshot.forEach(doc => {
                postData = doc.data();
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
                postData
            }
        }
    }
</script>

<script>
    import { browser } from '$app/env';
    import { goto } from '$app/navigation';
    import { user } from '/src/app/stores/user.js';

    export let postData;

    $: {
        if(browser && !$user) goto('/');
    }

    
</script>


<container>
    <div class="date" >{postData.createdAt.toDate().toISOString().split('T')[0]}</div>
    <h3>{postData.name}</h3>
    <p>{postData.body}</p>
</container>


<style>
    .date {
        font-size: 12px;
    }
</style>