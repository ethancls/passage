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
    <div className="relative h-screen w-screen overflow-hidden bg-background text-center text-foreground">
      <div
        className={cn(
          "hidden h-screen w-full items-center overflow-hidden lg:flex",
          showImage ? "justify-start" : "justify-center",
        )}
      >
        <section
          className={cn(
            "relative z-10 flex h-full p-16",
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
          <div className="absolute top-0 right-0 bottom-0 left-[650px] z-0 m-6 overflow-hidden rounded-[40px] 2xl:left-[800px]">
            <img
              src={backgroundImage}
              alt=""
              className="auth-bg-zoom h-screen w-[calc(100vw-650px)] object-cover 2xl:w-[calc(100vw-800px)]"
              onError={() => setShowImage(false)}
            />
          </div>
        ) : null}
      </div>

      <div
        className="flex h-screen items-center justify-center bg-cover bg-center px-4 py-10 lg:hidden"
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
