"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type StudentProfile = {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  profileImage: string;
};

type SessionResponse = {
  user?: {
    name?: string;
    email?: string;
  };
};

type StudentProfileContextType = {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
};

const DEFAULT_PROFILE: StudentProfile = {
  fullName: "Student",
  email: "",
  phone: "012 345 678",
  bio: "Student at AUPP.",
  profileImage: "",
};

const STORAGE_KEY = "student-profile";

const StudentProfileContext = createContext<StudentProfileContextType | null>(
  null
);

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateProfile = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        try {
          const parsed = JSON.parse(saved) as StudentProfile;
          if (isMounted) {
            setProfile(parsed);
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      try {
        const response = await fetch("/api/auth/get-session", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const session = (await response.json()) as SessionResponse;
        const sessionName = session.user?.name?.trim();
        const sessionEmail = session.user?.email?.trim();

        if (!isMounted) {
          return;
        }

        setProfile((prev) => ({
          ...prev,
          fullName: sessionName || prev.fullName,
          email: sessionEmail || prev.email,
          profileImage: "",
        }));
      } finally {
        if (isMounted) {
          setHydrated(true);
        }
      }
    };

    void hydrateProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, hydrated]);

  const value = useMemo(
    () => ({
      profile,
      updateProfile: (updates: Partial<StudentProfile>) => {
        setProfile((prev) => ({
          ...prev,
          ...updates,
        }));
      },
    }),
    [profile]
  );

  return (
    <StudentProfileContext.Provider value={value}>
      {children}
    </StudentProfileContext.Provider>
  );
}

export function useStudentProfile() {
  const context = useContext(StudentProfileContext);

  if (!context) {
    throw new Error(
      "useStudentProfile must be used inside StudentProfileProvider"
    );
  }

  return context;
}
