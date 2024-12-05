"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPageConfig, updatePageConfig } from "@/utils/fetchers";
import { PageConfig } from "@/types";
import { useToast } from "@/components/ToastProvider/ToastProvider"; 

const AdminPanel = () => {
  const { showToast } = useToast(); 

  const { data: config, refetch } = useQuery<PageConfig, Error>({
    queryKey: ["pageConfig"],
    queryFn: fetchPageConfig,
  });

  const mutation = useMutation({
    mutationFn: updatePageConfig,
    onSuccess: () => {
      showToast("Configuration updated successfully!", "success");
      refetch();
    },
    onError: (error: Error) => {
      showToast(error.message, "error");
    },
  });

  const [localConfig, setLocalConfig] = useState<PageConfig>({
    page2: [],
    page3: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  const handleToggle = (page: "page2" | "page3", component: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      [page]: prev[page].includes(component)
        ? prev[page].filter((c) => c !== component)
        : [...prev[page], component],
    }));
  };

  const handleSave = () => {
    if (localConfig.page2.length === 0 || localConfig.page3.length === 0) {
      setError("Each step must have at least one field.");
      showToast("Each step must have at least one field.", "error");
      return;
    }
    setError("");
    mutation.mutate(localConfig);
  };

  if (!config) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">Page 2</h2>
            {["aboutMe", "birthdate"].map((component) => (
              <label key={component} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localConfig.page2.includes(component)}
                  onChange={() => handleToggle("page2", component)}
                />
                <span>{component}</span>
              </label>
            ))}
          </div>
          <div>
            <h2 className="text-lg font-bold">Page 3 (Address Fields)</h2>
            {["street", "city", "state", "zip"].map((component) => (
              <label key={component} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localConfig.page3.includes(component)}
                  onChange={() => handleToggle("page3", component)}
                />
                <span>{component}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-4 p-2 bg-green-500 text-white rounded"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
