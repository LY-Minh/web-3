"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  FileCheck2,
  History,
  LogOut,
  Package,
  Search,
  X,
} from "lucide-react";
import styles from "../items/items.module.css";

type ClaimStatus = "pending" | "approved" | "rejected";

type AdminClaim = {
  id: string;
  itemId: string;
  studentId: string;
  status: ClaimStatus;
  createdAt: string;
  itemName: string;
  studentName: string;
  studentEmail: string;
  reviewerName: string | null;
};

const STATUS_OPTIONS: Array<{ value: "" | ClaimStatus; label: string }> = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const statusClass: Record<ClaimStatus, string> = {
  pending: styles.statusClaimed,
  approved: styles.statusAvailable,
  rejected: styles.statusReturned,
};

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function toLabel(value: ClaimStatus) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ClaimStatus>("");
  const [reviewingClaimId, setReviewingClaimId] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    const response = await fetch("/api/admin/claims", { cache: "no-store" });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? "Failed to fetch claims");
    }

    const payload = (await response.json()) as AdminClaim[];
    setClaims(payload);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadClaims = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await fetchClaims();
      } catch (fetchError) {
        if (!isCancelled) {
          const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch claims";
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadClaims();

    return () => {
      isCancelled = true;
    };
  }, [fetchClaims]);

  const filteredClaims = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return claims.filter((claim) => {
      if (statusFilter && claim.status !== statusFilter) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const haystack = [claim.id, claim.itemName, claim.itemId, claim.studentName, claim.studentEmail]
        .join(" ")
        .toLowerCase();

      return haystack.includes(searchTerm);
    });
  }, [claims, search, statusFilter]);

  async function reviewClaim(claimId: string, status: "approved" | "rejected") {
    setReviewingClaimId(claimId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/claims/${claimId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Failed to review claim");
      }

      await fetchClaims();
    } catch (reviewError) {
      const message = reviewError instanceof Error ? reviewError.message : "Failed to review claim";
      setError(message);
    } finally {
      setReviewingClaimId(null);
    }
  }

  return (
    <div className={styles.adminPage}>
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.adminBrand}>
            <div className={styles.brandIcon}>
              <Package size={20} />
            </div>
            <div>
              <h2>Lost &amp; Found</h2>
              <p>Admin Panel</p>
            </div>
          </div>

          <p className={styles.menuLabel}>Navigation</p>
          <nav className={styles.adminNav}>
            <Link href="/admin/items" className={styles.navItem}>
              <Package size={18} /> Items
            </Link>
            <Link href="/admin/claims" className={`${styles.navItem} ${styles.active}`}>
              <FileCheck2 size={18} /> Claims
            </Link>
            <Link href="/admin/agreements" className={styles.navItem}>
              <FileCheck2 size={18} /> Agreements
            </Link>
            <Link href="/admin/logs" className={styles.navItem}>
              <History size={18} /> Activity Logs
            </Link>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <button className={styles.logoutBtn}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className={styles.adminMain}>
        <header className={styles.adminTopbar}>
          <div className={styles.searchBar}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search claims"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.userProfile}>
              <span>Admin User</span>
            </div>
          </div>
        </header>

        <div className={styles.pageContent}>
          <div className={styles.pageHeaderRow}>
            <div>
              <h1 className={styles.pageTitle}>Claims</h1>
              <p className={styles.pageSubtitle}>
                Review claims from API. Approving a claim automatically creates an agreement.
              </p>
            </div>
          </div>

          <div className={styles.filterBar}>
            <div className={styles.filterSelectWrap}>
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "" | ClaimStatus)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.label} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className={styles.selectIcon} />
            </div>
          </div>

          {error && (
            <div className={styles.tableContainer} style={{ marginBottom: 16 }}>
              <div className={styles.emptyRow} style={{ padding: 20 }}>
                {error}
              </div>
            </div>
          )}

          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Item</th>
                  <th>Student</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      Loading claims...
                    </td>
                  </tr>
                ) : filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      No claims found.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim) => {
                    const submitted = formatDateTime(claim.createdAt);
                    const isPending = claim.status === "pending";
                    const isBusy = reviewingClaimId === claim.id;

                    return (
                      <tr key={claim.id}>
                        <td>
                          <p className={styles.itemName}>{claim.id}</p>
                        </td>
                        <td>
                          <div className={styles.itemCell}>
                            <div className={styles.itemAvatar}>{claim.itemName.charAt(0)}</div>
                            <div>
                              <p className={styles.itemName}>{claim.itemName}</p>
                              <p className={styles.itemId}>ID: {claim.itemId}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className={styles.itemName}>{claim.studentName}</p>
                          <p className={styles.itemId}>{claim.studentEmail}</p>
                        </td>
                        <td className={styles.cellMuted}>
                          {submitted.date}
                          <br />
                          <span className={styles.itemId}>{submitted.time}</span>
                        </td>
                        <td>
                          <span className={`${styles.statusPill} ${statusClass[claim.status]}`}>
                            {toLabel(claim.status)}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionCell}>
                            {isPending ? (
                              <>
                                <button
                                  title="Approve claim"
                                  disabled={isBusy}
                                  onClick={() => reviewClaim(claim.id, "approved")}
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  title="Reject claim"
                                  disabled={isBusy}
                                  onClick={() => reviewClaim(claim.id, "rejected")}
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <p className={styles.itemId}>{claim.reviewerName ? `By ${claim.reviewerName}` : "Reviewed"}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
