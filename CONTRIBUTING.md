# Contribuyendo al Proyecto

¡Gracias por tu interés en contribuir! Este proyecto está bajo licencia **CC BY-NC-SA 4.0**, lo que significa que puedes contribuir libremente para uso no comercial.

## Tipos de Contribuciones Bienvenidas

### Siempre Bienvenidas:
- Reportes de errores
- Mejoras en documentación
- Nuevas características no comerciales
- Pruebas y ejemplos
- Traducciones
- Optimizaciones de rendimiento

### Requieren Discusión Previa:
- Características orientadas a uso comercial
- Cambios en la arquitectura principal
- Modificaciones a la licencia

## Cómo Contribuir

### 1. Fork y Clonar
```bash
# Haz fork del repositorio en GitHub, luego:
git clone https://github.com/TU-USUARIO/waw-braves-js.git
cd waw-braves-js
npm install
```

### 2. Crear Rama
```bash
git checkout -b feature/mi-nueva-caracteristica
# o
git checkout -b fix/arreglar-error-especifico
```

### 3. Desarrollar
- Sigue las convenciones de código existentes
- Añade comentarios claros en español
- Prueba tus cambios localmente
- Actualiza documentación si es necesario

### 4. Commit y Push
```bash
git add .
git commit -m "feat: descripción clara del cambio"
git push origin feature/mi-nueva-caracteristica
```

### 5. Pull Request
- Descripción clara de los cambios
- Referencias a issues relacionados
- Confirma que no rompe funcionalidad existente

## Convenciones de Código

### Commits:
```bash
feat: nueva característica
fix: corrección de error
docs: actualización de documentación
style: formato, punto y coma faltante, etc
refactor: refactoring de código
test: añadir pruebas
chore: actualizar build, etc
```

### Código JavaScript:
```javascript
// Usar camelCase
const clientId = process.env.CLIENT_ID;

// Comentarios descriptivos en español
// Procesar mensaje entrante y enviar al webhook
async function processIncomingMessage(msg) {
  // Implementación...
}

// Manejo de errores consistente
try {
  await client.sendMessage(chatId, message);
  console.log(`Mensaje enviado a ${chatId}`);
} catch (err) {
  console.error(`Error enviando mensaje:`, err.message);
}
```

## Reportar Errores

### Antes de reportar:
1. Busca en issues existentes
2. Actualiza a la última versión
3. Verifica tu configuración

### Incluir en el reporte:
```markdown
**Descripción del error:**
Descripción clara y concisa del problema

**Pasos para reproducir:**
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

**Comportamiento esperado:**
Lo que esperabas que pasara

**Información del sistema:**
- SO: [Ubuntu 22.04]
- Node.js: [v18.17.0]
- Versión del bot: [v1.1.2]

**Logs relevantes:**
```
Pegar logs aquí
```
```

## Sugerir Características

### Para nuevas características:
1. Crear issue con etiqueta `enhancement`
2. Describir el caso de uso claramente
3. Explicar la implementación propuesta
4. Considerar alternativas existentes

### Preguntas a responder:
- ¿Resuelve un problema real?
- ¿Es compatible con la licencia no comercial?
- ¿Afecta el rendimiento?
- ¿Requiere dependencias adicionales?

## Licencia de Contribuciones

Al contribuir, aceptas que:

- Tu contribución se licencia bajo **CC BY-NC-SA 4.0**
- Mantienes los derechos de autor de tu trabajo
- Garantizas que tienes derecho a licenciar tu contribución
- Tu contribución es para uso **no comercial**

## Uso Comercial

Si tu contribución está orientada a uso comercial o quieres discutir oportunidades comerciales:

**Contacto:** hello@braveslab.com  
**Website:** braveslab.com

## Reconocimientos

Todos los contribuyentes serán reconocidos en:
- CONTRIBUTORS.md
- Notas de versión  
- Documentación del proyecto

---

**¿Preguntas?** No dudes en abrir un issue o contactarnos directamente!

¡Gracias por hacer este proyecto mejor!