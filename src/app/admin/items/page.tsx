// "use client";

// import { useState } from "react";
// import { 
//   Search, Plus, Filter, Eye, Edit2, MoreVertical, 
//   Box, CheckCircle2, Clock, Trash2, ChevronLeft, ChevronRight, X
// } from "lucide-react";
// import AdminWrapper from "../AdminWrapper";
// import styles from "./items.module.css";

// export default function AdminItemsPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <AdminWrapper>
//       {/* HEADER ROW */}
//       <div className={styles.pageHeaderRow}>
//         <div className={styles.pageHeader}>
//           <h1>Items</h1>
//           <p>Manage all found items in the system. Add new items, edit details, or mark items as unavailable.</p>
//         </div>
//         <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
//           <Plus size={16} /> Add New Item
//         </button>
//       </div>

//       {/* FILTER ROW (Location Dropdown Deleted!) */}
//       <div className={styles.filterBar}>
//         <div className={styles.filterSearch}>
//           <Search size={16} color="#94a3b8" />
//           <input type="text" placeholder="Search items by name or ID..." />
//         </div>
        
//         {/* Category Dropdown */}
//         <select className={styles.filterSelect} defaultValue="all">
//           <option value="all">All Categories</option>
//           <option value="electronics">Electronics</option>
//           <option value="bags">Bags</option>
//           <option value="accessories">Accessories</option>
//           <option value="personal">Personal Items</option>
//           <option value="documents">Documents</option>
//           <option value="clothing">Clothing</option>
//           <option value="keys">Keys</option>
//         </select>

//         {/* Status Dropdown */}
//         <select className={styles.filterSelect} defaultValue="all">
//           <option value="all">All Statuses</option>
//           <option value="available">Available</option>
//           <option value="pending">Pending Claim</option>
//           <option value="claimed">Claimed (Returned)</option>
//           <option value="unavailable">Unavailable</option>
//         </select>
        
//         <button className={styles.filterBtn}>
//           <Filter size={16} /> Filters
//         </button>
//       </div>

//       {/* STATS CARDS */}
//       <div className={styles.statsGrid}>
//         <div className={styles.statCard}>
//           <div className={`${styles.statIcon} ${styles.iconBlue}`}>
//             <Box size={24} />
//           </div>
//           <div className={styles.statInfo}>
//             <h3>Total Items</h3>
//             <p className={styles.statValue}>143</p>
//             <p>All found items</p>
//           </div>
//         </div>
//         <div className={styles.statCard}>
//           <div className={`${styles.statIcon} ${styles.iconGreen}`}>
//             <CheckCircle2 size={24} />
//           </div>
//           <div className={styles.statInfo}>
//             <h3>Available</h3>
//             <p className={styles.statValue}>89</p>
//             <p>Ready to claim</p>
//           </div>
//         </div>
//         <div className={styles.statCard}>
//           <div className={`${styles.statIcon} ${styles.iconYellow}`}>
//             <Clock size={24} />
//           </div>
//           <div className={styles.statInfo}>
//             <h3>Claimed</h3>
//             <p className={styles.statValue}>32</p>
//             <p>Currently claimed</p>
//           </div>
//         </div>
//         <div className={styles.statCard}>
//           <div className={`${styles.statIcon} ${styles.iconGrey}`}>
//             <Trash2 size={24} />
//           </div>
//           <div className={styles.statInfo}>
//             <h3>Unavailable</h3>
//             <p className={styles.statValue}>22</p>
//             <p>Not available</p>
//           </div>
//         </div>
//       </div>

