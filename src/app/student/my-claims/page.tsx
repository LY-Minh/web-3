"use client";

import StudentProfileMenu from "@/components/student-profile-menu";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronRight, FolderKanban, Home, LogOut, X } from "lucide-react";
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

type ClaimFile = {
  id: string;
  claimId: string | null;
  fileName: string;
  fileType: string | null;
  uploadedAt: string;
  accessUrl: string | null;
};

type ClaimDetail = ClaimRecord & {
  files: ClaimFile[];
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

const shortenId = (value: string, prefixLength = 8, suffixLength = 6) => {
  const text = value.trim();
  if (!text) {
    return "-";
  }

  if (text.length <= prefixLength + suffixLength + 3) {
    return text;
  }

  return `${text.slice(0, prefixLength)}...${text.slice(-suffixLength)}`;
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

const detailOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(11, 18, 32, 0.55)",
  display: "grid",
  placeItems: "center",
  padding: "20px",
  zIndex: 120,
} as const;

const detailModalStyle = {
  width: "min(760px, 100%)",
  maxHeight: "86vh",
  background: "#ffffff",
  borderRadius: "20px",
  border: "1px solid #dfe7f2",
  boxShadow: "0 20px 44px rgba(18, 36, 73, 0.2)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
} as const;

const detailHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
  padding: "20px 22px",
  borderBottom: "1px solid #e8edf6",
  background: "linear-gradient(135deg, #f3f7ff 0%, #fbfdff 100%)",
} as const;

const detailContentStyle = {
  padding: "20px 22px 22px",
  overflowY: "auto",
  overflowX: "hidden",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
} as const;

const detailGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "10px 16px",
} as const;

const detailRowStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  padding: "12px",
  border: "1px solid #e8edf6",
  borderRadius: "12px",
  background: "#fbfdff",
  minWidth: 0,
} as const;

const detailLabelStyle = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#4b5f80",
  margin: 0,
} as const;

const detailValueStyle = {
  color: "#24324a",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
} as const;

const detailBlockStyle = {
  border: "1px solid #e8edf6",
  borderRadius: "14px",
  background: "#ffffff",
  padding: "14px",
  minWidth: 0,
} as const;

const fileItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  border: "1px solid #e7edf7",
  borderRadius: "12px",
  background: "#f9fbff",
  padding: "10px 12px",
} as const;

const fileInfoStyle = {
  minWidth: 0,
  flex: 1,
} as const;

