import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { USER_ROUTES } from './user.routes';
import { UserListComponent } from './components/user-list/user-list';
import { UserFormComponent } from './components/user-form/user-form';

@NgModule({
  imports: [
    RouterModule.forChild(USER_ROUTES),
    UserListComponent,
    UserFormComponent
  ]
})
export class UserModule {} 