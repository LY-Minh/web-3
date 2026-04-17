"use client";

import StudentProfileMenu from "@/components/student-profile-menu";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Home,
  LogOut,
} from "lucide-react";
import styles from "./my-claims.module.css";

type ClaimStatus = "pending" | "approved" | "rejected";

type ItemStatus = "lost" | "claimed" | "approved_claim" | "picked_up";

type ItemCategory =
  | "electronics"
  | "clothing"
  | "accessories"
  | "documents"
  | "other";

type ClaimRecord = {
  id: string;
  itemId: string;
  studentId: string;
  proofDescription: string;
  status: ClaimStatus;
  reviewedById: string | null;
  createdAt: string;
  updatedAt: string;
};

type ItemRecord = {
  id: string;
  name: string;
  description: string | null;
  category: ItemCategory;
  status: ItemStatus;
  registeredById: string;
  createdAt: string;
  updatedAt: string;
};

type ClaimItem = {
  id: string;
  itemName: string;
  itemDescription: string;
  itemCategory: ItemCategory;
  itemStatus: ItemStatus;
  submittedDate: string;
  proofDescription: string;
  status: ClaimStatus;
};

const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  pending: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
};

const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  lost: "Lost",
  claimed: "Claimed",
  approved_claim: "Approved Claim",
  picked_up: "Picked Up",
};

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  accessories: "Accessories",
  documents: "Documents",
  other: "Other",
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString();
};

const getStatusClassName = (status: ClaimStatus) => {
  if (status === "approved") {
    return styles.statusApproved;
  }
  if (status === "rejected") {
    return styles.statusRejected;
  }
  return styles.statusReview;
};

export default function MyClaimsPage() {
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const loadClaims = useCallback(async () => {
    setIsLoadingClaims(true);
    setLoadError(null);

    try {
      const claimsResponse = await fetch("/api/student/claims", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const claimsData = await claimsResponse.json();
      if (!claimsResponse.ok) {
        const message =
          typeof claimsData?.error === "string"
            ? claimsData.error
            : "Failed to load claims.";
        throw new Error(message);
      }

      if (!Array.isArray(claimsData)) {
        throw new Error("Unexpected claims response format.");
      }

      const claimRecords = claimsData as ClaimRecord[];
      const enrichedClaims = await Promise.all(
        claimRecords.map(async (claim) => {
          let item: ItemRecord | null = null;

          const itemResponse = await fetch(`/api/student/items/${claim.itemId}`, {
            method: "GET",
            credentials: "include",
          });

          if (itemResponse.ok) {
            item = (await itemResponse.json()) as ItemRecord;
          }

          return {
            id: claim.id,
            itemName: item?.name ?? "Unknown item",
            itemDescription: item?.description ?? "No item description available.",
            itemCategory: item?.category ?? "other",
            itemStatus: item?.status ?? "claimed",
            submittedDate: claim.createdAt,
            proofDescription: claim.proofDescription,
            status: claim.status,
          } as ClaimItem;
        })
      );

      setClaims(enrichedClaims);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load claims.";
      setLoadError(message);
      setClaims([]);
    } finally {
      setIsLoadingClaims(false);
    }
  }, []);

  useEffect(() => {
    void loadClaims();

    const handleClaimsChanged = () => {
      void loadClaims();
    };

    window.addEventListener("claims:changed", handleClaimsChanged);
    return () => {
      window.removeEventListener("claims:changed", handleClaimsChanged);
    };
  }, [loadClaims]);

  const handleRefreshClaims = async () => {
    await loadClaims();
  };

  const visibleClaims = useMemo(() => {
    let filtered = [...claims];

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (claim) =>
          claim.status.toLowerCase() === statusFilter
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const left = new Date(a.submittedDate).getTime();
      const right = new Date(b.submittedDate).getTime();
      if (sortBy === "newest") return right - left;
      return left - right;
    });

    return filtered;
  }, [claims, statusFilter, sortBy]);

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
              href="/student/my-claims"
              className={`${styles.navItem} ${styles.active}`}
            >
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
            <FolderKanban size={34} className={styles.topIcon} />
            <h1>My Claims</h1>
            <ChevronRight size={20} className={styles.crumbArrow} />
          </div>

          <div className={styles.topbarRight}>
            <nav className={styles.topLinks}>
              <Link href="/student" className={styles.topLink}>
                Home
              </Link>
              <Link
                href="/student/my-claims"
                className={`${styles.topLink} ${styles.topLinkActive}`}
              >
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
          <h2>My Claims</h2>
          <p>
            Track the status of claims you submitted.
          </p>

          <div className={styles.filtersRow}>
            <div className={styles.filterSelect}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown size={18} />
            </div>

            <div className={styles.filterSelect}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <ChevronDown size={18} />
            </div>
          </div>

          {loadError && <p className={styles.stateMessage}>{loadError}</p>}
        </section>

        <section className={styles.claimsSection}>
          <h3>My Claims ({visibleClaims.length})</h3>

          {isLoadingClaims ? (
            <p className={styles.emptyState}>Loading claims...</p>
          ) : loadError ? (
            <p className={styles.emptyState}>{loadError}</p>
          ) : visibleClaims.length === 0 ? (
            <p className={styles.emptyState}>
              No claims found yet. Submit a claim from Home and it will appear here.
            </p>
          ) : (
            <div className={styles.claimsGrid}>
              {visibleClaims.map((claim) => (
                <div className={styles.claimCard} key={claim.id}>
                  <div className={styles.claimTop}>
                    <div className={styles.claimImageWrap}>
                      <div className={styles.claimImagePlaceholder}>
                        {CATEGORY_LABELS[claim.itemCategory]}
                      </div>
                    </div>

                    <div className={styles.claimMainInfo}>
                      <h4>{claim.itemName}</h4>
                      <p className={styles.claimedDate}>
                        Submitted: {formatDate(claim.submittedDate)}
                      </p>

                      <span
                        className={`${styles.statusBadge} ${getStatusClassName(
                          claim.status
                        )}`}
                      >
                        {CLAIM_STATUS_LABELS[claim.status]}
                      </span>
                    </div>
                  </div>

                  <div className={styles.claimBody}>
                    <p>
                      <strong>Category:</strong> {CATEGORY_LABELS[claim.itemCategory]}
                    </p>
                    <p>
                      <strong>Item Status:</strong> {ITEM_STATUS_LABELS[claim.itemStatus]}
                    </p>
                    <p>
                      <strong>Item Description:</strong> {claim.itemDescription}
                    </p>
                    <p>
                      <strong>Proof:</strong> {claim.proofDescription}
                    </p>
                  </div>

                  <div className={styles.claimActions}>
                    <button
                      className={styles.primaryBtn}
                      type="button"
                      onClick={handleRefreshClaims}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
