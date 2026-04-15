"use client";
import StudentProfileMenu from "@/components/student-profile-menu";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  FolderKanban,
  LogOut,
  Upload,
  Search,
} from "lucide-react";
import styles from "./report_items.module.css";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
export default function ReportItemPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFileName, setSelectedFileName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    reportType: "lost",
    itemName: "",
    category: "electronics",
    color: "black",
    location: "",
    date: "",
    description: "",
  });
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName("");
    }
  };

  const handleCancel = () => {
    setFormData({
      reportType: "lost",
      itemName: "",
      category: "electronics",
      color: "black",
      location: "",
      date: "",
      description: "",
    });
    setSelectedFileName("");
    setSuccessMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccessMessage("Report submitted successfully.");

    setFormData({
      reportType: "lost",
      itemName: "",
      category: "electronics",
      color: "black",
      location: "",
      date: "",
      description: "",
    });
    setSelectedFileName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

            <Link
              href="/student/report_items"
              className={`${styles.navItem} ${styles.active}`}
            >
              <FileText size={20} />
              <span>Report Item</span>
            </Link>

            <Link href="/student/my-claims" className={styles.navItem}>
              <FolderKanban size={20} />
              <span>My Claims</span>
            </Link>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <a href="/" className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Log Out</span>
          </a>
        </div>
      </aside>

      <main className={styles.studentMain}>
        <header className={styles.studentTopbar}>
          <div className={styles.pageTitleWrap}>
            <FileText size={34} className={styles.topIcon} />
            <h1>Report Item</h1>
            <ChevronRight size={20} className={styles.crumbArrow} />
          </div>

          <div className={styles.topbarRight}>
            <nav className={styles.topLinks}>
              <Link href="/student" className={styles.topLink}>
                Home
              </Link>
              <Link
                href="/student/report_items"
                className={`${styles.topLink} ${styles.topLinkActive}`}
              >
                Report Item
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

        <section className={styles.heroBanner}>
          <h2>
            <strong>Report a Lost or Found Item</strong> Help others recover
            their belongings faster.
          </h2>
          <p>
            Fill in the details below as clearly as possible so the item can be
            matched accurately.
          </p>
        </section>

        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              <h3>Item Details</h3>
              <p>Provide the basic information about the item.</p>
            </div>

            <form className={styles.reportForm} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="reportType">Report Type</label>
                  <div className={styles.selectWrap}>
                    <select
                      id="reportType"
                      name="reportType"
                      value={formData.reportType}
                      onChange={handleInputChange}
                    >
                      <option value="lost">Lost Item</option>
                      <option value="found">Found Item</option>
                    </select>
                    <ChevronDown size={18} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="itemName">Item Name</label>
                  <input
                    id="itemName"
                    name="itemName"
                    type="text"
                    placeholder="e.g. Black Backpack"
                    value={formData.itemName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">Category</label>
                  <div className={styles.selectWrap}>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="electronics">Electronics</option>
                      <option value="bags">Bags</option>
                      <option value="accessories">Accessories</option>
                      <option value="personal-items">Personal Items</option>
                      <option value="documents">Documents</option>
                      <option value="clothing">Clothing</option>
                      <option value="keys">Keys</option>
                    </select>
                    <ChevronDown size={18} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="color">Color</label>
                  <div className={styles.selectWrap}>
                    <select
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                    >
                      <option value="black">Black</option>
                      <option value="white">White</option>
                      <option value="brown">Brown</option>
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                      <option value="red">Red</option>
                      <option value="yellow">Yellow</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="others">Others</option>
                    </select>
                    <ChevronDown size={18} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Library, Room A201, Cafeteria"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="date">Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the item clearly, including brand, size, special marks, stickers, keychain, or anything distinctive."
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Upload Image</label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.hiddenFileInput}
                />

                <div className={styles.uploadBox}>
                  <Upload size={26} />
                  <h4>Drag and drop your image here</h4>
                  <p>or click to browse files</p>

                  {selectedFileName && (
                    <span className={styles.fileName}>
                      Selected: {selectedFileName}
                    </span>
                  )}

                  <button
                    type="button"
                    className={styles.uploadBtn}
                    onClick={handleChooseFile}
                  >
                    Choose File
                  </button>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                {successMessage && (
                  <div className={styles.successMessage}>{successMessage}</div>
                )}
                <button type="submit" className={styles.submitBtn}>
                  Submit Report
                </button>
              </div>
            </form>
          </div>

          <div className={styles.sidePanel}>
            <div className={styles.tipCard}>
              <h3>Reporting Tips</h3>
              <ul>
                <li>Use a clear and specific item name.</li>
                <li>Include color, brand, and unique details.</li>
                <li>Mention the last known location accurately.</li>
                <li>Upload a clear image if available.</li>
              </ul>
            </div>

            <div className={styles.previewCard}>
              <h3>Quick Search First</h3>
              <p>
                Before reporting, you may want to search existing found items.
              </p>
              <div className={styles.searchMini}>
                <Search size={18} />
                <input type="text" placeholder="Search existing items..." />
              </div>
              <Link href="/student" className={styles.searchLinkBtn}>
                Go to Homepage
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
