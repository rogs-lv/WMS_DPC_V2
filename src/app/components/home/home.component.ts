import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { auth } from '../../interfaces/authenticate.interface';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
import { SnakbarComponent } from '../shared/snakbar/snakbar.component';
import { module } from 'src/app/models/module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;
  titleModule: string = '';
  modules: module[];
  //modules: module[];
  dataUser = {
    idUser: '',
    whsCode: ''
  };

  constructor(
    private auth: AuthService,
    private config: ConfigurationService,
    private router: Router
  ) { 
    this.modules = [];
  }

  ngOnInit() {
    this.getDataUser();
    this.getConfigMenu();
  }
  //Mode menu angular material
  mode = new FormControl('over');

  logout() {
    this.auth.doLogout();
    this.router.navigateByUrl('/login');
  }
  onChangeTittle(value: string) {
    this.titleModule = value;
  }
  getConfigMenu() {
    const { IdUser } = this.auth.getDataToken();
    this.config.getConfigurationProfile(IdUser).subscribe(response => {
      if(response.Code == 0) {
        this.modules = response.Data;
        this.getTitleModule();
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','error-snackbar');
    });
  }
  getTitleModule() {
    if(this.modules[0].Submodules.length > 0) {
      //this.router.navigateByUrl(`/home/${this.modules[0].Submodules[0].Path}`);
      this.titleModule = this.modules[0].Submodules[0].Title;
    } else {
      //this.router.navigateByUrl(`/home/${this.modules[0].Path}`);
      this.titleModule = this.modules[0].Title;
    }
    /* const urlArray = this.router.url.split('/');
    let index = 2;
    const firstModule = this.modules.find(val => val.Path === urlArray[index]);
    if(firstModule === undefined) {
      let { Submodules } = this.modules.find(sub => sub.Submodules.length > 0);
      this.titleModule = Submodules.find(val => val.Path === urlArray[index]).Title;
      this.router.navigateByUrl(`/home/${Submodules[0].Path}`);
    } else {
      this.titleModule = this.modules.find(val => val.Path === urlArray[index]).Title;
      this.router.navigateByUrl(`/home/${firstModule.Path}`);
    } */
  }
  getDataUser() {
    const {IdUser, WhsCode} = this.auth.getDataToken();
    this.dataUser.idUser = IdUser;
    this.dataUser.whsCode = WhsCode;
  }
  
}
