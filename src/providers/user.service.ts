import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertService } from './alert.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ThrowStmt } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(
        private router: Router,
        private afs: AngularFirestore,
        private alertService: AlertService,
        private authService: AuthService
    ) { }
    userData: any;
    student_id:string;
    inputid(id_string: string) {
        this.userData = { id: id_string }
        this.setUserData(this.userData);
        this.alertService.presentLoading();
        this.afs.collection(`users`).doc(id_string).get() //check with firestore database that this id have been created or not
            .toPromise()
            .then(doc => {
                if (!doc.exists) {
                    console.log('ID not registered');
                    this.student_id = id_string;
                    this.authService.setIdState(true);
                    this.router.navigate(["/register"]); //redirect to register page
                    this.alertService.dismissLd();
                }else {
                    console.log('Document Data: ', doc.data());
                    this.userData = doc.data();
                    this.setUserData(doc.data());
                    this.authService.setIdState(true);
                    this.authService.setDataState(true);
                    this.router.navigate(["/registered"]);
                    this.alertService.dismissLd();
                }
            })
            .catch(err => {
                console.log('Error', err);
            })
    }

    submitUserData(data: any) {
        this.userData = data;
        this.userData.id = this.student_id;
        this.afs.collection(`users`).doc(this.student_id)
            .set(this.userData)
            .then(() => {
                this.afs.collection('codeauth').doc(this.student_id).set({
                    code : this.student_id,
                    recordedTime : new Date(),
                    status : 1
                }).catch(err => {
                    console.log('error', err);
                })
                this.setUserData(this.userData);
                this.authService.setDataState(true);
                this.router.navigate(['/registered']);
            })
            .catch(err => {
                console.log('error', err);
            });
    }
    setUserData(data: any) {
        localStorage.setItem('userData', JSON.stringify(data));
    }
    clearUserData() {
        localStorage.clear();
    }
    getUserData(): any {
        //return JSON.parse(localStorage.getItem('userData'));
        return this.student_id;
    }
    getStudentID(): string {
        return this.getUserData().id;
    }
}

