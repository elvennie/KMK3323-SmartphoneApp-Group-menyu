import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, AlertController, ToastController, NavController } from '@ionic/angular/standalone';
import { DataService } from '../services/data'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule],
})
export class HomePage implements OnInit {
  
  public lang: 'en' | 'bm' = 'en';

  public txt: any = {
    en: {
      subtitle: 'FOOD ORDER',
      desc: 'Food Ordering System',
      role: 'Select Your Role',
      customer: 'Customer',
      vendor: 'Vendor',
      forgot: 'Forgot Password?',
      noAccount: "Don't have an account?",
      create: 'Create New Account',
      needHelp: 'Need Help?',
      contact: 'Contact us:'
    },
    bm: {
      subtitle: 'PESANAN MAKANAN',
      desc: 'Sistem Pesanan Makanan',
      role: 'Pilih Peranan Anda',
      customer: 'Pelanggan',
      vendor: 'Peniaga',
      forgot: 'Lupa Kata Laluan?',
      noAccount: "Tiada akaun lagi?",
      create: 'Daftar Akaun Baru',
      needHelp: 'Perlukan Bantuan?',
      contact: 'Hubungi kami:'
    }
  };

  constructor(
    private router: Router, 
    private alertController: AlertController,
    private toastController: ToastController,
    private navCtrl: NavController,
    public dataService: DataService // Mesti public
  ) {}

  ngOnInit() {
    // --- 1. LOGIK LOGIN SEKALI SAHAJA ---
    // Setiap kali app dibuka, semak jika ada user dalam localStorage
    if (this.dataService.currentUser) {
      const role = this.dataService.currentUser.role;
      console.log('User dikesan, auto-redirect ke:', role);
      this.navCtrl.navigateRoot(`/${role}`);
    }
  }

  setLang(code: 'en' | 'bm') {
    this.lang = code;
  }

  // Masuk sebagai Customer
  async gotoCustomer() {
    if (!this.dataService.currentUser) {
      this.showLoginPopup('customer'); 
    } else {
      this.navCtrl.navigateRoot('/customer');
    }
  }

  // Masuk sebagai Vendor
  async gotoVendor() {
    if (!this.dataService.currentUser) {
      this.showLoginPopup('vendor');
    } else {
      if (this.dataService.currentUser.role === 'vendor') {
        this.navCtrl.navigateRoot('/vendor');
      } else {
        this.showToast('Akses Ditolak: Anda bukan Vendor', 'danger');
      }
    }
  }

  // --- 2. LOGIK DAFTAR AKAUN BARU ---
  async onCreateAccount() {
    const alert = await this.alertController.create({
      header: this.lang === 'en' ? 'Create Account' : 'Daftar Akaun',
      cssClass: 'custom-alert',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Full Name' },
        { name: 'email', type: 'email', placeholder: 'Email Address' },
        { name: 'password', type: 'password', placeholder: 'Password' }
      ],
      buttons: [
        { text: this.lang === 'en' ? 'Cancel' : 'Batal', role: 'cancel' },
        {
          text: this.lang === 'en' ? 'Sign Up' : 'Daftar',
          handler: (data) => {
            if (!data.name || !data.email || !data.password) {
              this.showToast('Fill all fields!', 'warning');
              return false;
            }
            
            // Simpan ke DataService (Push ke array users)
            const success = this.dataService.registerUser({
              name: data.name,
              email: data.email,
              password: data.password,
              role: 'customer' // Pendaftaran baru secara automatik adalah customer
            });

            if (success) {
              this.showToast('Success! Please Login.', 'success');
              return true;
            } else {
              this.showToast('Email already taken!', 'danger');
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async showLoginPopup(targetRole: 'customer' | 'vendor') {
    const alert = await this.alertController.create({
      header: `Login (${targetRole})`,
      inputs: [
        { name: 'email', type: 'email', placeholder: 'Email' },
        { name: 'password', type: 'password', placeholder: 'Password' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Login',
          handler: (data) => {
            const user = this.dataService.loginUser(data.email, data.password);
            if (user) {
              if (user.role === targetRole) {
                this.navCtrl.navigateRoot(`/${targetRole}`);
                return true;
              } else {
                this.showToast(`Error: You are not a ${targetRole}`, 'danger');
                this.dataService.logoutUser();
                return false;
              }
            } else {
              this.showToast('Invalid Email/Password', 'danger');
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async onForgotPassword() {
    this.showToast('Reset link sent to your email.', 'primary');
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastController.create({
      message: msg, duration: 2000, color: color, position: 'top'
    });
    toast.present();
  }
}