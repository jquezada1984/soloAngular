# Configuración de GitHub Pages para Angular

## Pasos para publicar en GitHub Pages

### 1. Configurar el repositorio en GitHub

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** > **Pages**
3. En **Source**, selecciona **Deploy from a branch**
4. En **Branch**, selecciona **gh-pages** y **/(root)**
5. Haz clic en **Save**

### 2. Actualizar la configuración

Antes de hacer el deploy, necesitas actualizar los siguientes archivos con tu información:

#### En `angular.json`:
```json
"deploy": {
  "builder": "angular-cli-ghpages:deploy",
  "options": {
    "baseHref": "/TU_REPOSITORIO/",
    "repo": "https://github.com/TU_USUARIO/TU_REPOSITORIO.git",
    "branch": "gh-pages",
    "name": "TU_NOMBRE",
    "email": "TU_EMAIL"
  }
}
```

#### En `package.json`:
```json
"deploy": "ng deploy --base-href=https://TU_USUARIO.github.io/TU_REPOSITORIO/",
"deploy:gh-pages": "ng deploy --base-href=https://TU_USUARIO.github.io/TU_REPOSITORIO/"
```

**Reemplaza:**
- `TU_USUARIO` con tu nombre de usuario de GitHub
- `TU_REPOSITORIO` con el nombre de tu repositorio
- `TU_NOMBRE` con tu nombre real
- `TU_EMAIL` con tu email de GitHub

### 3. Configurar Git (si no lo has hecho)

```bash
git config --global user.name "TU_NOMBRE"
git config --global user.email "TU_EMAIL"
```

### 4. Hacer el deploy

```bash
# Construir la aplicación para producción
npm run build:prod

# Hacer el deploy a GitHub Pages
npm run deploy
```

### 5. Verificar el deploy

1. Ve a tu repositorio en GitHub
2. Ve a **Actions** para ver el progreso del deploy
3. Una vez completado, tu aplicación estará disponible en:
   `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

## Notas importantes

- El primer deploy puede tardar unos minutos
- Asegúrate de que tu repositorio sea público para usar GitHub Pages gratuito
- Si tu repositorio es privado, necesitarás GitHub Pro para usar GitHub Pages
- Cada vez que hagas push a la rama principal, puedes ejecutar `npm run deploy` para actualizar el sitio

## Solución de problemas

### Error de autenticación
Si tienes problemas con la autenticación, puedes usar un token de acceso personal:
1. Ve a GitHub > Settings > Developer settings > Personal access tokens
2. Genera un nuevo token con permisos de repo
3. Usa el token como contraseña cuando te lo pida

### Error de base-href
Asegúrate de que el `baseHref` en `angular.json` coincida con la URL de tu repositorio en GitHub Pages. 