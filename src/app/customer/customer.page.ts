import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataService, MenuItem, Review } from '../services/data'; 
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, 
  IonButton, IonIcon, IonContent, IonRow, 
  IonCol, IonCard, IonItem, IonThumbnail, IonLabel,
  IonSegment, IonSegmentButton, ModalController, NavController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, cartOutline, timeOutline, 
  globeOutline, starOutline, receiptOutline 
} from 'ionicons/icons';
import { AddonModalPage } from '../addon-modal/addon-modal.page'; 

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, 
    IonButtons, IonButton, IonIcon, IonContent, IonRow, 
    IonCol, IonCard, IonItem, IonThumbnail, IonLabel,
    IonSegment, IonSegmentButton
  ]
})
export class CustomerPage implements OnInit {
  public filteredMenu: MenuItem[] = [];
  
  public categories: string[] = [
    'All', 'Nasi', 'Nasi Padang Ayam', 'Nasi Padang Keli', 
    'Nasi Padang Tilapia', 'Nasi Padang Ikan', 'Nasi Padang Pak Lek', 'Add On'
  ];

  constructor(
    public dataService: DataService, 
    private router: Router,
    private navCtrl: NavController, // Tambah ini untuk navigasi
    private modalCtrl: ModalController 
  ) {
    // Pastikan receiptOutline ditambah di sini
    addIcons({ 
      logOutOutline, cartOutline, timeOutline, 
      globeOutline, starOutline, receiptOutline 
    });
  }

  ngOnInit() {
    this.filteredMenu = [...this.dataService.menuItems];
  }

  // --- FUNGSI NAVIGASI YANG BARU DITAMBAH ---

  goToCart() {
    console.log('Navigating to Cart...');
    this.navCtrl.navigateForward('/cart');
  }

  goToOrders() {
    console.log('Navigating to Customer Orders...');
    this.navCtrl.navigateForward('/customer-orders');
  }

  // --- FUNGSI SEDIA ADA ---

  async openAddon(item: MenuItem) {
    const modal = await this.modalCtrl.create({
      component: AddonModalPage,
      componentProps: { item: item },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95,
      handle: true
    });
    return await modal.present();
  }

  filterByCategory(ev: any) {
    const category = ev.detail.value;
    if (category === 'All') {
      this.filteredMenu = [...this.dataService.menuItems];
    } else {
      this.filteredMenu = this.dataService.menuItems.filter((item: MenuItem) => item.category === category);
    }
  }

  onLogout() {
    this.dataService.logoutUser();
    this.navCtrl.navigateRoot('/home'); // Gunakan navigateRoot untuk logout
  }

  async presentRateModal(orderId: string) {
    console.log('Buka modal rating untuk:', orderId);
    // Logic modal rating anda di sini...
  }

  submitRating(orderId: string, rating: number, comment: string) {
    const newReview: Review = {
      orderId: orderId,
      customerName: this.dataService.currentUser?.name || 'Customer',
      rating: rating,
      comment: comment,
      date: new Date().toISOString()
    };
    this.dataService.submitReview(newReview);
  }
}