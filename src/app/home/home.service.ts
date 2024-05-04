import { Injectable } from '@angular/core';
import { addDoc, collection,getFirestore, updateDoc, doc, deleteDoc, getDocs } from "firebase/firestore"
import { initializeApp } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { User, iUser } from './home.model';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  newList: iUser[] = []; 
  users: User = new User();
  isloading: boolean = false;
  constructor(private alert: AlertController) { }

  async getUsers():Promise<iUser[]>{
    const app = initializeApp(environment.firebaseConfig);
    const firestore = getFirestore(app);

    const users: User[] = [];

    const querySnapshot = await getDocs(collection(firestore, "users"));
    querySnapshot.forEach((doc) => {
      const user=doc.data() as User;
      user.id = doc.id;
      users.push(user); 
    });
    return users;
  }
  async tryAdd(user: User) {
    const app = initializeApp(environment.firebaseConfig);
    const firestore = getFirestore(app);

    try{
      const docRefM1 = await addDoc(collection(firestore, "users"), {
      title : user.title,
      record: user.record,
      singer: user.singer,
      rating: user.rating,
      });
      console.log("Doc written with ID:", docRefM1);
    }catch (e){
      console.error("error adding document:", e);
    }
  }

async tryUpdate(user:User) {
  const app = initializeApp(environment.firebaseConfig);
  const firestore = getFirestore(app);

  try{
    const docRef = doc(firestore, "users", user.id);
    await updateDoc(docRef, {title: user.title, record: user.record, singer: user.singer, rating:user.rating });
  }catch (e){
    console.error("error adding document:", e);
  }
}

async tryDelete(user:User){
  const app = initializeApp(environment.firebaseConfig);
  const firestore = getFirestore(app);

  try{
    const docRef = doc(firestore, "users", user.id);
    await deleteDoc(docRef);
  }catch(e){
    console.error("error adding document:", e);
  }
}

async presentAlert(header: string,message: string){
const alert =await this.alert.create({
  header: header,
  message: message,
  buttons: ['OK']
});
await alert.present();
}
  edit(user: iUser){
  this.users = user;
  }
}