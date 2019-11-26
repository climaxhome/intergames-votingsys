import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-freshcodes',
  templateUrl: './freshcodes.page.html',
  styleUrls: ['./freshcodes.page.scss'],
})
export class FreshcodesPage implements OnInit {
  usedcount = 0;
  unusedcount = 0;
  codeauths = [];
  codeauthsall = [];
  LastestEntry: any;
  firstInResponse: any = [];
  lastInResponse: any = [];
  prev_strt_at: any = [];
  pagination_clicked_count = 0;
  disable_next: boolean = false;
  disable_prev: boolean = false;

  constructor(private afs: AngularFirestore, private authService : AuthService) {
   }
  
  loadCodeCount(){
    this.afs.collection('codecount').doc('set1').get().subscribe(res =>{
      this.usedcount = res.get('used');
      this.unusedcount = res.get('unused');
    })
  }

  loadAllCodes(){
    this.afs.collection(`codeauth`, q => q.orderBy('status','desc'))
    .snapshotChanges().subscribe(response => {
      if (!response.length){
        console.log('no data available');
        return false;
      }
      this.codeauthsall = [];
      response.forEach(a => {
        let codeauth:any = a.payload.doc.data();
        codeauth.id = a.payload.doc.id;
        this.codeauthsall.push(codeauth);
      });
    },error => {
    });
  }

  loadCodes(){
    this.afs.collection(`codeauth`, q => q.orderBy('status','desc').limit(5))
    .snapshotChanges().subscribe(response => {
      if (!response.length){
        console.log('no data available');
        return false;
      }
      this.codeauths = [];

      this.firstInResponse = response[0].payload.doc;
      this.lastInResponse = response[response.length - 1].payload.doc;
      response.forEach(a => {
        let codeauth:any = a.payload.doc.data();
        codeauth.id = a.payload.doc.id;
        this.codeauths.push(codeauth);
      });


      this.prev_strt_at = [];
      this.pagination_clicked_count = 0;
      this.disable_next = false;
      this.disable_prev = false;

      this.push_prev_startAt(this.firstInResponse);
    },error => {

    });
  }
  nextCode(){
    this.loadCodeCount();
    this.disable_next = true;
    this.afs.collection(`codeauth`, ref => ref
    .limit(5)
    .orderBy('status','desc')
    .startAfter(this.lastInResponse)
    ).get()
    .subscribe(response => {

      if(!response.docs.length){
        this.disable_next = true;
        return;
      }
      this.firstInResponse = response.docs[0];
      this.lastInResponse = response.docs[response.docs.length - 1];

      this.codeauths = [];
      
      response.forEach(a => {
        let codeauth:any = a.data();
        codeauth.id = a.id;
        this.codeauths.push(codeauth);
        console.log('next code success');
      });

      this.pagination_clicked_count++;

      this.push_prev_startAt(this.firstInResponse);
      
      this.disable_next = false;

    },error => {
      this.disable_next = false;
    });
  }
  previousCode(){
    this.loadCodeCount();
    this.disable_prev = true;
    this.afs.collection(`codeauth`, ref => ref
    .orderBy('status','desc')
    .startAt(this.get_prev_startAt())
    .endBefore(this.firstInResponse)
    .limit(5))
    .get().subscribe(response => {

      this.firstInResponse = response.docs[0];
      this.lastInResponse = response.docs[response.docs.length - 1];

      this.codeauths = [];
      response.forEach(a => {
        let codeauth:any = a.data();
        codeauth.id = a.id;
        this.codeauths.push(codeauth);
        console.log('prev code success');
      });

      this.pagination_clicked_count--;

      this.pop_prev_startAt(this.firstInResponse);

      this.disable_prev = false;
      this.disable_next = false;

    },error => {
      this.disable_prev = false;
    });
  }

  push_prev_startAt(prev_first_doc) {
    this.prev_strt_at.push(prev_first_doc);
  }

  get_prev_startAt() {
    if (this.prev_strt_at.length > (this.pagination_clicked_count + 1))
      this.prev_strt_at.splice(this.prev_strt_at.length - 2, this.prev_strt_at.length - 1);
    return this.prev_strt_at[this.pagination_clicked_count - 1];
  }

  pop_prev_startAt(prev_first_doc) {
    this.prev_strt_at.forEach(element => {
      if (prev_first_doc.data().id == element.data().id) {
        element = null;
      }
    });
  }

  ngOnInit() {
    this.loadCodes();
    this.loadAllCodes();
    this.loadCodeCount();
  }

}
