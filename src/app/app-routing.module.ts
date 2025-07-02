import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { TrackTransactionsComponent } from './track-transactions/track-transactions.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { GetUserComponent } from './get-user/get-user.component';

const routes: Routes = [
  { path: 'get-user', component: GetUserComponent },
  { path: 'home', component: LandingPageComponent },
  { path: 'transactions', component: TrackTransactionsComponent },
  { path: 'users', component: UserListComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
