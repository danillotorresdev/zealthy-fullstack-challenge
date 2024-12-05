import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { useToast } from "@/components/ToastProvider/ToastProvider";
import { useRouter } from "next/navigation";
import { formatDateForInput } from "@/utils/formatDate";
import { FormValues } from "@/components/types";
import { validateToken } from "@/utils/fetchers";

export const useAuthValidation = () => {
  const [formData, setFormData] = useState<FormValues>({
    email: "",
    password: "",
    aboutMe: "",
    birthdate: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      validateToken(token)
        .then(({ currentStep, ...user }) => {
          const normalizedUser = {
            ...user,
            birthdate: formatDateForInput(user.birthdate),
          };
          setFormData(normalizedUser);
          if (currentStep >= 3) {
            showToast("User already updated!", "info");
            router.push("/data");
          } else {
            setStep(currentStep || 0);
          }
        })
        .catch(() => {
          Cookies.remove("authToken");
          Cookies.remove("user");
          showToast("Session expired. Please log in again.", "error");
        });
    }
  }, [router, showToast]);

  return { formData, setFormData, step, setStep };
};
