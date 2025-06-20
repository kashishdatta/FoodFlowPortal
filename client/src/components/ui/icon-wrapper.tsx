import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface IconWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const IconWrapper = ({ children, className, ...props }: IconWrapperProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      {children}
    </div>
  );
};

export default IconWrapper;
