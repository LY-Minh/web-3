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

type StudentProfileContextType = {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
};

const DEFAULT_PROFILE: StudentProfile = {
  fullName: "John Doe",
  email: "johndoe@example.com",
  phone: "012 345 678",
  bio: "Student at AUPP.",
  profileImage: "https://i.pravatar.cc/200?img=12",
};

const STORAGE_KEY = "student-profile";

const StudentProfileContext = createContext<StudentProfileContextType | null>(
  null
);

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StudentProfile;
        setProfile(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setHydrated(true);
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