//       {/* DATA TABLE */}
//       <div className={styles.tableContainer}>
//         <table className={styles.adminTable}>
//           <thead>
//             <tr>
//               <th>Item</th>
//               <th>Category</th>
//               <th>Location Found</th>
//               <th>Date Found</th>
//               <th>Status</th>
//               <th>Reported By</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>
//                 <div className={styles.itemCell}>
//                   <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=100&q=80" alt="Backpack" className={styles.itemImg} />
//                   <div className={styles.itemInfo}>
//                     <strong>Backpack (Black)</strong>
//                     <span>ID: ITEM-001</span>
//                   </div>
//                 </div>
//               </td>
//               <td><span className={`${styles.catBadge} ${styles.catBags}`}>Bags</span></td>
//               <td>Library - 2nd Floor</td>
//               <td>Apr 22, 2025<br/><span style={{color: '#94a3b8', fontSize: '12px'}}>10:30 AM</span></td>
//               <td><span className={`${styles.statusPill} ${styles.statusAvailable}`}>Available</span></td>
//               <td>
//                 <div className={styles.reportedBy}>
//                   <strong>John Doe</strong>
//                   <span>Student</span>
//                 </div>
//               </td>
//               <td>
//                 <div className={styles.actionCell}>
//                   <button><Eye size={16} /></button>
//                   <button><Edit2 size={16} /></button>
//                   <button><MoreVertical size={16} /></button>
//                 </div>
//               </td>
//             </tr>
//             <tr>
//               <td>
//                 <div className={styles.itemCell}>
//                   <img src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=100&q=80" alt="iPhone" className={styles.itemImg} />
//                   <div className={styles.itemInfo}>
//                     <strong>iPhone (Silver)</strong>
//                     <span>ID: ITEM-002</span>
//                   </div>
//                 </div>
//               </td>
//               <td><span className={`${styles.catBadge} ${styles.catElectronics}`}>Electronics</span></td>
//               <td>Cafeteria</td>
//               <td>Apr 21, 2025<br/><span style={{color: '#94a3b8', fontSize: '12px'}}>2:15 PM</span></td>
//               <td><span className={`${styles.statusPill} ${styles.statusClaimed}`}>Claimed</span></td>
//               <td>
//                 <div className={styles.reportedBy}>
//                   <strong>Sara Kim</strong>
//                   <span>Student</span>
//                 </div>
//               </td>
//               <td>
//                 <div className={styles.actionCell}>
//                   <button><Eye size={16} /></button>
//                   <button><Edit2 size={16} /></button>
//                   <button><MoreVertical size={16} /></button>
//                 </div>
//               </td>
//             </tr>
//             <tr>
//               <td>
//                 <div className={styles.itemCell}>
//                   <img src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=100&q=80" alt="Keys" className={styles.itemImg} />
//                   <div className={styles.itemInfo}>
//                     <strong>Set of Keys</strong>
//                     <span>ID: ITEM-003</span>
//                   </div>
//                 </div>
//               </td>
//               <td><span className={`${styles.catBadge} ${styles.catKeys}`}>Keys</span></td>
//               <td>Parking Lot</td>
//               <td>Apr 20, 2025<br/><span style={{color: '#94a3b8', fontSize: '12px'}}>4:45 PM</span></td>
//               <td><span className={`${styles.statusPill} ${styles.statusAvailable}`}>Available</span></td>
//               <td>
//                 <div className={styles.reportedBy}>
//                   <strong>Ali Hassan</strong>
//                   <span>Student</span>
//                 </div>
//               </td>
//               <td>
//                 <div className={styles.actionCell}>
//                   <button><Eye size={16} /></button>
//                   <button><Edit2 size={16} /></button>
//                   <button><MoreVertical size={16} /></button>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className={styles.paginationRow}>
//           <p>Showing 1 to 3 of 143 items</p>
//           <div className={styles.pageControls}>
//             <button className={styles.pageBtn}><ChevronLeft size={16} /></button>
//             <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
//             <button className={styles.pageBtn}>2</button>
//             <button className={styles.pageBtn}>3</button>
//             <span className={styles.pageDots}>...</span>
//             <button className={styles.pageBtn}>24</button>
//             <button className={styles.pageBtn}><ChevronRight size={16} /></button>
//           </div>
//         </div>
//       </div>

//       {/* NEW ITEM MODAL */}
//       {isModalOpen && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContent} style={{ width: '450px', overflowY: 'auto' }}>
//             <div className={styles.modalHeader}>
//               <h3>Register New Item</h3>
//               <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
//                 <X size={20} />
//               </button>
//             </div>
            
//             <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
//               <div className={styles.formGroup}>
//                 <label>Item Name</label>
//                 <input type="text" placeholder="e.g. AirPods Pro" required />
//               </div>
              
//               <div style={{ display: 'flex', gap: '16px' }}>
//                 <div className={styles.formGroup} style={{ flex: 1 }}>
//                   <label>Category</label>
//                   <select required defaultValue="">
//                     <option value="" disabled>Select category</option>
//                     <option value="electronics">Electronics</option>
//                     <option value="bags">Bags</option>
//                     <option value="accessories">Accessories</option>
//                     <option value="personal">Personal Items</option>
//                     <option value="documents">Documents</option>
//                     <option value="clothing">Clothing</option>
//                     <option value="keys">Keys</option>
//                   </select>
//                 </div>

