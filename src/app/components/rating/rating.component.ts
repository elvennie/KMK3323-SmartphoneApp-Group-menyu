import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonIcon, IonFooter, IonTextarea, ModalController, ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { DataService, Review } from '../../services/data';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, 
    IonTitle, IonContent, IonButton, IonIcon, 
    IonFooter, IonTextarea
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="light">
        <ion-title>Rate Your Order</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="rating-container">
        <p style="color: #666; font-size: 0.9rem;">Order #{{ orderId }}</p>
        
        <h3 style="font-weight: bold; margin-top: 20px;">Your Rating:</h3>
        <div class="stars">
          <ion-icon 
            *ngFor="let s of [1,2,3,4,5]" 
            [name]="s <= rating ? 'star' : 'star-outline'"
            (click)="setRating(s)"
            [style.color]="s <= rating ? '#ffc409' : '#b4b4b4'">
          </ion-icon>
        </div>

        <h3 style="font-weight: bold; margin-top: 30px; text-align: left;">Your Review (Optional):</h3>
        <ion-textarea 
          placeholder="Tell us about your experience..." 
          fill="outline" 
          rows="5"
          [(ngModel)]="comment"
          style="--border-radius: 12px; margin-top: 10px;">
        </ion-textarea>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border ion-padding">
      <div style="display: flex; gap: 12px;">
        <ion-button expand="block" fill="outline" style="flex: 1; --border-radius: 10px;" (click)="cancel()">
          Cancel
        </ion-button>
        <ion-button expand="block" style="flex: 1; --border-radius: 10px; --background: #003366;" 
                    (click)="submit()" [disabled]="rating === 0">
          Submit
        </ion-button>
      </div>
    </ion-footer>
  `,
  styles: [`
    .rating-container { text-align: center; padding: 10px; }
    .stars { font-size: 45px; display: flex; justify-content: center; gap: 8px; margin: 20px 0; }
    ion-icon { cursor: pointer; transition: transform 0.1s; }
    ion-icon:active { transform: scale(1.2); }
  `]
})
export class RatingComponent {
  @Input() orderId!: string;
  rating: number = 0;
  comment: string = '';

  constructor(
    private modalCtrl: ModalController, 
    private dataService: DataService,
    private toastCtrl: ToastController // Tambah ini untuk maklum balas selepas submit
  ) {
    addIcons({ star, starOutline });
  }

  setRating(val: number) { this.rating = val; }

  cancel() { this.modalCtrl.dismiss(); }

  async submit() {
    const review: Review = {
      orderId: this.orderId,
      customerName: this.dataService.currentUser?.name || 'Guest',
      rating: this.rating,
      comment: this.comment,
      date: new Date().toISOString()
    };

    // Tampilkan toast terima kasih
    const toast = await this.toastCtrl.create({
      message: 'Thank you for your rating! ⭐',
      duration: 2000,
      color: 'dark',
      position: 'bottom'
    });
    await toast.present();

    // Hantar data review balik ke halaman pemanggil
    this.modalCtrl.dismiss(review);
  }
}