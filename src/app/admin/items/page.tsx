"use client";

import { useState } from "react";
import { 
  Search, Plus, Filter, Eye, Edit2, MoreVertical, 
  Box, CheckCircle2, Clock, Trash2, ChevronLeft, ChevronRight, X
} from "lucide-react";
import AdminWrapper from "../AdminWrapper";
import styles from "./items.module.css";

export default function AdminItemsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AdminWrapper>
      {/* HEADER ROW */}
      <div className={styles.pageHeaderRow}>
        <div className={styles.pageHeader}>
          <h1>Items</h1>
          <p>Manage all found items in the system. Add new items, edit details, or mark items as unavailable.</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add New Item
        </button>
      </div>

      {/* FILTER ROW */}
      <div className={styles.filterBar}>
        <div className={styles.filterSearch}>
          <Search size={16} color="#94a3b8" />
          <input type="text" placeholder="Search items by name, category, or location..." />
        </div>
        <select className={styles.filterSelect}>
          <option>All Categories</option>
        </select>
        <select className={styles.filterSelect}>
          <option>All Status</option>
        </select>
        <select className={styles.filterSelect}>
          <option>All Locations</option>
        </select>
        <button className={styles.filterBtn}>
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* STATS CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconBlue}`}>
            <Box size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Items</h3>
            <p className={styles.statValue}>143</p>
            <p>All found items</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGreen}`}>
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Available</h3>
            <p className={styles.statValue}>89</p>
            <p>Ready to claim</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconYellow}`}>
            <Clock size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Claimed</h3>
            <p className={styles.statValue}>32</p>
            <p>Currently claimed</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGrey}`}>
            <Trash2 size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Unavailable</h3>
            <p className={styles.statValue}>22</p>
            <p>Not available</p>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className={styles.tableContainer}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Location Found</th>
              <th>Date Found</th>
              <th>Status</th>
              <th>Reported By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 */}
            <tr>
              <td>
                <div className={styles.itemCell}>
                  <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=100&q=80" alt="Backpack" className={styles.itemImg} />
                  <div className={styles.itemInfo}>
                    <strong>Backpack (Black)</strong>
                    <span>ID: ITEM-001</span>
                  </div>
                </div>
              </td>
              <td><span className={`${styles.catBadge} ${styles.catBags}`}>Bags</span></td>
              <td>Library - 2nd Floor</td>
              <td>Apr 22, 2025<br/><span style={{color: '#94a3b8', fontSize: '12px'}}>10:30 AM</span></td>
              <td><span className={`${styles.statusPill} ${styles.statusAvailable}`}>Available</span></td>
              <td>
                <div className={styles.reportedBy}>
                  <strong>John Doe</strong>
                  <span>Student</span>
                </div>
              </td>
              <td>
                <div className={styles.actionCell}>
                  <button><Eye size={16} /></button>
                  <button><Edit2 size={16} /></button>
                  <button><MoreVertical size={16} /></button>
                </div>
              </td>
            </tr>
            {/* Row 2 */}
            <tr>
              <td>
                <div className={styles.itemCell}>
                  <img src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=100&q=80" alt="iPhone" className={styles.itemImg} />
                  <div className={styles.itemInfo}>
                    <strong>iPhone (Silver)</strong>
                    <span>ID: ITEM-002</span>
                  </div>
                </div>
              </td>
              <td><span className={`${styles.catBadge} ${styles.catElectronics}`}>Electronics</span></td>
              <td>Cafeteria</td>
              <td>Apr 21, 2025<br/><span style={{color: '#94a3b8', fontSize: '12px'}}>2:15 PM</span></td>
              <td><span className={`${styles.statusPill} ${styles.statusClaimed}`}>Claimed</span></td>
              <td>
                <div className={styles.reportedBy}>
                  <strong>Sara Kim</strong>
                  <span>Student</span>
                </div>
              </td>
              <td>
                <div className={styles.actionCell}>
                  <button><Eye size={16} /></button>
                  <button><Edit2 size={16} /></button>
                  <button><MoreVertical size={16} /></button>
                </div>
              </td>
            </tr>
            {/* Row 3 */}
            <tr>
              <td>
                <div className={styles.itemCell}>
                  <img src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=100&q=80" alt="Keys" className={styles.itemImg} />
                  <div className={styles.itemInfo}>
                    <strong>Set of Keys</strong>
                    <span>ID: ITEM-003</span>
                  </div>
                </div>
              </td>
              <td><span className={`${styles.catBadge} ${styles.catKeys}`}>Keys</span></td>
              <td>Parking Lot</td>
              <td>Apr 20, 2025<br/><span style={{color: '#94a3b8', fontSize: '12px'}}>4:45 PM</span></td>
              <td><span className={`${styles.statusPill} ${styles.statusAvailable}`}>Available</span></td>
              <td>
                <div className={styles.reportedBy}>
                  <strong>Ali Hassan</strong>
                  <span>Student</span>
                </div>
              </td>
              <td>
                <div className={styles.actionCell}>
                  <button><Eye size={16} /></button>
                  <button><Edit2 size={16} /></button>
                  <button><MoreVertical size={16} /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.paginationRow}>
          <p>Showing 1 to 3 of 143 items</p>
          <div className={styles.pageControls}>
            <button className={styles.pageBtn}><ChevronLeft size={16} /></button>
            <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <span className={styles.pageDots}>...</span>
            <button className={styles.pageBtn}>24</button>
            <button className={styles.pageBtn}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* NEW ITEM MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Register New Item</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label>Item Name</label>
                <input type="text" placeholder="e.g. Blue Hydroflask" />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select>
                  <option>Bags</option>
                  <option>Electronics</option>
                  <option>Keys</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea placeholder="Any identifying marks?"></textarea>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminWrapper>
  );
}