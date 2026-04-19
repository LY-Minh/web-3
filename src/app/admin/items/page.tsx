"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  CheckCircle2,
  ChevronDown,
  Edit2,
  Eye,
  FileCheck2,
  History,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import styles from "./items.module.css";
import AdminLogoutButton from "@/components/admin-logout-button";

type ItemCategory = "electronics" | "clothing" | "accessories" | "documents" | "other";
type ItemStatus = "lost" | "claimed" | "approved_claim" | "picked_up";

type ItemFile = {
  id: string;
  fileName: string;
  fileType: string | null;
  fileUrl: string;
  uploadedAt: string;
};

type AdminItem = {
  id: string;
  name: string;
  description: string | null;
  category: ItemCategory;
  status: ItemStatus;
  createdAt: string;
  files: ItemFile[];
};

type CreateItemForm = {
  name: string;
  category: "" | ItemCategory;
  description: string;
  files: File[];
};

type UpdateItemForm = {
  name: string;
  category: "" | ItemCategory;
  description: string;
  files: File[];
};

const CATEGORY_OPTIONS: Array<{ value: ItemCategory; label: string }> = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "accessories", label: "Accessories" },
  { value: "documents", label: "Documents" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS: Array<{ value: ItemStatus; label: string }> = [
  { value: "lost", label: "Available" },
  { value: "claimed", label: "Claimed" },
  { value: "approved_claim", label: "Approved" },
  { value: "picked_up", label: "Picked Up" },
];

const statusClass: Record<ItemStatus, string> = {
  lost: styles.statusAvailable,
  claimed: styles.statusClaimed,
  approved_claim: styles.statusApproved,
  picked_up: styles.statusReturned,
};

const statusLabel: Record<ItemStatus, string> = {
  lost: "Available",
  claimed: "Claimed",
  approved_claim: "Approved",
  picked_up: "Picked Up",
};

const categoryClass: Record<ItemCategory, string> = {
  electronics: styles.catElectronics,
  clothing: styles.catOthers,
  accessories: styles.catAccessories,
  documents: styles.catOthers,
  other: styles.catOthers,
};

const EMPTY_FORM: CreateItemForm = {
  name: "",
  category: "",
  description: "",
  files: [],
};

const EMPTY_UPDATE_FORM: UpdateItemForm = {
  name: "",
  category: "",
  description: "",
  files: [],
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function categoryLabel(value: ItemCategory) {
  return CATEGORY_OPTIONS.find((category) => category.value === value)?.label ?? value;
}

export default function AdminItemsPage() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"" | ItemCategory>("");
  const [statusFilter, setStatusFilter] = useState<"" | ItemStatus>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateItemForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateItemForm, string>>>({});

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<AdminItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState<UpdateItemForm>(EMPTY_UPDATE_FORM);
  const [updateErrors, setUpdateErrors] = useState<Partial<Record<keyof UpdateItemForm, string>>>({});

  const buildUpdateForm = (item: AdminItem): UpdateItemForm => ({
    name: item.name,
    category: item.category,
    description: item.description ?? "",
    files: [],
  });

  const fetchItems = useCallback(async () => {
    setError(null);

    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("q", search.trim());
    }
    if (categoryFilter) {
      params.set("category", categoryFilter);
    }
    if (statusFilter) {
      params.set("status", statusFilter);
    }

    const target = params.toString() ? `/api/admin/items?${params.toString()}` : "/api/admin/items";

    const response = await fetch(target, { cache: "no-store" });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? "Failed to fetch items");
    }

    const payload = (await response.json()) as AdminItem[];
    setItems(payload);
  }, [categoryFilter, search, statusFilter]);

  const fetchItemById = useCallback(async (itemId: string) => {
    const response = await fetch(`/api/admin/items/${itemId}`, { cache: "no-store" });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? "Failed to fetch item details");
    }

    return (await response.json()) as AdminItem;
  }, []);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        await fetchItems();
      } catch (fetchError) {
        if (!isCancelled) {
          const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch items";
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [fetchItems]);

  const summary = useMemo(() => {
    const available = items.filter((item) => item.status === "lost").length;
    const claimed = items.filter((item) => item.status === "claimed").length;
    const unavailable = items.filter((item) => item.status === "approved_claim" || item.status === "picked_up").length;

    return {
      total: items.length,
      available,
      claimed,
      unavailable,
    };
  }, [items]);

  function validateForm() {
    const nextErrors: Partial<Record<keyof CreateItemForm, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Item name is required";
    }
    if (!form.category) {
      nextErrors.category = "Category is required";
    }
    if (form.files.length === 0) {
      nextErrors.files = "At least one file is required";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleCreateItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("description", form.description.trim());
      payload.append("category", form.category);
      for (const file of form.files) {
        payload.append("files", file);
      }

      const response = await fetch("/api/admin/items", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Failed to create item");
      }

      setIsModalOpen(false);
      setForm(EMPTY_FORM);
      setFormErrors({});
      await fetchItems();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Failed to create item";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteItem(itemId: string) {
    if (!confirm("Delete this item?")) {
      return;
    }

    setDeletingItemId(itemId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Failed to delete item");
      }

      await fetchItems();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Failed to delete item";
      setError(message);
    } finally {
      setDeletingItemId(null);
    }
  }

  async function openItemModal(itemId: string, mode: "view" | "edit") {
    setIsDetailModalOpen(true);
    setIsDetailLoading(true);
    setDetailError(null);
    setSelectedItem(null);
    setIsEditMode(mode === "edit");
    setUpdateErrors({});

    try {
      const item = await fetchItemById(itemId);
      setSelectedItem(item);
      setUpdateForm(buildUpdateForm(item));
    } catch (itemError) {
      const message = itemError instanceof Error ? itemError.message : "Failed to fetch item details";
      setDetailError(message);
    } finally {
      setIsDetailLoading(false);
    }
  }

  function closeDetailModal() {
    setIsDetailModalOpen(false);
    setIsDetailLoading(false);
    setDetailError(null);
    setSelectedItem(null);
    setIsEditMode(false);
    setIsUpdating(false);
    setUpdateForm(EMPTY_UPDATE_FORM);
    setUpdateErrors({});
  }

  function validateUpdateForm() {
    const nextErrors: Partial<Record<keyof UpdateItemForm, string>> = {};

    if (!updateForm.name.trim()) {
      nextErrors.name = "Item name is required";
    }
    if (!updateForm.category) {
      nextErrors.category = "Category is required";
    }

    setUpdateErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleUpdateItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedItem) {
      return;
    }

    if (!validateUpdateForm()) {
      return;
    }

    const nextName = updateForm.name.trim();
    const nextDescription = updateForm.description.trim();
    const currentDescription = selectedItem.description ?? "";

    const hasFieldChanges =
      nextName !== selectedItem.name ||
      updateForm.category !== selectedItem.category ||
      nextDescription !== currentDescription;

    if (!hasFieldChanges && updateForm.files.length === 0) {
      setDetailError("No changes to save.");
      return;
    }

    setIsUpdating(true);
    setDetailError(null);

    try {
      const payload = new FormData();
      payload.append("name", nextName);
      payload.append("description", nextDescription);
      payload.append("category", updateForm.category);
      for (const file of updateForm.files) {
        payload.append("files", file);
      }

      const response = await fetch(`/api/admin/items/${selectedItem.id}`, {
        method: "PUT",
        body: payload,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Failed to update item");
      }

      const refreshedItem = await fetchItemById(selectedItem.id);
      setSelectedItem(refreshedItem);
      setUpdateForm(buildUpdateForm(refreshedItem));
      setIsEditMode(false);
      await fetchItems();
    } catch (updateError) {
      const message = updateError instanceof Error ? updateError.message : "Failed to update item";
      setDetailError(message);
    } finally {
      setIsUpdating(false);
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
            <Link href="/admin/items" className={`${styles.navItem} ${styles.active}`}>
              <Package size={18} /> Items
            </Link>
            <Link href="/admin/claims" className={styles.navItem}>
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
          <AdminLogoutButton className={styles.logoutBtn} />
        </div>
      </aside>

      <main className={styles.adminMain}>
        <header className={styles.adminTopbar}>
          <div className={styles.searchBar}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search items"
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
              <h1 className={styles.pageTitle}>Items</h1>
              <p className={styles.pageSubtitle}>Manage found items directly from the backend inventory API.</p>
            </div>
            <button
              className={styles.primaryBtn}
              onClick={() => {
                setIsModalOpen(true);
                setFormErrors({});
              }}
            >
              <Plus size={16} /> Add New Item
            </button>
          </div>

          <div className={styles.filterBar}>
            <div className={styles.filterSelectWrap}>
              <select
                className={styles.filterSelect}
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value as "" | ItemCategory)}
              >
                <option value="">All Categories</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className={styles.selectIcon} />
            </div>

            <div className={styles.filterSelectWrap}>
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "" | ItemStatus)}
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className={styles.selectIcon} />
            </div>

            <button
              className={styles.filterBtn}
              onClick={() => {
                setSearch("");
                setCategoryFilter("");
                setStatusFilter("");
              }}
              type="button"
            >
              Clear Filters
            </button>
          </div>

          {error && (
            <div className={styles.tableContainer} style={{ marginBottom: 16 }}>
              <div className={styles.emptyRow} style={{ padding: 20 }}>
                {error}
              </div>
            </div>
          )}

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconBlue}`}>
                <Box size={22} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Total Items</p>
                <p className={styles.statValue}>{summary.total}</p>
                <p className={styles.statSub}>API-backed inventory</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconGreen}`}>
                <CheckCircle2 size={22} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Available</p>
                <p className={styles.statValue}>{summary.available}</p>
                <p className={styles.statSub}>Status: lost</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconYellow}`}>
                <FileCheck2 size={22} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Claimed</p>
                <p className={styles.statValue}>{summary.claimed}</p>
                <p className={styles.statSub}>Status: claimed</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.iconGrey}`}>
                <History size={22} />
              </div>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>Unavailable</p>
                <p className={styles.statValue}>{summary.unavailable}</p>
                <p className={styles.statSub}>Approved or picked up</p>
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Files</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      Loading items...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyRow}>
                      No items found.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
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
                      <td>
                        <span className={`${styles.catBadge} ${categoryClass[item.category]}`}>
                          {categoryLabel(item.category)}
                        </span>
                      </td>
                      <td className={styles.cellMuted}>{formatDate(item.createdAt)}</td>
                      <td>
                        <span className={`${styles.statusPill} ${statusClass[item.status]}`}>
                          {statusLabel[item.status]}
                        </span>
                      </td>
                      <td className={styles.cellMuted}>{item.files.length}</td>
                      <td>
                        <div className={styles.actionCell}>
                          <button
                            title="View item"
                            onClick={() => openItemModal(item.id, "view")}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            title="Edit item"
                            onClick={() => openItemModal(item.id, "edit")}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            title="Delete item"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={deletingItemId === item.id}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalDrawer} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Register New Item</h3>
                <p>Create an item in the admin API inventory.</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleCreateItem} noValidate>
              <div className={styles.formGroup}>
                <label>Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Black Backpack"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className={formErrors.name ? styles.inputErr : ""}
                />
                {formErrors.name && <span className={styles.errMsg}>{formErrors.name}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Category</label>
                <div className={styles.selectWrap}>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, category: event.target.value as "" | ItemCategory }))
                    }
                    className={formErrors.category ? styles.inputErr : ""}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </div>
                {formErrors.category && <span className={styles.errMsg}>{formErrors.category}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  placeholder="Enter item description"
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Files</label>
                <input
                  type="file"
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      files: Array.from(event.target.files ?? []),
                    }))
                  }
                  multiple
                  className={formErrors.files ? styles.inputErr : ""}
                />
                {formErrors.files && <span className={styles.errMsg}>{formErrors.files}</span>}
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  <Plus size={15} /> {isSubmitting ? "Creating..." : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailModalOpen && (
        <div className={styles.modalOverlay} onClick={closeDetailModal}>
          <div className={styles.modalDrawer} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>{isEditMode ? "Edit Item" : "Item Details"}</h3>
                <p>{selectedItem ? `Item ID: ${selectedItem.id}` : "Loading item details"}</p>
              </div>
              <button className={styles.closeBtn} onClick={closeDetailModal}>
                <X size={20} />
              </button>
            </div>

            {isDetailLoading ? (
              <div className={styles.emptyRow} style={{ padding: 20 }}>
                Loading item details...
              </div>
            ) : detailError && !selectedItem ? (
              <div className={styles.emptyRow} style={{ padding: 20 }}>
                {detailError}
              </div>
            ) : selectedItem ? (
              isEditMode ? (
                <form className={styles.modalForm} onSubmit={handleUpdateItem} noValidate>
                  {detailError && <span className={styles.errMsg}>{detailError}</span>}

                  <div className={styles.formGroup}>
                    <label>Item Name</label>
                    <input
                      type="text"
                      value={updateForm.name}
                      onChange={(event) => setUpdateForm((prev) => ({ ...prev, name: event.target.value }))}
                      className={updateErrors.name ? styles.inputErr : ""}
                    />
                    {updateErrors.name && <span className={styles.errMsg}>{updateErrors.name}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <div className={styles.selectWrap}>
                      <select
                        value={updateForm.category}
                        onChange={(event) =>
                          setUpdateForm((prev) => ({ ...prev, category: event.target.value as "" | ItemCategory }))
                        }
                        className={updateErrors.category ? styles.inputErr : ""}
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        {CATEGORY_OPTIONS.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={15} />
                    </div>
                    {updateErrors.category && <span className={styles.errMsg}>{updateErrors.category}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      value={updateForm.description}
                      onChange={(event) =>
                        setUpdateForm((prev) => ({ ...prev, description: event.target.value }))
                      }
                      rows={4}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Replace Files (optional)</label>
                    <input
                      type="file"
                      onChange={(event) =>
                        setUpdateForm((prev) => ({
                          ...prev,
                          files: Array.from(event.target.files ?? []),
                        }))
                      }
                      multiple
                    />
                    <p className={styles.itemId}>Uploading new files replaces active files for this item.</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Current Files</label>
                    {selectedItem.files.length === 0 ? (
                      <p className={styles.itemId}>No files attached.</p>
                    ) : (
                      <ul style={{ display: "grid", gap: 8, margin: 0, paddingLeft: 18 }}>
                        {selectedItem.files.map((file) => (
                          <li key={file.id}>
                            <a href={file.fileUrl} target="_blank" rel="noreferrer">
                              {file.fileName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => {
                        setIsEditMode(false);
                        setUpdateForm(buildUpdateForm(selectedItem));
                        setUpdateErrors({});
                        setDetailError(null);
                      }}
                    >
                      Back
                    </button>
                    <button type="submit" className={styles.submitBtn} disabled={isUpdating}>
                      <Edit2 size={15} /> {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.modalForm}>
                  {detailError && <span className={styles.errMsg}>{detailError}</span>}

                  <div className={styles.formGroup}>
                    <label>Item Name</label>
                    <p className={styles.itemName}>{selectedItem.name}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <p className={styles.itemId}>{categoryLabel(selectedItem.category)}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <span className={`${styles.statusPill} ${statusClass[selectedItem.status]}`}>
                      {statusLabel[selectedItem.status]}
                    </span>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <p className={styles.itemId}>{selectedItem.description ?? "-"}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Files</label>
                    {selectedItem.files.length === 0 ? (
                      <p className={styles.itemId}>No files attached.</p>
                    ) : (
                      <ul style={{ display: "grid", gap: 8, margin: 0, paddingLeft: 18 }}>
                        {selectedItem.files.map((file) => (
                          <li key={file.id}>
                            <a href={file.fileUrl} target="_blank" rel="noreferrer">
                              {file.fileName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelBtn} onClick={closeDetailModal}>
                      Close
                    </button>
                    <button type="button" className={styles.submitBtn} onClick={() => setIsEditMode(true)}>
                      <Edit2 size={15} /> Edit Item
                    </button>
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
