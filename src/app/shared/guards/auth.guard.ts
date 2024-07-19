import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { UserService } from 'src/app/core/user.service';

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);

  return userService.isAuthenticated$.pipe(
    map((status) => {
      console.log('isAuthenticated:' + status);
      if (status) {
        return true;
      }

      return router.createUrlTree(['/']);
    })
  );
};
