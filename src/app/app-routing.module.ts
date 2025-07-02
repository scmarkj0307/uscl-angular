import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackTransactionsComponent } from './components/track-transactions/track-transactions.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  { path: 'transactions', component: TrackTransactionsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
