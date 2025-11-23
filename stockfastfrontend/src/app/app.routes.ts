import { Routes } from '@angular/router';
import { GeneralComponent } from './pages/general-component/general-component';
import { StockComponent } from './pages/stock-component/stock-component';
import { VentasComponent } from './pages/ventas-component/ventas-component';
import { SeoComponent } from './pages/seo-component/seo-component';
import { EstadisticasComponent } from './pages/estadisticas-component/estadisticas-component';
import { AjustesComponent } from './pages/ajustes-component/ajustes-component';
import { AddloteComponent } from './pages/addlote-component/addlote-component';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { LoginComponent } from './pages/login-component/login-component';
import { RegisterComponent } from './pages/register-component/register-component';

import { authGuard } from './core/guards/auth-guard';
import { Stockfastpropage } from './layouts/stockfastpropage/stockfastpropage';
import { NotFoundPage } from './layouts/notfoundpage/notfoundpage';

export const routes: Routes = [
  // Layout para autenticación
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  {
    path: 'stockfastpro',
    component: Stockfastpropage,
    children: [],
  },

  // Layout del dashboard
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' }, // <-- ruta raíz
      { path: 'general', component: GeneralComponent },
      { path: 'stock', component: StockComponent },
      { path: 'addlote', component: AddloteComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'seo', component: SeoComponent },
      { path: 'estadisticas', component: EstadisticasComponent },
      { path: 'ajustes', component: AjustesComponent },
    ],
  },

  // Fallback
  { path: '**', component: NotFoundPage },
];
