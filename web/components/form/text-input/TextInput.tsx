import { Text } from "@/components/text/text-variant/text";
import { DEFAULT_INPUT_VARIANT } from "@/lib/constants/common";
import clsx from "clsx";
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import styles from "./TextInput.module.scss";
import { TextInputProps } from "./TextInput.props";

export function TextInput(props: Readonly<TextInputProps>) {
  const {
    actionComponent,
    as,
    className,
    helperText,
    label,
    type,
    variant,
    name,
    required,
    validation,
    hideReset,
    ...rest
  } = props;

  const {
    register,
    formState: { errors, isDirty, dirtyFields },
    resetField
  } = useFormContext();

  const currentVariant = variant ?? DEFAULT_INPUT_VARIANT;

  const fieldProps = {
    type: type ?? "text",
    className: clsx(
      "text-field",
      errors[name] ? "text-field__error" : currentVariant,
      className
    ),
    "aria-label": name,
    ...register(name, validation),
    ...rest
  };

  return (
    <div className={styles.container}>
      {label && (
        <Text as="label" htmlFor={props.name}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </Text>
      )}

      {helperText && <Text as="helper" content={helperText} />}

      <span>
        {as === "textarea" ? (
          <textarea {...fieldProps} />
        ) : (
          <input {...fieldProps} />
        )}

        {actionComponent
          ? actionComponent
          : isDirty &&
            dirtyFields[name] &&
            !hideReset && (
              <button
                type="button"
                className={styles.resetButton}
                onClick={() => resetField(name)}
              >
                <X className="size-5" />
              </button>
            )}
      </span>

      {errors[name] && (
        <Text
          as="error"
          content={String(errors[name]?.message) ?? errors[name].type}
        />
      )}
    </div>
  );
}
