import { describe, expect, it } from 'vitest';
import { fillFlagTemplate } from '../src/docker/session.js';

describe('fillFlagTemplate', () => {
  it('sustituye todas las apariciones de $DOJO_FLAG sin alterar el resto', () => {
    const setup = 'echo "clave: $DOJO_FLAG"\nbase64 <<< "$DOJO_FLAG"\necho fin';
    const out = fillFlagTemplate(setup, 'FLAG{abcd1234abcd1234abcd1234}');
    expect(out).toBe('echo "clave: FLAG{abcd1234abcd1234abcd1234}"\nbase64 <<< "FLAG{abcd1234abcd1234abcd1234}"\necho fin');
  });

  it('no rompe setups sin placeholder', () => {
    expect(fillFlagTemplate('set -e\necho hola', 'FLAG{u}')).toBe('set -e\necho hola');
  });
});
