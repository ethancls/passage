import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell backgroundImage="">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Page introuvable</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            La page que vous cherchez n'existe pas.
          </p>
        </div>
        <Button
          onClick={() => { setLoading(true); navigate("/"); }}
          loading={loading}
          className="w-full"
        >
          Accueil
        </Button>
      </div>
    </AuthShell>
  );
};
