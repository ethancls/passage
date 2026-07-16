import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { useUserContext } from "@/context/user-context";
import { isValidUrl } from "@/lib/utils";
import { Navigate, useLocation, useNavigate } from "react-router";
import DOMPurify from "dompurify";
import { useState } from "react";

export const ContinuePage = () => {
  const { isLoggedIn } = useUserContext();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const { domain, disableContinue, backgroundImage } = useAppContext();
  const { search } = useLocation();
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(search);
  const redirectURI = searchParams.get("redirect_uri");

  if (!redirectURI) {
    return <Navigate to="/logout" />;
  }

  if (!isValidUrl(DOMPurify.sanitize(redirectURI))) {
    return <Navigate to="/logout" />;
  }

  const handleRedirect = () => {
    setLoading(true);
    window.location.href = DOMPurify.sanitize(redirectURI);
  };

  if (disableContinue) {
    handleRedirect();
  }

  const navigate = useNavigate();

  const url = new URL(redirectURI);

  if (!(url.hostname == domain) && !url.hostname.endsWith(`.${domain}`)) {
    return (
      <AuthShell backgroundImage={backgroundImage}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-destructive">
              Redirection non fiable
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Vous essayez d'être redirigé vers un domaine différent de <code>{domain}</code>. Voulez-vous continuer ?
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={handleRedirect} loading={loading} variant="destructive">
              Continuer
            </Button>
            <Button onClick={() => navigate("/logout")} variant="outline" disabled={loading}>
              Annuler
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  if (url.protocol === "http:" && window.location.protocol === "https:") {
    return (
      <AuthShell backgroundImage={backgroundImage}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-amber-600">
              Redirection non sécurisée
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Vous essayez d'être redirigé de <code>https</code> vers <code>http</code>. Voulez-vous continuer ?
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={handleRedirect} loading={loading} variant="warning">
              Continuer
            </Button>
            <Button onClick={() => navigate("/logout")} variant="outline" disabled={loading}>
              Annuler
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell backgroundImage={backgroundImage}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Continuer</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Cliquez pour continuer vers votre application.
          </p>
        </div>
        <Button onClick={handleRedirect} loading={loading} className="w-full">
          Continuer
        </Button>
      </div>
    </AuthShell>
  );
};
