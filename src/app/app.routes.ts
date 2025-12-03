import { Routes } from '@angular/router';
import { BrowserComponent } from './features/video-games/pages/browser/browser.component';
import { EditComponent } from './features/video-games/pages/edit/edit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/browser', pathMatch: 'full' },
  { path: 'browser', component: BrowserComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: '**', redirectTo: '/browser' }
];