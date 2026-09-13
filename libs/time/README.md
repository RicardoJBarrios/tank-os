# TankOS Time

Un único módulo para los valores temporales y su uso en TankOS: lógica,
validación Zod, persistencia Firestore, servicios/pipes Angular y controles
Angular Material. Solo el motor sustituible permanece en `time-luxon`.

| Importación              | Responsabilidad                                  |
| ------------------------ | ------------------------------------------------ |
| `@tankos/time`           | Valores, puertos, cálculos y esquemas Zod        |
| `@tankos/time/angular`   | Composición, servicios, pipes y `TimeField`      |
| `@tankos/time/firestore` | Conversión de valores a representación Firestore |
| `@tankos/time-luxon`     | Implementación Luxon elegida por la app          |

Las tres primeras entradas pertenecen al **mismo proyecto Nx y paquete**.
Separan las importaciones, no multiplican librerías ni configuraciones.
El núcleo sigue sin depender de Angular, Firebase o Material.

```ts
// Raíz de composición de la aplicación
import { provideTimeAngular } from '@tankos/time/angular';
import { createLuxonRuntime } from '@tankos/time-luxon';

const providers = [provideTimeAngular(createLuxonRuntime())];
```

`TimeField` usa el calendario y el selector de hora de Material. Se conecta
a `FormControl`/`FormGroup` o a Signal Forms mediante el puente CVA de Angular.
Sus valores son `LocalDate | null`, `LocalTime | null` o `Instant | null`
según `kind`; nunca un `Date`.

Consulta el [contrato](docs/README.md), los
[ejemplos de formularios](docs/forms.md) y la
[representación Firestore](docs/firestore.md).

`TimeField` usa el adaptador oficial Material/Luxon, con `locale` del usuario y
`timeZone` del contexto reactivos. No publica DateTime como valor de formulario.
La [auditoría](docs/localization-audit.md) recoge la API ampliada, las diferencias
deliberadas frente a DatePipe y las pruebas de localización.

## Verificación

```sh
NX_DAEMON=false pnpm nx run-many -p time,time-luxon -t lint,typecheck,test,build --skip-nx-cache --parallel=2
```

Los tests de Time incluyen el núcleo, Zod, las conversiones Firestore y la
integración Material con las dos APIs de formularios. No requieren acceder a
Firebase: estas conversiones no escriben documentos.

Validación de Time (2026-09-07): 384 pruebas, con cobertura V8 del 100 % en
líneas, sentencias, funciones y ramas. La simplificación usa directamente el
adaptador oficial de Material/Luxon, sin parser estricto propio. Las pruebas
incluyen ambas APIs de formularios y cambios reactivos de locale y zona sin
emitir modificaciones. El runtime separado también usa Luxon; su
[contrato](../time-luxon/docs/README.md) documenta los cambios de parsing,
normalización DST y serialización frente al motor anterior.
El recorrido Chromium sobre los artefactos compilados comprueba entrada regional,
límites, errores al enviar, teclado/foco, Signal Forms y cambios de preferencias.

Avisos del entorno: JSDOM no interpreta las reglas CSS `@layer` de los overlays
de CDK y no implementa scroll; el test adapta únicamente `scrollIntoView`.
La compilación de las librerías y el recorrido Chromium pasan. Con Luxon como
runtime, TankOS alcanza 1,01 MB iniciales y su build de producción falla por
11,2 kB sobre el límite de error de 1 MB (aviso: 900 kB). No se ha ampliado
el presupuesto: resolverlo exige aceptar el nuevo coste u optimizar el arranque.

## Adopción del producto

`Aquarium.establishedAt` todavía utiliza `Date` y el agregado aún no modela
su zona IANA. La migración debe modificar conjuntamente dominio, DTO, formulario
y persistencia. Que este módulo sea reutilizable no cierra esa deuda vertical.
