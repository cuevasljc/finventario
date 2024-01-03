import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material-module';
import { VentaComponent } from './venta/venta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Restangular, RestangularModule } from 'ngx-restangular';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    VentaComponent
  ],
  imports: [
    RestangularModule.forRoot((RestangularProvider) => {
      RestangularProvider.setBaseUrl('http://127.0.0.1:8000/api/'); // Set your API server URL here
      RestangularProvider.addFullRequestInterceptor((requestParams: { headers: { Authorization?: any; }; }, operation:string, path:string) => {
        const token = localStorage.getItem('auth_token'); // Get the token from localStorage
        if (token) {
          requestParams.headers = requestParams.headers || {};
          requestParams.headers.Authorization = `Bearer ${token}`;
        }
        return requestParams;
      });
    }),
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
  providers: [AuthService, Restangular],  // Agrega tu servicio aquí
})
export class AppModule { }