export default function MyClaimsPage() {
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [selectedClaimDetail, setSelectedClaimDetail] = useState<ClaimDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

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

  const openClaimDetailModal = async (claimId: string) => {
    setIsDetailModalOpen(true);
    setIsLoadingDetail(true);
    setDetailError(null);
    setSelectedClaimDetail(null);

    try {
      const response = await fetch(`/api/student/claims/${claimId}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          typeof data?.error === "string"
            ? data.error
            : "Failed to load claim details.";
        throw new Error(message);
      }

      if (!data || typeof data !== "object") {
        throw new Error("Unexpected claim detail response.");
      }

      const detail = data as Partial<ClaimDetail>;
      const normalizedFiles = Array.isArray(detail.files) ? detail.files : [];

      setSelectedClaimDetail({
        ...(detail as ClaimDetail),
        files: normalizedFiles,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load claim details.";
      setDetailError(message);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const closeClaimDetailModal = () => {
    setIsDetailModalOpen(false);
    setIsLoadingDetail(false);
    setSelectedClaimDetail(null);
    setDetailError(null);
  };

  const activeClaimSummary = selectedClaimDetail
    ? claims.find((claim) => claim.id === selectedClaimDetail.id) ?? null
    : null;

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

          {loadError && <p className={styles.stateMessage}>{loadError}</p>}
        </section>

        <section className={styles.claimsSection}>
          <h3>My Claims ({claims.length})</h3>

          {isLoadingClaims ? (
            <p className={styles.emptyState}>Loading claims...</p>
          ) : loadError ? (
            <p className={styles.emptyState}>{loadError}</p>
          ) : claims.length === 0 ? (
            <p className={styles.emptyState}>
              No claims found yet. Submit a claim from Home and it will appear here.
            </p>
          ) : (
            <div className={styles.claimsGrid}>
              {claims.map((claim) => (
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
                      className={styles.secondaryBtn}
                      type="button"
                      onClick={() => void openClaimDetailModal(claim.id)}
                    >
                      View Details
                    </button>

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

      {isDetailModalOpen && (
        <div
          className={styles.modalOverlay}
          style={detailOverlayStyle}
          onClick={closeClaimDetailModal}
        >
          <div
            className={styles.detailModal}
            style={detailModalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.detailModalHeader} style={detailHeaderStyle}>
              <div>
                <h3>Claim Details</h3>
                <p>
                  {activeClaimSummary
                    ? `Reviewing your claim for ${activeClaimSummary.itemName}`
                    : "Reviewing your selected claim."}
                </p>
              </div>

              <button
                type="button"
                className={styles.detailModalCloseBtn}
                onClick={closeClaimDetailModal}
                aria-label="Close claim details"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.detailModalContent} style={detailContentStyle}>
              {isLoadingDetail ? (
                <p className={styles.emptyState}>Loading claim details...</p>
              ) : detailError ? (
                <p className={styles.stateMessage}>{detailError}</p>
              ) : selectedClaimDetail ? (
                <>
                  <div className={styles.detailGrid} style={detailGridStyle}>
                    <div className={styles.detailRow} style={detailRowStyle}>
                      <span className={styles.detailLabel} style={detailLabelStyle}>Claim ID</span>
                      <span
                        className={styles.detailValue}
                        style={detailValueStyle}
                        title={selectedClaimDetail.id}
                      >
                        {shortenId(selectedClaimDetail.id)}
                      </span>
                    </div>
                    <div className={styles.detailRow} style={detailRowStyle}>
                      <span className={styles.detailLabel} style={detailLabelStyle}>Submitted</span>
                      <span className={styles.detailValue} style={detailValueStyle}>
                        {formatDate(selectedClaimDetail.createdAt)}
                      </span>
                    </div>
                    <div className={styles.detailRow} style={detailRowStyle}>
                      <span className={styles.detailLabel} style={detailLabelStyle}>Status</span>
                      <span className={styles.detailValue} style={detailValueStyle}>
                        {CLAIM_STATUS_LABELS[selectedClaimDetail.status]}
                      </span>
                    </div>
                    <div className={styles.detailRow} style={detailRowStyle}>
                      <span className={styles.detailLabel} style={detailLabelStyle}>Claimed Item</span>
                      <span
                        className={styles.detailValue}
                        style={detailValueStyle}
                        title={activeClaimSummary?.itemName ?? selectedClaimDetail.itemId}
                      >
                        {activeClaimSummary?.itemName ?? shortenId(selectedClaimDetail.itemId)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailBlock} style={detailBlockStyle}>
                    <p className={styles.detailLabel} style={detailLabelStyle}>Proof Description</p>
                    <p className={styles.detailValue} style={detailValueStyle}>{selectedClaimDetail.proofDescription}</p>
                  </div>

                  <div className={styles.detailBlock} style={detailBlockStyle}>
                    <p className={styles.detailLabel} style={detailLabelStyle}>Associated Files</p>
                    {selectedClaimDetail.files.length === 0 ? (
                      <p className={styles.emptyState}>No files are associated with this claim.</p>
                    ) : (
                      <ul className={styles.fileList}>
                        {selectedClaimDetail.files.map((file) => (
                          <li key={file.id} className={styles.fileItem} style={fileItemStyle}>
                            <div className={styles.fileInfo} style={fileInfoStyle}>
                              <p className={styles.fileName}>{file.fileName}</p>
                              <p className={styles.fileMeta}>
                                {file.fileType ?? "Unknown type"} • Uploaded {formatDate(file.uploadedAt)}
                              </p>
                            </div>

                            {file.accessUrl ? (
                              <a
                                href={file.accessUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.fileViewLink}
                              >
                                View File
                              </a>
                            ) : (
                              <span className={styles.fileUnavailable}>Unavailable</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
