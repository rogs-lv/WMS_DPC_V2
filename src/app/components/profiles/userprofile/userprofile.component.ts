import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
import { SnakbarComponent } from '../../shared/snakbar/snakbar.component';
import { module, submodule } from 'src/app/models/module';
import { additionalSettings, profile, profileUser } from '../../../models/profile';
import { ProfileService } from 'src/app/service/profile/profile.service';
import { Router } from '@angular/router';
import { ComunicationService } from 'src/app/service/shared/comunication.service';
import { NgForm } from '@angular/forms';
import { warehouse } from 'src/app/models/warehouse';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;
  profileUser: profile;
  modules: module[];
  sub_module: submodule[];
  additionalSett: additionalSettings[];
  warehouses: warehouse[];
  action: string = 'I'; //Insert - New
  loading: boolean = false;
  checkTransfer: boolean = true;
  checkPrincial: boolean = true;
  
  constructor(
    private auth: AuthService,
    private configService: ConfigurationService,
    private profileService: ProfileService,
    private sharedService: ComunicationService
  ) { 
    this.modules = [];
    this.additionalSett = [];
    this.profileUser = new profile();
    this.warehouses = [];
  }

  ngOnInit() {
    this.profileUser = new profile();
    this.sharedService.sharedIdProfileObservable.subscribe(profile => {
      if(profile !== null){
        this.action = 'U'; // Update
        this.profileUser = profile;
        this.getModulesProfile(profile.IdUser);
        this.getAdditionalSettings(profile.IdUser);
      } else {
        this.action = 'I'; // Insert new user
        this.profileUser.Status = true;
        this.getModulesProfile('N');
        this.getAdditionalSettings('N');
      }
    });
    this.getWarehouse();
  }
  onClickProfile(formProfile: NgForm) {

  }
  getModulesProfile(idProfile) {
    this.profileService.getModulesProfile(idProfile).subscribe(response => {
      if(response.Code === 0) {
        this.modules = response.Data;
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','error-snackbar');
    });
  }
  getAdditionalSettings(idProfile){
    this.profileService.getAdditionalSettingsProfile(idProfile).subscribe(response => {
      if(response.Code === 0) {
        this.additionalSett = response.Data;
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','error-snackbar');
    });
  }
  getWarehouse(){
    this.profileService.getWarehouse().subscribe(response => {
      if(response.Code == 0){
        this.warehouses = response.Data;
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar', 'error-snackbar')
    })
  }
  buildDataUser(): profileUser { 
    const data: profileUser = new profileUser();
    data.UserProfile = this.profileUser;
    data.UserAdditionalSettings = this.additionalSett;
    data.UserModules = this.modules;
    return data;
  }
  onCreateUser() {
    this.loading = true;
    this.profileService.createProfile(this.buildDataUser()).subscribe(response => {
      if(response.Code == 0) {
        this.loading = false;
        this.childSnak.openSnackBar(response.Data, 'Cerrar', 'success-snackbar')
        this.onResetCreate();
      } else {
        this.loading = false;
        this.childSnak.openSnackBar(response.Message, 'Cerrar', 'error-snackbar')
      }      
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar', 'error-snackbar')
      this.loading = false;
    })
  }
  onUpdateUser(){
    //console.log('update',this.additionalSett, this.modules, this.profileUser.Status);
    this.loading = true;
    this.profileService.updateProfile(this.buildDataUser()).subscribe(response => {
      if(response.Code == 0) {
        this.loading = false;
        this.childSnak.openSnackBar(response.Data, 'Cerrar', 'success-snackbar')
        this.onResetCreate();
        this.action = 'I';
      } else {
        this.loading = false;
        this.childSnak.openSnackBar(response.Message, 'Cerrar', 'error-snackbar')
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar', 'error-snackbar')
      this.loading = false;
    });
  }

  onClickAllTransfer(){
    const filterModuleTran = this.modules.filter(val => val.Principal === 'TRAN');
    if(this.checkTransfer)
      filterModuleTran.map(x=> x.Status = true);
    else 
      filterModuleTran.map(x=> x.Status = false);
  }
  onClickAllPrincipal(){
    const filterModulePrincipal = this.modules.filter(val => val.Principal === '' && val.IdModule !== 'TRAN');
    if(this.checkPrincial)
      filterModulePrincipal.map(x=> x.Status = true);
    else 
      filterModulePrincipal.map(x=> x.Status = false);
  }
  onResetCreate() {
    this.profileUser = new profile();
    this.profileUser.Status = true;
    const filterModuleTran = this.modules.filter(val => val.Principal === 'TRAN');
    const filterModulePrincipal = this.modules.filter(val => val.Principal === '' && val.IdModule !== 'TRAN');
    filterModuleTran.map(x=> x.Status = true);
    filterModulePrincipal.map(x=> x.Status = true);
    this.additionalSett.map(y => y.Status = true);
  }
}
