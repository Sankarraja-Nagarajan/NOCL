import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankerDetailsComponent } from './tanker-details.component';

describe('TankerDetailsComponent', () => {
  let component: TankerDetailsComponent;
  let fixture: ComponentFixture<TankerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TankerDetailsComponent]
    });
    fixture = TestBed.createComponent(TankerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
