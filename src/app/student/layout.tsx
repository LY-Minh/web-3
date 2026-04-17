import type { ReactNode } from "react";
import { StudentProfileProvider } from "@/components/student-profile-context";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return <StudentProfileProvider>{children}</StudentProfileProvider>;
}
