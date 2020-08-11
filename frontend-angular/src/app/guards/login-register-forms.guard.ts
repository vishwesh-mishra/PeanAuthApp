import {Injectable} from '@angular/core';
import {Router, CanDeactivate} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class LoginRegisterFormsGuard {
    constructor(
        private authService: AuthService,
        private router: Router
    ){}

    canActivate(){
        if(!this.authService.loggedIn()){
            return true;
        } else {
            this.router.navigate(['/dashboard']);
            return false;
        }
    }
}