import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";

export const UnauthorizedPage = () => {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const username = searchParams.get("username");
  const resource = searchParams.get("resource");
  const groupErr = searchParams.get("groupErr");
  const ip = searchParams.get("ip");

  if (!username && !ip) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  let message = `L'utilisateur ${username} n'est pas autorisé à se connecter.`;
  if (resource && groupErr === "true") {
    message = `L'utilisateur ${username} n'appartient pas aux groupes requis pour accéder à ${resource}.`;
  } else if (resource) {
    message = `L'utilisateur ${username} n'est pas autorisé à accéder à ${resource}.`;
  } else if (ip) {
    message = `L'adresse IP ${ip} n'est pas autorisée à accéder à ${resource}.`;
  }

  return (
    <AuthShell backgroundImage="">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Non autorisé</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{message}</p>
        </div>
        <Button
          onClick={() => { setLoading(true); navigate("/login"); }}
          loading={loading}
          className="w-full"
        >
          Réessayer
        </Button>
      </div>
    </AuthShell>
  );
};
