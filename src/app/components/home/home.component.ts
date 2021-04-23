import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
import { SnakbarComponent } from '../shared/snakbar/snakbar.component';
import { moduleHome } from 'src/app/models/module';
import { ServiceLayer } from 'src/app/service/shared/ServicesLayer.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;
  titleModule: string = '';
  modules: moduleHome[];
  dataUser = {
    idUser: '',
    whsCode: ''
  };

  constructor(
    private auth: AuthService,
    private sapSL: ServiceLayer,
    private config: ConfigurationService,
    private router: Router
  ) { 
  }

  ngOnInit() {
    this.getDataUser();
    this.getConfigMenu();
  }
  //Mode menu angular material
  mode = new FormControl('over');

  logout() {
    this.auth.doLogout();
    this.sapSL.deleteSession();
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
    const urlArray = this.router.url.split('/');
    const index = 2;
    const firstLevel = this.pathExist(urlArray[index])
    if( firstLevel !== null) { // exist in first level
      this.titleModule = firstLevel.Title;
    }
  }

  private pathExist(path: string): any {
    const indexPath = this.modules.findIndex( x => x.Path === path);
    if(indexPath !== -1){ // Exist path in array
      return this.modules[indexPath];
    } else { // Not exist path in array
      return null;
    }
  }

  getDataUser() {
    const {IdUser, WhsCode} = this.auth.getDataToken();
    this.dataUser.idUser = IdUser;
    this.dataUser.whsCode = WhsCode;
  }
  
}
