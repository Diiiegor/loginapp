import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UsuarioModel} from "../models/usuario.model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = `https://identitytoolkit.googleapis.com/v1/accounts`;
  private apikey = `AIzaSyCVR13zfogoUmPIXsZvil6bbeNaYGdgWAY`;
  usertoken: string;

  constructor(private http: HttpClient) {
    this.leertoken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel) {
    const authdata = {
      ...usuario,
      returnSecureToken: true
    };
    return this.http.post(`${this.url}:signInWithPassword?key=${this.apikey}`, authdata)
      .pipe(map(resp => {
        this.guardarToken(resp['idToken']);
        return resp;
      }));
  }

  nuevousuario(usuario: UsuarioModel) {

    const authdata = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`${this.url}:signUp?key=${this.apikey}`, authdata)
      .pipe(map(resp => {
        this.guardarToken(resp['idToken']);
        return resp;
      }));
  }

  private guardarToken(idtoken: string) {
    this.usertoken = idtoken;
    localStorage.setItem('token', idtoken);

    const hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leertoken() {
    if (localStorage.getItem('token')) {
      this.usertoken = localStorage.getItem('token');
    } else {
      this.usertoken = '';
    }
    return this.usertoken;
  }

  estaautenticado(): boolean {

    if (this.usertoken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiradate = new Date();
    expiradate.setTime(expira);

    if (expiradate > new Date()) {
      return true;
    } else {
      return false;
    }

    return this.usertoken.length > 2;
  }

}
