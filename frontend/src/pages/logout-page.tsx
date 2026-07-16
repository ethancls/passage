import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { useUserContext } from "@/context/user-context";
import { capitalize } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trans, useTranslation } from "react-i18next";
import { Navigate } from "react-router";
import { toast } from "sonner";

export const LogoutPage = () => {
  const { provider, username, isLoggedIn, email } = useUserContext();
  const { backgroundImage, genericName } = useAppContext();
  const { t } = useTranslation();

  const logoutMutation = useMutation({
    mutationFn: () => axios.post("/api/logout"),
    mutationKey: ["logout"],
    onSuccess: () => {
      toast.success("Déconnecté", { description: "Vous avez été déconnecté." });
      setTimeout(() => { window.location.replace("/login"); }, 500);
    },
    onError: () => {
      toast.error("Erreur", { description: "Échec de la déconnexion. Réessayez." });
    },
  });

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <AuthShell backgroundImage={backgroundImage}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("logoutTitle")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {provider !== "username" ? (
              <Trans
                i18nKey="logoutOauthSubtitle"
                t={t}
                components={{ code: <code /> }}
                values={{
                  username: email,
                  provider: provider === "generic" ? genericName : capitalize(provider),
                }}
              />
            ) : (
              <Trans
                i18nKey="logoutUsernameSubtitle"
                t={t}
                components={{ code: <code /> }}
                values={{ username }}
              />
            )}
          </p>
        </div>

        <div className="flex w-full gap-2">
          <Button
            className="flex-1"
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={logoutMutation.isPending}
          >
            {t("cancelTitle")}
          </Button>
          <Button className="flex-1" loading={logoutMutation.isPending} onClick={() => logoutMutation.mutate()}>
            {t("logoutTitle")}
          </Button>
        </div>
      </div>
    </AuthShell>
  );
};
