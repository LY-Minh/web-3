"use client";

import StudentProfileMenu from "@/components/student-profile-menu";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Settings,
  Search,
  Home,
  FileText,
  FolderKanban,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import styles from "./student.module.css";

type Item = {
  id: number;
  name: string;
  category: string;
  color: string;
  status: string;
  image: string;
  foundLocation: string;
  dateFound: string;
  description: string;
};

const sampleItems: Item[] = [
  {
    id: 1,
    name: "Black Backpack",
    category: "Bags",
    color: "black",
    status: "Found",
    image: "/image/student/black_backpack.jpeg",
    foundLocation: "Main Library, 2nd Floor",
    dateFound: "2026-04-10",
    description:
      "A black backpack with multiple zip compartments and a small silver keychain attached to the front pocket.",
  },
  {
    id: 2,
    name: "Silver iPhone",
    category: "Electronics",
    color: "silver",
    status: "Found",
    image: "/image/student/silver iphone.jpeg",
    foundLocation: "Cafeteria near the cashier",
    dateFound: "2026-04-11",
    description:
      "Silver iPhone with a transparent case and visible scratch on the top-right corner.",
  },
  {
    id: 3,
    name: "Set of Keys",
    category: "Accessories",
    color: "silver",
    status: "Found",
    image: "/image/student/keys.jpeg",
    foundLocation: "Hallway outside Room C214",
    dateFound: "2026-04-09",
    description:
      "A small set of keys with a blue plastic keychain and one gold-colored key.",
  },
  {
    id: 4,
    name: "AirPods",
    category: "Electronics",
    color: "white",
    status: "Found",
    image: "/image/student/airpods.jpeg",
    foundLocation: "Student Lounge sofa area",
    dateFound: "2026-04-12",
    description:
      "White AirPods case with slight dirt marks on the bottom and initials sticker on the back.",
  },
  {
    id: 5,
    name: "Wallet",
    category: "Accessories",
    color: "brown",
    status: "Found",
    image: "/image/student/wallet.jpeg",
    foundLocation: "Parking area near Gate B",
    dateFound: "2026-04-08",
    description:
      "Brown leather wallet with multiple card slots and a slightly worn corner.",
  },
  {
    id: 6,
    name: "Water Bottle",
    category: "Personal Items",
    color: "black",
    status: "Found",
    image: "/image/student/water bottle.jpeg",
    foundLocation: "Gym entrance bench",
    dateFound: "2026-04-07",
    description:
      "Black reusable bottle with flip lid and white sticker around the middle.",
  },
];

