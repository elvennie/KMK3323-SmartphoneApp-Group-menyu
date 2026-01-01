import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  available?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: any[];
  total: number;
  date: string; // The time the order was placed
  status: string;
  type: string;
  customerName?: string;
  isRated?: boolean;
  // --- NEW UPGRADE FIELDS ---
  isScheduled?: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface User {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'vendor';
}

export interface Review {
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public notification$ = new Subject<string>();

  public users: User[] = [
    { name: 'Ali', email: 'ali@gmail.com', password: '123', role: 'customer' },
    { 
      name: 'Pak Lek', 
      email: 'Vendorpaklek@gmail.com', 
      password: 'Jombeli', 
      role: 'vendor' 
    }
  ];
  
  public currentUser: User | null = null;
  public cart: CartItem[] = [];
  public orders: Order[] = []; 
  public reviews: Review[] = [];

  public menuItems: MenuItem[] = [
    { id: '1', name: 'Set A Nasi', price: 6.00, category: 'Nasi', image: 'assets/images/set-a.jpg', available: true },
    { id: '2', name: 'Set B Nasi', price: 9.00, category: 'Nasi', image: 'assets/images/set-b.jpg', available: true },
    { id: '3', name: 'Set C Nasi', price: 12.00, category: 'Nasi', image: 'assets/images/set-c.jpg', available: true },
    { id: '4', name: 'Ayam Bakar', price: 10.00, category: 'Nasi Padang Ayam', image: 'assets/images/ayam-bakar.jpg', available: true },
    { id: '5', name: 'Ayam Bakar Gepuk', price: 10.00, category: 'Nasi Padang Ayam', image: 'assets/images/ayam-bakar.jpg', available: true },
    { id: '6', name: 'Ayam Bakar Geprek', price: 11.00, category: 'Nasi Padang Ayam', image: 'assets/images/ayam-bakar.jpg', available: true },
    { id: '7', name: 'Ayam Goreng', price: 9.00, category: 'Nasi Padang Ayam', image: 'assets/images/ayam-goreng.jpg', available: true },
    { id: '8', name: 'Keli', price: 10.00, category: 'Nasi Padang Keli', image: 'assets/images/keli-goreng.jpg', available: true },
    { id: '9', name: 'Keli Gepuk', price: 11.00, category: 'Nasi Padang Keli', image: 'assets/images/keli-goreng.jpg', available: true },
    { id: '10', name: 'Keli Geprek', price: 11.00, category: 'Nasi Padang Keli', image: 'assets/images/keli-goreng.jpg', available: true },
    { id: '11', name: 'Tilapia', price: 10.00, category: 'Nasi Padang Tilapia', image: 'assets/images/tilapia-bakar.jpg', available: true },
    { id: '12', name: 'Tilapia Gepuk', price: 11.00, category: 'Nasi Padang Tilapia', image: 'assets/images/tilapia-bakar.jpg', available: true },
    { id: '13', name: 'Tilapia Geprek', price: 11.00, category: 'Nasi Padang Tilapia', image: 'assets/images/tilapia-bakar.jpg', available: true },
    { id: '14', name: 'Ikan Kembong', price: 8.00, category: 'Nasi Padang Ikan', image: 'assets/images/ikan-kembong.jpg', available: true },
    { id: '15', name: 'Pak Lek', price: 7.00, category: 'Nasi Padang Pak Lek', image: 'assets/images/set-a.jpg', available: true },
    { id: '16', name: 'Nasi Add On', price: 0.50, category: 'Add On', image: 'assets/images/nasi-putih.jpg', available: true },
    { id: '17', name: 'Sambal Add On', price: 0.20, category: 'Add On', image: 'assets/images/sambal.jpg', available: true },
    { id: '18', name: 'Kobis Goreng Add On', price: 2.00, category: 'Add On', image: 'assets/images/kobis.jpg', available: true }
  ];

  constructor() {
    const savedUser = localStorage.getItem('my_app_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  // --- ORDERS & CART ---
  addOrder(newOrder: Order) {
    this.orders.push(newOrder);
  }

  addToCart(item: MenuItem) {
    const exist = this.cart.find(i => i.id === item.id);
    if (exist) {
      exist.quantity++;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  updateOrderStatus(orderId: string, status: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      if (status === 'Completed') {
        this.notification$.next(orderId);
      }
    }
  }

  // --- USER MANAGEMENT ---
  loginUser(email: string, pass: string): User | null {
    const user = this.users.find(u => u.email === email && u.password === pass);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('my_app_user', JSON.stringify(user));
      return user;
    }
    return null;
  }

  registerUser(userData: User): boolean {
    const exist = this.users.find(u => u.email === userData.email);
    if (exist) return false;
    this.users.push({ ...userData, role: 'customer' });
    return true;
  }
  
  logoutUser() {
    this.currentUser = null;
    localStorage.removeItem('my_app_user');
  }

  // --- STATS & REVIEWS ---
  getVendorStats() {
    const today = new Date().toLocaleDateString();

    const todayOrders = this.orders.filter(o => {
      if (!o.date) return false;
      // Normalizing date string for comparison
      return o.date.includes(today);
    });

    const totalReviewsCount = this.reviews.length;
    const avgRatingValue = totalReviewsCount > 0 
      ? (this.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
      : "0.0";

    return {
      activeOrders: this.orders.filter(o => o.status !== 'Completed').length,
      totalSalesToday: todayOrders.reduce((sum, o) => sum + o.total, 0),
      todayOrdersCount: todayOrders.length,
      menuItemsCount: this.menuItems.length,
      averageRating: avgRatingValue,
      totalReviews: totalReviewsCount,
      recentActivity: [...this.orders].reverse().slice(0, 5) 
    };
  }

  submitReview(review: Review) {
    this.reviews.push(review);
    const order = this.orders.find(o => o.id === review.orderId);
    if (order) {
      order.isRated = true;
    }
  }
}