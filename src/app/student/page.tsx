"use client";

import StudentProfileMenu from "@/components/student-profile-menu";
import Link from "next/link";
import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Search,
  Home,
  FolderKanban,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import styles from "./student.module.css";

type ItemCategory =
  | "electronics"
  | "clothing"
  | "accessories"
  | "documents"
  | "other";

type ItemStatus = "lost" | "claimed" | "approved_claim" | "picked_up";

type Item = {
  id: string;
  name: string;
  description: string | null;
  category: ItemCategory;
  status: ItemStatus;
  registeredById: string;
  createdAt: string;
  updatedAt: string;
};

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  accessories: "Accessories",
  documents: "Documents",
  other: "Other",
};

const STATUS_LABELS: Record<ItemStatus, string> = {
  lost: "Lost",
  claimed: "Claimed",
  approved_claim: "Approved Claim",
  picked_up: "Picked Up",
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString();
};

export default function StudentPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState("");
  const [claimError, setClaimError] = useState<string | null>(null);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ItemCategory>(
    "all"
  );
  const [sortBy, setSortBy] = useState("newest");

  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadItems = useCallback(async () => {
    setIsLoadingItems(true);
    setItemsError(null);

    try {
      const response = await fetch("/api/student/items", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          typeof data?.error === "string"
            ? data.error
            : "Failed to load items.";
        throw new Error(message);
      }

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response from items API.");
      }

      setItems(data as Item[]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load items.";
      setItemsError(message);
    } finally {
      setIsLoadingItems(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const openDetailModal = (item: Item) => {
    setDetailItem(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setDetailItem(null);
    setShowDetailModal(false);
  };

  const [claimForm, setClaimForm] = useState({
    proofDescription: "",
  });
  const [claimFiles, setClaimFiles] = useState<File[]>([]);

  const openClaimModal = (item: Item) => {
    setSelectedItem(item);
    setShowClaimModal(true);
    setClaimSuccess("");
    setClaimError(null);
    setClaimForm({
      proofDescription: "",
    });
    setClaimFiles([]);
  };

  const closeClaimModal = () => {
    setShowClaimModal(false);
    setSelectedItem(null);
    setClaimSuccess("");
    setClaimError(null);
    setClaimForm({
      proofDescription: "",
    });
    setClaimFiles([]);
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

  const handleClaimFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setClaimFiles(files);
  };

  const handleClaimSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedItem) {
      return;
    }

    setClaimSuccess("");
    setClaimError(null);

    const proofDescription = claimForm.proofDescription.trim();

    if (proofDescription.length < 10) {
      setClaimError("Please provide at least 10 characters of claim details.");
      return;
    }

    if (claimFiles.length === 0) {
      setClaimError("Please upload at least one proof file.");
      return;
    }

    setIsSubmittingClaim(true);

    try {
      const payload = new FormData();
      payload.append("itemId", selectedItem.id);
      payload.append("proofDescription", proofDescription);
      claimFiles.forEach((file) => payload.append("files", file));

      const response = await fetch("/api/student/claims", {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      const data = await response.json();
      if (!response.ok) {
        const message =
          typeof data?.error === "string"
            ? data.error
            : "Failed to submit claim.";
        setClaimError(message);
        return;
      }

      await loadItems();
      window.dispatchEvent(new Event("claims:changed"));

      setClaimSuccess(
        `Your claim for "${selectedItem.name}" has been submitted successfully.`
      );

      setTimeout(() => {
        closeClaimModal();
      }, 1800);
    } catch {
      setClaimError("Something went wrong while submitting your claim.");
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  const displayedItems = useMemo(() => {
    let filtered = [...items];

    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.category === categoryFilter
      );
    }

    filtered.sort((a, b) => {
      const left = new Date(a.createdAt).getTime();
      const right = new Date(b.createdAt).getTime();

      if (sortBy === "newest") {
        return right - left;
      }

      return left - right;
    });

    return filtered;
  }, [items, searchTerm, categoryFilter, sortBy]);

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
          <div className={styles.pageTitleWrap} />

          <div className={styles.topbarRight}>
            <nav className={styles.topLinks}>
              <Link
                href="/student"
                className={`${styles.topLink} ${styles.topLinkActive}`}
              >
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
              onChange={(e) =>
                setCategoryFilter(e.target.value as "all" | ItemCategory)
              }
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="documents">Documents</option>
              <option value="other">Other</option>
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
        </section>

        <section className={styles.itemsSection}>
          <h3>Recent Found Items</h3>
          <div className={styles.itemsGrid}>
            {isLoadingItems ? (
              <p className={styles.noItemsMessage}>Loading items...</p>
            ) : itemsError ? (
              <p className={styles.noItemsMessage}>{itemsError}</p>
            ) : displayedItems.length > 0 ? (
              displayedItems.map((item) => (
                <div className={styles.itemCard} key={item.id}>
                  <div className={styles.itemImageWrap}>
                    <div
                      className={styles.itemImage}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        background: "#eaf0fa",
                        color: "#31415f",
                        fontWeight: 700,
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      {CATEGORY_LABELS[item.category]}
                    </div>
                  </div>

                  <div className={styles.itemInfo}>
                    <h4>{item.name}</h4>
                    <p
                      style={{
                        margin: "0 0 14px",
                        color: "#566784",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {STATUS_LABELS[item.status]} • {formatDate(item.createdAt)}
                    </p>

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
                        disabled={
                          item.status === "approved_claim" ||
                          item.status === "picked_up"
                        }
                        onClick={() => openClaimModal(item)}
                        style={
                          item.status === "approved_claim" ||
                          item.status === "picked_up"
                            ? { opacity: 0.55, cursor: "not-allowed" }
                            : undefined
                        }
                      >
                        {item.status === "approved_claim" ||
                        item.status === "picked_up"
                          ? "Unavailable"
                          : "Claim Item"}
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
              <div className={styles.claimFormGroup}>
                <label htmlFor="proofDescription">Proof Description</label>
                <textarea
                  id="proofDescription"
                  name="proofDescription"
                  rows={4}
                  value={claimForm.proofDescription}
                  onChange={handleClaimInputChange}
                  placeholder="Describe why this item belongs to you (marks, stickers, scratches, contents, etc.)"
                  required
                />
              </div>

              <div className={styles.claimFormGroup}>
                <label htmlFor="proofFiles">Upload Proof Files</label>
                <input
                  id="proofFiles"
                  name="proofFiles"
                  type="file"
                  multiple
                  className={styles.fileInputHidden}
                  onChange={handleClaimFilesChange}
                />
                <label htmlFor="proofFiles" className={styles.fileUploadButton}>
                  Choose Files
                </label>
                <p className={styles.fileUploadHint}>
                  Upload screenshots, receipts, or photos as evidence.
                </p>
                {claimFiles.length > 0 && (
                  <>
                    <p className={styles.fileUploadHint}>
                      {claimFiles.length} file
                      {claimFiles.length > 1 ? "s" : ""} selected
                    </p>
                    <ul className={styles.fileUploadList}>
                      {claimFiles.map((file) => (
                        <li key={`${file.name}-${file.size}`} className={styles.fileUploadItem}>
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {claimSuccess && (
                <div className={styles.claimSuccessMessage}>{claimSuccess}</div>
              )}

              {claimError && (
                <div
                  className={styles.claimSuccessMessage}
                  style={{
                    background: "#fff0f1",
                    borderColor: "#f2c8cd",
                    color: "#b42318",
                  }}
                >
                  {claimError}
                </div>
              )}

              <div className={styles.claimModalActions}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={closeClaimModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalSubmitBtn}
                  disabled={isSubmittingClaim}
                  style={
                    isSubmittingClaim
                      ? { opacity: 0.7, cursor: "not-allowed" }
                      : undefined
                  }
                >
                  {isSubmittingClaim ? "Submitting..." : "Submit Claim"}
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
                <div
                  className={styles.detailImage}
                  style={{
                    display: "grid",
                    placeItems: "center",
                    background: "#eaf0fa",
                    color: "#31415f",
                    fontWeight: 700,
                    textAlign: "center",
                    padding: "16px",
                  }}
                >
                  {CATEGORY_LABELS[detailItem.category]}
                </div>
              </div>

              <div className={styles.detailInfo}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Item Name</span>
                  <span className={styles.detailValue}>{detailItem.name}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Category</span>
                  <span className={styles.detailValue}>
                    {CATEGORY_LABELS[detailItem.category]}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={styles.detailValue}>
                    {STATUS_LABELS[detailItem.status]}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Date Registered</span>
                  <span className={styles.detailValue}>
                    {formatDate(detailItem.createdAt)}
                  </span>
                </div>

                <div className={styles.detailDescriptionBlock}>
                  <span className={styles.detailLabel}>Description</span>
                  <p className={styles.detailDescription}>
                    {detailItem.description ?? "No description provided."}
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
                disabled={
                  detailItem.status === "approved_claim" ||
                  detailItem.status === "picked_up"
                }
                onClick={() => {
                  if (
                    detailItem.status === "approved_claim" ||
                    detailItem.status === "picked_up"
                  ) {
                    return;
                  }
                  closeDetailModal();
                  openClaimModal(detailItem);
                }}
                style={
                  detailItem.status === "approved_claim" ||
                  detailItem.status === "picked_up"
                    ? { opacity: 0.55, cursor: "not-allowed" }
                    : undefined
                }
              >
                {detailItem.status === "approved_claim" ||
                detailItem.status === "picked_up"
                  ? "Claim Unavailable"
                  : "Claim This Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
