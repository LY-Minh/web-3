"use client";
import StudentProfileMenu from "@/components/student-profile-menu";
import { useStudentProfile } from "@/components/student-profile-context";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Home,
  LogOut,
  Settings,
  Camera,
} from "lucide-react";
import styles from "./account_setting.module.css";

export default function AccountSettingsPage() {
  const { profile, updateProfile } = useStudentProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/200?img=12"
  );

  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    bio: profile.bio,
    profileImage: profile.profileImage,
  });
  useEffect(() => {
    setFormData({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      bio: profile.bio,
      profileImage: profile.profileImage,
    });
  }, [profile]);

  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setFormData((prev) => ({
          ...prev,
          profileImage: result,
        }));
      }
    };

    reader.readAsDataURL(file);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateProfile({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      profileImage: formData.profileImage,
    });

    setSuccessMessage("Profile updated successfully.");

    setTimeout(() => {
      setSuccessMessage("");
    }, 1800);
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
          <div className={styles.profileMini}>N</div>

          <a href="/" className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Log Out</span>
          </a>
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
              <p>Update your photo and personal information.</p>
            </div>

            <form className={styles.settingsForm} onSubmit={handleSubmit}>
              <div className={styles.profileImageSection}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.hiddenFileInput}
                />

                <div className={styles.profileImageWrap}>
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className={styles.profileImageLarge}
                  />
                </div>

                <button
                  type="button"
                  className={styles.changePhotoBtn}
                  onClick={handleChooseImage}
                >
                  <Camera size={18} />
                  <span>Change Profile Photo</span>
                </button>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={formData.phone}
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
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </div>

              {successMessage && (
                <div className={styles.successMessage}>{successMessage}</div>
              )}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
