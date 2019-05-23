import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { HomePage } from './home.page';
import { HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    HttpClientModule
  ],
  declarations: [HomePage],
  providers:[QRScanner]
})
export class HomePageModule {}
