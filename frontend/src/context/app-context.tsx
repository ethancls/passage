import {
  appContextSchema,
  AppContextSchema,
} from "@/schemas/app-context-schema";
import { createContext, useContext, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";

const AppContext = createContext<AppContextSchema | null>(null);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isFetching, data, error } = useSuspenseQuery({
    queryKey: ["app"],
    queryFn: () => axios.get("/api/app").then((res) => res.data),
  });

  const validated = appContextSchema.safeParse(data);
  const authButtonColor = validated.success
    ? validated.data.authButtonColor
    : "#99ccff";

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--auth-button-color",
      authButtonColor,
    );
  }, [authButtonColor]);

  if (error && !isFetching) {
    throw error;
  }

  if (validated.success === false) {
    throw validated.error;
  }

  return (
    <AppContext.Provider value={validated.data}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
};
