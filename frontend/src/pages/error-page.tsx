import { AuthShell } from "@/components/auth/auth-shell";

export const ErrorPage = () => {
  return (
    <AuthShell backgroundImage="">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Erreur</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Une erreur est survenue. Veuillez réessayer.
          </p>
        </div>
      </div>
    </AuthShell>
  );
};
