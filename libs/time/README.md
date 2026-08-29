# TankOS Time

`@tankos/time` es el contrato temporal independiente de la implementación.
Exporta `Instant`, `LocalDate`, `Duration`, los puertos, `TimeRuntime` y los
esquemas Zod canónicos. No selecciona ni conoce `Date`, `Intl`, Angular o
Firebase.

```ts
import { createZodTimeSchemas, type TimePort } from '@tankos/time';

const schemas = createZodTimeSchemas(timePort, timeZoneDatabase);
const instant = schemas.instant.parse(input.occurredAt);
```

Las librerías de dominio y aplicación dependen de este paquete. No deben crear
valores `Date`: la raíz de composición suministra un `TimeRuntime` concreto.
Zod permanece aquí porque es una decisión arquitectónica cerrada y la frontera
de parseo de la aplicación, no un runtime temporal opcional.

## Regla estructural

Cada función o clase temporal tiene un fichero, TSDoc y prueba unitaria
específica. Los casos límite pertenecen a la operación más concreta; las
factorías de objetos solo componen esas operaciones y prueban el cableado o un
recorrido feliz. Los `index.ts` de cada directorio limitan la API pública: que
una operación interna se exporte desde su fichero para probarla no la convierte
en API del paquete.

## Deuda conocida de adopción

El agregado `Aquarium` todavía utiliza `Date` para `establishedAt` y aún no
modela su zona IANA. Su migración debe cambiar de forma atómica dominio, DTO
Zod, formulario y representación Firestore. No debe introducirse una conversión
parcial que oculte la incompatibilidad.

Comandos de calidad:

- `pnpm nx run time:build`
- `pnpm nx run time:test`
- `pnpm nx run time:lint`
- `pnpm nx run time-date-intl:test`
- `pnpm nx run time-angular:test`
- `pnpm nx run time-firestore:test`

Consulta [`docs/README.md`](docs/README.md) para ver el contrato completo.
