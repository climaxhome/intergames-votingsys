import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
//import { CodeProvider } from '../../providers/code'; HEEEROKU
import { LoadingController } from '@ionic/angular';
import { VoteService } from '../../providers/vote.service';
import { AlertService } from '../../providers/alert.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  name: string;
  status: number;
  constructor(//public codeProvider : CodeProvider, HEEROKU
    public alertController: AlertController,
    public loadingController: LoadingController,
    public voteService: VoteService,
    public alsv: AlertService,
    private router: Router
    ){
  }
  async voteAlert(name:string){
    const alert = await this.alertController.create({
      header: 'Input Your Code',
      inputs: [{
          name: 'code',
          type: 'text',
          placeholder: 'ex. 1234ABCD'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Vote',
          handler: data => {
            if(!data.code){
              this.alsv.inputEmptyAlert();
            }else{
              this.vote(name,String(data.code));
            }
            console.log('Vote clicked');
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result)
  }
  vote(name:string,code:string){
    this.voteService.vote(name,code);
  }
  goToScanner(){
    this.router.navigate(['scanner']);
  }
}
