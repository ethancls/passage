import { ThemeSwitch } from "@/components/ui/theme-switch";

interface AuthShellProps {
  backgroundImage: string;
  children: React.ReactNode;
}

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1582769923195-c6e60dc1d8dc?q=100&w=2400&auto=format&fit=crop";

export const AuthShell = ({ backgroundImage, children }: AuthShellProps) => {
  const bg = backgroundImage || DEFAULT_BG;

  return (
    <div className="flex min-h-svh">
      {/* Left — form */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-background px-6">
        {/* Header bar — logo left, theme switch right */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-6 py-4">
          <img
            src="/favicon.svg"
            alt="VoidAuth"
            className="h-16 mt-2"
            style={{ width: "auto" }}
          />
          <ThemeSwitch />
        </div>

        <div className="w-full max-w-[380px] pt-20 lg:pt-0">{children}</div>
      </div>

      {/* Right — image */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bg})` }}
        />
        <div className="relative flex w-full h-full flex-col justify-end items-start p-10">
          <p className="text-xs text-white/40">
            Photo by{" "}
            <a
              href="https://unsplash.com/@adamgonzales"
              className="underline hover:text-white/70"
              target="_blank"
              rel="noreferrer"
            >
              Adam Gonzales
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
