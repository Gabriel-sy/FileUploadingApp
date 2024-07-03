import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Se tiver o jwt, cria um request header com o token, se não, continua a request.
    if (this.authService.isLoggedIn()) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + this.authService.getToken())
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}

