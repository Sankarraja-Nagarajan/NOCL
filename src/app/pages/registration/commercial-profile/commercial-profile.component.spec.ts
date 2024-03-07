import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialProfileComponent } from './commercial-profile.component';

describe('CommercialProfileComponent', () => {
  let component: CommercialProfileComponent;
  let fixture: ComponentFixture<CommercialProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommercialProfileComponent]
    });
    fixture = TestBed.createComponent(CommercialProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
