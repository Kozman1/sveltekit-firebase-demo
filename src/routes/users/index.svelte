<script context="module">
    import UserListCard from '$lib/userListCard.svelte';
    import { get } from 'svelte/store';
    import { collection, getDocs, getFirestore } from 'firebase/firestore';

    

    export const load = async ({ fetch }) => {


        const db = getFirestore();
        let members = [];

        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            querySnapshot.forEach(doc => {
                members.push(doc.data());
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
                members 
            }
        }
    }
</script>


<script>
    import { goto } from '$app/navigation';
    import { browser } from '$app/env';
    import { user } from '/src/app/stores/user.js';
    import { onMount } from 'svelte';

    export let members;

    $: {
        if(browser && !$user) goto('/');
    }

    onMount(() => {
        members = [ ...members ].filter(member => member.uid !== $user.uid);
    });
</script>


<container>
    <h3>Other users:</h3>
    <div class="users-list">
        {#each members as member}
            <UserListCard { ...member }/>
        {/each}
    </div>
</container>


<style>

</style>