import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
@Injectable({
	providedIn: 'root'
})
export class FirebaseService {
	public userData = JSON.parse(sessionStorage.getItem("userData"));
	constructor(private db: AngularFirestore) {
	}
    addNotification(param){
        console.log(param)
        return this.db.collection(param['path']).doc(param['content_id']).set(param['data']);
    }
	getNotifications(param){
        console.log(param)
        let collection = this.db.collection(param['path'], ref => ref.where("role_id", "==", param['role_id']));
        return collection.valueChanges();
    }
    deleteNotification(param){
        this.db.doc(param['path']).delete();
    }
}
