import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsManagementComponent } from './shifts-management.component';

describe('ShiftsManagementComponent', () => {
  let component: ShiftsManagementComponent;
  let fixture: ComponentFixture<ShiftsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
