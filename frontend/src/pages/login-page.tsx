import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { Fingerprint } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { GoogleIcon } from "@/components/icons/google";
import { OAuthButton } from "@/components/ui/oauth-button";
import { Separator, SeperatorWithChildren } from "@/components/ui/separator";
import { useAppContext } from "@/context/app-context";
import { useUserContext } from "@/context/user-context";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router";
import { toast } from "sonner";

type OAuthUrlResponse = { url: string };
type LoginResponse = { totpPending?: boolean };

export const LoginPage = () => {
  const { isLoggedIn } = useUserContext();
  const { configuredProviders, genericName, backgroundImage } = useAppContext();
  const { search } = useLocation();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(search);
  const redirectUri = searchParams.get("redirect_uri");
  const oauthConfigured = configuredProviders.filter((p: string) => p !== "username").length > 0;
  const userAuthConfigured = configuredProviders.includes("username");

  const oauthMutation = useMutation({
    mutationFn: (provider: string) =>
      axios.get(`/api/oauth/url/${provider}?redirect_uri=${encodeURIComponent(redirectUri ?? "")}`),
    mutationKey: ["oauth"],
    onSuccess: (data: AxiosResponse<{ url: string }>) => {
      toast.info("Redirection", { description: "Redirection vers le fournisseur d'authentification..." });
      setTimeout(() => { window.location.href = data.data.url; }, 500);
    },
    onError: () => { toast.error("Erreur", { description: "Impossible de récupérer l'URL d'authentification." }); },
  });

  const loginMutation = useMutation({
    mutationFn: (values: { username: string; password: string }) =>
      axios.post<LoginResponse>("/api/login", values),
    mutationKey: ["login"],
    onSuccess: (data: AxiosResponse<LoginResponse>) => {
      if (data.data.totpPending) {
        window.location.replace(`/totp?redirect_uri=${encodeURIComponent(redirectUri ?? "")}`);
        return;
      }
      toast.success("Connecté", { description: "Bienvenue !" });
      setTimeout(() => { window.location.replace(redirectUri ? decodeURIComponent(redirectUri) : "/"); }, 500);
    },
    onError: (error: AxiosError) => {
      toast.error("Échec de connexion", { description: error.response?.status === 429 ? "Trop de tentatives. Réessayez plus tard." : "Nom d'utilisateur ou mot de passe incorrect." });
    },
  });

  if (isLoggedIn) return <Navigate to="/logout" />;

  return (
    <AuthShell backgroundImage={backgroundImage}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenue !</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Connectez-vous à votre compte
          </p>
        </div>

        {oauthConfigured && (
          <div className="flex flex-col gap-2">
            {configuredProviders.includes("google") && (
              <OAuthButton
                title="Google"
                icon={<GoogleIcon />}
                onClick={() => oauthMutation.mutate("google")}
                loading={oauthMutation.isPending && oauthMutation.variables === "google"}
                disabled={oauthMutation.isPending || loginMutation.isPending}
              />
            )}
            {configuredProviders.includes("github") && (
              <OAuthButton
                title="GitHub"
                icon={<GithubIcon />}
                onClick={() => oauthMutation.mutate("github")}
                loading={oauthMutation.isPending && oauthMutation.variables === "github"}
                disabled={oauthMutation.isPending || loginMutation.isPending}
              />
            )}
            {configuredProviders.includes("generic") && (
              <OAuthButton
                title={genericName}
                icon={<Fingerprint />}
                onClick={() => oauthMutation.mutate("generic")}
                loading={oauthMutation.isPending && oauthMutation.variables === "generic"}
                disabled={oauthMutation.isPending || loginMutation.isPending}
              />
            )}
          </div>
        )}

        {userAuthConfigured && oauthConfigured && <SeperatorWithChildren>Ou</SeperatorWithChildren>}

        {userAuthConfigured && (
          <LoginForm
            onSubmit={(values) => loginMutation.mutate(values)}
            loading={loginMutation.isPending || oauthMutation.isPending}
          />
        )}

        {configuredProviders.length === 0 && (
          <p className="text-center text-sm text-destructive">{t("failedToFetchProvidersTitle")}</p>
        )}
      </div>
    </AuthShell>
  );
};
