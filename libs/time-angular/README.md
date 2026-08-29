# Integración temporal de TankOS con Angular

`@tankos/time-angular` adapta los contratos temporales neutrales a inyección de
dependencias y presentación Angular. Exporta servicios, tokens y los pipes
independientes `tankInstant`, `tankAquariumInstant`, `tankUserInstant`,
`tankLocalDate`, `tankDuration` y `tankHumanizeDuration`.

La aplicación entrega un runtime ya compuesto:

```ts
import { createDateIntlRuntime } from '@tankos/time-date-intl';
import { provideTimeAngular } from '@tankos/time-angular';

provideTimeAngular(createDateIntlRuntime());
```

`provideTimeAngular` no recibe solo reloj y base de zonas para construir el
`TimePort`: hacerlo acoplaría Angular a Date/Intl. La factoría del runtime
concreto realiza esa composición y Angular recibe el contrato neutral completo.

La localización usa el contrato cerrado `LOCALE_ID` de Angular. La zona de
presentación se resuelve por intención: opción explícita, zona del acuario, zona
del usuario y UTC. Los `LocalDate` nunca se desplazan por una zona.

Las operaciones de formato tienen pruebas unitarias específicas. Las pruebas
que levantan inyección Angular usan Spectator; los recorridos E2E de navegador,
si existen, pertenecen a Playwright.

Consulta [`docs/README.md`](docs/README.md) para ver los ejemplos completos.
