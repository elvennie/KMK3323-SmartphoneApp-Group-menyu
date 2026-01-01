import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonButton, IonIcon, NavController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, person, timeOutline, personOutline } from 'ionicons/icons';
import { DataService } from '../services/data';

@Component({
  selector: 'app-vendor-orders',
  templateUrl: './vendor-orders.page.html',
  styleUrls: ['./vendor-orders.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonButton, IonIcon, CommonModule, FormsModule
  ]
})
export class VendorOrdersPage {
  orderTab: string = 'active';

  constructor(
    public dataService: DataService,
    private navCtrl: NavController
  ) {
    addIcons({ arrowBackOutline, person, timeOutline, personOutline });
  }

  goBack() {
    this.navCtrl.back();
  }

  // Fungsi untuk menukar status pesanan
  updateStatus(order: any, nextStatus: string) {
    order.status = nextStatus;
    console.log(`Order #${order.id} status updated to: ${nextStatus}`);
  }
}