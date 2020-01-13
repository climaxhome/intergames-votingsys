import { Injectable } from "@angular/core";
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({providedIn:'root'})
export class AlertService{
    constructor(public alertController: AlertController,
                public loadingController: LoadingController,
                ){}

  async presentLoading(){
    const loading = await this.loadingController.create({
      message: "please wait...",
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
  async voteFalse(){
    this.loadingController.dismiss();
    const alert = await this.alertController.create({
      message: "Invalid code. Please try again.",
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result)
  }
  async voteTrue(){
    this.loadingController.dismiss();
    const alert = await this.alertController.create({
      message: 'Vote Successful!',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result)
  }
  async inputEmptyAlert(){
    const alert = await this.alertController.create({
      message: 'Input cannot be empty!',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result)
  }
  async alertMessage(msg:string){
    const alert = await this.alertController.create({
      message: msg,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result)
  }
  async pwInvalidAlert(){
    this.loadingController.dismiss();
    const alert = await this.alertController.create({
      message: 'Password Invalid!',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result)
  }
  dismissLd(){
    this.loadingController.dismiss();
  }
}