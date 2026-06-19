import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverRequestsComponent } from './driver-requests.component';

describe('DriverRequestsComponent', () => {
  let component: DriverRequestsComponent;
  let fixture: ComponentFixture<DriverRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
