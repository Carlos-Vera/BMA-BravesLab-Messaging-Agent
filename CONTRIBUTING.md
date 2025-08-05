# Contribuyendo al Proyecto

Gracias por tu interes en contribuir! Este proyecto esta bajo licencia **CC BY-NC-SA 4.0**, lo que significa que puedes contribuir libremente para uso no comercial.

## Tipos de Contribuciones Bienvenidas

### Siempre Bienvenidas:
- Reportes de errores
- Mejoras en documentacion
- Nuevas caracteristicas no comerciales
- Pruebas y ejemplos
- Traducciones
- Optimizaciones de rendimiento

### Requieren Discusion Previa:
- Caracteristicas orientadas a uso comercial
- Cambios en la arquitectura principal
- Modificaciones a la licencia

## Como Contribuir

### 1. Fork y Clonar
```bash
# Haz fork del repositorio en GitHub, luego:
git clone https://github.com/Carlos-Vera/waw-braves-js.git
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
- Sigue las convenciones de codigo existentes
- Anade comentarios claros en espanol
- Prueba tus cambios localmente
- Actualiza documentacion si es necesario

### 4. Commit y Push
```bash
git add .
git commit -m "feat: descripcion clara del cambio"
git push origin feature/mi-nueva-caracteristica
```

### 5. Pull Request
- Descripcion clara de los cambios
- Referencias a issues relacionados
- Confirma que no rompe funcionalidad existente

## Convenciones de Codigo

### Commits:
```bash
feat: nueva caracteristica
fix: correccion de error
docs: actualizacion de documentacion
style: formato, punto y coma faltante, etc
refactor: refactoring de codigo
test: anadir pruebas
chore: actualizar build, etc
```

### Codigo JavaScript:
```javascript
// Usar camelCase
const clientId = process.env.CLIENT_ID;

// Comentarios descriptivos en espanol
// Procesar mensaje entrante y enviar al webhook
async function processIncomingMessage(msg) {
  // Implementacion...
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
2. Actualiza a la ultima version
3. Verifica tu configuracion

### Incluir en el reporte:
```markdown
**Descripcion del error:**
Descripcion clara y concisa del problema

**Pasos para reproducir:**
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

**Comportamiento esperado:**
Lo que esperabas que pasara

**Informacion del sistema:**
- SO: [Ubuntu 22.04]
- Node.js: [v18.17.0]
- Version del bot: [v1.0.0]

**Logs relevantes:**
```
Pegar logs aqui
```
```

## Sugerir Caracteristicas

### Para nuevas caracteristicas:
1. Crear issue con etiqueta `enhancement`
2. Describir el caso de uso claramente
3. Explicar la implementacion propuesta
4. Considerar alternativas existentes

### Preguntas a responder:
- Resuelve un problema real?
- Es compatible con la licencia no comercial?
- Afecta el rendimiento?
- Requiere dependencias adicionales?

## Licencia de Contribuciones

Al contribuir, aceptas que:

- Tu contribucion se licencia bajo **CC BY-NC-SA 4.0**
- Mantienes los derechos de autor de tu trabajo
- Garantizas que tienes derecho a licenciar tu contribucion
- Tu contribucion es para uso **no comercial**

## Uso Comercial

Si tu contribucion esta orientada a uso comercial o quieres discutir oportunidades comerciales:

**Contacto:** carlos@braveslab.com  
**WhatsApp:** +34 623 928 854

## Reconocimientos

Todos los contribuyentes seran reconocidos en:
- CONTRIBUTORS.md
- Notas de version  
- Documentacion del proyecto

---

**Preguntas?** No dudes en abrir un issue o contactarnos directamente!

Gracias por hacer este proyecto mejor!