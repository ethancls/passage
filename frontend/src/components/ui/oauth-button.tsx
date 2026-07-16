import { Button } from "./button";
import React from "react";

interface Props extends React.ComponentProps<typeof Button> {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

export const OAuthButton = (props: Props) => {
  const { title, icon, onClick, loading, className, ...rest } = props;

  return (
    <Button
      onClick={onClick}
      className={`w-full ${className || ""}`}
      variant="outline"
      size="lg"
      loading={loading}
      {...rest}
    >
      <span className="flex items-center justify-center size-5 shrink-0">
        {icon}
      </span>
      <span>{title}</span>
    </Button>
  );
};
