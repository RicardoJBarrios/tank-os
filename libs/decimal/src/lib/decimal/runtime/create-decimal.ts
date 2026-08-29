import type { DecimalArithmeticPort } from '../core/ports';
import {
  normalizeDecimalInput,
  type Decimal,
  type DecimalContext,
  type DecimalInput,
  type DecimalOperand,
  type DecimalValue,
} from '../core/value-types';

/** Creates an immutable fluent Decimal bound to one arithmetic implementation. */
export function createDecimal(
  value: DecimalInput,
  arithmetic: DecimalArithmeticPort,
): Decimal {
  return new DecimalValueObject(value, arithmetic);
}

class DecimalValueObject implements Decimal {
  readonly #arithmetic: DecimalArithmeticPort;
  readonly #value: DecimalValue;

  public constructor(value: DecimalInput, arithmetic: DecimalArithmeticPort) {
    this.#value = normalizeDecimalInput(value);
    this.#arithmetic = arithmetic;
  }

  public get value(): DecimalValue {
    return this.#value;
  }

  public add(...operands: [DecimalOperand, ...DecimalOperand[]]): Decimal {
    return this.#create(this.#arithmetic.add(...this.#operands(operands)));
  }

  public subtract(...operands: [DecimalOperand, ...DecimalOperand[]]): Decimal {
    return this.#create(this.#arithmetic.subtract(...this.#operands(operands)));
  }

  public multiply(...operands: [DecimalOperand, ...DecimalOperand[]]): Decimal {
    return this.#create(this.#arithmetic.multiply(...this.#operands(operands)));
  }

  public divide(
    right: DecimalOperand,
    context: DecimalContext,
    ...additionalDivisors: DecimalOperand[]
  ): Decimal {
    return this.#create(
      this.#arithmetic.divide(
        this.#value,
        DecimalValueObject.#valueOf(right),
        context,
        ...DecimalValueObject.#values(additionalDivisors),
      ),
    );
  }

  public remainder(right: DecimalOperand): Decimal {
    return this.#create(
      this.#arithmetic.remainder(this.#value, DecimalValueObject.#valueOf(right)),
    );
  }

  public power(exponent: DecimalOperand, context?: DecimalContext): Decimal {
    return this.#create(
      this.#arithmetic.power(
        this.#value,
        DecimalValueObject.#valueOf(exponent),
        context,
      ),
    );
  }

  public round(context: DecimalContext): Decimal {
    return this.#create(this.#arithmetic.round(this.#value, context));
  }

  public negate(): Decimal {
    return this.#create(this.#arithmetic.negate(this.#value));
  }

  public compare(other: DecimalOperand): -1 | 0 | 1 {
    return this.#arithmetic.compare(
      this.#value,
      DecimalValueObject.#valueOf(other),
    );
  }

  public toString(): string {
    return this.#value;
  }

  public toJSON(): string {
    return this.#value;
  }

  public [Symbol.toPrimitive](hint: string): string {
    if (hint === 'string') return this.#value;
    throw new TypeError('Decimal values must use fluent arithmetic methods explicitly');
  }

  #create(value: DecimalValue): Decimal {
    return createDecimal(value, this.#arithmetic);
  }

  static #valueOf(operand: DecimalOperand): DecimalValue {
    return toDecimalValue(operand);
  }

  static #values(operands: readonly DecimalOperand[]): DecimalValue[] {
    return operands.map((operand) => DecimalValueObject.#valueOf(operand));
  }

  #operands(
    operands: readonly [DecimalOperand, ...DecimalOperand[]],
  ): [DecimalValue, DecimalValue, ...DecimalValue[]] {
    return [this.#value, ...DecimalValueObject.#values(operands)] as [
      DecimalValue,
      DecimalValue,
      ...DecimalValue[],
    ];
  }
}

function toDecimalValue(operand: DecimalOperand): DecimalValue {
  return typeof operand === 'object' ? operand.value : normalizeDecimalInput(operand);
}
