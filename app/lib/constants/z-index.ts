/**
 * Z-Index Hierarchy for ZK Password Vault
 *
 * Centralized z-index management to prevent stacking context issues
 * Higher numbers = closer to user (on top)
 */

export const Z_INDEX = {
  // Base content
  BASE: 0,

  // Fixed elements (navbar, footer)
  NAVBAR: 10,
  FOOTER: 10,

  // Dropdowns and popovers
  DROPDOWN: 30,
  POPOVER: 30,

  // Modals and dialogs
  MODAL_BACKDROP: 40,
  MODAL_CONTENT: 40,

  // System overlays (loading, saving, etc.)
  LOADING_OVERLAY: 60,
  SAVING_OVERLAY: 60,

  // Critical notifications
  TOAST: 70,
  ALERT: 70,

  // Developer tools / debug (highest)
  DEBUG: 9999,
} as const;

/**
 * Usage:
 *
 * import { Z_INDEX } from '@/lib/constants/z-index';
 *
 * <div className={`fixed inset-0 z-[${Z_INDEX.MODAL_BACKDROP}]`}>
 *   Modal backdrop
 * </div>
 */

export default Z_INDEX;
