import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApartmentFormComponent } from './create-apartment-form.component';

describe('CreateApartmentFormComponent', () => {
  let component: CreateApartmentFormComponent;
  let fixture: ComponentFixture<CreateApartmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApartmentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateApartmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
