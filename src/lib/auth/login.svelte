<script context="module">
</script>

<script>
    import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
    import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
    import { user } from '/src/app/stores/user.js';
    import { auth } from '/src/app/stores/auth.js';
    
    
    const db = getFirestore();
    const provider = new GoogleAuthProvider();

    const createUserDoc = async () => {
        const docRef = await setDoc(doc(db, 'users', `${$user.uid}`), {
            displayName: $user.displayName,
            email: $user.email,
            photoURL: $user.photoURL,
            bio: '',
            uid: $user.uid,
            friends: [],
            createdAt: serverTimestamp()
        }, { merge: true });
    }

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup($auth, provider);
            await createUserDoc();
        }
        catch(error) {
            console.error(new Error(error));
        }
    }

</script>

{#if !$user}
    <div on:click={loginWithGoogle}>
        <slot/>
    </div>
{/if}


