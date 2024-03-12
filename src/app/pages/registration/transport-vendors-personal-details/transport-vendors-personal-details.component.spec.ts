import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportVendorsPersonalDetailsComponent } from './transport-vendors-personal-details.component';

describe('TransportVendorsPersonalDetailsComponent', () => {
  let component: TransportVendorsPersonalDetailsComponent;
  let fixture: ComponentFixture<TransportVendorsPersonalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportVendorsPersonalDetailsComponent]
    });
    fixture = TestBed.createComponent(TransportVendorsPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
