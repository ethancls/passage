import { AuthShell } from "@/components/auth/auth-shell";
import { useAppContext } from "@/context/app-context";
import Markdown from "react-markdown";

export const ForgotPasswordPage = () => {
  const { forgotPasswordMessage, backgroundImage } = useAppContext();

  return (
    <AuthShell backgroundImage={backgroundImage}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mot de passe oublié</h1>
          <div className="mt-1.5 text-sm text-muted-foreground">
            <Markdown>
              {forgotPasswordMessage !== ""
                ? forgotPasswordMessage
                : "Vous pouvez réinitialiser votre mot de passe en modifiant la variable `USERS`."}
            </Markdown>
          </div>
        </div>
      </div>
    </AuthShell>
  );
};
