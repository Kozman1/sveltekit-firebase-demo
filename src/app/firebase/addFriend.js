

export const addFriend = async () => {

    if(userData.friends?.includes($user.uid)) {
        isUpdating = false;
        toggleWarning(true, `This user is already added as a friend`);
        return;
    }
    try {
            const batch = writeBatch(db);
            batch.update(doc(db, 'users', `${userData.uid}`), { friends: arrayUnion($user.uid) });
            batch.update(doc(db, 'users', `${$user.uid}`), { friends: arrayUnion(userData.uid) });
            await batch.commit();

    }
    catch(error) {
        return console.error(new Error(error.message));
    }
}


isUpdating = true;
let updatedUserData;

if(isUsersProfile) {
    isUpdating = false;
    toggleWarning(true, `You don't have permissions to edit this profile`);
    return;
}


const docSnap = await getDoc(doc(db, 'users', `${userData.uid}`));
if(!docSnap.exists()) throw new Error(`Profile doesn't exist!`);
updatedUserData = docSnap.data();


userData = { ...updatedUserData };
isUpdating = false;