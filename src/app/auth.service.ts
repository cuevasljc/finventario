import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private authToken!: string;
  private isLoggedInFlag: boolean = false;
 
  constructor(private http: HttpClient,private router: Router) {
    this.isLoggedInFlag = this.getStoredToken() !== null;
  }
  login(username: string, password: string) {
    // Realizar la llamada de inicio de sesión y almacenar el token
    this.http.post(`${this.apiUrl}/login`, { username, password }).subscribe(
      (response: any) => {
        this.authToken = response.access_token;
        localStorage.setItem(TOKEN_KEY, this.authToken);
        this.isLoggedInFlag = true;
        // Después de un inicio de sesión exitoso, redirige a la página de inicio
       this.router.navigate(['/home']);
        // También podrías guardar el token en el almacenamiento local para persistencia
        // localStorage.setItem('authToken', this.authToken);
      },
      (error) => {
        console.error('Error al iniciar sesión', error);
      }
    );
  }
  isAuthenticated(): boolean{
    // Verifica si el token está presente y no ha expirado
    const storedToken = this.getStoredToken();
    if (storedToken) {
      // Puedes implementar una lógica adicional para verificar la validez del token,
      // como decodificar el token y verificar su fecha de expiración
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  }
  // Otros métodos del servicio...

  // Método para realizar solicitudes autenticadas
  getSecureData() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
    });

    return this.http.get(`${this.apiUrl}/secure-data`, { headers });
  }

  isLoggedIn(): boolean {
    return this.isLoggedInFlag;
  }

  // login() {
  //   // Implementa la lógica de autenticación y establece la bandera a true
  //   this.isLoggedInFlag = true;
  // }

  logout() {
    var authToken=this.getStoredToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
    });
    
    this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe(
      () => {
        localStorage.removeItem(TOKEN_KEY);
        this.isLoggedInFlag = false;
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error al cerrar sesión', error);
      }
    );
  }
  getStoredToken(): string | null {
    // Obtener el token del almacenamiento local
    return localStorage.getItem(TOKEN_KEY);
  }
}