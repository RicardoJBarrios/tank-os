# Runtime decimal basado en Big.js

Este paquete implementa `DecimalArithmeticPort` con Big.js y traduce sus fallos
al modelo de errores de `@tankos/decimal`. La factoría de runtime compone el
adaptador junto a `createDecimalRuntime()`; no decide inyección Angular,
persistencia ni formato regional.

Un runtime alternativo debe conservar los valores canónicos, el contexto de
redondeo explícito y los errores públicos del núcleo.
