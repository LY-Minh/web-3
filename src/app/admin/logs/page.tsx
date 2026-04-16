"use client";

import Link from "next/link";
import { 
  Search, Bell, MessageSquare, Package, FileCheck2, 
  Users, History, Settings, LogOut, Filter, Download 
} from "lucide-react";
import styles from "./logs.module.css";

export default function AdminLogsPage() {
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
            <Link href="/admin/agreements" className={styles.navItem}>
              <FileCheck2 size={18} /> Agreements
            </Link>
          </nav>

          <div className={styles.menuLabel}>System</div>
          <nav className={styles.adminNav}>
            <Link href="/admin/users" className={styles.navItem}>
              <Users size={18} /> Users
            </Link>
            {/* Active Tab */}
            <Link href="/admin/logs" className={`${styles.navItem} ${styles.active}`}>
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
        <header className={styles.adminTopbar}>
          <div className={styles.searchBar}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search logs by user, action, or module..." />
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

        <div className={styles.pageContent}>
          <div className={styles.pageHeader}>
            <h1>Activity Logs</h1>
            <p>Track all system activities and changes made by users.</p>
          </div>

          <div className={styles.controlsRow}>
            <div className={styles.tabs}>
              <button className={`${styles.tabBtn} ${styles.tabActive}`}>All Modules</button>
              <button className={styles.tabBtn}>Items</button>
              <button className={styles.tabBtn}>Claims</button>
              <button className={styles.tabBtn}>Agreements</button>
            </div>
            
            <div className={styles.actions}>
              <button className={styles.filterBtn}>
                <Filter size={16} /> Filters
              </button>
              <button className={styles.filterBtn}>
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 */}
                <tr>
                  <td>
                    Apr 22, 2025<br/>
                    <span style={{color: '#64748b', fontSize: '12px'}}>3:45 PM</span>
                  </td>
                  <td>
                    <strong>Admin User</strong><br/>
                    <span style={{fontSize: '12px', color: '#64748b'}}>admin@school.edu</span>
                  </td>
                  <td><span className={`${styles.statusPill} ${styles.statusSigned}`}>Approved Claim</span></td>
                  <td>Claims</td>
                  <td>Approved claim for iPhone (Silver) by Sara Kim</td>
                  <td style={{color: '#64748b', fontSize: '13px'}}>192.168.1.101</td>
                </tr>
                
                {/* Row 2 */}
                <tr>
                  <td>
                    Apr 22, 2025<br/>
                    <span style={{color: '#64748b', fontSize: '12px'}}>2:15 PM</span>
                  </td>
                  <td>
                    <strong>Staff User</strong><br/>
                    <span style={{fontSize: '12px', color: '#64748b'}}>staff@school.edu</span>
                  </td>
                  <td><span className={`${styles.statusPill} ${styles.statusReturned}`}>Added Item</span></td>
                  <td>Items</td>
                  <td>Added new item: Water Bottle (Blue)</td>
                  <td style={{color: '#64748b', fontSize: '13px'}}>192.168.1.105</td>
                </tr>

                {/* Row 3 */}
                <tr>
                  <td>
                    Apr 22, 2025<br/>
                    <span style={{color: '#64748b', fontSize: '12px'}}>1:40 PM</span>
                  </td>
                  <td>
                    <strong>Student User</strong><br/>
                    <span style={{fontSize: '12px', color: '#64748b'}}>john.doe@school.edu</span>
                  </td>
                  <td><span className={`${styles.statusPill} ${styles.statusPending}`}>Submitted Claim</span></td>
                  <td>Claims</td>
                  <td>Submitted claim for Set of Keys</td>
                  <td style={{color: '#64748b', fontSize: '13px'}}>192.168.1.110</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}