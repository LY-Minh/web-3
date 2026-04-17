
import { pgTable, text, timestamp, uuid, pgEnum, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// enums
export const userRoleEnum = pgEnum("user_role", ["student", "admin"]);
export const itemStatusEnum = pgEnum("item_status", ["lost", "claimed", "approved_claim", "picked_up"]);
export const claimStatusEnum = pgEnum("claim_status", ["pending", "approved", "rejected"]);
export const itemCategoryEnum = pgEnum("item_category", ["electronics", "clothing", "accessories", "documents", "other"]);


export const itemsTable = pgTable("items", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    category: itemCategoryEnum("category").notNull(),
    status: itemStatusEnum("status").default("lost").notNull(),
    registeredById: text("registered_by_id").references(() => user.id).notNull(), 
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

});

export const claimsTable = pgTable("claims", {
    id: uuid("id").defaultRandom().primaryKey(),
    itemId: uuid("item_id").references(() => itemsTable.id).notNull(),
    studentId: text("student_id").references(() => user.id).notNull(),
    proofDescription: text("proof_description").notNull(),
    status: claimStatusEnum("status").default("pending").notNull(),
    reviewedById: text("reviewed_by_id").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesTable = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),
    // File can be off an item or a claim
    itemId: uuid("item_id").references(() => itemsTable.id),
    claimId: uuid("claim_id").references(() => claimsTable.id),
    fileName: text("file_name").notNull(),
    fileType: text("file_type"),
    fileUrl: text("file_url").notNull(), 
    isActive: boolean("is_active").default(true).notNull(), // For soft deletion
    s3Key: text("s3_key").notNull(),
    uploadedById: text("uploaded_by_id").references(() => user.id).notNull(),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const pickupAgreementsTable = pgTable("pickup_agreements", {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id").references(() => claimsTable.id).notNull(),
    itemId: uuid("item_id").references(() => itemsTable.id).notNull(),
    studentId: text("student_id").references(() => user.id).notNull(),
    signedAt: timestamp("signed_at").defaultNow().notNull(),
    adminId: text("admin_id").references(() => user.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});