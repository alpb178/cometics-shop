"use client";

import { Text } from "@/components/text/text-variant/text";
import clsx from "clsx";
import { Controller, useFormContext } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import RPNInput, { type Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import styles from "./PhoneInput.module.scss";

type PhoneInputProps = {
  name: string;
  label?: string;
  required?: boolean;
  defaultCountry?: Country;
  helperText?: string;
};

export function PhoneInput({
  name,
  label,
  required,
  defaultCountry = "BO",
  helperText
}: Readonly<PhoneInputProps>) {
  const {
    control,
    formState: { errors }
  } = useFormContext();

  const errorMessage =
    errors[name]?.message != null ? String(errors[name]?.message) : null;

  return (
    <div className="relative w-full">
      {label && (
        <Text as="label" htmlFor={name}>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </Text>
      )}

      {helperText && <Text as="helper" content={helperText} />}

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? "El teléfono es requerido" : false,
          validate: (value) =>
            !value ||
            isValidPhoneNumber(value) ||
            "Número de teléfono inválido"
        }}
        render={({ field }) => (
          <RPNInput
            {...field}
            id={name}
            defaultCountry={defaultCountry}
            international
            countryCallingCodeEditable={false}
            value={field.value || ""}
            onChange={(value) => field.onChange(value || "")}
            numberInputProps={{
              className: clsx(
                "text-field",
                errorMessage ? "text-field__error" : "outlined",
                styles.phoneInputField
              )
            }}
            className={clsx("my-2 w-full", styles.phoneInputRoot)}
          />
        )}
      />

      {errorMessage && <Text as="error" content={errorMessage} />}
    </div>
  );
}
