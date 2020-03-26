import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RemindcardPage } from '../remindcard/remindcard';


declare var require: any;



/**
 * Generated class for the QrScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-scan',
  templateUrl: 'qr-scan.html',
})
export class QrScanPage {
  scanFormat: string;
  card_id: any;
  studentArray = [];
  term : any;
  term_id= [];
  qrId:any;
  data: Observable<any>;
  val : any;


  dateFormat = require('dateformat');
  date = this.dateFormat(new Date(), "yyyy-mm-dd");
  time = this.dateFormat(new Date(), "HH:MM:ss");

  


  constructor(public navCtrl: NavController, public navParams: NavParams,
             public http: HttpClient, private barcodeScanner: BarcodeScanner) {
    this.loadstudentcheckData();
   


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrScanPage');
  }


  loadstudentcheckData() {
       let url = "http://192.168.43.75/servicephp/gettm.php?";
    this.http.get(url).subscribe((data: any) => {
      this.term = data.term;
    }, (error) => { console.log(error) });
  }

  barcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.card_id = barcodeData.text;
        let url = 'http://192.168.43.75/servicephp/getqrcodescan.php?card_id=' +barcodeData.text;
      this.http.get(url).subscribe((data: any) => {
        this.studentArray = data.student;
       
        this.studentArray.forEach(element => {
          this.qrId = element.qrId
          this.card_id = element.card_id

        });
        console.log( this.qrId);
        console.log(this.studentArray);
      }, (error) => { console.log(error) });
      this.scanFormat = barcodeData.format;
    }).catch(err => {
      console.log('Error', err);
    });
  }


  showt(item){
   this.term.forEach(element =>   {
    if(item == element.term_id){
      this.term_id.push(element.term_id);
    }
  });
    console.log(this.term_id);
  }


  


  postJsonData() {
    let jsonData = { card_id: this.card_id, term_id:this.term_id, date: this.date, time: this.time, qrId: this.qrId }; //สร้าง obj
    console.log(jsonData);
    let url = 'http://192.168.43.75/servicephp/saverabsong.php'; 
    this.http.post(url, jsonData).subscribe((data: any) => {
      console.log(url);
      alert("บันทึกเรียบร้อยแล้ว");
      this.navCtrl.push(QrScanPage)
      console.log(data);
    }
    );
  }

 

  remind() {
        this.navCtrl.push(RemindcardPage)
}

}//end class
