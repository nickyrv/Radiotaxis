import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverFailuresComponent } from './driver-failures.component';

describe('DriverFailuresComponent', () => {
  let component: DriverFailuresComponent;
  let fixture: ComponentFixture<DriverFailuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverFailuresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverFailuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
