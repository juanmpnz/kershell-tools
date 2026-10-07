'use client';

import type { ComponentProps } from 'react';

type DecimalInputProps = Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange' | 'onBlur' | 'step'> & {
  value: string;
  onValueChange: (value: string) => void;
};

/** Keep editing unrestricted; display cents consistently once the field loses focus. */
export function DecimalInput({ value, onValueChange, ...props }: DecimalInputProps) {
  return <input {...props} type="number" inputMode="decimal" step="0.01" value={value}
    onChange={(event) => onValueChange(event.target.value)}
    onBlur={() => {
      if (value.trim() && Number.isFinite(Number(value))) onValueChange(Number(value).toFixed(2));
    }} />;
}
