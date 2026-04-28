"use client";
import StudentProfileMenu from "@/components/student-profile-menu";
import { useStudentProfile } from "@/components/student-profile-context";
import { authClient } from "@/auth/auth-client";
import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ChevronRight,
  FolderKanban,
  Home,
  LogOut,
  Settings,
} from "lucide-react";
import styles from "./account_setting.module.css";

type UserProfileResponse = {
  name?: string | null;
  email?: string;
  contactNumber?: string | null;
  bio?: string | null;
  error?: string;
};

export default function AccountSettingsPage() {
  const { profile, updateProfile } = useStudentProfile();
  const { data: sessionData } = authClient.useSession();
  const userId = sessionData?.user?.id ?? null;

  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    bio: string;
  } | null>(null);

  const resolvedFormData = formData ?? {
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    bio: profile.bio,
  };

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!userId) {
        return;
      }

      try {
        const profileRes = await fetch(`/api/student/user-profile/${userId}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = (await profileRes.json()) as UserProfileResponse;
        if (!profileRes.ok || data.error || !isMounted) return;

        setFormData({
          fullName: data.name ?? profile.fullName,
          email: data.email ?? profile.email,
          phone: data.contactNumber ?? "",
          bio: data.bio ?? "",
        });
      } catch {
        if (isMounted) {
          setErrorMessage("Failed to load profile.");
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [userId, profile.fullName, profile.email]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...(prev ?? {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
      }),
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      setErrorMessage("Unable to resolve current user.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/student/user-profile/${userId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resolvedFormData.fullName.trim(),
          email: resolvedFormData.email.trim(),
          contactNumber: resolvedFormData.phone.trim() || null,
          bio: resolvedFormData.bio.trim() || null,
        }),
      });

      const data = (await res.json()) as UserProfileResponse;

      if (!res.ok || data.error) {
        setErrorMessage(data.error || "Failed to update profile.");
        return;
      }

      const nextProfile = {
        fullName: data.name ?? resolvedFormData.fullName,
        email: data.email ?? resolvedFormData.email,
        phone: data.contactNumber ?? "",
        bio: data.bio ?? "",
      };

      setFormData(nextProfile);
      updateProfile(nextProfile);

      setSuccessMessage("Profile updated successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 1800);
    } catch {
      setErrorMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(null);
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className={styles.studentPage}>
      <aside className={styles.studentSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.studentBrand}>
            <div className={styles.brandIcon}>🛡️</div>
            <div>
              <h2>Lost &amp; Found</h2>
              <p>Student Homepage</p>
            </div>
          </div>

          <nav className={styles.studentNav}>
            <Link href="/student" className={styles.navItem}>
              <Home size={20} />
              <span>Home</span>
            </Link>

            <Link href="/student/my-claims" className={styles.navItem}>
              <FolderKanban size={20} />
              <span>My Claims</span>
            </Link>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Log Out</span>
          </Link>
        </div>
      </aside>

      <main className={styles.studentMain}>
        <header className={styles.studentTopbar}>
          <div className={styles.pageTitleWrap}>
            <Settings size={34} className={styles.topIcon} />
            <h1>Account Settings</h1>
            <ChevronRight size={20} className={styles.crumbArrow} />
          </div>

          <div className={styles.topbarRight}>
            <nav className={styles.topLinks}>
              <Link href="/student" className={styles.topLink}>
                Home
              </Link>
              <Link href="/student/my-claims" className={styles.topLink}>
                My Claims
              </Link>
            </nav>

            <StudentProfileMenu
              classNames={{
                profileMenuWrap: styles.profileMenuWrap,
                userBoxButton: styles.userBoxButton,
                userAvatar: styles.userAvatar,
                profileDropdown: styles.profileDropdown,
                profileDropdownItem: styles.profileDropdownItem,
              }}
            />
          </div>
        </header>

        <section className={styles.settingsSection}>
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h2>Profile Information</h2>
              <p>Update your personal information.</p>
            </div>

            <form className={styles.settingsForm} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={resolvedFormData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={resolvedFormData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={resolvedFormData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={5}
                  value={resolvedFormData.bio}
                  onChange={handleInputChange}
                />
              </div>

              {successMessage && (
                <div className={styles.successMessage}>{successMessage}</div>
              )}

              {errorMessage && (
                <div
                  className={styles.successMessage}
                  style={{
                    background: "#fff0f1",
                    borderColor: "#f2c8cd",
                    color: "#b42318",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
