import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataUser = {
    name: 'Mario Lopez',
    warehouse: 'CEDIS'
  }
  submodule = [
      {
        path: 'locationMovement ',
        title: 'Mov. Ubicación',
        icon: '',
      },
      {
        path: 'transferRequest ',
        title: 'Solicitud Traspaso',
        icon: '',
      },
      {
        path: 'sendProduction',
        title: 'Env. a Producción',
        icon: '',
      },
      {
        path: 'transferReceipt  ',
        title: 'Recibo de Traspaso',
        icon: '',
      },
      {
        path: 'manualTransfer   ',
        title: 'Transpaso Manual',
        icon: '',
      }
  ];
  modules = [
    {
      path: 'dasboard',
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
      submodules: this.submodule
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
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  mode = new FormControl('over');

  logout() {
    //this.auth.doLogout();
    this.router.navigateByUrl('/login');
  }
}
