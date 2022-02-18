<script>
    import { doc, getDoc, getFirestore } from "firebase/firestore";



    let firestoreData,
        airtableData,
        firestoreTime,
        airtableTime,
        firestoreAvgTime = 0,
        airtableAvgTime = 0,
        isUpdating = false;

    let firestoreRequests = [];
    let airtableRequests = [];

    $: firestoreRequests = !!firestoreRequests[0] ? [ ...firestoreRequests, firestoreTime] : [firestoreTime];
    $: airtableRequests = !!airtableRequests[0] ? [ ...airtableRequests, airtableTime] : [airtableTime];

    $: {
        if (firestoreRequests) {
            console.log(firestoreRequests);
            firestoreAvgTime = Math.round(firestoreRequests.reduce((prev, curr) => prev + curr, 0) / firestoreRequests.length);
        };
    }

    $: {
        if (airtableRequests) {
            airtableAvgTime = Math.round(airtableRequests.reduce((prev, curr) => prev + curr, 0) / airtableRequests.length);
        };
    }



    const getFirestoreData = async () => {
        const startTime = performance.now();
        isUpdating = true
        
        const db = getFirestore();
        const docRef = doc(db, 'comparison', 'testData');
        let docSnap;
        try {
            docSnap = await getDoc(docRef);
            if(!docSnap.exists()) {
                throw new Error("Doc doesn't exist!");
            }
        }
        catch(error) {
            isUpdating = false;
            console.error(error);
            return;
        }

        firestoreData = docSnap.data();
        const endTime = performance.now();
        firestoreTime = Math.round(endTime - startTime);
        isUpdating = false;
    }

    const getAirtableData = async () => {
        const startTime = performance.now();
        isUpdating = true;

        try {
            let result = await (await fetch('https://kozman.api.stdlib.com/airtable-comparison-connector@dev/')).json();
            airtableData = result.fields;
        }
        catch(error) {
            isUpdating = false;
            console.error(error.message);
            return;
        }
        isUpdating = false;
        const endTime = performance.now();
        airtableTime = Math.round(endTime - startTime);
    }

</script>




<container>
    <h1>Firebase vs Airtable</h1>
    <h3>Click button to fetch data(same data for both dbs) and see time it takes to do it</h3>
    <main>
        <div class="column">
            <h4>Firebase</h4>
            {#if firestoreData && firestoreTime}
                <ul>
                    <li>First Name: {firestoreData.firstName}</li>
                    <li>Last Name: {firestoreData.lastName}</li>
                    <li>Age: {firestoreData.age}</li>
                </ul>
                <div class="time">Request Time: {firestoreTime} ms</div>
                <div class="time">Average Time: {firestoreAvgTime} ms</div>
            {/if}
            <button 
                on:click={getFirestoreData} 
                disabled={isUpdating}
                class="button"
            >
                {isUpdating ? 'Updating...' : 'Fetch From Firestore'}
            </button>
        </div>
        <div class="column">
            <h4>Airtable</h4>
            {#if airtableData && airtableTime}
            <ul>
                <li>First Name: {airtableData.firstName}</li>
                <li>Last Name: {airtableData.lastName}</li>
                <li>Age: {airtableData.age}</li>
            </ul>
                <div class="time">Request Time: {airtableTime} ms</div>
                <div class="time">Average Time: {airtableAvgTime} ms</div>
            {/if}
            <button 
                on:click={getAirtableData} 
                disabled={isUpdating}
                class="button"
            >
                {isUpdating ? 'Updating...' : 'Fetch From Airtable'}
            </button>
        </div>
    </main>
</container>


<style>
    main {
        display: flex;
        
    }

    .column {
        width: 50%;
        padding-right: 20px;
    }
</style>

