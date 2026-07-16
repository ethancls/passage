import { AuthShell } from "@/components/auth/auth-shell";
import { TotpForm } from "@/components/auth/totp-form";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { useUserContext } from "@/context/user-context";
import { TotpSchema } from "@/schemas/totp-schema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useId } from "react";
import { Navigate, useLocation } from "react-router";
import { toast } from "sonner";

export const TotpPage = () => {
  const { totpPending } = useUserContext();

  if (!totpPending) {
    return <Navigate to="/" />;
  }

  const { backgroundImage } = useAppContext();
  const { search } = useLocation();
  const formId = useId();

  const searchParams = new URLSearchParams(search);
  const redirectUri = searchParams.get("redirect_uri");

  const totpMutation = useMutation({
    mutationFn: (values: TotpSchema) => axios.post("/api/totp", values),
    mutationKey: ["totp"],
    onSuccess: () => {
      toast.success("Vérifié", { description: "Redirection en cours..." });
      setTimeout(() => {
        window.location.replace(redirectUri ? decodeURIComponent(redirectUri) : "/");
      }, 500);
    },
    onError: () => {
      toast.error("Erreur", { description: "Code invalide. Réessayez." });
    },
  });

  return (
    <AuthShell backgroundImage={backgroundImage}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Code TOTP</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Entrez le code de votre application d'authentification.
          </p>
        </div>
        <TotpForm
          formId={formId}
          onSubmit={(values) => totpMutation.mutate(values)}
          loading={totpMutation.isPending}
        />
        <Button form={formId} type="submit" className="w-full" loading={totpMutation.isPending}>
          Continuer
        </Button>
      </div>
    </AuthShell>
  );
};
