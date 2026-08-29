# Runtime temporal Date/Intl de TankOS

`@tankos/time-date-intl` implementa `@tankos/time` mediante las API JavaScript
`Date` e `Intl`. El nombre describe la tecnología sustituible; la etiqueta
anterior se ha eliminado porque no identificaba qué implementación se usaba.

Solo las raíces de composición y las pruebas de integración de adaptadores
pueden importar este paquete:

```ts
import { createDateIntlRuntime } from '@tankos/time-date-intl';

const runtime = createDateIntlRuntime();
```

`createDateIntlRuntime()` construye una única base de zonas horarias y compone
con ella `clock`, `timePort` y `timeZoneDatabase`. Para sustituciones puntuales
en pruebas también acepta implementaciones explícitas. Entre las librerías del
workspace solo puede depender de `@tankos/time`.

Cada operación se define y prueba en su propio fichero. El barrel público solo
expone `createDateIntlRuntime` y las factorías que una raíz de composición pueda
necesitar; los colaboradores internos exportados para pruebas siguen siendo
privados para consumidores del paquete.

Consulta [`docs/README.md`](docs/README.md) para conocer las reglas de uso.
