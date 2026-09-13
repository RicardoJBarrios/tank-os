# Runtime temporal Luxon de TankOS

`@tankos/time-luxon` implementa los puertos neutrales de `@tankos/time`.
Luxon gestiona parsing ISO, serialización, reloj, calendario, zonas y resolución
DST. No se mantiene un segundo parser ni un algoritmo propio de búsqueda de offsets.

```ts
import { createLuxonRuntime } from '@tankos/time-luxon';

const runtime = createLuxonRuntime();
provideTimeAngular(runtime);
```

Solo las raíces de composición y las pruebas importan este runtime.
Sus valores públicos siguen siendo `Instant`, `LocalDate` y `Duration`;
no se persisten objetos `DateTime` ni `Duration` de Luxon.

La sustitución elimina el paquete anterior y sus aliases, no mantiene dos motores.
Véase [el contrato y los cambios de comportamiento](docs/README.md).

Validación del runtime (2026-09-07): 319 pruebas, con cobertura V8 del 100 %
en líneas, sentencias, funciones y ramas. El código de producción pasa de
1.337 a 668 líneas respecto al motor sustituido (32 módulos auxiliares menos).
Las librerías y Chromium compilan/ejecutan correctamente. La compilación de
producción de TankOS queda bloqueada por el presupuesto de bundle inicial:
1,01 MB, 11,2 kB por encima del límite de error de 1 MB. El presupuesto no
se ha modificado.

```sh
NX_DAEMON=false NX_ISOLATE_PLUGINS=false pnpm nx run-many -p time,time-luxon -t lint,typecheck,test,build --parallel=2
NX_DAEMON=false NX_ISOLATE_PLUGINS=false pnpm nx browser-test time
```
