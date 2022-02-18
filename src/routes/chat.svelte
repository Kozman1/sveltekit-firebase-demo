<script context="module">

    // export const load = async () => {

    // }
</script>

<script>
    import { fly } from 'svelte/transition';
    import { backInOut } from 'svelte/easing';
    import { doc, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, collection, getDoc, addDoc } from "firebase/firestore";
    import { onDestroy, onMount } from "svelte";
    import { goto } from '$app/navigation';
    import { browser } from '$app/env';
    import { user } from '/src/app/stores/user.js';
    
    const db = getFirestore();
    
    $: {
        if(browser && !$user) goto('/');
    }

    let unsubscribe = () => {},   
        messageText = '',
        warningText = '',
        messages = [],
        showWarning = false,
        isUpdating = false,
        authors = {};


    const toggleWarning = (show, text) => {
        showWarning = show;
        warningText = text;
    };

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
                console.error(error.message);
            }
            authors[authorID] = authorData;
            resolve(authorData);
        });
    }

    const sendMessage = async () => {
        isUpdating = true;
        let data, profileData;
        if(messageText.length < 1) {
            isUpdating = false;
            toggleWarning(true, `Can't send empty message`);
            return;
        }
        

        try {
            data = {
                body: messageText,
                authorUID: $user.uid,
                createdAt: serverTimestamp(),
            }
            await addDoc(collection(db, 'globalChat'), data);
            profileData = await getAuthor($user.uid);
        }
        catch(error) {
            isUpdating = false;
            console.error(error.message);
            return;
        }
        messageText = '';

        isUpdating = false;
    }

    onMount(async () => {
        try {
            const q = query(collection(db, 'globalChat'), orderBy('createdAt'), limit(50));

            unsubscribe = onSnapshot(q, async querySnapshot => {
                let temp = [];
                for(const doc of querySnapshot.docs) {
                    let profileData = await getAuthor(doc.data().authorUID);
                    temp.push({
                            ...doc.data(), 
                            author: { 
                                displayName: profileData.displayName, 
                                photoURL: profileData.photoURL,
                                uid: profileData.uid
                            }
                    });
                }
                messages = [ ...temp ];
            });
           
        }
        catch(error) {
            console.error(error);
        }
    });

    onDestroy(unsubscribe);
</script>

<container>
    <main>
        {#if showWarning}
            <div 
                on:click={toggleWarning.bind(null, false, '')} 
                transition:fly={{duration: 250, easing: backInOut}}
                class="warning"
            >
                {warningText}
            </div>
        {/if}
        <div class="chat">
            <div class="chat-mask">
                {#each messages as message}
                    <div class="message-wrap" class:current={$user?.uid === message.author.uid}>
                        {#if $user?.uid !== message.author.uid}
                            <a href="/users/{message.author.uid}">
                                <img src={message.author.photoURL} alt="user avatar" class="chat-avatar">
                            </a>                           
                        {/if}

                        <div class="message-content" >
                            <div class="message-bubble">
                                <div class="message-text">
                                    <div class="username">{message.author.displayName}</div>
                                    {message.body}
                                    <div class="message-row">
                                        <!-- TODO: show if message viewed: <div class="message-support-text">&#10003&#10003</div> -->
                                        <!-- TODO: replace this date parser abomination with something that makes sense -->
                                        {#if message.createdAt?.toDate}
                                            <div class="message-support-text">{
                                                `${message.createdAt.toDate().getHours().toString().padStart(2, '0')}:${(message.createdAt.toDate().getMinutes().toString().padStart(2, '0'))}`
                                            }</div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>       
                {/each} 
            </div>
            <div class="input-wrap">
                <input 
                    bind:value={messageText}
                    disabled={isUpdating}
                    type="text" 
                    name="message" 
                    placeholder="Type something here..."/>
                <input 
                    on:click={sendMessage}
                    disabled={isUpdating}
                    class="button" 
                    type="submit" 
                    value={isUpdating ? 'Sending...' : 'Send'}
                />
            </div>
        </div>
    </main>

</container>

<style>
    container {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    main {
        display: flex;
    }

    .chat {
        width: 60vw;
        max-width: 600px;
        min-height: 90vh;
        max-height: 550px;
        background-color: rgb(103, 103, 120);
    }

    .chat-mask {
        box-sizing: border-box;
        height: calc(100% - 40px);
        display: flex;
        flex-direction: column;
        overflow: scroll;
        padding: 30px 15px;
    }

    .chat-avatar {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        border-radius: 10px;
        object-fit: cover;
        object-position: 50% 50%;
    }

    .username {
        font-size: 8px;
        text-transform: uppercase;
        color: #ff3e00;
    }

    .message-wrap {
        display: flex;
        flex-direction: row;
        margin-top: 15px;
        padding-right: 35%;
    }

    .message-wrap.current {
        padding-right: 0%;
        justify-content: flex-end;
    }

    .message-bubble {
        display: flex;
        flex-direction: row;
        flex-grow: 0;
        flex-shrink: 1;
        flex-basis: auto;
        align-items: flex-start;
        justify-content: space-between;
        padding: 10px 15px;
        border-radius: 10px;
        background-color: #fff;
    }

    .current .message-bubble {
        background-color: #afc7dc;
    }

    .message-row {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .message-support-text {
        margin-left: 10px;
        font-size: 8px;
        color: rgb(103, 103, 120);
        text-transform: uppercase;
    }

    .input-wrap {
        width: 100%;
        display: flex;
    }
    
    input {
        margin: 0px;
        flex-grow: 1;
        flex-shrink: 0;
    }
</style>