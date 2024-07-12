import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Jwt } from '../../domain/Jwt';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../domain/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API = 'http://localhost:8080/'
  private readonly platformId = inject(PLATFORM_ID)

  constructor(private http: HttpClient, private router: Router) {
  }

  register(login: string, password: string) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var json = JSON.stringify({ "login": login, "password": password })
    return this.http.post(this.API + 'auth/register', json, { headers: header });
  }

  login(login: string, password: string) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var json = JSON.stringify({ "login": login, "password": password })
    return this.http.post<Jwt>(this.API + 'auth/login', json, { headers: header });
  }

  setSession(jwt: string) {
    const expirationTime = Date.now() + 1000 * 60 * 60 * 60;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('expireDate', expirationTime.toString())
    }

  }

  isLoggedIn() {
    const dateNow = Date.now()

    if (isPlatformBrowser(this.platformId)) {
      const expireDateAsNumber = localStorage.getItem("expireDate") as unknown as number;
      if (expireDateAsNumber > dateNow) {
        return true;
      } else {
        return false
      }
    } else {
      return false;
    }

  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("expireDate");
      this.router.navigateByUrl('login')
    }

  }

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("jwt");
    } else {
      return null;
    }
  }

  findUserByToken(jwt: string) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json')
    var json = JSON.stringify({ jwt: jwt })
    return this.http.post<User>(this.API + 'auth/jwt', json, { headers: header });
  }
}
