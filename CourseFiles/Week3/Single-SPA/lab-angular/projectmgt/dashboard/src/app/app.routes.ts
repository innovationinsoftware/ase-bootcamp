import { Routes } from '@angular/router';
import { HelpSectionComponent } from './help-section/help-section.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'help', component: HelpSectionComponent },
  { path: '**', redirectTo: '' },
];
