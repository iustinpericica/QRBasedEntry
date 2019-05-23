import { Component, ChangeDetectorRef } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private qrScanner: QRScanner, public changeDetector: ChangeDetectorRef, private http: HttpClient ) { }

  public currentState:string = "Not scanning";
  public currentQR:string = "default";
  public serverResponse:string = "nothing";

  public scan():void{
    
    this.currentState = "Scanning..";
    this.currentQR = "default";
    this.serverResponse = "Waiting";

    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
       if (status.authorized) {
         // camera permission was granted
        
         // start scanning
         let scanSub = this.qrScanner.scan().subscribe((text: string) => {
           console.log('Scanned something', text);
           this.currentState = "Not scanning..";
           this.http.get(`http://192.168.0.234:3000/code/${text}`, {responseType: 'text'}).subscribe((data)=>{
             console.log('data ', data);
             if(data == 'used' || data == 'wrong'){
               console.log('WRONG');
               this.serverResponse = data;
               this.currentQR = "red";
             }
             else if(data == 'ok'){
               console.log('OK!');
               this.serverResponse = 'OK';
               this.currentQR = "green";
             }
             this.changeDetector.detectChanges();
           })
           this.changeDetector.detectChanges();
           this.qrScanner.hide(); // hide camera preview
           scanSub.unsubscribe(); // stop scanning
         });
  
       } else if (status.denied) {

       } else {
       }
    })
    .catch((e: any) => console.log('Error is', e));
            
  }

}
