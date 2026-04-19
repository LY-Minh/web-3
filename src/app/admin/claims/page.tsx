import { Separator } from "@/components/ui/separator";
import { FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Eye,
  FileCheck2,
  History,
  Package,
  Search,
  X,
} from "lucide-react";
import styles from "../items/items.module.css";
import AdminLogoutButton from "@/components/admin-logout-button";

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

type ClaimFile = {
  id: string;
  claimId: string | null;
  fileName: string;
  fileType: string | null;
  uploadedAt: string;
  accessUrl: string | null;
};

type AdminClaimDetail = {
  id: string;
  itemId: string;
  studentId: string;
  proofDescription: string;
  status: ClaimStatus;
  reviewedById: string | null;
  createdAt: string;
  updatedAt: string;
  files: ClaimFile[];
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

function shortenId(value: string, prefixLength = 8, suffixLength = 6) {
  const text = value.trim();
  if (!text) {
    return "-";
  }

  if (text.length <= prefixLength + suffixLength + 3) {
    return text;
  }

  return `${text.slice(0, prefixLength)}...${text.slice(-suffixLength)}`;
}

const STATUS_OPTIONS: Array<{ value: "" | ClaimStatus; label: string }> = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminClaimsPage() {
    return (
        <div className="flex-1 p-8 bg-slate-50 min-h-screen">
            <Link href="/admin">
                <Button variant="ghost" className="mb-4 text-slate-500 hover:text-blue-600">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </Link>

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ClaimStatus>("");
  const [reviewingClaimId, setReviewingClaimId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [selectedClaimDetail, setSelectedClaimDetail] = useState<AdminClaimDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

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

  async function openClaimDetailModal(claimId: string) {
    setIsDetailModalOpen(true);
    setIsLoadingDetail(true);
    setSelectedClaimDetail(null);
    setDetailError(null);

    try {
      const response = await fetch(`/api/admin/claims/${claimId}`, {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => null)) as AdminClaimDetail | { error?: string } | null;

      if (!response.ok) {
        const message = payload && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "Failed to load claim details";
        throw new Error(message);
      }

      if (!payload || !("id" in payload)) {
        throw new Error("Invalid claim detail response");
      }

      setSelectedClaimDetail({
        ...payload,
        files: Array.isArray(payload.files) ? payload.files : [],
      });
    } catch (claimDetailError) {
      const message = claimDetailError instanceof Error ? claimDetailError.message : "Failed to load claim details";
      setDetailError(message);
    } finally {
      setIsLoadingDetail(false);
    }
  }

  function closeClaimDetailModal() {
    setIsDetailModalOpen(false);
    setIsLoadingDetail(false);
    setSelectedClaimDetail(null);
    setDetailError(null);
  }

  const activeClaimSummary = selectedClaimDetail
    ? claims.find((claim) => claim.id === selectedClaimDetail.id) ?? null
    : null;

  return (
    <div className={styles.adminPage}>
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.adminBrand}>
            <div className={styles.brandIcon}>
              <Package size={20} />
            </div>

            <Separator className="mb-8" />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            <th className="px-6 py-4">Item</th>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {claims.map((claim) => (
                            <tr key={claim.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="h-10 w-10 relative rounded-lg overflow-hidden border">
                                        <Image src={claim.image} alt="" fill sizes="40px" className="object-cover" />
                                    </div>
                                    <span className="font-bold text-sm">{claim.item}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{claim.student}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{claim.date}</td>
                                <td className="px-6 py-4">
                                    <Badge className="bg-orange-50 text-orange-600 border-orange-100">{claim.status}</Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-100">Review</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className={styles.sidebarBottom}>
          <AdminLogoutButton className={styles.logoutBtn} />
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
                                  title="View claim details"
                                  onClick={() => void openClaimDetailModal(claim.id)}
                                >
                                  <Eye size={14} />
                                </button>
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
                              <>
                                <button
                                  title="View claim details"
                                  onClick={() => void openClaimDetailModal(claim.id)}
                                >
                                  <Eye size={14} />
                                </button>
                                <p className={styles.itemId}>{claim.reviewerName ? `By ${claim.reviewerName}` : "Reviewed"}</p>
                              </>
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

      {isDetailModalOpen && (
        <div
          className={styles.modalOverlay}
          style={detailOverlayStyle}
          onClick={closeClaimDetailModal}
        >
          <div
            className={styles.detailModal}
            style={detailModalStyle}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.detailModalHeader} style={detailHeaderStyle}>
              <div>
                <h3>Claim Details</h3>
                <p>
                  {activeClaimSummary
                    ? `Reviewing ${activeClaimSummary.studentName}'s claim for ${activeClaimSummary.itemName}`
                    : "Reviewing selected claim."}
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
                <p className={styles.emptyRow} style={{ padding: 20 }}>Loading claim details...</p>
              ) : detailError ? (
                <p className={styles.emptyRow} style={{ padding: 20 }}>{detailError}</p>
              ) : selectedClaimDetail ? (
                <>
                  <div className={styles.detailGrid} style={detailGridStyle}>
                    <div className={styles.detailRow} style={detailRowStyle}>
                      <p className={styles.detailLabel} style={detailLabelStyle}>Claim ID</p>
                      <p className={styles.detailValue} style={detailValueStyle} title={selectedClaimDetail.id}>
                        {shortenId(selectedClaimDetail.id)}
                      </p>
                    </div>

                    <div className={styles.detailRow} style={detailRowStyle}>
                      <p className={styles.detailLabel} style={detailLabelStyle}>Status</p>
                      <p className={styles.detailValue} style={detailValueStyle}>{toLabel(selectedClaimDetail.status)}</p>
                    </div>

                    <div className={styles.detailRow} style={detailRowStyle}>
                      <p className={styles.detailLabel} style={detailLabelStyle}>Submitted</p>
                      <p className={styles.detailValue} style={detailValueStyle}>
                        {formatDateTime(selectedClaimDetail.createdAt).date} {formatDateTime(selectedClaimDetail.createdAt).time}
                      </p>
                    </div>

                    <div className={styles.detailRow} style={detailRowStyle}>
                      <p className={styles.detailLabel} style={detailLabelStyle}>Last Updated</p>
                      <p className={styles.detailValue} style={detailValueStyle}>
                        {formatDateTime(selectedClaimDetail.updatedAt).date} {formatDateTime(selectedClaimDetail.updatedAt).time}
                      </p>
                    </div>

                    <div className={styles.detailRow} style={detailRowStyle}>
                      <p className={styles.detailLabel} style={detailLabelStyle}>Item</p>
                      <p className={styles.detailValue} style={detailValueStyle} title={activeClaimSummary?.itemName ?? selectedClaimDetail.itemId}>
                        {activeClaimSummary?.itemName ?? shortenId(selectedClaimDetail.itemId)}
                      </p>
                    </div>

                    <div className={styles.detailRow} style={detailRowStyle}>
                      <p className={styles.detailLabel} style={detailLabelStyle}>Student</p>
                      <p className={styles.detailValue} style={detailValueStyle}>
                        {activeClaimSummary?.studentName ?? shortenId(selectedClaimDetail.studentId)}
                        {activeClaimSummary?.studentEmail ? ` (${activeClaimSummary.studentEmail})` : ""}
                      </p>
                    </div>
                  </div>

                  <div className={styles.detailBlock} style={detailBlockStyle}>
                    <p className={styles.detailLabel} style={detailLabelStyle}>Proof Description</p>
                    <p className={styles.detailValue} style={detailValueStyle}>{selectedClaimDetail.proofDescription}</p>
                  </div>

                  <div className={styles.detailBlock} style={detailBlockStyle}>
                    <p className={styles.detailLabel} style={detailLabelStyle}>Claim Files</p>

                    {selectedClaimDetail.files.length === 0 ? (
                      <p className={styles.emptyRow} style={{ padding: 16 }}>No files attached to this claim.</p>
                    ) : (
                      <ul className={styles.fileList} style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
                        {selectedClaimDetail.files.map((file) => (
                          <li key={file.id} className={styles.fileItem} style={fileItemStyle}>
                            <div className={styles.fileInfo} style={fileInfoStyle}>
                              <p className={styles.itemName}>{file.fileName}</p>
                              <p className={styles.itemId}>
                                {file.fileType ?? "Unknown type"} • Uploaded {formatDateTime(file.uploadedAt).date}
                              </p>
                            </div>

                            {file.accessUrl ? (
                              <a
                                href={file.accessUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.primaryBtn}
                                style={{ textDecoration: "none", padding: "7px 12px", fontSize: 12 }}
                              >
                                View File
                              </a>
                            ) : (
                              <span className={styles.itemId}>Unavailable</span>
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
