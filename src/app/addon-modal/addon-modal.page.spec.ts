import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddonModalPage } from './addon-modal.page';

describe('AddonModalPage', () => {
  let component: AddonModalPage;
  let fixture: ComponentFixture<AddonModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
