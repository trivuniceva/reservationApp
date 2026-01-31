import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApartmentPageComponent } from './create-apartment-page.component';

describe('CreateApartmentPageComponent', () => {
  let component: CreateApartmentPageComponent;
  let fixture: ComponentFixture<CreateApartmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApartmentPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateApartmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
