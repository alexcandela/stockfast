import { Routes } from '@angular/router';
import { GeneralComponent } from './pages/general-component/general-component';
import { StockComponent } from './pages/stock-component/stock-component';
import { VentasComponent } from './pages/ventas-component/ventas-component';
import { SeoComponent } from './pages/seo-component/seo-component';
import { EstadisticasComponent } from './pages/estadisticas-component/estadisticas-component';
import { AjustesComponent } from './pages/ajustes-component/ajustes-component';
import { AddloteComponent } from './pages/addlote-component/addlote-component';

export const routes: Routes = [
  { path: 'general', component: GeneralComponent },
  { path: 'stock', component: StockComponent },
  { path: 'addlote', component: AddloteComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'seo', component: SeoComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'ajustes', component: AjustesComponent },
  { path: '', redirectTo: '/general', pathMatch: 'full' },
  { path: '**', redirectTo: '/general' }
];
