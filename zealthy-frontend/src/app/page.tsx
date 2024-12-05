"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  fetchPageConfig,
  authenticateUser,
  updateUser,
} from "../utils/fetchers";
import { useToast } from "@/components/ToastProvider/ToastProvider";
import { OnboardingForm } from "@/components/OnboardingForm/OnboardingForm";
import { useAuthValidation } from "@/app/hooks/useAuthValidation";
import { useOnboardingSteps } from "@/app/hooks/useOnboardingSteps";
import { useFormLogic } from "@/app/hooks/useFormLogic";
import { FormValues } from "@/components/types";
import router from "next/router";

const OnboardingWizard = () => {
  const {
    data: config,
    isLoading: configLoading,
    error: configError,
  } = useQuery({
    queryKey: ["pageConfig"],
    queryFn: fetchPageConfig,
    staleTime: Infinity,
  });

  const { formData, setFormData, step, setStep } = useAuthValidation();
  const steps = useOnboardingSteps(config);
  const { register, handleSubmit, errors } = useFormLogic(
    step,
    steps,
    formData
  );
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: authenticateUser,
    onSuccess: ({ token, step, user }) => {
      showToast("Authentication successful!", "success");
      Cookies.set("authToken", token, { expires: 1 });
      Cookies.set("user", JSON.stringify(user), { expires: 1 });

      setFormData(user as FormValues);
      setStep(step);
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to authenticate.";
      showToast(errorMessage, "error");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (updatedData: Partial<FormValues>) => {
      const userCookie = Cookies.get("user");
      if (!userCookie) {
        throw new Error("User not logged in");
      }
      const userId = JSON.parse(userCookie)?.id;
      if (!userId) {
        throw new Error("User ID not found in cookie");
      }
      const { aboutMe, birthdate, email, password, ...rest } = updatedData;
      const normalizedData = { aboutMe, birthdate, email, password };

      return updateUser(userId, {
        ...normalizedData,
        address: Object.keys(rest).length === 0 ? undefined : rest,
      });
    },
    onSuccess: () => {
      showToast("User updated successfully!", "success");
    },
    onError: (error) => {
      const errorMessage = error?.message || "Failed to update user.";
      showToast(errorMessage, "error");
    },
  });

  const normalizeFormData = (data: Partial<FormValues>): FormValues => ({
    email: data.email || formData.email || "", // Default to current or empty string
    password: data.password || formData.password || "",
    aboutMe: data.aboutMe || formData.aboutMe || "",
    birthdate: data.birthdate
      ? new Date(data.birthdate).toISOString().split("T")[0]
      : formData.birthdate || "",
    street: data.street || formData.street || "",
    city: data.city || formData.city || "",
    state: data.state || formData.state || "",
    zip: data.zip || formData.zip || "",
  });

  const stepHandlers: Record<number, (data: Partial<FormValues>) => void> = {
    0: (data) => {
      mutation.mutate(data);
    },
    1: (data) => {
      const { aboutMe, birthdate } = normalizeFormData(data);
      updateUserMutation.mutate({ aboutMe, birthdate });
      setFormData((oldValues) => ({
        ...oldValues,
        aboutMe,
        birthdate,
      }));
      setStep((prev) => prev + 1);
    },
    2: (data) => {
      const normalizedData = normalizeFormData(data);
      updateUserMutation.mutate(normalizedData);
      router.push("/data");
    },
  };

  const onSubmit = (data: Partial<FormValues>) => {
    const handler = stepHandlers[step];
    if (handler) {
      handler(data);
    } else {
      showToast("Invalid step.", "error");
    }
  };

  if (configLoading) return <div>Loading...</div>;
  if (configError) {
    showToast(configError.message || "Failed to load configuration.", "error");
    return <div>Error loading configuration.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md relative">
        <OnboardingForm
          step={step}
          steps={steps}
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default OnboardingWizard;
