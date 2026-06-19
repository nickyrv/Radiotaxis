import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverVehicleComponent } from './driver-vehicle.component';

describe('DriverVehicleComponent', () => {
  let component: DriverVehicleComponent;
  let fixture: ComponentFixture<DriverVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
