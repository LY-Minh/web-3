"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  History,
  Package,
  Printer,
  Search,
} from "lucide-react";
import styles from "./agreements.module.css";
import AdminLogoutButton from "@/components/admin-logout-button";

type ClaimStatus = "pending" | "approved" | "rejected";

type AdminAgreement = {
  id: string;
  claimId: string;
  itemId: string;
  studentId: string;
  adminId: string;
  signedAt: string | null;
  createdAt: string;
  itemName: string;
  itemCategory: string;
  itemStatus: string;
  studentName: string;
  studentEmail: string;
  adminName: string;
  adminEmail: string;
  claimStatus: ClaimStatus;
  claimCreatedAt: string;
};

type AgreementTab = "all" | "pending" | "signed";

const TABS: Array<{ key: AgreementTab; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending Signature" },
  { key: "signed", label: "Signed" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toClaimLabel(status: ClaimStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function agreementState(agreement: AdminAgreement): "Signed" | "Pending" {
  return agreement.signedAt ? "Signed" : "Pending";
}

export default function AdminAgreementsPage() {
  const [agreements, setAgreements] = useState<AdminAgreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [printingAgreementId, setPrintingAgreementId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AgreementTab>("all");

  const fetchAgreements = useCallback(async () => {
    const response = await fetch("/api/admin/agreements", { cache: "no-store" });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? "Failed to fetch agreements");
    }

    const payload = (await response.json()) as AdminAgreement[];
    setAgreements(payload);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadAgreements = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await fetchAgreements();
      } catch (fetchError) {
        if (!isCancelled) {
          const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch agreements";
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadAgreements();

    return () => {
      isCancelled = true;
    };
  }, [fetchAgreements]);

  const tabCounts = useMemo(() => {
    const pending = agreements.filter((agreement) => !agreement.signedAt).length;
    const signed = agreements.length - pending;

    return {
      all: agreements.length,
      pending,
      signed,
    };
  }, [agreements]);

  const filteredAgreements = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return agreements.filter((agreement) => {
      const state = agreementState(agreement);

      if (activeTab === "pending" && state !== "Pending") {
        return false;
      }

      if (activeTab === "signed" && state !== "Signed") {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const haystack = [
        agreement.id,
        agreement.claimId,
        agreement.itemName,
        agreement.studentName,
        agreement.studentEmail,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(searchTerm);
    });
  }, [activeTab, agreements, search]);

  async function handlePrintAgreement(agreementId: string) {
    setPrintingAgreementId(agreementId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/agreements/${agreementId}/print`, {
        method: "GET",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Failed to print agreement");
      }

      const pdfBlob = await response.blob();
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);

      await fetchAgreements();
    } catch (printError) {
      const message = printError instanceof Error ? printError.message : "Failed to print agreement";
      setError(message);
    } finally {
      setPrintingAgreementId(null);
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
            <Link href="/admin/claims" className={styles.navItem}>
              <FileCheck2 size={18} /> Claims
            </Link>
            <Link href="/admin/agreements" className={`${styles.navItem} ${styles.active}`}>
              <FileCheck2 size={18} /> Agreements
            </Link>
            <Link href="/admin/logs" className={styles.navItem}>
              <History size={18} /> Activity Logs
            </Link>
          </nav>
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
              placeholder="Search agreements"
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
              <h1 className={styles.pageTitle}>Agreements</h1>
              <p className={styles.pageSubtitle}>
                Agreement records come from claim approvals. This page is for audit and print only.
              </p>
            </div>
          </div>

          <div className={styles.controlsRow}>
            <div className={styles.tabs}>
              {TABS.map((tab) => {
                const count = tabCounts[tab.key];
                return (
                  <button
                    key={tab.key}
                    className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabActive : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
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
                  <th>Agreement ID</th>
                  <th>Claim / Item</th>
                  <th>Student</th>
                  <th>Date Created</th>
                  <th>Claim Status</th>
                  <th>Signature</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      Loading agreements...
                    </td>
                  </tr>
                ) : filteredAgreements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      No agreements found.
                    </td>
                  </tr>
                ) : (
                  filteredAgreements.map((agreement) => {
                    const state = agreementState(agreement);
                    const isSigned = state === "Signed";

                    return (
                      <tr key={agreement.id}>
                        <td>
                          <span className={styles.agreementId}>{agreement.id}</span>
                        </td>
                        <td>
                          <div className={styles.itemCell}>
                            <div className={styles.itemAvatar}>{agreement.itemName.charAt(0)}</div>
                            <div>
                              <p className={styles.itemName}>{agreement.itemName}</p>
                              <p className={styles.itemId}>Claim: {agreement.claimId}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className={styles.itemName}>{agreement.studentName}</p>
                          <p className={styles.itemId}>{agreement.studentEmail}</p>
                        </td>
                        <td className={styles.cellMuted}>
                          {formatDate(agreement.createdAt)}
                          <br />
                          <span className={styles.timeText}>{formatTime(agreement.createdAt)}</span>
                        </td>
                        <td>
                          <span className={`${styles.statusPill} ${styles.statusPending}`}>
                            {toClaimLabel(agreement.claimStatus)}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.statusPill} ${isSigned ? styles.statusSigned : styles.statusPending}`}>
                            {isSigned ? "Signed" : "Pending"}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionCell}>
                            <button
                              onClick={() => handlePrintAgreement(agreement.id)}
                              disabled={printingAgreementId === agreement.id}
                            >
                              <Printer size={14} />
                              {printingAgreementId === agreement.id ? "Printing..." : "Print"}
                            </button>
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
