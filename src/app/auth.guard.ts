// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Asegúrate de ajustar la ruta según tu estructura

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

 canActivate(): boolean {
    if (this.authService.getStoredToken()) {
      // Si hay un token almacenado, el usuario está autenticado
      return true;
    } else {
      // Si no hay un token almacenado, redirigir al usuario a /login
      this.router.navigate(['/login']);
      return false;
    }
  }
}