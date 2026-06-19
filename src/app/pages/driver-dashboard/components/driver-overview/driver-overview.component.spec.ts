import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOverviewComponent } from './driver-overview.component';

describe('DriverOverviewComponent', () => {
  let component: DriverOverviewComponent;
  let fixture: ComponentFixture<DriverOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
