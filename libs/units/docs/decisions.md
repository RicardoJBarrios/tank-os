# Units: decisiones de dominio

Este documento es la fuente de verdad de las decisiones específicas de
`@tankos/units`. Las decisiones generales del producto y las de verticales aún
no implementadas permanecen en `.codex/archive/`.

## Alcance

Units modela definiciones de unidades y su representación. No modela
conversiones, mediciones, parámetros, acuarios ni observaciones. Una medición
podrá referenciar un código de unidad, pero la relación no invierte la
dependencia.

## Definiciones

- Una unidad tiene identidad estable, código cualificado, sistema y metadatos
  de representación.
- Las unidades son públicas o privadas; no existe un catálogo en memoria
  paralelo.
- Una unidad privada tiene propietario. El keeper puede usar y administrar sus
  privadas, pero solo puede leer las públicas. El admin puede administrar
  ambos ámbitos y promover una privada a pública.
- El código es un identificador de negocio y no se edita al modificar una
  unidad. La aplicación conserva la identidad y el adaptador impone la
  unicidad lógica.
- Las revisiones se almacenan como nuevos registros cuando cambia el contrato;
  el ciclo de vida técnico pertenece a `data-access`. La sustitución requiere
  una operación atómica del adaptador y no admite un fallback create-then-retire.
- El servicio de aplicación autoriza cada lectura y comando y limita las listas
  de keeper a su propietario. El repositorio no recibe ni interpreta roles.

## Representación

Una representación conserva símbolo, fallback ASCII, posición y espaciado. El
formateo textual pertenece a la presentación; el dominio solo conserva los
metadatos necesarios para producirlo.

La definición de unidades no conoce Angular, Firebase, Firestore ni un
proveedor de traducciones. Los esquemas Zod canónicos forman parte de
`@tankos/units` como frontera de entrada y salida, sin constituir un módulo
publicable separado.

## Conversiones

Units no define fórmulas, factores, contextos de redondeo ni un motor de
conversiones. Las transformaciones pertenecen al caso de uso consumidor, en
principio Measurements. Si varios dominios necesitan en el futuro un motor
reutilizable, se evaluará como módulo separado a partir de esos requisitos; no
se mantiene una abstracción anticipada dentro de Units.

## Límites

No se aceptan números sin unidad ni relaciones con Aquarium. La compatibilidad
entre una unidad y una futura medición será decisión de la vertical de
mediciones, no de Units.

## Deuda de integración Angular

La integración Angular se denomina `units-angular`, no `units-ui`. El estado
actual mantiene provisionalmente `units-ui` y el token aislado de
`units-composition`. Se consolidarán en `units-angular` después de revisar las
fronteras de Data Access y AuthN/AuthZ; esta separación no se considera la
arquitectura objetivo.
