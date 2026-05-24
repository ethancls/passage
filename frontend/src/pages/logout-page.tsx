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
  const { backgroundImage, genericName, title } = useAppContext();
  const { t } = useTranslation();
  const brandTitle = title?.trim() || "Passage";

  const logoutMutation = useMutation({
    mutationFn: () => axios.post("/api/logout"),
    mutationKey: ["logout"],
    onSuccess: () => {
      toast.success(t("logoutSuccessTitle"), {
        description: t("logoutSuccessSubtitle"),
      });

      setTimeout(async () => {
        window.location.replace("/login");
      }, 500);
    },
    onError: () => {
      toast.error(t("logoutFailTitle"), {
        description: t("logoutFailSubtitle"),
      });
    },
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <AuthShell backgroundImage={backgroundImage}>
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
          {t("logoutTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {provider !== "username" ? (
            <Trans
              i18nKey="logoutOauthSubtitle"
              t={t}
              components={{
                code: <code />,
              }}
              values={{
                username: email,
                provider:
                  provider === "generic" ? genericName : capitalize(provider),
              }}
            />
          ) : (
            <Trans
              i18nKey="logoutUsernameSubtitle"
              t={t}
              components={{
                code: <code />,
              }}
              values={{
                username,
              }}
            />
          )}
        </p>

        <div className="mt-10 flex w-full gap-2">
          <Button
            className="h-10 flex-1 cursor-pointer"
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
            disabled={logoutMutation.isPending}
          >
            {t("cancelTitle")}
          </Button>
          <Button
            className="h-10 flex-1 cursor-pointer"
            loading={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            {t("logoutTitle")}
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">{brandTitle}</p>
      </div>
    </AuthShell>
  );
};
