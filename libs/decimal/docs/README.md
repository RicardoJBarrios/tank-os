# Contrato decimal

`@tankos/decimal` representa valores matemáticos decimales finitos sin usar
aritmética binaria de JavaScript. Su forma canónica es una cadena ASCII sin
separadores regionales: `"1.25"`, `"0"` o `"-3.5"`.

## Límites y representación

- El límite externo acepta únicamente cadenas; no admite espacios, coma
  decimal, hexadecimales ni `NaN`/`Infinity`.
- La normalización elimina ceros no significativos y expande notación
  científica dentro de límites explícitos de tamaño y exponente.
- `DecimalValue` expresa valor matemático, no precisión de medida: `"1.20"`
  y `"1.2"` son iguales. La precisión significativa pertenece al dominio que
  la necesite.
- `decimalFromSafeInteger()` es la única conversión directa desde `number`.
  Rechaza fracciones y enteros fuera del rango seguro.

## Runtime y aritmética

El núcleo declara `DecimalArithmeticPort` y compone un `DecimalRuntime` con
`createDecimalRuntime()`. El runtime crea valores inmutables y una API fluida;
la implementación concreta se elige solo en la raíz de composición.

Las operaciones exactas no redondean implícitamente. División, potencias
negativas y `round()` reciben un `DecimalContext` explícito con número máximo
de decimales y modo de redondeo. Ese contexto está congelado y validado.

## Zod, JSON y persistencia

Zod es el contrato de parsing cerrado del producto, por eso vive en esta
librería. `createZodDecimalSchemas()` expone el esquema de valor canónico y el
de contexto de redondeo. JSON, REST y Firestore persisten decimales como
cadenas; no existe `decimal-zod`, `decimal-json-http` ni `decimal-firestore`.

## Lo que Decimal no decide

Decimal no conoce monedas, unidades, medidas, estadísticas, Firebase ni
formatos regionales. Las fórmulas de conversión pertenecen a Units. La
presentación y entrada localizada pertenecen a `@tankos/decimal-angular`.

Cada función o clase pública tiene prueba específica y los barrels exponen
solo el contrato de cada paquete. Los tests unitarios cubren valores límite y
los de composición se limitan al camino feliz.
