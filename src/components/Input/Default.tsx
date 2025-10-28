"use client";
import React, { ComponentProps, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IconType } from "react-icons";
import { HiEye, HiEyeOff } from "react-icons/hi"; // 👁️ ícones de visualizar senha

type InputDefaultProps = {
  name: string;
  label?: string;
  icon?: IconType;
} & ComponentProps<"input">;

const InputDefault = ({
  name,
  label,
  icon: Icon,
  placeholder = "",
  type = "text",
  className,
  ...rest
}: InputDefaultProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1 block font-medium text-black dark:text-white"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <Controller
          name={name}
          control={control}
          defaultValue={type === "number" ? 0 : ""}
          render={({ field }) => (
            <div className="relative">
              <input
                {...rest}
                id={name}
                type={type === "password" && showPassword ? "text" : type}
                placeholder={placeholder}
                className={`w-full rounded border border-stroke bg-transparent py-3 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                {...field}
                onChange={(e) => {
                  field.onChange(
                    type === "number"
                      ? Number(e.target.value ?? "0")
                      : e.target.value
                  );
                }}
                onBlur={(e) => {
                  field.onChange(
                    type === "number"
                      ? Number(e.target.value ?? "0")
                      : e.target.value
                  );
                }}
              />

              {/* Ícone de olho apenas para password */}
              {type === "password" && (
                <span
                  className="absolute bottom-0 right-4 top-0 flex items-center cursor-pointer select-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                </span>
              )}
            </div>
          )}
        />

        {/* Ícone padrão, se existir */}
        {Icon && type !== "password" && (
          <span className="absolute bottom-0 right-4 top-0 flex items-center">
            <Icon size={24} />
          </span>
        )}

        <p
          className={`mt-1 w-full break-words text-sm text-red-500 ${
            !errors[name] ? "py-2.5" : ""
          }`}
        >
          {errors[name]
            ? (errors[name]?.message as string) || "Invalid input"
            : ""}
        </p>
      </div>
    </div>
  );
};

export default InputDefault;
