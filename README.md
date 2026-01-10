# 🎭 El Juego del Impostor

Un juego web de deducción social diseñado con una interfaz moderna y oscura ("Dark Mode"). El objetivo es descubrir quiénes son los impostores entre el grupo de jugadores.

## 🚀 Novedades y Funcionalidades

Hemos actualizado la aplicación para mejorar la experiencia de usuario y la lógica del juego. Aquí están los cambios principales:

### 1. Navegación Fluida
*   **Sistema de Pantallas**: La aplicación funciona como una "Single Page Application" (SPA). No recarga la página al cambiar de sección.
*   **Historial del Navegador**: Ahora puedes usar los botones de **Atrás** y **Adelante** del navegador para moverte entre el menú y las instrucciones.
*   **Logo Home**: El logo de "El Impostor" en la esquina superior izquierda siempre te devuelve a la pantalla inicial.

### 2. Interfaz Principal
*   **Diseño Limpio**: Se eliminaron las tarjetas redundantes de la portada para centrar la atención en los botones de acción.
*   **Botones Centrales**: Accesos directos grandes y claros para "Jugar Ahora" y "Cómo se juega".

### 3. Pantalla de Instrucciones
*   **Guía Visual**: Al hacer clic en "Cómo se juega", verás una guía paso a paso con tarjetas animadas.
*   **Animaciones**: Las tarjetas aparecen en cascada para una experiencia más dinámica.

### 4. Configuración de Partida (Lógica)
*   **Agregar Jugadores**: 
    *   Puedes presionar **Enter** en el teclado para agregar nombres rápidamente.
    *   Interfaz de lista con opción para eliminar jugadores.
*   **Regla de Mínimos**: El botón de continuar (ahora llamado **"Hecho"**) solo aparece si hay **4 jugadores o más**.
*   **Cálculo de Impostores**:
    *   Al finalizar la lista, un modal te pregunta cuántos impostores quieres.
    *   **Validación Matemática**: El sistema calcula automáticamente el máximo permitido.
    *   *Regla*: La cantidad de impostores debe ser menor a la tercera parte del total (`Max < Total / 3`).

## 🛠️ Tecnologías

*   **HTML5**: Estructura semántica.
*   **CSS3**: Variables CSS, Flexbox, Grid y Animaciones (sin frameworks externos).
*   **JavaScript (Vanilla)**: Lógica de estado, manipulación del DOM y History API.

## 📂 Estructura del Proyecto

*   `index.html`: Contiene todas las "pantallas" (Portada, Instrucciones, Configuración) que se muestran u ocultan según necesidad.
*   `style.css`: Estilos globales, modo oscuro y animaciones.
*   `main.js`: Lógica del juego, manejo de eventos y navegación.

## 🎮 Cómo probarlo

1.  Abre el archivo `index.html` en tu navegador.
2.  Navega a "Cómo se juega" y prueba el botón de "Volver" o el logo.
3.  Ve a "Jugar Ahora".
4.  Agrega al menos 4 nombres (usa Enter para ir rápido).
5.  Presiona "Hecho" y verás el modal que limita la cantidad de impostores según la lógica del juego.