import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { user } from 'src/app/models/user';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { SnakbarComponent } from '../shared/snakbar/snakbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;
  user: user;
  loading: boolean;
  
  constructor(
    private auth: AuthService,
    private router: Router
  ) { 
    this.user = new user();
    this.loading = false;
  }

  ngOnInit() {
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.loading = true;
      this.auth.signIn(this.user).subscribe(response => {
        if(response.Data.Token) {
          this.router.navigateByUrl('/home');
        } else {
          this.childSnak.openSnackBar(response.Message, 'Cerrar', 'error-snackbar')
          this.loading = false;
        }
      }, (err) => {
        console.log('---', err)
        this.childSnak.openSnackBar(err.message, 'Cerrar', 'error-snackbar')
        this.loading = false;
      });
    }
  }
}