//                 <div className={styles.formGroup} style={{ flex: 1 }}>
//                     <label>Status</label>
//                     <select required defaultValue="available">
//                         <option value="available">Available</option>
//                         <option value="pending">Pending Claim</option>
//                         <option value="claimed">Claimed (Returned)</option>
//                         <option value="unavailable">Unavailable</option>
//                     </select>
//                 </div>
//               </div>

//               {/* Location is now a text input so it can be manually typed! */}
//               <div className={styles.formGroup}>
//                 <label>Location Found</label>
//                 <input type="text" placeholder="e.g. Library 2nd Floor, Room 104" required />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Reported By (Finder's Name)</label>
//                 <input type="text" placeholder="Student or Staff Name" required />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Description & Condition</label>
//                 <textarea placeholder="Any identifying marks, damage, or contents?" required></textarea>
//               </div>

//               <div className={styles.modalActions}>
//                 <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
//                 <button type="submit" className={styles.submitBtn}>Save Item</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </AdminWrapper>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Plus, Filter, Eye, Edit2, MoreVertical,
  Box, CheckCircle2, Clock, Trash2, ChevronLeft,
  ChevronRight, ChevronDown, X, MapPin, Calendar,
  Tag, Palette, AlignLeft, User,
  Package, FileCheck2, Users, History, Settings, LogOut, Bell, MessageSquare,
} from "lucide-react";
import styles from "./items.module.css";

type ItemStatus = "lost" | "claimed" | "approved_claim" | "returned";

interface Item {
  id: string; name: string; category: string; color: string;
  location: string; dateFound: string; status: ItemStatus;
  description: string; reportedBy: string;
}

const INITIAL_ITEMS: Item[] = [
  { id: "ITEM-001", name: "Backpack (Black)",    category: "Bags",        color: "Black",  location: "Library – 2nd Floor", dateFound: "2025-04-22", status: "lost",           description: "Large black backpack with laptop compartment.", reportedBy: "John Doe"    },
  { id: "ITEM-002", name: "iPhone (Silver)",     category: "Electronics", color: "Silver", location: "Cafeteria",           dateFound: "2025-04-21", status: "claimed",        description: "iPhone 14, silver, cracked screen protector.",  reportedBy: "Sara Kim"    },
  { id: "ITEM-003", name: "Set of Keys",         category: "Keys",        color: "Silver", location: "Parking Lot",         dateFound: "2025-04-20", status: "lost",           description: "3 keys on a blue lanyard.",                     reportedBy: "Ali Hassan"  },
  { id: "ITEM-004", name: "AirPods",             category: "Electronics", color: "White",  location: "Gym",                 dateFound: "2025-04-18", status: "approved_claim", description: "AirPods Gen 3 in white case.",                  reportedBy: "Emma Lee"    },
  { id: "ITEM-005", name: "Wallet (Brown)",      category: "Accessories", color: "Brown",  location: "Student Center",      dateFound: "2025-04-17", status: "returned",       description: "Brown leather wallet, no cash inside.",         reportedBy: "Michael Tan" },
  { id: "ITEM-006", name: "Water Bottle (Blue)", category: "Others",      color: "Blue",   location: "Basketball Court",    dateFound: "2025-04-16", status: "lost",           description: "Blue Hydro Flask, 32oz.",                       reportedBy: "David Park"  },
];

const CATEGORIES = ["Electronics", "Bags", "Accessories", "Keys", "Clothing", "Documents", "Others"];
const COLORS     = ["Black", "White", "Silver", "Gold", "Blue", "Red", "Green", "Brown", "Gray", "Yellow", "Pink", "Purple", "Orange"];
const LOCATIONS  = ["Library – 1st Floor", "Library – 2nd Floor", "Cafeteria", "Parking Lot", "Gym", "Student Center", "Basketball Court", "Classroom Block A", "Classroom Block B", "Admin Building", "Other"];

const catClass: Record<string, string> = {
  Electronics: styles.catElectronics, Bags: styles.catBags, Keys: styles.catKeys,
  Accessories: styles.catAccessories, Others: styles.catOthers, Clothing: styles.catOthers, Documents: styles.catOthers,
};

const statusClass: Record<ItemStatus, string> = {
  lost: styles.statusAvailable, claimed: styles.statusClaimed,
  approved_claim: styles.statusApproved, returned: styles.statusReturned,
};

