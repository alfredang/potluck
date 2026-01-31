// Re-export schema from API package for use in web app
// This allows sharing the same schema between API and web serverless functions

export {
  users,
  chefProfiles,
  menuCategories,
  menus,
  chefAvailability,
  bookings,
  payments,
  subscriptions,
  reviews,
  disputes,
} from '../../api/src/db/schema/index';
