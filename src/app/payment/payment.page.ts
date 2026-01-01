import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, 
  IonButtons, IonBackButton, IonIcon, IonFooter, 
  NavController, ToastController,
  IonDatetime, IonDatetimeButton, IonModal 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, cashOutline, documentTextOutline, chevronBack } from 'ionicons/icons';
import { DataService, Order } from '../services/data';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonBackButton, IonIcon, IonFooter, 
    IonDatetime, IonDatetimeButton, IonModal, 
    CommonModule, FormsModule
  ]
})
export class PaymentPage implements OnInit {
  pickupOption: string = 'asap';
  paymentMethod: string = 'cash'; 

  // Variabel untuk menyimpan tarikh dan masa pilihan user
  scheduledDate: string = new Date().toISOString();
  scheduledTime: string = new Date().toISOString();

  // --- TAMBAHAN BARU UNTUK RANGE TARIKH ---
  minDate: string = new Date().toISOString(); // Paling awal: Hari ini
  maxDate: string = '2099-12-31T23:59:59';   // Paling lewat: Tahun 2099
  // ----------------------------------------

  constructor(
    public dataService: DataService, 
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    addIcons({ timeOutline, cashOutline, documentTextOutline, chevronBack });
  }

  ngOnInit() {
    if (this.dataService.cart.length === 0) {
      this.navCtrl.navigateRoot('/customer');
    }
  }

  get total() {
    return this.dataService.getCartTotal();
  }

  async confirmOrder() {
    if (this.dataService.cart.length === 0) return;

    let finalType = 'ASAP';
    let displayTime = '';

    // Logik untuk memproses masa jika user pilih "Schedule for Later"
    if (this.pickupOption === 'later') {
      const timeObj = new Date(this.scheduledTime);
      
      // Format masa ke 12-hour AM/PM (Contoh: 02:30 PM)
      const formattedTime = timeObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const dateObj = new Date(this.scheduledDate);
      const formattedDate = dateObj.toLocaleDateString('en-GB'); // Format DD/MM/YYYY

      finalType = 'SCHEDULED';
      displayTime = `${formattedDate} | ${formattedTime}`;
    }

    const newOrder: Order = {
      id: 'ORD' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      items: JSON.parse(JSON.stringify(this.dataService.cart)),
      total: this.total,
      date: new Date().toISOString(), 
      status: 'Pending',
      type: finalType, 
      customerName: this.dataService.currentUser?.name || 'Guest',
      isScheduled: this.pickupOption === 'later',
      scheduledTime: displayTime 
    };

    // Simpan ke DataService
    this.dataService.addOrder(newOrder);

    // Kosongkan bakul
    this.dataService.cart = []; 
    
    const toast = await this.toastCtrl.create({
      message: 'Order successfully placed!',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
    
    // Navigasi ke halaman utama customer
    this.navCtrl.navigateRoot('/customer');
  }
}