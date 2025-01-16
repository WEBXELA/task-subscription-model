/*
  # Subscription System Schema

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plan` (text) - free, pro, business, enterprise
      - `status` (text) - active, canceled, past_due
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `subscription_history`
      - `id` (uuid, primary key)
      - `subscription_id` (uuid, references subscriptions)
      - `event_type` (text) - created, updated, canceled
      - `previous_plan` (text)
      - `new_plan` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan text NOT NULL CHECK (plan IN ('free', 'pro', 'business', 'enterprise')),
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')) DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Subscription History Table
CREATE TABLE IF NOT EXISTS subscription_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('created', 'updated', 'canceled')),
  previous_plan text CHECK (previous_plan IN ('free', 'pro', 'business', 'enterprise')),
  new_plan text CHECK (new_plan IN ('free', 'pro', 'business', 'enterprise')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for subscription_history
CREATE POLICY "Users can view own subscription history"
  ON subscription_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = subscription_history.subscription_id
      AND subscriptions.user_id = auth.uid()
    )
  );

-- Function to update subscription history
CREATE OR REPLACE FUNCTION log_subscription_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO subscription_history (subscription_id, event_type, new_plan)
    VALUES (NEW.id, 'created', NEW.plan);
  ELSIF (TG_OP = 'UPDATE') AND (OLD.plan != NEW.plan) THEN
    INSERT INTO subscription_history (subscription_id, event_type, previous_plan, new_plan)
    VALUES (NEW.id, 'updated', OLD.plan, NEW.plan);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subscription changes
CREATE TRIGGER subscription_audit
AFTER INSERT OR UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION log_subscription_change();

-- Function to create default subscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan, current_period_end)
  VALUES (NEW.id, 'free', (now() + interval '1 year'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();