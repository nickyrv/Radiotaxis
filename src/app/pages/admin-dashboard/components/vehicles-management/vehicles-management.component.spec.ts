import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesManagementComponent } from './vehicles-management.component';

describe('VehiclesManagementComponent', () => {
  let component: VehiclesManagementComponent;
  let fixture: ComponentFixture<VehiclesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclesManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
