import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AuthShellProps {
  backgroundImage: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthShell = ({
  backgroundImage,
  children,
  footer,
}: AuthShellProps) => {
  const [showImage, setShowImage] = useState(Boolean(backgroundImage));

  useEffect(() => {
    setShowImage(Boolean(backgroundImage));
  }, [backgroundImage]);

  return (
    <div className="relative min-h-svh w-screen overflow-hidden bg-background text-center text-foreground">
      <div
        className={cn(
          "hidden min-h-svh w-full items-center overflow-hidden lg:flex",
          showImage ? "justify-start" : "justify-center",
        )}
      >
        <section
          className={cn(
            "relative z-10 flex min-h-svh p-16",
            showImage ? "w-[650px] 2xl:w-[800px]" : "w-full max-w-2xl",
          )}
        >
          <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="flex grow flex-col items-center justify-center overflow-auto p-1">
              {children}
            </div>
            {footer ? (
              <div className="mb-4 flex items-center justify-center">
                {footer}
              </div>
            ) : null}
          </div>
        </section>

        {showImage ? (
          <div className="absolute inset-y-6 right-6 left-[650px] z-0 overflow-hidden rounded-[40px] 2xl:left-[800px]">
            <img
              src={backgroundImage}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setShowImage(false)}
            />
          </div>
        ) : null}
      </div>

      <div
        className="flex min-h-svh items-center justify-center bg-cover bg-center px-4 py-10 lg:hidden"
        style={
          showImage ? { backgroundImage: `url(${backgroundImage})` } : undefined
        }
      >
        <div
          className={cn(
            "w-full max-w-md rounded-xl border bg-card/95 px-4 py-10 shadow-sm backdrop-blur sm:p-10",
            !showImage && "border-0 bg-transparent shadow-none",
          )}
        >
          {children}
          {footer ? <div className="mt-7 flex justify-center">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
};

