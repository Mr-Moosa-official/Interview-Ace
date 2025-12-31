import { LucideProps, Mic } from "lucide-react";

export const Logo = (props: LucideProps) => (
  <div className="bg-primary text-primary-foreground p-2 rounded-lg flex items-center justify-center">
    <Mic {...props} className="size-6" />
  </div>
);
