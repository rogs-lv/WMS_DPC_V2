import { TestBed, async, inject } from '@angular/core/testing';

import { AuthChildRouteGuard } from './auth-child-route.guard';

describe('AuthChildRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthChildRouteGuard]
    });
  });

  it('should ...', inject([AuthChildRouteGuard], (guard: AuthChildRouteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
