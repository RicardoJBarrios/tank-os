# Adaptador temporal de Firestore

`@tankos/time-firestore` es la frontera física entre Firebase Firestore y los
valores de `@tankos/time`. Mantiene Firebase fuera del contrato principal y es
el único paquete temporal que conoce `Timestamp`.

## Representación persistida

- `Instant` se guarda como `Timestamp` y se recupera normalizado a precisión de
  milisegundos sobre la línea temporal UTC.
- `LocalDate` se guarda como cadena canónica `YYYY-MM-DD`; no se convierte a
  `Timestamp` porque no representa una medianoche en ninguna zona.
- `Duration` se guarda como un número entero seguro de milisegundos
  transcurridos; una lectura fraccionaria o fuera del rango seguro se rechaza
  como representación física inválida y no se trunca silenciosamente.
- Las zonas de usuario y acuario se guardan como identificadores IANA validados,
  no como offsets fijos. El offset depende del instante y de las reglas DST.

El adaptador recibe los puertos temporales elegidos por la aplicación y no
selecciona un runtime. Tampoco contiene presentación, pipes ni decisiones de
JSON/REST. Los repositorios deben usar una instancia configurada con el mismo
`TimePort` que usa el resto de la aplicación.

No deben persistirse cadenas formateadas para el usuario, objetos `Date`, horas
locales sin zona ni offsets como sustituto de una zona IANA. Si la zona de origen
es información de negocio que debe conservarse, se almacena en un campo
separado del instante UTC.
