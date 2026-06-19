import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerReportsComponent } from './owner-reports.component';

describe('OwnerReportsComponent', () => {
  let component: OwnerReportsComponent;
  let fixture: ComponentFixture<OwnerReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
