import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualTurnoverComponent } from './annual-turnover.component';

describe('AnnualTurnoverComponent', () => {
  let component: AnnualTurnoverComponent;
  let fixture: ComponentFixture<AnnualTurnoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnualTurnoverComponent]
    });
    fixture = TestBed.createComponent(AnnualTurnoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
