import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { module, sub_module } from 'src/app/models/menu';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  titleModule: string = '';
  modules: module[];
  dataUser = {
    name: 'Mario Lopez',
    warehouse: 'CEDIS'
  }

  constructor(
    private router: Router
  ) { 
  }

  ngOnInit() {
    this.getConfigMenu();
    this.getTitleModule();
  }
  mode = new FormControl('over');

  logout() {
    //this.auth.doLogout();
    this.router.navigateByUrl('/login');
  }
  onChangeTittle(value: string) {
    this.titleModule = value;
  }
  getConfigMenu() {
    
    this.modules = [
      {
        path: 'dashboard',
        title: 'Inicio',
        icon: 'dashboard',
        submodules: []
      },
      {
        path: 'quality',
        title: 'Calidad',
        icon: 'verified',
        submodules: []
      },
      {
        path: '',
        title: 'Traspasos',
        icon: 'published_with_changes',
        submodules: [
          {
            path: 'move',
            title: 'Mov. Ubicación',
            icon: '',
          },
          {
            path: 'request',
            title: 'Solicitud Traspaso',
            icon: '',
          },
          {
            path: 'production',
            title: 'Env. a Producción',
            icon: '',
          },
          {
            path: 'receipt',
            title: 'Recibo de Traspaso',
            icon: '',
          },
          {
            path: 'manual',
            title: 'Transpaso Manual',
            icon: '',
          }
        ]
      },
      {
        path: 'shipping',
        title: 'Remisionado',
        icon: 'local_shipping',
        submodules: []
      },
      {
        path: 'shipment',
        title: 'Embarque',
        icon: 'directions_boat',
        submodules: []
      },
      {
        path: 'inventory',
        title: 'Rec. de Inventario',
        icon: 'checklist',
        submodules: []
      },
      {
        path: 'profiles',
        title: 'Adm. Perfiles',
        icon: 'group',
        submodules: []
      },
      {
        path: 'folio',
        title: 'Folio SAP',
        icon: 'qr_code_2',
        submodules: []
      }
    ];;
  }
  getTitleModule() {
    let urlArray = this.router.url.split('/');
    let lenghtArray = urlArray.length;
    let path = this.modules.find(val => val.path === urlArray[lenghtArray-1]);
    if(path === undefined) {
      let { submodules } = this.modules.find(sub => sub.submodules.length > 0);
      this.titleModule = submodules.find(val => val.path === urlArray[lenghtArray-1]).title;
    } else {
      this.titleModule = this.modules.find(val => val.path === urlArray[lenghtArray-1]).title;
    }
  }
}
