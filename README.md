# Calculadora para iPhone · v2

Calculadora web instalable para iPhone 15. HTML, CSS y JavaScript sin dependencias ni compilación.

## Interfaz

- Operación completa en pantalla mientras se escribe; expresión gris sobre el resultado al pulsar igual.
- Dos reducciones de fuente según el ancho disponible, contando cifras y operadores. Después se mantiene el tamaño mínimo y se difumina el exceso por la izquierda, sin truncar el cálculo.
- Los botones crecen un 20 % en 0,2 segundos, permanecen grandes durante la pulsación y vuelven a su tamaño en 0,2 segundos al soltar. Los botones grises se aclaran y los operadores se vuelven amarillos.
- Mantener el separador decimal durante 3 segundos abre los ajustes sin introducir un decimal.
- Ajustes de posición de botonera, pantalla e iconos; separación independiente de filas y columnas; separación de iconos. Cambios en directo y guardado local automático.
- Formatos europeo (1.234,56) e internacional (1,234.56).
- Iconos superiores decorativos. Motor aritmético original conservado.

## Instalar o actualizar

Servir la carpeta raíz por HTTPS. En Safari: Compartir > Añadir a pantalla de inicio.

Para actualizar una instalación existente, el alojamiento debe estar activo. Abrir la app con conexión y volver a abrirla si aún aparece la versión anterior. El service worker v2 sustituye la caché anterior cuando la nueva versión termina de descargarse.

El repositorio permanece privado. GitHub Pages no está habilitado; la copia ya instalada no recibirá estos cambios hasta publicar de nuevo la web.

## Validación

Comprobados el resultado de 123+42×3 (249), decimales exactos, representación de la expresión, cambio de formato y retención del número largo. Comprobados con eventos simulados el estado mantenido del botón, la apertura del menú tras 3 segundos, la supresión del decimal, la pulsación corta y la cancelación.

La vista previa local no fue accesible desde el navegador del entorno. Pendiente comprobar visualmente en Safari del iPhone la animación, los márgenes y la persistencia entre sesiones reales.
