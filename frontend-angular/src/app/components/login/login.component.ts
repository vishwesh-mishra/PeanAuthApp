import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService} from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    // Required Fields
    if(!this.validateService.validateLogin(user)){
      this.flashMessage.show("Please fill in all fields!", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show("You are now logged in!", {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/dashboard']);
      } else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 4000});
        this.username = "";
        this.password = "";
        this.router.navigate(['/login']);
      }
    });
  }

}
