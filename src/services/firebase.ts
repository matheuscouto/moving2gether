import firebase from 'react-native-firebase';
import { Observable } from 'rxjs';
import moment from 'moment'

// OBSERVABLE EXAMPLE
export const authStateObservable: Observable<{ uid: string } | null> = new Observable((observer) => {
	return firebase.auth().onAuthStateChanged(
		(user: {uid: string } | null) => {
			observer.next(user ? { uid: user.uid } : null);
		},
	);
});

// UPDATE USER PASSWORD EXAMPLE
export const updateUserPassword = async (newPassword:string):Promise<void> => {
	const user = firebase.auth().currentUser
	if(user) { await user.updatePassword(newPassword) }
}

export const pinIdea = async (link: string, category: string, rate: number) => {
	const newPinKey = firebase.database().ref().child('posts').push().key;
	await firebase.database().ref(`/pins/${newPinKey}`).set({
		link,
		category,
		timestamp: moment().unix(),
		rate
	});
}