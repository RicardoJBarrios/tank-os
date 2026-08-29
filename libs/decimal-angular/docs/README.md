# Contrato decimal en Angular

La raíz de composición selecciona el runtime y lo registra una sola vez:

```ts
provideDecimalAngular(createBigJsDecimalRuntime());
```

`DecimalService` expone valores inmutables para consumidores Angular. El pipe
`tankDecimal` usa `LOCALE_ID` para obtener mediante `Intl` los símbolos y el
patrón de agrupación; nunca pasa el decimal por `Number` ni por `DecimalPipe`.

La entrada de formularios todavía debe producir una cadena canónica antes de
entrar en el núcleo. Queda pendiente crear componentes reutilizables de edición
decimal integrados con formularios dinámicos Angular; deberán resolver el
locale mediante `LOCALE_ID`, no inventar un puerto de localización, y probarse
con Spectator.
