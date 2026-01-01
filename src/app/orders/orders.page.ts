import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonBackButton, IonIcon, IonButton, 
  NavController, IonModal, ModalController, IonBadge, IonCard, IonCardContent, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, timeOutline, cartOutline, receiptOutline, starOutline } from 'ionicons/icons';
import { DataService, Order } from '../services/data'; 
import { RatingComponent } from '../components/rating/rating.component'; // Import komponen rating

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonBackButton, IonIcon, IonButton,
    IonModal, IonBadge, IonCard, IonCardContent, IonItem, IonLabel,
    CommonModule, FormsModule
  ]
})
export class OrdersPage implements OnInit {
  isModalOpen = false;
  selectedOrder: Order | null = null;

  constructor(
    public dataService: DataService, 
    private navCtrl: NavController,
    private modalCtrl: ModalController // Tambah ini
  ) {
    addIcons({ chevronBack, timeOutline, cartOutline, receiptOutline, starOutline });
  }

  ngOnInit() {}

  // FUNGSI UNTUK MEMBUKA MODAL RATING
  async openRatingModal(orderId: string) {
    const modal = await this.modalCtrl.create({
      component: RatingComponent,
      componentProps: { orderId: orderId }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        // Simpan review ke DataService
        this.dataService.submitReview(result.data);
        
        // Tandakan pesanan sudah dirating supaya butang hilang
        const order = this.dataService.orders.find(o => o.id === orderId);
        if (order) {
          (order as any).isRated = true; 
        }
      }
    });

    return await modal.present();
  }

  openDetails(order: Order) {
    this.selectedOrder = order;
    this.isModalOpen = true;
  }

  goBack() {
    this.navCtrl.navigateRoot('/customer');
  }
}