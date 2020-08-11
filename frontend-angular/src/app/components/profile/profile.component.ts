import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  currentPassword: string;
  newPassword: string;
  isClicked: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
    ) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    })
  }

  onUpdatePassword(){
    this.authService.changePassword(this.user, this.currentPassword, this.newPassword)
      .subscribe(data => {
        if(data.success){
          this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.flashMessage.show(data.msg + ' Enter again!', {cssClass: 'alert-danger', timeout: 4000});
          this.currentPassword = null;
          this.newPassword = null;
        }
      },
      err => {
          this.currentPassword = null;
          this.newPassword = null;
      });
  }
}
