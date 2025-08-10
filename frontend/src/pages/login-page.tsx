import { LoginForm } from "@/components/auth/login-form";
import { ScanFace } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { GoogleIcon } from "@/components/icons/google";
import { OAuthButton } from "@/components/ui/oauth-button";
import { SeperatorWithChildren } from "@/components/ui/separator";
import { useAppContext } from "@/context/app-context";
import { useUserContext } from "@/context/user-context";
import { LoginSchema } from "@/schemas/login-schema";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router";
import { toast } from "sonner";


export const LoginPage = () => {
  const { isLoggedIn } = useUserContext();
  if (isLoggedIn) return <Navigate to="/logout" />;
  const { configuredProviders, title, genericName, backgroundImage } = useAppContext();
  const brandTitle = title?.trim() || "Passage";
  const { search } = useLocation();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(search);
  const redirectUri = searchParams.get("redirect_uri");
  const oauthConfigured = configuredProviders.filter((provider: string) => provider !== "username").length > 0;
  const userAuthConfigured = configuredProviders.includes("username");
  const oauthMutation = useMutation({
    mutationFn: (provider: string) => axios.get(`/api/oauth/url/${provider}?redirect_uri=${encodeURIComponent(redirectUri ?? "")}`),
    mutationKey: ["oauth"],
    onSuccess: (data: AxiosResponse<any>) => {
      toast.info(t("loginOauthSuccessTitle"), { description: t("loginOauthSuccessSubtitle") });
      setTimeout(() => { window.location.href = data.data.url; }, 500);
    },
    onError: () => { toast.error(t("loginOauthFailTitle"), { description: t("loginOauthFailSubtitle") }); },
  });
  const loginMutation = useMutation({
    mutationFn: (values: LoginSchema) => axios.post("/api/login", values),
    mutationKey: ["login"],
    onSuccess: (data: AxiosResponse<any>) => {
      if (data.data.totpPending) {
        window.location.replace(`/totp?redirect_uri=${encodeURIComponent(redirectUri ?? "")}`);
        return;
      }
  toast.success(t("loginSuccessTitle"), { description: t("loginSuccessSubtitle") });
  setTimeout(() => { window.location.replace(redirectUri ? decodeURIComponent(redirectUri) : "/"); }, 500);
    },
    onError: (error: AxiosError) => {
      toast.error(t("loginFailTitle"), { description: error.response?.status === 429 ? t("loginFailRateLimit") : t("loginFailSubtitle") });
    },
  });

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex h-screen w-screen overflow-hidden">
        {/* Colonne gauche (formulaire) */}
        <div className="flex flex-col h-full w-[650px] p-16 bg-background text-foreground relative z-10">
          <div className="flex flex-grow flex-col items-center justify-center overflow-auto">
              <div className="w-full max-w-sm flex flex-col gap-8 animate-in fade-in slide-in-from-left-8 duration-500">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold sm:text-4xl tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>{brandTitle}</h1>
                  {configuredProviders.length > 0 && (
                    <p className="text-muted-foreground text-sm">
                      {oauthConfigured ? t("loginTitle") : t("loginTitleSimple")}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-5">
                  {oauthConfigured && (
                    <div className="flex flex-col gap-2">
                      {configuredProviders.includes("google") && (
                        <OAuthButton
                          title="Google"
                          icon={<GoogleIcon />}
                          className="w-full"
                          onClick={() => oauthMutation.mutate("google")}
                          loading={oauthMutation.isPending && oauthMutation.variables === "google"}
                          disabled={oauthMutation.isPending || loginMutation.isPending}
                        />
                      )}
                      {configuredProviders.includes("github") && (
                        <OAuthButton
                          title="Github"
                          icon={<GithubIcon />}
                          className="w-full"
                          onClick={() => oauthMutation.mutate("github")}
                          loading={oauthMutation.isPending && oauthMutation.variables === "github"}
                          disabled={oauthMutation.isPending || loginMutation.isPending}
                        />
                      )}
                      {configuredProviders.includes("generic") && (
                        <OAuthButton
                          title={genericName}
                          icon={<ScanFace />}
                          className="w-full"
                          onClick={() => oauthMutation.mutate("generic")}
                          loading={oauthMutation.isPending && oauthMutation.variables === "generic"}
                          disabled={oauthMutation.isPending || loginMutation.isPending}
                        />
                      )}
                    </div>
                  )}
                  {userAuthConfigured && oauthConfigured && (
                    <SeperatorWithChildren>{t("loginDivider")}</SeperatorWithChildren>
                  )}
                  {userAuthConfigured && (
                    <LoginForm
                      onSubmit={(values) => loginMutation.mutate(values)}
                      loading={loginMutation.isPending || oauthMutation.isPending}
                    />
                  )}
                  {configuredProviders.length == 0 && (
                    <p className="text-sm text-destructive text-center">
                      {t("failedToFetchProvidersTitle")}
                    </p>
                  )}
                </div>
                <footer className="text-xs text-muted-foreground pt-4">
                  <p>&copy; {new Date().getFullYear()} {brandTitle}</p>
                </footer>
              </div>
            </div>
          </div>
        {/* Colonne droite (image) */}
        <div className="flex-1 h-full">
          <img src={backgroundImage} alt="Login background" className="h-full w-full object-cover rounded-l-[60px]" />
        </div>
      </div>
      {/* Mobile */}
      <div className="lg:hidden flex h-screen w-screen items-center justify-center bg-cover bg-center px-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="w-full max-w-md bg-background text-foreground backdrop-brightness-105/90 dark:backdrop-brightness-75/90 rounded-xl shadow-xl p-6 mx-3 border border-border">
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>{brandTitle}</h1>
              {configuredProviders.length > 0 && (
                <p className="text-muted-foreground text-sm">
                  {oauthConfigured ? t("loginTitle") : t("loginTitleSimple")}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-5">
              {oauthConfigured && (
                <div className="flex flex-col gap-2">
                  {configuredProviders.includes("google") && (
                    <OAuthButton
                      title="Google"
                      icon={<GoogleIcon />}
                      className="w-full"
                      onClick={() => oauthMutation.mutate("google")}
                      loading={oauthMutation.isPending && oauthMutation.variables === "google"}
                      disabled={oauthMutation.isPending || loginMutation.isPending}
                    />
                  )}
                  {configuredProviders.includes("github") && (
                    <OAuthButton
                      title="Github"
                      icon={<GithubIcon />}
                      className="w-full"
                      onClick={() => oauthMutation.mutate("github")}
                      loading={oauthMutation.isPending && oauthMutation.variables === "github"}
                      disabled={oauthMutation.isPending || loginMutation.isPending}
                    />
                  )}
                  {configuredProviders.includes("generic") && (
                    <OAuthButton
                      title={genericName}
                      icon={<ScanFace />}
                      className="w-full"
                      onClick={() => oauthMutation.mutate("generic")}
                      loading={oauthMutation.isPending && oauthMutation.variables === "generic"}
                      disabled={oauthMutation.isPending || loginMutation.isPending}
                    />
                  )}
                </div>
              )}
              {userAuthConfigured && oauthConfigured && (
                <SeperatorWithChildren>{t("loginDivider")}</SeperatorWithChildren>
              )}
              {userAuthConfigured && (
                <LoginForm
                  onSubmit={(values) => loginMutation.mutate(values)}
                  loading={loginMutation.isPending || oauthMutation.isPending}
                />
              )}
              {configuredProviders.length == 0 && (
                <p className="text-sm text-destructive text-center">
                  {t("failedToFetchProvidersTitle")}
                </p>
              )}
            </div>
            <footer className="text-xs text-muted-foreground pt-2 text-center">
              <p>&copy; {new Date().getFullYear()} {brandTitle}</p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};
// Layout responsive : desktop = colonne gauche (form), droite image; mobile = image de fond + carte centrée
