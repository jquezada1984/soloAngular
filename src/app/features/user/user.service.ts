import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, from } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaz para la respuesta del backend
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  city: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Interfaz para el frontend
export interface User {
  id?: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  city: string;
  photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.baseApiUrl + '/api/Users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<UserResponse[]>(this.apiUrl).pipe(
      switchMap(users => from([users.map(user => this.mapUserResponse(user))]))
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`).pipe(
      switchMap(user => from([this.mapUserResponse(user)]))
    );
  }

  createUser(user: User): Observable<User> {
    const formData = this.createFormData(user);
    return this.http.post<UserResponse>(this.apiUrl, formData).pipe(
      switchMap(userResponse => from([this.mapUserResponse(userResponse)]))
    );
  }

  updateUser(id: string, user: User): Observable<User> {
    // Para actualización, enviar solo los datos de texto como JSON
    const updateData = {
      name: user.name,
      email: user.email,
      age: user.age,
      phone: user.phone,
      city: user.city
    };
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, updateData).pipe(
      switchMap(userResponse => from([this.mapUserResponse(userResponse)]))
    );
  }

  updateUserPhoto(id: string, photoDataUrl: string): Observable<User> {
    const formData = new FormData();
    const photoFile = this.dataURLtoFile(photoDataUrl, 'photo.png');
    formData.append('PhotoFile', photoFile);
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}/photo`, formData).pipe(
      switchMap(userResponse => from([this.mapUserResponse(userResponse)]))
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Mapear respuesta del backend al formato del frontend
  private mapUserResponse(userResponse: UserResponse): User {
    return {
      id: userResponse.id,
      name: userResponse.name,
      email: userResponse.email,
      age: userResponse.age,
      phone: userResponse.phone,
      city: userResponse.city,
      photo: userResponse.photoUrl // Mapear photoUrl a photo
    };
  }

  private createFormData(user: User): FormData {
    const formData = new FormData();
    
    // Agregar campos de texto
    formData.append('Name', user.name);
    formData.append('Email', user.email);
    formData.append('Age', user.age.toString());
    formData.append('Phone', user.phone);
    formData.append('City', user.city);
    
    // Agregar foto si existe
    if (user.photo && user.photo.startsWith('data:image')) {
      const photoFile = this.dataURLtoFile(user.photo, 'photo.png');
      formData.append('PhotoFile', photoFile);
    }
    
    return formData;
  }

  private dataURLtoFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }

  // Convertir URL de imagen a Data URL
  async urlToDataURL(imageUrl: string): Promise<string> {
    try {
      console.log('Convirtiendo URL a Data URL:', imageUrl);
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log('URL convertida exitosamente a Data URL');
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          console.error('Error en FileReader:', error);
          reject(error);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error al convertir URL a Data URL:', error);
      return '';
    }
  }

  // Obtener usuario con imagen convertida a Data URL
  getUserByIdWithPhoto(id: string): Observable<User> {
    console.log('Obteniendo usuario con foto, ID:', id);
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`).pipe(
      switchMap((userResponse: UserResponse) => {
        const user = this.mapUserResponse(userResponse);
        console.log('Usuario obtenido:', user);
        if (user.photo && user.photo.startsWith('/')) {
          console.log('Convirtiendo foto del usuario:', user.photo);
          // Convertir URL relativa a absoluta
          const fullImageUrl = environment.baseApiUrl + user.photo;
          return from(this.urlToDataURL(fullImageUrl)).pipe(
            switchMap(dataUrl => {
              console.log('Usuario con foto convertida:', { ...user, photo: dataUrl });
              return from([{ ...user, photo: dataUrl }]);
            })
          );
        }
        console.log('Usuario sin foto o foto ya es Data URL:', user);
        return from([user]);
      })
    );
  }
} 