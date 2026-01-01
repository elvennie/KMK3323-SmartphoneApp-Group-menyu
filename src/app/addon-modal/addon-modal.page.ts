import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DataService, MenuItem } from '../services/data'; 
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-addon-modal',
  templateUrl: './addon-modal.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AddonModalPage implements OnInit {
  @Input() item!: MenuItem;

  public addOnList: MenuItem[] = [];
  public quantities: { [key: string]: number } = {};

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService
  ) {
    addIcons({ close });
  }

  ngOnInit() {
    // Ambil item yang kategorinya 'Add On' dari DataService
    this.addOnList = this.dataService.menuItems.filter(m => m.category === 'Add On');
    
    // Set kuantiti awal kepada 0 untuk setiap add-on
    this.addOnList.forEach(addon => {
      this.quantities[addon.id] = 0;
    });
  }

  inc(id: string) {
    this.quantities[id]++;
  }

  dec(id: string) {
    if (this.quantities[id] > 0) {
      this.quantities[id]--;
    }
  }

  confirm() {
    // 1. Tambah item utama ke dalam cart
    this.dataService.addToCart(this.item);

    // 2. Tambah add-ons yang kuantitinya lebih dari 0
    this.addOnList.forEach(addon => {
      const qty = this.quantities[addon.id];
      if (qty > 0) {
        for (let i = 0; i < qty; i++) {
          this.dataService.addToCart(addon);
        }
      }
    });

    this.modalCtrl.dismiss({ added: true });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}