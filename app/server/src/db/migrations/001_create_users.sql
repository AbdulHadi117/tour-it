CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Partial unique index (not a plain UNIQUE constraint) so a soft-deleted user
-- doesn't permanently block someone else registering with the same email.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS users_status_idx ON users (status);
