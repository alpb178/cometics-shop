"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { TextInput } from "@/components/form/text-input/TextInput";
import type { TextInputProps } from "@/components/form/text-input/TextInput.props";

type PasswordInputProps = Omit<TextInputProps, "type" | "actionComponent">;

export function PasswordInput(props: Readonly<PasswordInputProps>) {
  const [show, setShow] = useState(false);

  return (
    <TextInput
      {...props}
      type={show ? "text" : "password"}
      hideReset
      actionComponent={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={show}
          className="absolute right-0 mx-2 p-2 text-foreground/40 transition-colors hover:text-foreground"
        >
          {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      }
    />
  );
}
