-- Lost & Found Management System - Database Schema
-- Run this in Supabase SQL Editor

-- Create ENUM types
CREATE TYPE item_type AS ENUM ('lost', 'found');
CREATE TYPE item_status AS ENUM ('open', 'claimed', 'closed');
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected');

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       VARCHAR(255) NOT NULL,
    reporter_name  VARCHAR(200) NOT NULL,
    reporter_email VARCHAR(200) NOT NULL,
    reporter_phone VARCHAR(20)  NOT NULL,
    title         VARCHAR(200) NOT NULL,
    description   TEXT         NOT NULL,
    category      VARCHAR(100) NOT NULL,
    location      VARCHAR(200) NOT NULL,
    date          DATE         NOT NULL,
    type          item_type    NOT NULL,
    status        item_status  NOT NULL DEFAULT 'open',
    image_urls    TEXT,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_items_user_id   ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category  ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_location  ON items(location);
CREATE INDEX IF NOT EXISTS idx_items_type      ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_status    ON items(status);

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id           UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    claimant_user_id  VARCHAR(255) NOT NULL,
    proof_description TEXT NOT NULL,
    proof_image_url   TEXT,
    status            claim_status NOT NULL DEFAULT 'pending',
    admin_note        TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(item_id, claimant_user_id)
);

CREATE INDEX IF NOT EXISTS idx_claims_item_id          ON claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant_user_id ON claims(claimant_user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status           ON claims(status);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER claims_updated_at
    BEFORE UPDATE ON claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
