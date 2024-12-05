import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormValues } from "@/components/types";

export const useFormLogic = (
  step: number,
  steps: (keyof FormValues)[][],
  formData: FormValues
) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(
      z.object(
        steps[step]?.reduce((acc, field) => {
          if (field === "email") {
            acc[field] = z.string().email("Invalid email address");
          } else if (field === "password") {
            acc[field] = z
              .string()
              .min(6, "Password must be at least 6 characters");
          } else if (field === "aboutMe") {
            acc[field] = z.string().optional();
          } else if (field === "birthdate") {
            acc[field] = z.string().optional();
          } else if (["street", "city", "state", "zip"].includes(field)) {
            acc[field] = z
              .string()
              .min(
                1,
                `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
              );
          }
          return acc;
        }, {} as Record<string, z.ZodTypeAny>)
      )
    ),
    defaultValues: formData,
  });

  return { register, handleSubmit, errors, reset };
};
