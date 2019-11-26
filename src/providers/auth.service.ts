import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth'
import { AlertService } from './alert.service';
import { User } from 'firebase';
import { switchMap } from 'rxjs/operators'; 

@Injectable({providedIn:'root'})
export class AuthService {
 
  authState = new BehaviorSubject(false);
  user$ : Observable<User>;
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private alertService: AlertService,
    private afAuth : AngularFireAuth){
      
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if(user){
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          }else{
            return of(null);
          } 
        }) 
      )
    }

  login(password:string) {
    //this.loginEmail('admin@gmail.com',password);
    if(!password){
      this.alertService.inputEmptyAlert();
    }else{
      this.alertService.presentLoading();
      this.afs.collection('freshcodepw').doc('pw1').get().subscribe( data =>{
          if(data.get('password') == password){
              this.router.navigate(['freshcodes']);
              this.authState.next(true);
              this.alertService.dismissLd();
          }else{
              this.alertService.pwInvalidAlert();
          }
      })
    }
  }
 
  logout() {
    this.authState.next(false);
  }
 
  isAuthenticated() {
    return this.authState.value;
  }
 
  async loginEmail(email: string, password: string) {
    var result = await this.afAuth.auth.signInWithEmailAndPassword(email, password)
  }
  async logoutEmail(){
    await this.afAuth.auth.signOut();
}
}