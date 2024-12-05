import { useEffect, useState } from "react";
import { PageConfig } from "@/types";
import { FormValues } from "@/components/types";

export const useOnboardingSteps = (config: PageConfig | undefined) => {
  const [steps, setSteps] = useState<(keyof FormValues)[][]>([]);

  useEffect(() => {
    if (config) {
      const dynamicSteps: (keyof FormValues)[][] = [["email", "password"]];
      if (config.page2?.length > 0)
        dynamicSteps.push(config.page2 as (keyof FormValues)[]);
      if (config.page3?.length > 0)
        dynamicSteps.push(config.page3 as (keyof FormValues)[]);
      setSteps(dynamicSteps);
    }
  }, [config]);

  return steps;
};
