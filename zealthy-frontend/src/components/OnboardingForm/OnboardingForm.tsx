import { FormField } from "@/components/FormField/FormField";
import { FormValues } from "@/components/types";
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

type OnboardingFormProps = {
  step: number;
  steps: (keyof FormValues)[][];
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: (data: Partial<FormValues>) => void;
};

export const OnboardingForm = ({
  step,
  steps,
  register,
  errors,
  handleSubmit,
  onSubmit,
}: OnboardingFormProps) => (
  <form key={step} onSubmit={handleSubmit(onSubmit)}>
    <h1 className="text-2xl font-bold text-center mb-4">
      Onboarding Step {step + 1}/{steps.length}
    </h1>
    <div className="space-y-4">
      {steps[step]?.map((field) => (
        <FormField key={field} field={field} register={register} errors={errors} />
      ))}
    </div>
    <div className="flex justify-end mt-4">
      <button
        type="submit"
        className="pl-6 pr-6 pt-2 pb-2 bg-blue-500 text-white rounded"
      >
        {step === steps.length - 1 ? "Submit" : "Next"}
      </button>
    </div>
  </form>
);

