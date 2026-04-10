
import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// enums
export const userRoleEnum = pgEnum("user_role", ["student", "admin"]);
export const itemStatusEnum = pgEnum("item_status", ["lost", "claimed", "approved_claim", "returned"]);
export const claimStatusEnum = pgEnum("claim_status", ["pending", "approved", "rejected"]);



export const items = pgTable("items", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category").notNull(),
    status: itemStatusEnum("status").default("lost").notNull(),
    registeredById: text("registered_by_id").references(() => user.id).notNull(), 
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

});

export const claims = pgTable("claims", {
    id: uuid("id").defaultRandom().primaryKey(),
    itemId: uuid("item_id").references(() => items.id).notNull(),
    studentId: text("student_id").references(() => user.id).notNull(),
    proofDescription: text("proof_description").notNull(),
    status: claimStatusEnum("status").default("pending").notNull(),
    reviewedById: text("reviewed_by_id").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),
    // File can be off an item or a claim
    itemId: uuid("item_id").references(() => items.id), 
    claimId: uuid("claim_id").references(() => claims.id),
    fileName: text("file_name").notNull(),
    fileType: text("file_type"),
    fileUrl: text("file_url").notNull(), 
    s3Key: text("s3_key").notNull(),
    uploadedById: text("uploaded_by_id").references(() => user.id).notNull(),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const pickupAgreements = pgTable("pickup_agreements", {
    id: uuid("id").defaultRandom().primaryKey(),
    claimId: uuid("claim_id").references(() => claims.id).notNull(),
    itemId: uuid("item_id").references(() => items.id).notNull(),
    studentId: text("student_id").references(() => user.id).notNull(),
    signedAt: timestamp("signed_at").defaultNow().notNull(),
    adminId: text("admin_id").references(() => user.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});