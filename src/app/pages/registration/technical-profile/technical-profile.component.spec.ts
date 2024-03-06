import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalProfileComponent } from './technical-profile.component';

describe('TechnicalProfileComponent', () => {
  let component: TechnicalProfileComponent;
  let fixture: ComponentFixture<TechnicalProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalProfileComponent]
    });
    fixture = TestBed.createComponent(TechnicalProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
