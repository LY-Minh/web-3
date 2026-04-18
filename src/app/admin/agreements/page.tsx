"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, Filter, Eye, Printer, MoreVertical, X,
  ChevronLeft, ChevronRight, ChevronDown,
  Package, FileCheck2, Users, History, Settings, LogOut,
  Bell, MessageSquare, User, AlignLeft, Calendar, FileText, Search,
} from "lucide-react";
import styles from "./agreements.module.css";

type AgreementStatus = "Pending" | "Signed" | "Returned" | "Expired";

interface Agreement {
  id: string; item: string; itemId: string;
  studentName: string; studentId: string;
  dateCreated: string; status: AgreementStatus;
  returnDate: string | null; returnNote: string | null;
}

const INITIAL: Agreement[] = [
  { id: "AGR-2025-067", item: "Backpack (Black)",    itemId: "ITEM-001", studentName: "John Doe",    studentId: "2023001", dateCreated: "2025-04-22T14:30:00", status: "Signed",   returnDate: "2025-05-06", returnNote: "14 days"  },
  { id: "AGR-2025-066", item: "iPhone (Silver)",     itemId: "ITEM-002", studentName: "Sara Kim",    studentId: "2023015", dateCreated: "2025-04-21T15:15:00", status: "Pending",  returnDate: null,         returnNote: null       },
  { id: "AGR-2025-065", item: "Set of Keys",         itemId: "ITEM-003", studentName: "Ali Hassan",  studentId: "2023008", dateCreated: "2025-04-20T11:45:00", status: "Signed",   returnDate: "2025-05-04", returnNote: "12 days"  },
  { id: "AGR-2025-064", item: "AirPods",             itemId: "ITEM-004", studentName: "Emma Lee",    studentId: "2023022", dateCreated: "2025-04-18T10:20:00", status: "Returned", returnDate: "2025-04-25", returnNote: "Returned" },
  { id: "AGR-2025-063", item: "Wallet (Brown)",      itemId: "ITEM-005", studentName: "Michael Tan", studentId: "2023011", dateCreated: "2025-04-17T13:30:00", status: "Expired",  returnDate: "2025-04-24", returnNote: "Overdue"  },
];

const AVAILABLE_CLAIMS = [
  { claimId: "CLM-001", item: "Water Bottle (Blue)", itemId: "ITEM-006", student: "David Park",  studentId: "2023033" },
  { claimId: "CLM-002", item: "Umbrella (Black)",    itemId: "ITEM-007", student: "Lily Chen",   studentId: "2023041" },
  { claimId: "CLM-003", item: "Laptop Charger",      itemId: "ITEM-008", student: "Ryan Torres", studentId: "2023055" },
];

const STATUS_PILL: Record<AgreementStatus, string> = {
  Signed: styles.statusSigned, Pending: styles.statusPending,
  Returned: styles.statusReturned, Expired: styles.statusExpired,
};

const TABS: { label: string; key: "All" | AgreementStatus; count?: number }[] = [
  { label: "All (67)",      key: "All"      },
  { label: "Pending (8)",   key: "Pending"  },
  { label: "Signed (45)",   key: "Signed"   },
  { label: "Returned (12)", key: "Returned" },
  { label: "Expired (2)",   key: "Expired"  },
];

function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function fmtTime(iso: string) { return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }); }

const EMPTY = { claimId: "", notes: "", returnDueDate: "" };

