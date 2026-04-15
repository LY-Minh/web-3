"use client";

import StudentProfileMenu from "@/components/student-profile-menu";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  FolderKanban,
  Home,
  LogOut,
} from "lucide-react";
import styles from "./my-claims.module.css";

type ClaimStatus = "Under Review" | "Approved" | "Rejected" | "Collected";

type ClaimItem = {
  id: number;
  itemName: string;
  claimedDate: string;
  reportedDate: string;
  submittedDate: string;
  location: string;
  description: string;
  claimId: string;
  status: ClaimStatus;
  image: string;
  archived: boolean;
};

const allClaims: ClaimItem[] = [
  {
    id: 1,
    itemName: "Black Backpack",
    claimedDate: "April 20, 2024",
    reportedDate: "April 19, 2024",
    submittedDate: "April 20, 2024",
    location: "Library",
    description: "Near the bookshelves around 6 PM.",
    claimId: "LF-00187",
    status: "Under Review",
    image: "/image/student/black_backpack.jpeg",
    archived: false,
  },
  {
    id: 2,
    itemName: "Silver iPhone",
    claimedDate: "April 18, 2024",
    reportedDate: "April 19, 2024",
    submittedDate: "April 16, 2024",
    location: "Library",
    description: "Found near the front desk area.",
    claimId: "LF-00179",
    status: "Approved",
    image: "/image/student/silver iphone.jpeg",
    archived: false,
  },
  {
    id: 3,
    itemName: "Set of Keys",
    claimedDate: "April 16, 2024",
    reportedDate: "April 16, 2024",
    submittedDate: "April 16, 2024",
    location: "Library",
    description: "Found in the hallway near Room C214.",
    claimId: "LF-00165",
    status: "Rejected",
    image: "/image/student/keys.jpeg",
    archived: false,
  },
  {
    id: 4,
    itemName: "AirPods",
    claimedDate: "March 28, 2024",
    reportedDate: "March 27, 2024",
    submittedDate: "March 28, 2024",
    location: "Student Lounge",
    description: "Claim completed and item already collected.",
    claimId: "LF-00122",
    status: "Collected",
    image: "/image/student/airpods.jpeg",
    archived: true,
  },
];

export default function MyClaimsPage() {
  const [activeTab, setActiveTab] = useState<"claimed" | "archived">("claimed");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const visibleClaims = useMemo(() => {
    let filtered = allClaims.filter((claim) =>
      activeTab === "claimed" ? !claim.archived : claim.archived
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (claim) =>
          claim.status.toLowerCase().replace(/\s+/g, "-") === statusFilter
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "newest") return b.id - a.id;
      return a.id - b.id;
    });

    return filtered;
  }, [activeTab, statusFilter, sortBy]);

  const claimedCount = allClaims.filter((item) => !item.archived).length;
  const archivedCount = allClaims.filter((item) => item.archived).length;

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

            <Link href="/student/report_items" className={styles.navItem}>
              <FileText size={20} />
              <span>Report Item</span>
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
          <a href="/" className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Log Out</span>
          </a>
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
              <Link href="/student/report_items" className={styles.topLink}>
                Report Item
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
            Track the status of items you&apos;ve claimed or reported as lost.
          </p>

          <div className={styles.filtersRow}>
            <div className={styles.filterSelect}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="under-review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="collected">Collected</option>
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
        </section>

        <section className={styles.tabsSection}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabBtn} ${
                activeTab === "claimed" ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab("claimed")}
            >
              Claimed Items ({claimedCount})
            </button>

            <button
              className={`${styles.tabBtn} ${
                activeTab === "archived" ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab("archived")}
            >
              Archived Claims ({archivedCount})
            </button>
          </div>
        </section>

        <section className={styles.claimsSection}>
          <h3>
            {activeTab === "claimed"
              ? `Claimed Items (${claimedCount})`
              : `Archived Claims (${archivedCount})`}
          </h3>

          <div className={styles.claimsGrid}>
            {visibleClaims.map((claim) => (
              <div className={styles.claimCard} key={claim.id}>
                <div className={styles.claimTop}>
                  <div className={styles.claimImageWrap}>
                    <img
                      src={claim.image}
                      alt={claim.itemName}
                      className={styles.claimImage}
                    />
                  </div>

                  <div className={styles.claimMainInfo}>
                    <h4>{claim.itemName}</h4>
                    <p className={styles.claimedDate}>
                      Claimed: {claim.claimedDate}
                    </p>

                    <span
                      className={`${styles.statusBadge} ${
                        claim.status === "Under Review"
                          ? styles.statusReview
                          : claim.status === "Approved"
                          ? styles.statusApproved
                          : claim.status === "Rejected"
                          ? styles.statusRejected
                          : styles.statusCollected
                      }`}
                    >
                      {claim.status}
                    </span>

                    <p className={styles.claimId}>ID: {claim.claimId}</p>
                  </div>
                </div>

                <div className={styles.claimBody}>
                  <p>
                    <strong>Reported:</strong> {claim.reportedDate}
                  </p>
                  <p>
                    <strong>Location:</strong> {claim.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {claim.description}
                  </p>
                  <p>
                    <strong>Submitted on:</strong> {claim.submittedDate}
                  </p>
                </div>

                <div className={styles.claimActions}>
                  <button className={styles.primaryBtn}>View Details</button>

                  {claim.status === "Under Review" && !claim.archived && (
                    <button className={styles.secondaryDangerBtn}>
                      Cancel Claim
                    </button>
                  )}

                  {claim.status === "Approved" && !claim.archived && (
                    <button className={styles.primaryOutlineBtn}>
                      Mark as Collected
                    </button>
                  )}

                  {claim.status === "Rejected" && !claim.archived && (
                    <button className={styles.secondaryBtn}>See Reason</button>
                  )}

                  {claim.archived && (
                    <button className={styles.secondaryBtn}>
                      View History
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
