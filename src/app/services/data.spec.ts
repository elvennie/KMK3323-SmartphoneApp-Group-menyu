import { TestBed } from '@angular/core/testing';
import { DataService } from './data'; // Pastikan ini 'DataService' bukan 'Data'

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Ujian tambahan untuk memastikan fungsi login berfungsi
  it('should have menu items populated', () => {
    expect(service.menuItems.length).toBeGreaterThan(0);
  });

  it('should find vendor Pak Lek', () => {
    const vendor = service.users.find(u => u.name === 'Pak Lek');
    expect(vendor).toBeDefined();
    expect(vendor?.role).toBe('vendor');
  });
});