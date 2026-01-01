import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorOrdersPage } from './vendor-orders.page';

describe('VendorOrdersPage', () => {
  let component: VendorOrdersPage;
  let fixture: ComponentFixture<VendorOrdersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