const statusLabel: Record<ItemStatus, string> = {
  lost: "Available", claimed: "Claimed", approved_claim: "Approved", returned: "Returned",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const EMPTY = { name: "", category: "", color: "", location: "", dateFound: "", status: "lost" as ItemStatus, description: "", reportedBy: "" };

export default function AdminItemsPage() {
  const [items, setItems]             = useState<Item[]>(INITIAL_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm]               = useState({ ...EMPTY });
  const [errors, setErrors]           = useState<Partial<typeof EMPTY>>({});
  const [search, setSearch]           = useState("");
  const [catFilter, setCatFilter]     = useState("");
  const [statFilter, setStatFilter]   = useState("");

  const filtered = items.filter(item =>
    (!search   || item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase())) &&
    (!catFilter  || item.category === catFilter) &&
    (!statFilter || item.status   === statFilter)
  );

  const summary = {
    total:    items.length,
    available: items.filter(i => i.status === "lost").length,
    claimed:  items.filter(i => i.status === "claimed").length,
    unavailable: items.filter(i => i.status === "returned").length,
  };

  function validate() {
    const e: Partial<typeof EMPTY> = {};
    if (!form.name.trim())       e.name       = "Item name is required";
    if (!form.category)          e.category   = "Please select a category";
    if (!form.color)             e.color      = "Please select a color";
    if (!form.location)          e.location   = "Please select a location";
    if (!form.dateFound)         e.dateFound  = "Date found is required";
    if (!form.reportedBy.trim()) e.reportedBy = "Reporter name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setItems([{ ...form, id: `ITEM-${String(items.length + 1).padStart(3, "0")}` }, ...items]);
    setIsModalOpen(false);
    setForm({ ...EMPTY });
    setErrors({});
  }

  function openModal() { setForm({ ...EMPTY }); setErrors({}); setIsModalOpen(true); }
  function handleDelete(id: string) { if (!confirm("Delete this item?")) return; setItems(items.filter(i => i.id !== id)); }

  return (
    <div className={styles.adminPage}>

      {/* ── SIDEBAR ── */}
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.adminBrand}>
            <div className={styles.brandIcon}><Package size={20} /></div>
            <div>
              <h2>Lost &amp; Found</h2>
              <p>Admin Dashboard</p>
            </div>
          </div>

          <p className={styles.menuLabel}>Management</p>
          <nav className={styles.adminNav}>
            <Link href="/admin/items"      className={`${styles.navItem} ${styles.active}`}><Package    size={18} /> Items</Link>
            <Link href="/admin/claims"     className={styles.navItem}><FileCheck2 size={18} /> Claims</Link>
            <Link href="/admin/agreements" className={styles.navItem}><FileCheck2 size={18} /> Agreements</Link>
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

      {/* ── MAIN ── */}
      <main className={styles.adminMain}>

        {/* Topbar */}
        <header className={styles.adminTopbar}>
          <div className={styles.searchBar}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search items, students, claims..." />
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.iconBtn}><Bell size={20} /><span className={styles.badge}></span></button>
            <button className={styles.iconBtn}><MessageSquare size={20} /></button>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}></div>
              <span>Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.pageContent}>

          {/* Header row */}
          <div className={styles.pageHeaderRow}>
            <div>
              <h1 className={styles.pageTitle}>Items</h1>
              <p className={styles.pageSubtitle}>Manage all found items in the system. Add new items, edit details, or mark items as unavailable.</p>
            </div>
            <button className={styles.primaryBtn} onClick={openModal}>
              <Plus size={16} /> Add New Item
            </button>
          </div>

          {/* Filter bar */}
          <div className={styles.filterBar}>
            <div className={styles.filterSearch}>
              <Search size={16} color="#94a3b8" />
              <input type="text" placeholder="Search items by name, category, or location..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className={styles.filterSelectWrap}>
              <select className={styles.filterSelect} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={15} className={styles.selectIcon} />
            </div>
            <div className={styles.filterSelectWrap}>
              <select className={styles.filterSelect} value={statFilter} onChange={e => setStatFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="lost">Available</option>
                <option value="claimed">Claimed</option>
                <option value="approved_claim">Approved</option>
                <option value="returned">Returned</option>
              </select>
              <ChevronDown size={15} className={styles.selectIcon} />
            </div>
            <button className={styles.filterBtn}><Filter size={16} /> Filters</button>
          </div>

          {/* Stat cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconBlue}`}><Box size={22} /></div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Total Items</p>
                <p className={styles.statValue}>{summary.total}</p>
                <p className={styles.statSub}>All found items</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconGreen}`}><CheckCircle2 size={22} /></div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Available</p>
                <p className={styles.statValue}>{summary.available}</p>
                <p className={styles.statSub}>Ready to claim</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconYellow}`}><Clock size={22} /></div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Claimed</p>
                <p className={styles.statValue}>{summary.claimed}</p>
                <p className={styles.statSub}>Currently claimed</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconGrey}`}><Trash2 size={22} /></div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Unavailable</p>
                <p className={styles.statValue}>{summary.unavailable}</p>
                <p className={styles.statSub}>Not available</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Item</th><th>Category</th><th>Location Found</th>
                  <th>Date Found</th><th>Status</th><th>Reported By</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className={styles.emptyRow}>No items found.</td></tr>
                ) : filtered.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.itemCell}>
                        <div className={styles.itemAvatar}>{item.name.charAt(0)}</div>
                        <div>
                          <p className={styles.itemName}>{item.name}</p>
                          <p className={styles.itemId}>ID: {item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={`${styles.catBadge} ${catClass[item.category] ?? styles.catOthers}`}>{item.category}</span></td>
                    <td className={styles.cellMuted}>{item.location}</td>
                    <td className={styles.cellMuted}>{fmtDate(item.dateFound)}</td>
                    <td><span className={`${styles.statusPill} ${statusClass[item.status]}`}>{statusLabel[item.status]}</span></td>
                    <td>
                      <p className={styles.itemName}>{item.reportedBy}</p>
                      <p className={styles.itemId}>Student</p>
                    </td>
                    <td>
                      <div className={styles.actionCell}>
                        <button title="View"><Eye size={15} /></button>
                        <button title="Edit"><Edit2 size={15} /></button>
                        <button title="More" onClick={() => handleDelete(item.id)}><MoreVertical size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.paginationRow}>
              <p>Showing 1 to {filtered.length} of {items.length} items</p>
              <div className={styles.pageControls}>
                <button className={styles.pageBtn}><ChevronLeft size={15} /></button>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <span className={styles.pageDots}>...</span>
                <button className={styles.pageBtn}>24</button>
                <button className={styles.pageBtn}><ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── ADD ITEM MODAL ── */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalDrawer} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Register New Item</h3>
                <p>Fill in the details of the found item below.</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form className={styles.modalForm} onSubmit={handleSubmit} noValidate>
              <div className={styles.formGroup}>
                <label><Tag size={13} /> Item Name <span className={styles.req}>*</span></label>
                <input type="text" placeholder="e.g. Black Backpack, iPhone 14..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={errors.name ? styles.inputErr : ""} />
                {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label><Tag size={13} /> Category <span className={styles.req}>*</span></label>
                  <div className={styles.selectWrap}>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={errors.category ? styles.inputErr : ""}>
                      <option value="" disabled>Select category</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={15} />
                  </div>
                  {errors.category && <span className={styles.errMsg}>{errors.category}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label><Palette size={13} /> Color <span className={styles.req}>*</span></label>
                  <div className={styles.selectWrap}>
                    <select value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className={errors.color ? styles.inputErr : ""}>
                      <option value="" disabled>Select color</option>
                      {COLORS.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={15} />
                  </div>
                  {errors.color && <span className={styles.errMsg}>{errors.color}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label><MapPin size={13} /> Location Found <span className={styles.req}>*</span></label>
                <div className={styles.selectWrap}>
                  <select value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={errors.location ? styles.inputErr : ""}>
                    <option value="" disabled>Select location</option>
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={15} />
                </div>
                {errors.location && <span className={styles.errMsg}>{errors.location}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label><Calendar size={13} /> Date Found <span className={styles.req}>*</span></label>
                  <input type="date" value={form.dateFound} onChange={e => setForm({ ...form, dateFound: e.target.value })} className={errors.dateFound ? styles.inputErr : ""} max={new Date().toISOString().split("T")[0]} />
                  {errors.dateFound && <span className={styles.errMsg}>{errors.dateFound}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label><Tag size={13} /> Status</label>
                  <div className={styles.selectWrap}>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ItemStatus })}>
                      <option value="lost">Available</option>
                      <option value="claimed">Claimed</option>
                    </select>
                    <ChevronDown size={15} />
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label><User size={13} /> Reported By <span className={styles.req}>*</span></label>
                <input type="text" placeholder="Name of student or staff who found the item" value={form.reportedBy} onChange={e => setForm({ ...form, reportedBy: e.target.value })} className={errors.reportedBy ? styles.inputErr : ""} />
                {errors.reportedBy && <span className={styles.errMsg}>{errors.reportedBy}</span>}
              </div>

              <div className={styles.formGroup}>
                <label><AlignLeft size={13} /> Description <span className={styles.optional}>(optional)</span></label>
                <textarea placeholder="Any identifying marks, brand, contents, damage..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}><Plus size={15} /> Register Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}