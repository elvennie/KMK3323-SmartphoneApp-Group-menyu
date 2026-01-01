import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, timeOutline, personOutline, 
  receiptOutline, restaurantOutline, listOutline,
  addOutline, createOutline, trashOutline, arrowBackOutline, star
} from 'ionicons/icons';
import { DataService } from '../services/data'; 

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VendorPage implements OnInit {
  currentView: string = 'dashboard'; 
  orderTab: string = 'active';
  vendorStats: any = {}; 

  constructor(
    public dataService: DataService, 
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    addIcons({ 
      logOutOutline, timeOutline, personOutline, 
      receiptOutline, restaurantOutline, listOutline,
      addOutline, createOutline, trashOutline, arrowBackOutline, star
    });
  }

  ngOnInit() {
    this.refreshStats();
  }

  refreshStats() {
    this.vendorStats = this.dataService.getVendorStats();
  }

  async viewOrderDetails(order: any) {
    const itemsList = order.items
      .map((item: any) => `• ${item.quantity}x ${item.name} (RM${(item.price * item.quantity).toFixed(2)})`)
      .join('\n');

    const alert = await this.alertCtrl.create({
      header: `Order #${order.id}`,
      subHeader: `Customer: ${order.customerName}`,
      message: `ITEMS:\n${itemsList}\n\nTOTAL: RM${order.total.toFixed(2)}`,
      buttons: [
        {
          text: 'CLOSE',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });

    await alert.present();
  }

  // --- FUNGSI BARU UNTUK SELESAIKAN RALAT TS2339 ---
  async viewItemDetails(item: any) {
    const alert = await this.alertCtrl.create({
      header: item.name,
      subHeader: item.category,
      message: `Price: RM${item.price.toFixed(2)}\nStatus: ${item.available ? 'Available' : 'Out of Stock'}`,
      buttons: ['OK']
    });

    await alert.present();
  }
  // ------------------------------------------------

  updateStatus(order: any, newStatus: string) {
    order.status = newStatus;
    this.dataService.updateOrderStatus(order.id, newStatus);
    this.refreshStats();
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'Pending': return '#3498db'; 
      case 'Preparing': return '#e67e22'; 
      case 'Ready': return '#2ecc71'; 
      case 'Completed': return '#2ecc71'; 
      default: return '#95a5a6'; 
    }
  }

  toggleAvailability(item: any) {
    item.available = !item.available;
  }

  editMenuItem(item: any) {
    console.log('Editing item:', item);
  }

  deleteMenuItem(itemId: string) {
    this.dataService.menuItems = this.dataService.menuItems.filter(i => i.id !== itemId);
    this.refreshStats();
  }

  goToAddMenu() {
    this.navCtrl.navigateForward('/add-menu');
  }

  logout() {
    this.dataService.logoutUser();
    this.navCtrl.navigateRoot('/home');
  }
}