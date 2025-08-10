import { useAppContext } from "@/context/app-context";
import { LanguageSelector } from "../language/language";
import { Outlet, useLocation } from "react-router";

export const Layout = () => {
  const { backgroundImage } = useAppContext();
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div
      className={
        `relative flex flex-col justify-center items-center min-h-svh ` +
        (isLogin ? "" : "")
      }
      style={isLogin ? {} : {
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
