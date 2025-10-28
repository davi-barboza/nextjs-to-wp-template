"use client";
import React, { ComponentProps, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useApolloClient } from "@apollo/client/react";
import { DocumentNode } from "graphql";
import { PluralQueryNameEnum } from "@/domain/enums/plural-query-name.enum";
import { SelectOption } from "@/domain/types/select-option";

type TGenericData = {
  [k in PluralQueryNameEnum]: {
    nodes: { id: string; descricao: string }[];
  };
};

type TProps = {
  name: string;
  label: string;
  options?: SelectOption[];
  pluralQueryName?: PluralQueryNameEnum;
  query?: DocumentNode; // GraphQL query string
  variables?: Record<string, unknown>;
  placeholder?: string;
} & ComponentProps<"select">;

const Select: React.FC<TProps> = ({
  pluralQueryName,
  name,
  options,
  query,
  variables,
  label,
  className,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const client = useApolloClient();
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    (async () => {
      if (query) {
        try {
          const { data } = await client.query<TGenericData>({
            query,
            variables,
          });

          const fetchedOptions = data && pluralQueryName ?
            data[pluralQueryName].nodes?.map((item) => ({
              label: item.descricao,
              value: item.id,
            })) ?? [] : [];

          setSelectOptions(fetchedOptions);
        } catch (error) {
          console.error("Erro ao buscar dados para o select:", error);
        }
      } else if (options) {
        setSelectOptions(options);
      }
    })();
  }, [query, variables, options, client, pluralQueryName]);

  return (
    <div className={className}>
      <label className="mb-1 block text-black dark:text-white">{label}</label>

      <div className="relative z-20">
        <Controller
          name={name}
          control={control}
          render={({ field: { value, ...rest } }) => (
            <select
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={value ?? ""}
              {...rest}
            >
              <option value="" className="text-body dark:text-bodydark">
                Selecione uma opção
              </option>

              {selectOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />

        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
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
  );
};

export default Select;
