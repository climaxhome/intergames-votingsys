import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertService } from '../../providers/alert.service';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

  constructor(
    private bcScanner : BarcodeScanner,
    private alertService : AlertService,
    private afs : AngularFirestore
  ) { }

  ngOnInit() {
  }

  scan(){
    this.bcScanner.scan().then(bcData => {
      const docRef = this.afs.collection('codeauth').doc(bcData.text); 
      this.alertService.alertMessage(String(bcData.text));
      docRef.get().subscribe(doc=>{
        if(doc.exists){
          this.alertService.alertMessage('code already scanned!');
        }else{
          docRef.set({
            code : doc.data().text,
            status : 1
          }).then(()=>{
            this.alertService.alertMessage(doc.data().text+' is successfully recorded to the database!');
          }).catch(err=>{
            this.alertService.alertMessage("error "+err);
          });
        }
      });
    }).catch(err=>{
      this.alertService.alertMessage('error '+err);
    });
  }
}
