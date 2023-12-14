import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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
  login(name: string, password: string) {
    // Realizar la llamada de inicio de sesión y almacenar el token
    this.http.post(`${this.apiUrl}/login`, { name, password }).subscribe(
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
    // Implementa la lógica de cierre de sesión y establece la bandera a false
    this.isLoggedInFlag = false;
  }
  getStoredToken(): string | null {
    // Obtener el token del almacenamiento local
    return localStorage.getItem(TOKEN_KEY);
  }
}