export default function StudentPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("color");
  const [sortBy, setSortBy] = useState("newest");
  const [alphabetOrder, setAlphabetOrder] = useState("az");
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const openDetailModal = (item: Item) => {
    setDetailItem(item);
    setShowDetailModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const closeDetailModal = () => {
    setDetailItem(null);
    setShowDetailModal(false);
  };
  const [claimForm, setClaimForm] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
    reason: "",
    proof: "",
  });

  const openClaimModal = (item: Item) => {
    setSelectedItem(item);
    setShowClaimModal(true);
    setClaimSuccess("");
    setClaimForm({
      fullName: "",
      studentId: "",
      email: "",
      phone: "",
      reason: "",
      proof: "",
    });
  };

  const closeClaimModal = () => {
    setShowClaimModal(false);
    setSelectedItem(null);
    setClaimSuccess("");
    setClaimForm({
      fullName: "",
      studentId: "",
      email: "",
      phone: "",
      reason: "",
      proof: "",
    });
  };

  const handleClaimInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClaimForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClaimSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setClaimSuccess(
      `Your claim for "${selectedItem?.name}" has been submitted successfully.`
    );

    setTimeout(() => {
      closeClaimModal();
    }, 1500);
  };
  const displayedItems = useMemo(() => {
    let filtered = [...sampleItems];

    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.category.toLowerCase().replace(/\s+/g, "-") === categoryFilter
      );
    }

    if (colorFilter !== "color") {
      filtered = filtered.filter((item) => item.color === colorFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === "newest") return b.id - a.id;
      return a.id - b.id;
    });

    filtered.sort((a, b) => {
      if (alphabetOrder === "az") {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });

    return filtered;
  }, [searchTerm, categoryFilter, colorFilter, sortBy, alphabetOrder]);

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
            <Link
              href="/student"
              className={`${styles.navItem} ${styles.active}`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>

            <Link href="/student/report_items" className={styles.navItem}>
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
          <div className={styles.pageTitleWrap} />

          <div className={styles.topbarRight}>
            <nav className={styles.topLinks}>
              <Link
                href="/student"
                className={`${styles.topLink} ${styles.topLinkActive}`}
              >
                Home
              </Link>
              <Link href="/student/report_items" className={styles.topLink}>
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

        <section className={styles.searchBanner}>
          <h2>
            <strong>Lost Something?</strong> Find your lost items here.
          </h2>

          <div className={styles.searchBox}>
            <div className={styles.searchInputWrap}>
              <Search size={24} />
              <input
                type="text"
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.searchBtn} type="button">
              Search
            </button>
          </div>
        </section>
        <section className={styles.filtersRow}>
          <div className={styles.filterSelect}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
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

          <div className={styles.filterSelect}>
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
            >
              <option value="color">Color</option>
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

          <div className={styles.filterSelect}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <ChevronDown size={18} />
          </div>

          <div className={styles.filterSelect}>
            <select
              value={alphabetOrder}
              onChange={(e) => setAlphabetOrder(e.target.value)}
            >
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
            <ChevronDown size={18} />
          </div>
        </section>

        <section className={styles.itemsSection}>
          <h3>Recent Found Items</h3>
          <div className={styles.itemsGrid}>
            {displayedItems.length > 0 ? (
              displayedItems.map((item) => (
                <div className={styles.itemCard} key={item.id}>
                  <div className={styles.itemImageWrap}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                  </div>

                  <div className={styles.itemInfo}>
                    <h4>{item.name}</h4>

                    <div className={styles.itemActionButtons}>
                      <button
                        className={styles.detailBtn}
                        type="button"
                        onClick={() => openDetailModal(item)}
                      >
                        View Details
                      </button>

                      <button
                        className={styles.claimBtn}
                        type="button"
                        onClick={() => openClaimModal(item)}
                      >
                        Claim Item
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noItemsMessage}>
                No items match your filters.
              </p>
            )}
          </div>
        </section>
      </main>

      {showClaimModal && selectedItem && (
        <div className={styles.modalOverlay} onClick={closeClaimModal}>
          <div
            className={styles.claimModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h3>Claim Item</h3>
                <p>
                  You are claiming: <strong>{selectedItem.name}</strong>
                </p>
              </div>

              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={closeClaimModal}
              >
                <X size={20} />
              </button>
            </div>

            <form className={styles.claimForm} onSubmit={handleClaimSubmit}>
              <div className={styles.claimFormGrid}>
                <div className={styles.claimFormGroup}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={claimForm.fullName}
                    onChange={handleClaimInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className={styles.claimFormGroup}>
                  <label htmlFor="studentId">Student ID</label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    value={claimForm.studentId}
                    onChange={handleClaimInputChange}
                    placeholder="Enter your student ID"
                    required
                  />
                </div>

                <div className={styles.claimFormGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={claimForm.email}
                    onChange={handleClaimInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className={styles.claimFormGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={claimForm.phone}
                    onChange={handleClaimInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className={styles.claimFormGroup}>
                <label htmlFor="reason">
                  Why do you believe this item is yours?
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  value={claimForm.reason}
                  onChange={handleClaimInputChange}
                  placeholder="Explain why this item belongs to you"
                  required
                />
              </div>

              <div className={styles.claimFormGroup}>
                <label htmlFor="proof">Distinctive proof/details</label>
                <textarea
                  id="proof"
                  name="proof"
                  rows={4}
                  value={claimForm.proof}
                  onChange={handleClaimInputChange}
                  placeholder="Mention unique marks, stickers, scratches, keychains, or other proof"
                  required
                />
              </div>

              {claimSuccess && (
                <div className={styles.claimSuccessMessage}>{claimSuccess}</div>
              )}

              <div className={styles.claimModalActions}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={closeClaimModal}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSubmitBtn}>
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDetailModal && detailItem && (
        <div className={styles.modalOverlay} onClick={closeDetailModal}>
          <div
            className={styles.detailModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h3>Item Details</h3>
                <p>
                  View full information for <strong>{detailItem.name}</strong>
                </p>
              </div>

              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={closeDetailModal}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.detailContent}>
              <div className={styles.detailImageWrap}>
                <img
                  src={detailItem.image}
                  alt={detailItem.name}
                  className={styles.detailImage}
                />
              </div>

              <div className={styles.detailInfo}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Item Name</span>
                  <span className={styles.detailValue}>{detailItem.name}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Category</span>
                  <span className={styles.detailValue}>
                    {detailItem.category}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Color</span>
                  <span className={styles.detailValue}>{detailItem.color}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={styles.detailValue}>
                    {detailItem.status}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Where It Was Found</span>
                  <span className={styles.detailValue}>
                    {detailItem.foundLocation}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Date Found</span>
                  <span className={styles.detailValue}>
                    {detailItem.dateFound}
                  </span>
                </div>

                <div className={styles.detailDescriptionBlock}>
                  <span className={styles.detailLabel}>Description</span>
                  <p className={styles.detailDescription}>
                    {detailItem.description}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.detailModalActions}>
              <button
                type="button"
                className={styles.modalCancelBtn}
                onClick={closeDetailModal}
              >
                Close
              </button>

              <button
                type="button"
                className={styles.modalSubmitBtn}
                onClick={() => {
                  closeDetailModal();
                  openClaimModal(detailItem);
                }}
              >
                Claim This Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
