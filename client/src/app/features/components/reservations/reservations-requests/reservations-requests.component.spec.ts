import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsRequestsComponent } from './reservations-requests.component';

describe('ReservationsRequestsComponent', () => {
  let component: ReservationsRequestsComponent;
  let fixture: ComponentFixture<ReservationsRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationsRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
