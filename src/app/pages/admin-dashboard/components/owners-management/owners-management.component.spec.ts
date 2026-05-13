import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnersManagementComponent } from './owners-management.component';

describe('OwnersManagementComponent', () => {
  let component: OwnersManagementComponent;
  let fixture: ComponentFixture<OwnersManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnersManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
