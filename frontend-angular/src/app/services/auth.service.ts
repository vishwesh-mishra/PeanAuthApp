import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  registerUser(user): Observable<any> {
    let url:string = 'http://localhost:3000/users/register'
    let httpHeaders:HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    let options:Optional = {
      headers: httpHeaders,
      responseType: 'json'
    };
    return this.httpClient.post(url, user, options);
  }

  authenticateUser(user): Observable<any> {
    let url: string = 'http://localhost:3000/users/authenticate';
    let httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    let options: Optional = {
      headers: httpHeaders,
      responseType: 'json'
    };
    return this.httpClient.post(url, user, options);
  }

  getProfile(): Observable<any>{
    let url: string = 'http://localhost:3000/users/profile';
    let httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization': localStorage.getItem('id_token'),
      'Content-Type': 'application/json'
    });
    return this.httpClient.get(url, {headers: httpHeaders});
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  changePassword(user, currentPassword, newPassword): Observable<any> {
      let userBody = {
        user: user,
        currentPassword: currentPassword,
        newPassword: newPassword
      };
      let url: string = 'http://localhost:3000/users/profile/updatePassword';
      let httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      let options: Optional = {
        headers: httpHeaders,
        responseType: 'json'
      };
      return this.httpClient.post(url, userBody, options);
  }

  loggedIn() {
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(localStorage.getItem('id_token'));
    return !isExpired;
  }

  // logTokenAndUser(){
  //   console.log('Loggged Token is: ', this.authToken);
  //   console.log('Loggged User is: ', this.user);
  // }

  logout(){
    localStorage.clear();
  }
}
