import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { DataService, MenuItem } from '../services/data';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.page.html',
  styleUrls: ['./add-menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddMenuPage {
  // Set category to an empty string so the vendor can type their own
  newItem = {
    name: '',
    price: null as number | null,
    category: '', 
    available: true
  };

  constructor(
    private dataService: DataService,
    private navCtrl: NavController,
    private toastCtrl: ToastController // Added for user feedback
  ) {}

  async saveItem() {
    // Check if name, price, and category are all provided
    if (this.newItem.name && this.newItem.price && this.newItem.category) {
      const newEntry: MenuItem = {
        id: Date.now().toString(), 
        name: this.newItem.name,
        price: Number(this.newItem.price),
        category: this.newItem.category, // Captures custom text from vendor
        image: 'assets/images/placeholder.jpg',
        available: true
      };
      
      this.dataService.menuItems.push(newEntry);
      
      // Optional: Show success message
      const toast = await this.toastCtrl.create({
        message: 'Menu item added successfully!',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

      this.navCtrl.back(); 
    } else {
      // Optional: Show error message if fields are missing
      const toast = await this.toastCtrl.create({
        message: 'Please fill in all details, including category.',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}