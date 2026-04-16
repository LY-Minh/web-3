"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, Bell, MessageSquare, LayoutDashboard, 
  Package, FileCheck2, Users, History, Settings, 
  LogOut, Plus, Filter, Eye, Printer, MoreVertical, X 
} from "lucide-react";
import styles from "./agreements.module.css";

export default function AdminAgreementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.adminPage}>
      {/* SIDEBAR */}
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.adminBrand}>
            <div className={styles.brandIcon}>
              <Package size={20} />
            </div>
            <div>
              <h2>Lost & Found</h2>
              <p>Admin Dashboard</p>
            </div>
          </div>

          <div className={styles.menuLabel}>Management</div>
          <nav className={styles.adminNav}>
            <Link href="/admin/items" className={styles.navItem}>
              <Package size={18} /> Items
            </Link>
            <Link href="/admin/claims" className={styles.navItem}>
              <FileCheck2 size={18} /> Claims
            </Link>
            {/* Active Tab */}
            <Link href="/admin/agreements" className={`${styles.navItem} ${styles.active}`}>
              <FileCheck2 size={18} /> Agreements
            </Link>
          </nav>

          <div className={styles.menuLabel}>System</div>
          <nav className={styles.adminNav}>
            <Link href="/admin/users" className={styles.navItem}>
              <Users size={18} /> Users
            </Link>
            <Link href="/admin/logs" className={styles.navItem}>
              <History size={18} /> Activity Logs
            </Link>
            <Link href="/admin/settings" className={styles.navItem}>
              <Settings size={18} /> Settings
            </Link>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <button className={styles.logoutBtn}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.adminMain}>
        {/* TOPBAR */}
        <header className={styles.adminTopbar}>
          <div className={styles.searchBar}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search items, students, claims..." />
          </div>

          <div className={styles.topbarRight}>
            <button className={styles.iconBtn}>
              <Bell size={20} />
              <span className={styles.badge}></span>
            </button>
            <button className={styles.iconBtn}>
              <MessageSquare size={20} />
            </button>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}></div>
              Admin User
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className={styles.pageContent}>
          <div className={styles.pageHeader}>
            <h1>Agreements</h1>
            <p>Manage claim agreements and generate printable documents for approved returns.</p>
          </div>

          <div className={styles.controlsRow}>
            <div className={styles.tabs}>
              <button className={`${styles.tabBtn} ${styles.tabActive}`}>All (67)</button>
              <button className={styles.tabBtn}>Pending (8)</button>
              <button className={styles.tabBtn}>Signed (45)</button>
              <button className={styles.tabBtn}>Returned (12)</button>
            </div>
            
            <div className={styles.actions}>
              <button className={styles.filterBtn}>
                <Filter size={16} /> Filters
              </button>
              {/* BUTTON TO OPEN MODAL */}
              <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
                <Plus size={16} /> New Agreement
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Agreement ID</th>
                  <th>Claim / Item</th>
                  <th>Student</th>
                  <th>Date Created</th>
                  <th>Status</th>
                  <th>Return Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample Row 1 */}
                <tr>
                  <td>AGR-2025-067</td>
                  <td>
                    <div className={styles.itemCell}>
                      <div className={styles.itemImg}></div>
                      <div className={styles.itemInfo}>
                        <strong>Backpack (Black)</strong>
                        <span>ITEM-001</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.studentInfo}>
                      <strong>John Doe</strong>
                      <span>ID: 2023001</span>
                    </div>
                  </td>
                  <td>Apr 22, 2025<br/><span style={{color: '#64748b', fontSize: '12px'}}>2:30 PM</span></td>
                  <td><span className={`${styles.statusPill} ${styles.statusSigned}`}>Signed</span></td>
                  <td>May 6, 2025<br/><span style={{color: '#64748b', fontSize: '12px'}}>(14 days)</span></td>
                  <td>
                    <div className={styles.actionCell}>
                      <button><Eye size={16} /> View</button>
                      <button><Printer size={16} /> Print</button>
                      <button><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
                {/* Sample Row 2 */}
                <tr>
                  <td>AGR-2025-066</td>
                  <td>
                    <div className={styles.itemCell}>
                      <div className={styles.itemImg}></div>
                      <div className={styles.itemInfo}>
                        <strong>iPhone (Silver)</strong>
                        <span>ITEM-002</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.studentInfo}>
                      <strong>Sara Kim</strong>
                      <span>ID: 2023015</span>
                    </div>
                  </td>
                  <td>Apr 21, 2025<br/><span style={{color: '#64748b', fontSize: '12px'}}>3:15 PM</span></td>
                  <td><span className={`${styles.statusPill} ${styles.statusPending}`}>Pending</span></td>
                  <td>-</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button><Eye size={16} /> View</button>
                      <button style={{ opacity: 0.5 }}><Printer size={16} /> Print</button>
                      <button><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* NEW AGREEMENT MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>New Agreement</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                Create an agreement for an approved claim.
              </p>

              <div className={styles.formGroup}>
                <label>Claim / Item</label>
                <select>
                  <option>Select claim or item</option>
                  <option>Backpack (Black) - ITEM-001</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Student</label>
                <select>
                  <option>Select student</option>
                  <option>John Doe - 2023001</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Return Due Date</label>
                <input type="date" />
              </div>

              <div className={styles.formGroup}>
                <label>Notes (Optional)</label>
                <textarea placeholder="Add any special notes or conditions..."></textarea>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Create Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}