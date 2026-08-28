/** Semantic states shared by all TankOS page-level UI implementations. */
export type TankosPageState = 'loading' | 'empty' | 'error' | 'not-found';

/** Shared layout constraints; visual implementations may map these to tokens. */
export const TANKOS_UI_LAYOUT = Object.freeze({
  contentMaxWidth: '72rem',
  formMaxWidth: '52rem',
  pagePadding: 'clamp(1rem, 4vw, 3rem)',
});
