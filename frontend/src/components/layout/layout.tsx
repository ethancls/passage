import { useAppContext } from "@/context/app-context";
import { LanguageSelector } from "../language/language";
import { Outlet, useLocation } from "react-router";

export const Layout = () => {
  const { backgroundImage } = useAppContext();
  const location = useLocation();
  const isAuthPage = ["/login", "/logout"].includes(location.pathname);

  return (
    <div
      className={
        `relative flex flex-col justify-center items-center min-h-svh ` +
        (isAuthPage ? "" : "")
      }
      style={isAuthPage ? {} : {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <LanguageSelector />
      <Outlet />
    </div>
  );
};
