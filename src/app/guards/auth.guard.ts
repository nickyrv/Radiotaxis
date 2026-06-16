import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const savedUser = localStorage.getItem('currentUser');

  if (!savedUser) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  try {
    const user = JSON.parse(savedUser);

    if (!user || !user.id || !user.role || user.status !== 'active') {
      localStorage.removeItem('currentUser');
      router.navigate(['/login'], { replaceUrl: true });
      return false;
    }

    return true;

  } catch {
    localStorage.removeItem('currentUser');
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
};