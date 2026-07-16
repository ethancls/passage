import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { useUserContext } from "@/context/user-context";
import { capitalize } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Navigate } from "react-router";
import { toast } from "sonner";

export const LogoutPage = () => {
  const { provider, username, isLoggedIn, email } = useUserContext();
  const { backgroundImage, genericName } = useAppContext();

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

  const subtitle =
    provider !== "username"
      ? `Vous êtes connecté en tant que ${email} via ${provider === "generic" ? genericName : capitalize(provider)}.`
      : `Vous êtes connecté en tant que ${username}.`;

  return (
    <AuthShell backgroundImage={backgroundImage}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Déconnexion</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {subtitle} Cliquez ci-dessous pour vous déconnecter.
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
            Annuler
          </Button>
          <Button className="flex-1" loading={logoutMutation.isPending} onClick={() => logoutMutation.mutate()}>
            Déconnexion
          </Button>
        </div>
      </div>
    </AuthShell>
  );
};