export default function AdminAgreementsPage() {
  const [agreements,  setAgreements]  = useState<Agreement[]>(INITIAL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab,   setActiveTab]   = useState<"All" | AgreementStatus>("All");
  const [form,        setForm]        = useState({ ...EMPTY });
  const [errors,      setErrors]      = useState<Partial<typeof EMPTY>>({});

  const filtered = activeTab === "All" ? agreements : agreements.filter(a => a.status === activeTab);

  function validate() {
    const e: Partial<typeof EMPTY> = {};
    if (!form.claimId)       e.claimId      = "Please select a claim";
    if (!form.returnDueDate) e.returnDueDate = "Return due date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const claim = AVAILABLE_CLAIMS.find(c => c.claimId === form.claimId);
    if (!claim) return;
    setAgreements([{ id: `AGR-2025-${String(agreements.length + 68).padStart(3,"0")}`, item: claim.item, itemId: claim.itemId, studentName: claim.student, studentId: claim.studentId, dateCreated: new Date().toISOString(), status: "Pending", returnDate: form.returnDueDate, returnNote: null }, ...agreements]);
    setIsModalOpen(false); setForm({ ...EMPTY }); setErrors({});
  }

  function openModal() { setForm({ ...EMPTY }); setErrors({}); setIsModalOpen(true); }
  const selectedClaim = AVAILABLE_CLAIMS.find(c => c.claimId === form.claimId);

  return (
    <div className={styles.adminPage}>

      {/* sidebar */}
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.adminBrand}>
            <div className={styles.brandIcon}><Package size={20} /></div>
            <div><h2>Lost &amp; Found</h2><p>Admin Dashboard</p></div>
          </div>
          <p className={styles.menuLabel}>Management</p>
          <nav className={styles.adminNav}>
            <Link href="/admin/items"      className={styles.navItem}><Package    size={18} /> Items</Link>
            <Link href="/admin/claims"     className={styles.navItem}><FileCheck2 size={18} /> Claims</Link>
            <Link href="/admin/agreements" className={`${styles.navItem} ${styles.active}`}><FileCheck2 size={18} /> Agreements</Link>
          </nav>
          <p className={styles.menuLabel}>System</p>
          <nav className={styles.adminNav}>
            <Link href="/admin/users"    className={styles.navItem}><Users    size={18} /> Users</Link>
            <Link href="/admin/logs"     className={styles.navItem}><History  size={18} /> Activity Logs</Link>
            <Link href="/admin/settings" className={styles.navItem}><Settings size={18} /> Settings</Link>
          </nav>
        </div>
        <div className={styles.sidebarBottom}>
          <button className={styles.logoutBtn}><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      {/* main */}
      <main className={styles.adminMain}>
        <header className={styles.adminTopbar}>
          <div className={styles.searchBar}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search items, students, claims..." />
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.iconBtn}><Bell size={20} /><span className={styles.badge}></span></button>
            <button className={styles.iconBtn}><MessageSquare size={20} /></button>
            <div className={styles.userProfile}><div className={styles.userAvatar}></div><span>Admin User</span></div>
          </div>
        </header>

        <div className={styles.pageContent}>
          <div className={styles.pageHeaderRow}>
            <div>
              <h1 className={styles.pageTitle}>Agreements</h1>
              <p className={styles.pageSubtitle}>Manage claim agreements and generate printable documents for approved returns.</p>
            </div>
          </div>

          {/* Tabs + filter */}
          <div className={styles.controlsRow}>
            <div className={styles.tabs}>
              {TABS.map(t => (
                <button key={t.key} className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabActive : ""}`} onClick={() => setActiveTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className={styles.actions}>
              <button className={styles.filterBtn}><Filter size={16} /> Filters</button>
              <button className={styles.primaryBtn} onClick={openModal}><Plus size={16} /> New Agreement</button>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Agreement ID</th><th>Claim / Item</th><th>Student</th>
                  <th>Date Created</th><th>Status</th><th>Return Date Set</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className={styles.emptyRow}>No agreements found.</td></tr>
                ) : filtered.map(agr => (
                  <tr key={agr.id}>
                    <td><span className={styles.agreementId}>{agr.id}</span></td>
                    <td>
                      <div className={styles.itemCell}>
                        <div className={styles.itemAvatar}>{agr.item.charAt(0)}</div>
                        <div><p className={styles.itemName}>{agr.item}</p><p className={styles.itemId}>{agr.itemId}</p></div>
                      </div>
                    </td>
                    <td><p className={styles.itemName}>{agr.studentName}</p><p className={styles.itemId}>ID: {agr.studentId}</p></td>
                    <td className={styles.cellMuted}>{fmtDate(agr.dateCreated)}<br/><span className={styles.timeText}>{fmtTime(agr.dateCreated)}</span></td>
                    <td><span className={`${styles.statusPill} ${STATUS_PILL[agr.status]}`}>{agr.status}</span></td>
                    <td>
                      {agr.returnDate ? (
                        <><span style={{ color: agr.status === "Expired" ? "#ef4444" : "#334155" }}>{fmtDate(agr.returnDate)}</span><br/><span className={styles.timeText} style={{ color: agr.status === "Expired" ? "#ef4444" : undefined }}>({agr.returnNote})</span></>
                      ) : <span className={styles.dash}>—</span>}
                    </td>
                    <td>
                      <div className={styles.actionCell}>
                        <button disabled={agr.status === "Pending"} style={{ opacity: agr.status === "Pending" ? 0.4 : 1 }}><Eye size={14} /> View</button>
                        <button disabled={agr.status === "Pending"} style={{ opacity: agr.status === "Pending" ? 0.4 : 1 }}><Printer size={14} /> Print</button>
                        <button className={styles.moreBtn}><MoreVertical size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.paginationRow}>
              <p>Showing 1 to {filtered.length} of 67 agreements</p>
              <div className={styles.pageControls}>
                <button className={styles.pageBtn}><ChevronLeft size={15} /></button>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <span className={styles.pageDots}>...</span>
                <button className={styles.pageBtn}>14</button>
                <button className={styles.pageBtn}><ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalDrawer} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div><h3>New Agreement</h3><p>Create a pickup agreement for an approved claim.</p></div>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form className={styles.modalForm} onSubmit={handleSubmit} noValidate>
              <div className={styles.formGroup}>
                <label><FileText size={13} /> Claim / Item <span className={styles.req}>*</span></label>
                <div className={styles.selectWrap}>
                  <select value={form.claimId} onChange={e => setForm({ ...form, claimId: e.target.value })} className={errors.claimId ? styles.inputErr : ""}>
                    <option value="" disabled>Select an approved claim...</option>
                    {AVAILABLE_CLAIMS.map(c => <option key={c.claimId} value={c.claimId}>{c.item} — {c.student}</option>)}
                  </select>
                  <ChevronDown size={15} />
                </div>
                {errors.claimId && <span className={styles.errMsg}>{errors.claimId}</span>}
              </div>

              {selectedClaim && (
                <div className={styles.claimPreview}>
                  <div className={styles.previewRow}>
                    <div><span className={styles.previewLabel}>Item</span><span className={styles.previewValue}>{selectedClaim.item}</span></div>
                    <div><span className={styles.previewLabel}>Student</span><span className={styles.previewValue}>{selectedClaim.student}</span></div>
                  </div>
                  <p className={styles.previewMeta}>Student ID: {selectedClaim.studentId} · Claim: {selectedClaim.claimId}</p>
                </div>
              )}

              <div className={styles.formGroup}>
                <label><Calendar size={13} /> Return Due Date <span className={styles.req}>*</span></label>
                <input type="date" value={form.returnDueDate} onChange={e => setForm({ ...form, returnDueDate: e.target.value })} className={errors.returnDueDate ? styles.inputErr : ""} min={new Date().toISOString().split("T")[0]} />
                {errors.returnDueDate && <span className={styles.errMsg}>{errors.returnDueDate}</span>}
              </div>

              <div className={styles.formGroup}>
                <label><AlignLeft size={13} /> Notes <span className={styles.optional}>(optional)</span></label>
                <textarea placeholder="Add any special conditions or remarks..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value.slice(0, 300) })} rows={4} />
                <span className={styles.charCount}>{form.notes.length}/300</span>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}><Plus size={15} /> Create Agreement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}