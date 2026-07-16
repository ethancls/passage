import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text select-none items-center justify-center gap-2 leading-none [&>kbd]:rounded-[calc(var(--radius)-5px)] in-[[data-slot=input-group]:has([data-slot=input-control])]:[&_svg:not([class*='size-'])]:size-4.5 sm:in-[[data-slot=input-group]:has([data-slot=input-control])]:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5",
  {
    defaultVariants: { align: "inline-start" },
    variants: {
      align: {
        "block-end": "order-last w-full justify-start px-[calc(--spacing(3)-1px)] pb-[calc(--spacing(3)-1px)] [.border-t]:pt-[calc(--spacing(3)-1px)]",
        "block-start": "order-first w-full justify-start px-[calc(--spacing(3)-1px)] pt-[calc(--spacing(3)-1px)] [.border-b]:pb-[calc(--spacing(3)-1px)]",
        "inline-end": "order-last pe-[calc(--spacing(3)-1px)]",
        "inline-start": "order-first ps-[calc(--spacing(3)-1px)]",
      },
    },
  },
);

export function InputGroup({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "relative inline-flex w-full min-w-0 items-center overflow-hidden rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-[input:disabled]:not-has-[input:focus-visible]:not-has-[input[aria-invalid]]:before:shadow-[0_1px_--theme(--color-black/4%)] has-[input:focus-visible]:has-[input[aria-invalid]]:border-destructive/64 has-[input:focus-visible]:has-[input[aria-invalid]]:ring-destructive/16 has-[input:focus-visible]:border-ring has-[input[aria-invalid]]:border-destructive/36 has-[input:disabled]:opacity-64 has-[input:disabled,input:focus-visible,input[aria-invalid]]:shadow-none has-[input:focus-visible]:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-[input[aria-invalid]]:ring-destructive/24 dark:not-has-[input:disabled]:not-has-[input:focus-visible]:not-has-[input[aria-invalid]]:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
      data-slot="input-group"
      role="group"
      {...props}
    />
  );
}

export function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>): React.ReactElement {
  return (
    <div
      className={cn(inputGroupAddonVariants({ align }), className)}
      data-align={align}
      data-slot="input-group-addon"
      onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.closest(
          "button, a, input, select, textarea, [role='button'], [role='combobox'], [role='listbox'], [data-slot='select-trigger']",
        );
        if (isInteractive) return;
        e.preventDefault();
        const parent = e.currentTarget.parentElement;
        const input = parent?.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
        if (input && !parent?.querySelector("input:focus, textarea:focus")) {
          input.focus();
        }
      }}
      {...props}
    />
  );
}

export function InputGroupInput({
  className,
  ...props
}: InputProps): React.ReactElement {
  return <Input className={className} unstyled {...props} />;
}
