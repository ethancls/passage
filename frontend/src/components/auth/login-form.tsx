import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Eye, EyeSlash } from "@phosphor-icons/react";

interface Props {
  onSubmit: (data: { username: string; password: string }) => void;
  loading?: boolean;
}

export const LoginForm = ({ onSubmit, loading }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel>Nom d'utilisateur</FieldLabel>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
          autoComplete="username"
        />
      </Field>

      <Field>
        <FieldLabel>Mot de passe</FieldLabel>
        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
            className="pr-10"
          />
          <button
            type="button"
            aria-label={showPassword ? "Cacher" : "Afficher"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full flex items-center justify-center px-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showPassword ? <EyeSlash aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
          </button>
        </div>
      </Field>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Se connecter
      </Button>
    </form>
  );
};
