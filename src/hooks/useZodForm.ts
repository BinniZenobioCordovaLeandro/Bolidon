import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { type UseFormProps, type UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';

export function useZodForm<T extends z.ZodType<any, any, any>>(
  schema: T,
  options?: UseFormProps<z.infer<T>>
): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    ...options,
  });
}

export function getZodErrorMessage(error: z.ZodError, field: string): string | undefined {
  const fieldError = error.errors.find(
    (err) => err.path.join('.') === field || err.path[err.path.length - 1] === field
  );
  return fieldError?.message;
}

export function validateField<T>(
  schema: z.ZodType<T>,
  value: unknown
): {
  isValid: boolean;
  error?: string;
} {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'Valor inválido',
      };
    }
    return {
      isValid: false,
      error: 'Error de validación',
    };
  }
}

export function useFieldValidation<T>(
  schema: z.ZodType<T>,
  value: unknown,
  debounceMs: number = 300
) {
  const [validation, setValidation] = React.useState<{
    isValid: boolean;
    error?: string;
  }>({ isValid: true });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== undefined && value !== '') {
        setValidation(validateField(schema, value));
      } else {
        setValidation({ isValid: true });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, schema, debounceMs]);

  return validation;
}

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type FormState<T> = {
  values: T;
  errors: FormErrors<T>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
};
