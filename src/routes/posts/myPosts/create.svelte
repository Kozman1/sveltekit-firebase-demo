<script context="module">

</script>

<script>
    import { fly } from 'svelte/transition';
    import { backInOut } from 'svelte/easing';
    import { goto } from "$app/navigation";
    import { getFirestore, setDoc, collection, doc, serverTimestamp } from "firebase/firestore";
    import { user } from '/src/app/stores/user.js';


    const db = getFirestore();
    let isUpdating = false;
    let postData = {
        name: '',
        body: '',
    }
    let showWarning,
        warningText;

    const toggleWarning = (show, text) => {
        showWarning = show;
        warningText = text;
    };

    const createPost = async () => {
        isUpdating = true;
        if(
           postData.name.length < 3
        ) {
            isUpdating = false;
            toggleWarning(true, 'Name is too short');
            return;
        }
        if(
           postData.body.length < 5
        ) {
            isUpdating = false;
            toggleWarning(true, 'Body is too short');
            return;
        }
        postData.createdAt = serverTimestamp();
        try {
            const userRef = doc(db, 'users', $user.uid);
            const collectionRef = collection(userRef, 'posts');
            const docRef = doc(collectionRef);
            await setDoc(
                docRef, 
                {
                    ...postData, 
                    id: docRef.id
                },
                { merge: true }
            );
        }
        catch(error) {
            return console.error(new Error(error.message));
        }
        isUpdating = false;
        goto('/posts/myPosts');
    }
</script>



<container class="post">
    <h3>CREATE POST:</h3>
    <label for="name">Name:*</label>
    <input 
        bind:value={postData.name} 
        disabled={isUpdating}
        type="text" 
        name="name"
    />
    <label for="body">Body:*</label>
    <textarea 
        bind:value={postData.body}
        disabled={isUpdating}
        name="body" 
        cols="30" 
        rows="10"
    />
    <input 
        on:click={createPost} 
        disabled={isUpdating}
        class="button" 
        type="submit" 
        value={isUpdating ? 'Creating...' : 'Create'}
    />

    {#if showWarning}
    <div 
        on:click={toggleWarning.bind(null, false, '')} 
        transition:fly={{duration: 250, easing: backInOut}}
        class="warning"
    >
        {warningText}
    </div>
    {/if}
</container>


<style>
    .post {
        display: flex;
        flex-direction: column;
    }
    
    input, textarea {
        margin-top: 15px;
    }
</style>