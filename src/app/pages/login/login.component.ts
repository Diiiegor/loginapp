import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UsuarioModel} from '../../models/usuario.model';
import {Router} from '@angular/router';
import {AuthService} from "../../services/auth.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarme = false;


  constructor(private authservice: AuthService, private router: Router) {
  }

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
    }
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espre por favor...'
    });
    Swal.showLoading();

    this.authservice.login(this.usuario).subscribe(resp => {
      console.log(resp);
      Swal.close();

      if (this.recordarme === true) {
        localStorage.setItem('email', this.usuario.email);
      }

      this.router.navigateByUrl('/home');
    }, (err) => {
      console.log(err.error.error.message);
      Swal.fire({
        type: 'error',
        text: err.error.error.message,
        title: 'Error al autenticar'
      });
    });
  }

}
