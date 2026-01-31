import { pgTable, uuid, varchar, json, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';

export const adminAuditLog = pgTable('admin_audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  adminId: uuid('admin_id')
    .references(() => users.id)
    .notNull(),

  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: uuid('entity_id'),
  details: json('details'),
  ipAddress: varchar('ip_address', { length: 45 }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const adminAuditLogRelations = relations(adminAuditLog, ({ one }) => ({
  admin: one(users, {
    fields: [adminAuditLog.adminId],
    references: [users.id],
  }),
}));
