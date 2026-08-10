-- One-time login (magic link) tokens — email delivery only.
-- token_hash is a SHA-256 of the raw opaque token; the raw value is never stored.
CREATE TABLE IF NOT EXISTS otl_tokens (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT        NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS otl_tokens_user_id_idx ON otl_tokens (user_id);
