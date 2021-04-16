import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
import { SnakbarComponent } from '../../shared/snakbar/snakbar.component';
import { module, submodule } from 'src/app/models/module';
import { additionalSettings, profile } from '../../../models/profile';
import { ProfileService } from 'src/app/service/profile/profile.service';
import { Router } from '@angular/router';
import { ComunicationService } from 'src/app/service/shared/comunication.service';
import { NgForm } from '@angular/forms';
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
  action: string = 'I'; //Insert - Nuevo
  loading: boolean = false;
  
  constructor(
    private auth: AuthService,
    private configService: ConfigurationService,
    private profileService: ProfileService,
    private sharedService: ComunicationService
  ) { 
    this.modules = [];
    this.additionalSett = [];
    this.profileUser = new profile();
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
        this.profileUser.Status = 'A';
        this.getModulesProfile('N');
        this.getAdditionalSettings('N');
      }
    });
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

  onCreateUser() {

  }
  onUpdateUser(){}
}
