export const SESSION_COOKIE_NAME = "vitalnotes_session";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const PASSWORD_RESET_TTL_MS = 1000 * 60 * 60;

export const BCRYPT_ROUNDS = 12;

export const STAFF_ROLES = ["ADMIN", "EDITOR", "AUTHOR"] as const;

export const ADMIN_SECTION_EDITOR_ROLES = ["ADMIN", "EDITOR"] as const;
