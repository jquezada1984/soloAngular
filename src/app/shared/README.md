# SharedModule

Este módulo contiene componentes, directivas y pipes reutilizables para toda la aplicación.

## Características

- **Componentes**: LoadingSpinner, Alert, Button
- **Directivas**: Highlight, Tooltip, ClickOutside
- **Pipes**: Truncate, FormatDate, CurrencyFormat
- **Módulos exportados**: CommonModule, FormsModule

## Instalación

```typescript
import { SharedModule } from './shared/shared-module';

@NgModule({
  imports: [SharedModule],
  // ...
})
export class AppModule { }
```

## Componentes

### LoadingSpinner

```html
<app-loading-spinner 
  [isLoading]="true" 
  message="Cargando datos...">
</app-loading-spinner>
```

### Alert

```html
<app-alert 
  type="success" 
  message="Operación completada exitosamente"
  [dismissible]="true"
  (close)="onAlertClose()">
</app-alert>
```

### Button

```html
<app-button 
  type="primary" 
  size="large"
  [loading]="isLoading"
  (click)="onButtonClick()">
  Guardar
</app-button>
```

## Directivas

### Highlight

```html
<p [appHighlight]="searchTerm" 
   [highlightColor]="'#ffff00'"
   [caseSensitive]="false">
  Este texto será resaltado si contiene el término de búsqueda.
</p>
```

### Tooltip

```html
<button [appTooltip]="'Información adicional'"
        tooltipPosition="top"
        [tooltipDelay]="500">
  Botón con tooltip
</button>
```

### ClickOutside

```html
<div [appClickOutside]="onClickOutside">
  <p>Este contenido se cerrará al hacer clic fuera de él</p>
</div>
```

## Pipes

### Truncate

```html
<p>{{ longText | truncate:100:true:'...' }}</p>
```

### FormatDate

```html
<p>{{ date | formatDate:'long' }}</p>
<p>{{ date | formatDate:'relative' }}</p>
<p>{{ date | formatDate:'datetime' }}</p>
```

### CurrencyFormat

```html
<p>{{ amount | currencyFormat:'EUR':'es-ES':'symbol' }}</p>
<p>{{ amount | currencyFormat:'USD':'en-US':'code' }}</p>
```

## Tipos Exportados

```typescript
import type { AlertType, ButtonType, ButtonSize } from './shared';

// AlertType: 'success' | 'error' | 'warning' | 'info'
// ButtonType: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
// ButtonSize: 'small' | 'medium' | 'large'
``` 