import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { profile } from 'src/app/models/profile';
import { ComunicationService } from 'src/app/service/shared/comunication.service';
import { ProfileService } from '../../../service/profile/profile.service';
import { SnakbarComponent } from '../../shared/snakbar/snakbar.component';
@Component({
  selector: 'app-listprofile',
  templateUrl: './listprofile.component.html',
  styleUrls: ['./listprofile.component.css']
})
export class ListprofileComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;
  profiles: profile[];
  searchTable: string;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private sharedService: ComunicationService
  ) {
    this.profiles = [];
  }

  ngOnInit() {
    this.getListProfiles();
  }
  
  getListProfiles() {
    this.profileService.getListProfiles().subscribe(response => {
      if(response.Code === 0) {
        this.profiles = response.Data;
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','error-snackbar');
    });
  }
  
  onEditProfile(Profile: profile) {
    this.sharedService.enviarMensaje(Profile);
    this.router.navigateByUrl(`/home/profiles/user`);
  }
  onCheckWarehouse() {

  }
  onClickNewUser() {
    this.sharedService.enviarMensaje(null);
    this.router.navigateByUrl(`/home/profiles/user`);
  }
}
