import { FormValues } from "@/components/types";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type FormFieldProps = {
  field: keyof FormValues;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
};

export const FormField = ({ field, register, errors }: FormFieldProps) => (
  <div>
    <input
      type={
        field === "password"
          ? "password"
          : field === "birthdate"
          ? "date"
          : "text"
      }
      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
      {...register(field)}
      className={`w-full p-2 border rounded ${
        errors[field] ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {errors[field] && (
      <p className="text-red-500 text-sm">
        {errors[field]?.message?.toString()}
      </p>
    )}
  </div>
);

