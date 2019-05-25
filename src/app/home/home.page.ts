import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, retry} from 'rxjs/operators';
import { throwError } from 'rxjs';
declare let toastr;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  public lastReq:boolean = true;

  constructor(private qrScanner: QRScanner, public changeDetector: ChangeDetectorRef, private http: HttpClient ) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  public ngOnInit():void{

    let interval = setInterval(()=>{
      if(this.lastReq == false){
        toastr.error("Server is not ok");
        this.currentState = "Server is not ok!";
      }
      this.lastReq = false;
      this.http.get(`http://${this.ip}:3000/check`, {responseType: 'text'}).pipe(
          catchError(this.handleError)
        ).
      subscribe((data)=>{
        this.lastReq = true;
        if(data != 'ok'){
          this.currentState = "Server is not ok!";
        }
       if(this.currentState == "Server is not ok!" && data == 'ok'){
          this.currentState = "Not scanning";
          toastr.success("Server is ok!");
        }
        if(data =='ok'){
          this.currentState = "Not scanning";
        }
    }, (err)=>{
          console.log("Server is not ok..");
          if(this.currentState == "Not scanning"){
            toastr.error("Server is not ok");
          }

          this.currentState = "Server is not ok!";
         
    })
  }, 6000);
  this.changeDetector.detectChanges();
  this.qrScanner.hide(); // hide camera preview
}

  public currentState:string = "Not scanning";
  public currentQR:string = "default";
  public serverResponse:string = "nothing";
  public ip = "192.168.0.234";


  public newIp():void{
    
    var retVal = prompt(`New ip:, current is ${this.ip}`);
    if(retVal)this.ip = retVal;
  }

  public scan():void{
    if(this.currentState != "Server is not ok!"){
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
           this.currentState = "Not scanning";
           this.http.get(`http://${this.ip}:3000/code/${text}`, {responseType: 'text'}).subscribe((data)=>{
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

}
