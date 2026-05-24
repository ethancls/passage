import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { Fingerprint } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { GoogleIcon } from "@/components/icons/google";
import { OAuthButton } from "@/components/ui/oauth-button";
import { SeperatorWithChildren } from "@/components/ui/separator";
import { useAppContext } from "@/context/app-context";
import { useUserContext } from "@/context/user-context";
import { LoginSchema } from "@/schemas/login-schema";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router";
import { toast } from "sonner";

type OAuthUrlResponse = {
  url: string;
};

type LoginResponse = {
  totpPending?: boolean;
};

export const LoginPage = () => {
  const { isLoggedIn } = useUserContext();
  const { configuredProviders, title, genericName, backgroundImage } = useAppContext();
  const brandTitle = title?.trim() || "Passage";
  const { search } = useLocation();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(search);
  const redirectUri = searchParams.get("redirect_uri");
  const oauthConfigured = configuredProviders.filter((provider: string) => provider !== "username").length > 0;
  const userAuthConfigured = configuredProviders.includes("username");
  const oauthMutation = useMutation({
    mutationFn: (provider: string) =>
      axios.get<OAuthUrlResponse>(
        `/api/oauth/url/${provider}?redirect_uri=${encodeURIComponent(redirectUri ?? "")}`,
      ),
    mutationKey: ["oauth"],
    onSuccess: (data: AxiosResponse<OAuthUrlResponse>) => {
      toast.info(t("loginOauthSuccessTitle"), { description: t("loginOauthSuccessSubtitle") });
      setTimeout(() => { window.location.href = data.data.url; }, 500);
    },
    onError: () => { toast.error(t("loginOauthFailTitle"), { description: t("loginOauthFailSubtitle") }); },
  });
  const loginMutation = useMutation({
    mutationFn: (values: LoginSchema) =>
      axios.post<LoginResponse>("/api/login", values),
    mutationKey: ["login"],
    onSuccess: (data: AxiosResponse<LoginResponse>) => {
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

  if (isLoggedIn) return <Navigate to="/logout" />;

  const providerButtons = (
    <div className="flex flex-col gap-2">
      {configuredProviders.includes("google") && (
        <OAuthButton
          title="Google"
          icon={<GoogleIcon />}
          className="h-10 w-full"
          onClick={() => oauthMutation.mutate("google")}
          loading={oauthMutation.isPending && oauthMutation.variables === "google"}
          disabled={oauthMutation.isPending || loginMutation.isPending}
        />
      )}
      {configuredProviders.includes("github") && (
        <OAuthButton
          title="Github"
          icon={<GithubIcon />}
          className="h-10 w-full"
          onClick={() => oauthMutation.mutate("github")}
          loading={oauthMutation.isPending && oauthMutation.variables === "github"}
          disabled={oauthMutation.isPending || loginMutation.isPending}
        />
      )}
      {configuredProviders.includes("generic") && (
        <OAuthButton
          title={genericName}
          icon={<Fingerprint />}
          className="h-10 w-full"
          onClick={() => oauthMutation.mutate("generic")}
          loading={oauthMutation.isPending && oauthMutation.variables === "generic"}
          disabled={oauthMutation.isPending || loginMutation.isPending}
        />
      )}
    </div>
  );

  return (
    <AuthShell
      backgroundImage={backgroundImage}
      footer={
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {brandTitle}
        </p>
      }
    >
      <div className="w-full max-w-[450px] animate-in fade-in duration-500">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-muted p-3">
            <img src="/favicon.svg" alt="" className="size-10" />
          </div>
        </div>

        <h1
          className="mt-5 text-3xl font-bold tracking-normal sm:text-4xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {brandTitle}
        </h1>
        {configuredProviders.length > 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {oauthConfigured ? t("loginTitle") : t("loginTitleSimple")}
          </p>
        ) : null}

        <div className="mt-10 flex flex-col gap-5">
          {oauthConfigured ? providerButtons : null}
          {userAuthConfigured && oauthConfigured ? (
            <SeperatorWithChildren>{t("loginDivider")}</SeperatorWithChildren>
          ) : null}
          {userAuthConfigured ? (
            <LoginForm
              onSubmit={(values) => loginMutation.mutate(values)}
              loading={loginMutation.isPending || oauthMutation.isPending}
            />
          ) : null}
          {configuredProviders.length === 0 ? (
            <p className="text-center text-sm text-destructive">
              {t("failedToFetchProvidersTitle")}
            </p>
          ) : null}
        </div>
      </div>
    </AuthShell>
  );
};
