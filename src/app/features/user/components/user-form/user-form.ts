import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../user.service';

export interface User {
  id?: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  city: string;
  photo?: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css']
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Input() isVisible = false;
  @Output() save = new EventEmitter<User>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  userForm!: FormGroup;
  isEditing = false;
  isSubmitting = false;

  // Cámara
  isCameraOpen = false;
  photoDataUrl: string | null = null;
  availableDevices: MediaDeviceInfo[] = [];
  selectedDeviceId: string | null = null;
  private stream: MediaStream | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.initForm();
    this.getAvailableCameras();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      console.log('Usuario recibido en formulario:', this.user);
      if (this.user) {
        this.isEditing = true;
        setTimeout(() => {
          if (this.userForm && this.user) {
            this.userForm.patchValue(this.user);
            this.photoDataUrl = this.user.photo || null;
            console.log('Foto asignada al formulario:', this.photoDataUrl);
          }
        });
      } else {
        this.isEditing = false;
        if (this.userForm) {
          this.userForm.reset();
        }
        this.photoDataUrl = null;
      }
    }
  }

  private initForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      photo: ['']
    });
  }

  async getAvailableCameras() {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.availableDevices = devices.filter(d => d.kind === 'videoinput');
    if (this.availableDevices.length > 0) {
      this.selectedDeviceId = this.availableDevices[0].deviceId;
    }
  }

  async openCamera() {
    if (!navigator.mediaDevices?.getUserMedia) return;
    try {
      this.isCameraOpen = true;
      this.photoDataUrl = null;
      if (this.stream) {
        this.stopCamera();
      }
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: this.selectedDeviceId ? { exact: this.selectedDeviceId } : undefined }
      });
      if (this.videoRef && this.videoRef.nativeElement) {
        this.videoRef.nativeElement.srcObject = this.stream;
        this.videoRef.nativeElement.play();
      }
    } catch (err) {
      alert('No se pudo acceder a la cámara.');
      this.isCameraOpen = false;
    }
  }

  capturePhoto() {
    if (!this.videoRef || !this.canvasRef) return;
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.photoDataUrl = canvas.toDataURL('image/png');
      this.userForm.patchValue({ photo: this.photoDataUrl });
    }
    this.stopCamera();
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCameraOpen = false;
  }

  onDeviceChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedDeviceId = select.value;
    if (this.isCameraOpen) {
      this.openCamera();
    }
  }

  removePhoto() {
    this.photoDataUrl = null;
    this.userForm.patchValue({ photo: '' });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const userData: User = {
        id: this.user?.id || undefined,
        ...this.userForm.value,
        photo: this.photoDataUrl || ''
      };
      
      if (this.isEditing && userData.id) {
        // Actualizar usuario
        this.userService.updateUser(userData.id, userData).subscribe({
          next: (updatedUser) => {
            // Si hay una nueva foto, actualizarla por separado
            if (this.photoDataUrl && this.photoDataUrl.startsWith('data:image')) {
              this.userService.updateUserPhoto(userData.id!, this.photoDataUrl).subscribe({
                next: (userWithPhoto) => {
                  this.save.emit(userWithPhoto);
                  this.isSubmitting = false;
                  this.closeForm();
                },
                error: (photoErr) => {
                  const msg = photoErr?.error || 'Error al actualizar la foto del usuario';
                  alert(msg);
                  this.save.emit(updatedUser);
                  this.isSubmitting = false;
                  this.closeForm();
                }
              });
            } else {
              this.save.emit(updatedUser);
              this.isSubmitting = false;
              this.closeForm();
            }
          },
          error: (err) => {
            const msg = err?.error || 'Error al actualizar el usuario';
            alert(msg);
            this.isSubmitting = false;
          }
        });
      } else {
        // Crear nuevo usuario
        this.userService.createUser(userData).subscribe({
          next: (createdUser) => {
            this.save.emit(createdUser);
            this.isSubmitting = false;
            this.closeForm();
          },
          error: (err) => {
            const msg = err?.error || 'Error al crear el usuario';
            alert(msg);
            this.isSubmitting = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  closeForm() {
    this.close.emit();
    this.userForm.reset();
    this.isEditing = false;
    this.isSubmitting = false;
    this.photoDataUrl = null;
    this.stopCamera();
  }

  private markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  private generateId(): number {
    return Math.floor(Math.random() * 10000) + 1;
  }
} 