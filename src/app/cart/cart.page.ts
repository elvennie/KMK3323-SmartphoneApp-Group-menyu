import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import {

  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,

  IonButton, IonIcon, IonFooter, NavController, ToastController

} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import { chevronBack, trashOutline, add, remove, cartOutline } from 'ionicons/icons';

import { DataService } from '../services/data';



@Component({

  selector: 'app-cart',

  templateUrl: './cart.page.html',

  styleUrls: ['./cart.page.scss'],

  standalone: true,

  imports: [

    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,

    IonButton, IonIcon, IonFooter, CommonModule, FormsModule, RouterModule

  ]

})

export class CartPage {

  constructor(

    public dataService: DataService,

    private navCtrl: NavController,

    private router: Router,

    private toastCtrl: ToastController

  ) {

    addIcons({ chevronBack, trashOutline, add, remove, cartOutline });

  }



  get total() {

    return this.dataService.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  }



  // Hanya navigasi ke payment, belum simpan order lagi

  processCheckout() {

    if (this.dataService.cart.length === 0) {

      this.presentToast('Your cart is empty!');

      return;

    }

    this.router.navigate(['/payment']);

  }



  async presentToast(msg: string) {

    const toast = await this.toastCtrl.create({

      message: msg,

      duration: 2000,

      position: 'bottom',

      color: 'dark'

    });

    await toast.present();

  }



  increaseQty(index: number) {

    this.dataService.cart[index].quantity++;

  }



  decreaseQty(index: number) {

    if (this.dataService.cart[index].quantity > 1) {

      this.dataService.cart[index].quantity--;

    } else {

      this.removeFromCart(index);

    }

  }



  removeFromCart(index: number) {

    this.dataService.cart.splice(index, 1);

  }



  goBack() {

    this.navCtrl.back();

  }

}