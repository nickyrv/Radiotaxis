import { TestBed } from '@angular/core/testing';

import { VehicleManagementEventService } from './vehicle-management-event.service';

describe('VehicleManagementEventService', () => {
  let service: VehicleManagementEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleManagementEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
