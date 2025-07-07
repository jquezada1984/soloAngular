import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../../../shared/components/nav-bar/nav-bar';
import { UserFormComponent, User } from '../user-form/user-form';
import { UserService } from '../../user.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NavBarComponent, UserFormComponent],
  templateUrl: './user-list.html',
  styleUrls: ['../../../../shared/styles/list-styles.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  showForm = false;
  selectedUser: User | null = null;
  environment = environment;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        alert('Error al obtener los usuarios');
      }
    });
  }

  addUser() {
    this.selectedUser = null;
    this.showForm = true;
  }

  editUser(user: User) {
    console.log('Editando usuario:', user);
    // Obtener el usuario con la imagen convertida a Data URL
    this.userService.getUserByIdWithPhoto(user.id!).subscribe({
      next: (userWithPhoto) => {
        console.log('Usuario con foto obtenido para editar:', userWithPhoto);
        this.selectedUser = userWithPhoto;
        this.showForm = true;
      },
      error: (err) => {
        console.error('Error al obtener usuario con foto:', err);
        // Fallback: usar el usuario sin foto
        this.selectedUser = { ...user };
        this.showForm = true;
      }
    });
  }

  deleteUser(userId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.users = this.users.filter(user => user.id !== userId);
    }
  }

  onSaveUser(user: User) {
    if (this.selectedUser) {
      // Editar usuario existente
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        // Actualizar con la URL de la imagen del backend
        this.users[index] = { ...user, photo: user.photo };
      }
    } else {
      // Agregar nuevo usuario
      this.users.push(user);
    }
  }

  onCloseForm() {
    this.showForm = false;
    this.selectedUser = null;
  }

  trackByUserId(index: number, user: User): string {
    return user.id!;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // Mostrar avatar con inicial en su lugar
    const avatar = img.parentElement?.querySelector('.datagrid-avatar') as HTMLElement;
    if (avatar) {
      avatar.style.display = 'block';
    }
  }
} 
