<script context="module">
    import { browser } from '$app/env';
    import { get } from 'svelte/store';
    import initFirebase from '/src/app/firebase/initialize-firebase.js';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { auth } from '/src/app/stores/auth.js';
    import { user } from '/src/app/stores/user.js';

    
    
    export const load = async ({ fetch }) => {
        try {
            await initFirebase();
        } 
        catch(error) {
            return {
                status: 500,
                error: new Error(error.message)
            }
        }
        
        if(browser) {
            auth.set(getAuth());
            onAuthStateChanged(get(auth), userData => {
                if(userData) {
                    user.set(userData);
                }
                else {
                    user.set(null);
                }
            });
        }

        return {
            props: {}
        }
    }
</script>

<script>
    import Header from '$lib/header.svelte';
    import Footer from '$lib/footer.svelte';
    import '../styles/global.css';


    
</script>

<Header/>
<slot/>
<Footer/>








