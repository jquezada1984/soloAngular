import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Mostrar mensaje amigable
    alert('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    // Loguear el error en consola para desarrolladores
    console.error('Error global:', error);
  }
} 