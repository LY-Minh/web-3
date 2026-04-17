import "dotenv/config";
import { sql } from "drizzle-orm";
import { db, pool } from "./index";
import {
  claimsTable,
  filesTable,
  itemCategoryEnum,
  itemsTable,
  itemStatusEnum,
  pickupAgreementsTable,
} from "./schema/schema";
import { user, userRoleEnum } from "./schema/auth-schema";

type UserRole = (typeof userRoleEnum.enumValues)[number];
type ItemCategory = (typeof itemCategoryEnum.enumValues)[number];
type ItemStatus = (typeof itemStatusEnum.enumValues)[number];

const users: Array<{
  id: string;
  name: string;
  email: string;
  role: UserRole;
}> = [
  {
    id: "admin-test-001",
    name: "Admin Tester",
    email: "admin.tester@example.edu",
    role: "admin",
  },
  {
    id: "student-test-001",
    name: "Alex Student",
    email: "alex.student@example.edu",
    role: "student",
  },
  {
    id: "student-test-002",
    name: "Jamie Student",
    email: "jamie.student@example.edu",
    role: "student",
  },
];

async function resolveCompletedItemStatus(): Promise<ItemStatus | "returned"> {
  const result = await db.execute(sql`
    select enumlabel
    from pg_enum e
    join pg_type t on e.enumtypid = t.oid
    where t.typname = 'item_status'
  `);

  const labels = result.rows
    .map((row) => row.enumlabel)
    .filter((v): v is string => typeof v === "string");

  if (labels.includes("picked_up")) {
    return "picked_up";
  }

  if (labels.includes("returned")) {
    return "returned";
  }

  return "approved_claim";
}

const items: Array<{
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  registeredById: string;
}> = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Black Wireless Earbuds",
    description: "Found in Lecture Hall B, row 4.",
    category: "electronics",
    status: "lost",
    registeredById: "admin-test-001",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Blue Hoodie",
    description: "Size M, campus logo on left chest.",
    category: "clothing",
    status: "claimed",
    registeredById: "admin-test-001",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Student ID Card",
    description: "Name visible on card holder.",
    category: "documents",
    status: "approved_claim",
    registeredById: "admin-test-001",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Silver Water Bottle",
    description: "Sticker says 'CS Club'.",
    category: "accessories",
    status: "approved_claim",
    registeredById: "admin-test-001",
  },
];

const claims: Array<{
  id: string;
  itemId: string;
  studentId: string;
  proofDescription: string;
  status: "pending" | "approved" | "rejected";
  reviewedById?: string;
}> = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    itemId: "22222222-2222-2222-2222-222222222222",
    studentId: "student-test-001",
    proofDescription: "It has my initials J.S. inside the tag.",
    status: "approved",
    reviewedById: "admin-test-001",
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    itemId: "33333333-3333-3333-3333-333333333333",
    studentId: "student-test-002",
    proofDescription: "My student number matches the card.",
    status: "approved",
    reviewedById: "admin-test-001",
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    itemId: "11111111-1111-1111-1111-111111111111",
    studentId: "student-test-001",
    proofDescription: "Case has a scratch near charging port.",
    status: "pending",
  },
];

const files: Array<{
  id: string;
  itemId?: string;
  claimId?: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  s3Key: string;
  uploadedById: string;
}> = [
  {
    id: "f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1",
    itemId: "11111111-1111-1111-1111-111111111111",
    fileName: "earbuds.jpg",
    fileType: "image/jpeg",
    fileUrl: "https://example-bucket.s3.amazonaws.com/items/earbuds.jpg",
    s3Key: "items/earbuds.jpg",
    uploadedById: "admin-test-001",
  },
  {
    id: "f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2",
    claimId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    fileName: "hoodie-proof.png",
    fileType: "image/png",
    fileUrl: "https://example-bucket.s3.amazonaws.com/claims/hoodie-proof.png",
    s3Key: "claims/hoodie-proof.png",
    uploadedById: "student-test-001",
  },
];

const pickupAgreements: Array<{
  id: string;
  claimId: string;
  itemId: string;
  studentId: string;
  adminId: string;
}> = [
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    claimId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    itemId: "33333333-3333-3333-3333-333333333333",
    studentId: "student-test-002",
    adminId: "admin-test-001",
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
  }

  const completedStatus = await resolveCompletedItemStatus();
  const seededItems = items.map((item) => {
    if (item.id === "44444444-4444-4444-4444-444444444444") {
      return { ...item, status: completedStatus };
    }

    return item;
  });

  await db.transaction(async (tx) => {
    for (const u of users) {
      await tx
        .insert(user)
        .values({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          emailVerified: true,
          banned: false,
        })
        .onConflictDoUpdate({
          target: user.id,
          set: {
            name: u.name,
            email: u.email,
            role: u.role,
            emailVerified: true,
            banned: false,
            updatedAt: new Date(),
          },
        });
    }

    for (const i of seededItems) {
      const itemStatusValue =
        i.status === "returned" ? sql.raw("'returned'::item_status") : i.status;

      await tx
        .insert(itemsTable)
        .values({
          ...i,
          status: itemStatusValue,
        })
        .onConflictDoUpdate({
          target: itemsTable.id,
          set: {
            name: i.name,
            description: i.description,
            category: i.category,
            status: itemStatusValue,
            registeredById: i.registeredById,
            updatedAt: new Date(),
          },
        });
    }

    for (const c of claims) {
      await tx
        .insert(claimsTable)
        .values(c)
        .onConflictDoUpdate({
          target: claimsTable.id,
          set: {
            itemId: c.itemId,
            studentId: c.studentId,
            proofDescription: c.proofDescription,
            status: c.status,
            reviewedById: c.reviewedById,
            updatedAt: new Date(),
          },
        });
    }

    for (const f of files) {
      await tx
        .insert(filesTable)
        .values({
          ...f,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: filesTable.id,
          set: {
            itemId: f.itemId,
            claimId: f.claimId,
            fileName: f.fileName,
            fileType: f.fileType,
            fileUrl: f.fileUrl,
            s3Key: f.s3Key,
            uploadedById: f.uploadedById,
            isActive: true,
          },
        });
    }

    for (const p of pickupAgreements) {
      await tx
        .insert(pickupAgreementsTable)
        .values(p)
        .onConflictDoUpdate({
          target: pickupAgreementsTable.id,
          set: {
            claimId: p.claimId,
            itemId: p.itemId,
            studentId: p.studentId,
            adminId: p.adminId,
          },
        });
    }
  });

  console.log("Seed complete.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
