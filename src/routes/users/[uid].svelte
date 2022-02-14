<script context="module">
    import { writeBatch, arrayUnion, doc, getDoc, getFirestore, setDoc, updateDoc, arrayRemove } from 'firebase/firestore';
    
    

    export const load = async ({ params }) => {
        
        const db = getFirestore();
        const uid = params.uid;
        let userDataSnapshot;

        try {
            const docSnap = await getDoc(doc(db, 'users', uid));
            if(docSnap.exists()) { 
                userDataSnapshot = docSnap.data(); 
            }
            else {
                throw new Error(`Can't access document data`);
            }
        }
        catch(error) {
            console.error(new Error(error.message));
            return {
                status: 500,
                error: error.message
            }
        }

        return {
            props: {
                userDataSnapshot
            },
        };
    };
</script>

<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { backInOut } from 'svelte/easing';
    import { browser } from '$app/env';
    import { updateProfile } from "firebase/auth";
    import { user } from "/src/app/stores/user.js";
    import { auth } from "/src/app/stores/auth.js";
    import { goto } from '$app/navigation';

    export let userDataSnapshot;
    $: {
        if(browser && !$user) goto('/');
    }
    
    const db = getFirestore();    
    let isUsersProfile = false;
    
    let userData = { ...userDataSnapshot };
    let warningText,
        showWarning = false,
        isUpdating = false;
    
    $: friendsNumber = userData.friends.length

    onMount(() => {
        isUsersProfile = $user?.uid === userData.uid;
    });

    const toggleWarning = (show, text) => {
        showWarning = show;
        warningText = text;
    };

    const updateUserProfile = async () => {
        isUpdating = true;
        if(
            JSON.stringify(userData) === JSON.stringify(userDataSnapshot)
        ) {
            isUpdating = false;
            toggleWarning(true, 'No user information was updated');
            return;
        }
        if(
           userData.displayName.length < 3
        ) {
            isUpdating = false;
            toggleWarning(true, 'Name is too short');
            return;
        }
        if(!isUsersProfile) {
            isUpdating = false;
            toggleWarning(true, `You don't have permissions to edit this profile`);
            return;
        }

        try {
            await Promise.all([
                updateProfile($auth.currentUser, { displayName: userData.displayName }),
                setDoc(doc(db, 'users', `${$user.uid}`), userData, { merge: true})
            ]);
        }
        catch(error) {
            return console.error(new Error(error.message));
        }
        userDataSnapshot = { ...userData };
        user.set({ ...userData });
        isUpdating = false;
        
    };

    // TODO: move addFriend and remove Friend to a seperate file
    // TODO: add removeFriend
    const addFriend = async () => {
        isUpdating = true;
        let updatedUserData;
        if(isUsersProfile) {
            isUpdating = false;
            toggleWarning(true, `You don't have permissions to edit this profile`);
            return;
        }
        if(userData.friends?.includes(userData.uid)) {
            isUpdating = false;
            toggleWarning(true, `This user is already added as a friend`);
            return;
        }
        try {
                const batch = writeBatch(db);
                batch.update(doc(db, 'users', `${userData.uid}`), { friends: arrayUnion($user.uid) });
                batch.update(doc(db, 'users', `${$user.uid}`), { friends: arrayUnion(userData.uid) });
                await batch.commit();
                const docSnap = await getDoc(doc(db, 'users', `${userData.uid}`));
                if(!docSnap.exists()) throw new Error(`Profile doesn't exist!`);
                updatedUserData = docSnap.data();
        }
        catch(error) {
            return console.error(new Error(error.message));
        }
        userData = { ...updatedUserData };
        isUpdating = false;
    }

    const removeFriend = async () => {
        isUpdating = true;
        let updatedUserData;
        if(isUsersProfile) {
            isUpdating = false;
            toggleWarning(true, `You don't have permissions to edit this profile`);
            return;
        }
        if(userData.friends?.includes(userData.uid)) {
            isUpdating = false;
            toggleWarning(true, `You are not friends with this user yet!`);
            return;
        }
        try {
                const batch = writeBatch(db);
                batch.update(doc(db, 'users', `${userData.uid}`), { friends: arrayRemove($user.uid) });
                batch.update(doc(db, 'users', `${$user.uid}`), { friends: arrayRemove(userData.uid) });
                await batch.commit();
                const docSnap = await getDoc(doc(db, 'users', `${userData.uid}`));
                if(!docSnap.exists()) throw new Error(`Profile doesn't exist!`);
                updatedUserData = docSnap.data();
        }
        catch(error) {
            return console.error(new Error(error.message));
        }
        userData = { ...updatedUserData };
        isUpdating = false;
    }

    const getFriendsSuffix = (number) => {
        let result;
        switch(number) {
            case 0:
                result = '';
                break;
            case 1:
                result = 'user';
                break;
            default:
                result = 'people';
                break;
        }
        return result;
    }

</script>

<container class="profile">
    <div class="row">
        <img src={userData.photoURL} alt="user" class="profile__image"/>
        {#if 
            browser && 
            !isUsersProfile &&
            !userData.friends.includes($user.uid)
        }
            <button 
                on:click={addFriend}
                disabled={isUpdating}
                class="button"
            >
                {isUpdating ? 'Updating...' : 'Add friend'}
            </button>
        {:else if 
            browser && 
            !isUsersProfile && 
            userData.friends.includes($user.uid)
        }
            <button 
                on:click={removeFriend}
                disabled={isUpdating}
                class="button"
            >
                Remove friend
            </button>
        {/if}
    </div>
    {#if !isUsersProfile} 
        <div>
            This user is friends with {friendsNumber || 'no one, be first!'} {getFriendsSuffix(friendsNumber)}
        </div>
    {/if}

    <input 
        bind:value={userData.displayName} 
        disabled={!isUsersProfile || isUpdating} 
        type="text" 
        name="user-name" 
        placeholder="Full name"
    />
    <input 
        bind:value={userData.description} 
        disabled={!isUsersProfile || isUpdating} 
        type="text" name="user-description" 
        placeholder="Short description"
    />
    {#if isUsersProfile}
        <input 
            on:click={updateUserProfile}
            value={isUpdating ? 'Updating...' : 'Update'}
            class="button"
            type="submit" 
            name="submit"
        /> 
    {/if}
    

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
    .profile {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .profile__image {
        width: 150px;
        height: 150px;
        margin-bottom: 50px;
        border-radius: 15%;
        object-fit: cover;
        object-position: 50% 50%;
    }

</style>
