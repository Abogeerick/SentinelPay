-- Seed Data for Demo User: demo@sentinelpay.io
-- User ID: 88ec79be-d4b5-440b-8796-afddefcd2f07

-- First, get or set the wallet ID for this user
DO $$
DECLARE
    demo_user_id UUID := '88ec79be-d4b5-440b-8796-afddefcd2f07';
    demo_wallet_id UUID;
BEGIN
    -- Get the wallet ID
    SELECT id INTO demo_wallet_id FROM wallets WHERE user_id = demo_user_id LIMIT 1;
    
    -- If no wallet exists, create one
    IF demo_wallet_id IS NULL THEN
        demo_wallet_id := gen_random_uuid();
        INSERT INTO wallets (id, user_id, balance, currency, created_at, updated_at)
        VALUES (demo_wallet_id, demo_user_id, 12450.75, 'KES', NOW(), NOW());
    ELSE
        -- Update balance
        UPDATE wallets SET balance = 12450.75, updated_at = NOW() WHERE id = demo_wallet_id;
    END IF;

    -- Clear existing transactions for demo user
    DELETE FROM transactions WHERE user_id = demo_user_id;

    -- Insert sample transactions
    -- Transaction 1: Recent payment (completed)
    INSERT INTO transactions (id, user_id, wallet_id, amount, type, status, ip_address, device_id, risk_score, metadata, created_at, updated_at)
    VALUES (
        gen_random_uuid(), demo_user_id, demo_wallet_id, 120.00, 'debit', 'success',
        '197.201.12.44', 'device_abc123', 15,
        '{"recipient": "Store_ABC", "recipientName": "Main St Grocers", "description": "Grocery shopping", "paymentType": "checkout"}'::jsonb,
        NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
    );

    -- Transaction 2: Transfer (completed)
    INSERT INTO transactions (id, user_id, wallet_id, amount, type, status, ip_address, device_id, risk_score, metadata, created_at, updated_at)
    VALUES (
        gen_random_uuid(), demo_user_id, demo_wallet_id, 500.00, 'debit', 'success',
        '197.201.12.44', 'device_abc123', 25,
        '{"recipient": "Alice_Smith", "recipientName": "Alice Smith", "description": "Rent payment", "transferType": "transfer"}'::jsonb,
        NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
    );

    -- Transaction 3: Salary deposit (income)
    INSERT INTO transactions (id, user_id, wallet_id, amount, type, status, ip_address, device_id, risk_score, metadata, created_at, updated_at)
    VALUES (
        gen_random_uuid(), demo_user_id, demo_wallet_id, 45000.00, 'credit', 'success',
        '197.201.12.44', 'device_abc123', 5,
        '{"recipient": "self", "recipientName": "Tech Corp Salary", "description": "Monthly salary"}'::jsonb,
        NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'
    );

    -- Transaction 4: Subscription payment
    INSERT INTO transactions (id, user_id, wallet_id, amount, type, status, ip_address, device_id, risk_score, metadata, created_at, updated_at)
    VALUES (
        gen_random_uuid(), demo_user_id, demo_wallet_id, 1499.00, 'debit', 'success',
        '197.201.12.44', 'device_abc123', 10,
        '{"recipient": "Sub_Netflix", "recipientName": "Streaming Service", "description": "Monthly subscription", "paymentType": "checkout"}'::jsonb,
        NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
    );

    -- Transaction 5: Large purchase (flagged for review)
    INSERT INTO transactions (id, user_id, wallet_id, amount, type, status, ip_address, device_id, risk_score, metadata, created_at, updated_at)
    VALUES (
        gen_random_uuid(), demo_user_id, demo_wallet_id, 55000.00, 'debit', 'flagged',
        '41.90.100.15', 'device_unknown', 75,
        '{"recipient": "Unknown_Merch", "recipientName": "Electronics Hub", "description": "Electronics purchase", "paymentType": "checkout"}'::jsonb,
        NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
    );

    -- Transaction 6: Mobile money payment
    INSERT INTO transactions (id, user_id, wallet_id, amount, type, status, ip_address, device_id, risk_score, metadata, created_at, updated_at)
    VALUES (
        gen_random_uuid(), demo_user_id, demo_wallet_id, 2500.00, 'debit', 'success',
        '197.201.12.44', 'device_abc123', 20,
        '{"recipient": "+254712345678", "recipientName": "MPESA - +254712345678", "description": "Mobile money transfer", "paymentMethod": "mobile-money", "provider": "mpesa"}'::jsonb,
        NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'
    );

    -- Transaction 7: Restaurant payment
    INSERT INTO transactions (id, user_id, wallet_id, amount, type, status, ip_address, device_id, risk_score, metadata, created_at, updated_at)
    VALUES (
        gen_random_uuid(), demo_user_id, demo_wallet_id, 3200.00, 'debit', 'success',
        '197.201.12.44', 'device_abc123', 12,
        '{"recipient": "Restaurant_XYZ", "recipientName": "Gourmet Restaurant", "description": "Dinner", "paymentType": "checkout"}'::jsonb,
        NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'
    );

    -- Transaction 8: Utility bill
    INSERT INTO transactions (id, user_id, wallet_id, amount, type, status, ip_address, device_id, risk_score, metadata, created_at, updated_at)
    VALUES (
        gen_random_uuid(), demo_user_id, demo_wallet_id, 4500.00, 'debit', 'success',
        '197.201.12.44', 'device_abc123', 8,
        '{"recipient": "KPLC", "recipientName": "Kenya Power", "description": "Electricity bill", "paymentType": "checkout"}'::jsonb,
        NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
    );

    -- Transaction 9: Online course
    INSERT INTO transactions (id, user_id, wallet_id, amount, type, status, ip_address, device_id, risk_score, metadata, created_at, updated_at)
    VALUES (
        gen_random_uuid(), demo_user_id, demo_wallet_id, 8950.00, 'debit', 'success',
        '197.201.12.44', 'device_abc123', 15,
        '{"recipient": "Udemy", "recipientName": "Online Course Platform", "description": "Tech course enrollment", "paymentType": "checkout"}'::jsonb,
        NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'
    );

    -- Transaction 10: Suspicious night transaction (flagged)
    INSERT INTO transactions (id, user_id, wallet_id, amount, type, status, ip_address, device_id, risk_score, metadata, created_at, updated_at)
    VALUES (
        gen_random_uuid(), demo_user_id, demo_wallet_id, 15000.00, 'debit', 'flagged',
        '102.89.45.23', 'device_new', 85,
        '{"recipient": "Unknown_Recipient", "recipientName": "Suspicious Merchant", "description": "Late night purchase", "paymentType": "checkout"}'::jsonb,
        NOW() - INTERVAL '2 days' + INTERVAL '3 hours', NOW() - INTERVAL '2 days' + INTERVAL '3 hours'
    );

END $$;

-- Insert fraud events for flagged transactions
INSERT INTO fraud_events (id, transaction_id, rule_triggered, severity, notes, created_at)
SELECT 
    gen_random_uuid(),
    t.id,
    'high_amount_spike',
    'high',
    'Transaction amount exceeds threshold of 50,000 KES',
    t.created_at
FROM transactions t
WHERE t.user_id = '88ec79be-d4b5-440b-8796-afddefcd2f07'
AND t.status = 'flagged'
AND t.amount >= 50000
AND NOT EXISTS (
    SELECT 1 FROM fraud_events fe WHERE fe.transaction_id = t.id AND fe.rule_triggered = 'high_amount_spike'
);

INSERT INTO fraud_events (id, transaction_id, rule_triggered, severity, notes, created_at)
SELECT 
    gen_random_uuid(),
    t.id,
    'ip_change',
    'medium',
    'Transaction from new IP address detected',
    t.created_at
FROM transactions t
WHERE t.user_id = '88ec79be-d4b5-440b-8796-afddefcd2f07'
AND t.status = 'flagged'
AND t.ip_address != '197.201.12.44'
AND NOT EXISTS (
    SELECT 1 FROM fraud_events fe WHERE fe.transaction_id = t.id AND fe.rule_triggered = 'ip_change'
);

INSERT INTO fraud_events (id, transaction_id, rule_triggered, severity, notes, created_at)
SELECT 
    gen_random_uuid(),
    t.id,
    'device_mismatch',
    'medium',
    'Transaction from unrecognized device',
    t.created_at
FROM transactions t
WHERE t.user_id = '88ec79be-d4b5-440b-8796-afddefcd2f07'
AND t.status = 'flagged'
AND t.device_id != 'device_abc123'
AND NOT EXISTS (
    SELECT 1 FROM fraud_events fe WHERE fe.transaction_id = t.id AND fe.rule_triggered = 'device_mismatch'
);

INSERT INTO fraud_events (id, transaction_id, rule_triggered, severity, notes, created_at)
SELECT 
    gen_random_uuid(),
    t.id,
    'suspicious_hours',
    'medium',
    'Transaction during suspicious hours (1am-4am)',
    t.created_at
FROM transactions t
WHERE t.user_id = '88ec79be-d4b5-440b-8796-afddefcd2f07'
AND t.status = 'flagged'
AND EXTRACT(HOUR FROM t.created_at) BETWEEN 1 AND 4
AND NOT EXISTS (
    SELECT 1 FROM fraud_events fe WHERE fe.transaction_id = t.id AND fe.rule_triggered = 'suspicious_hours'
);

-- Update user's device fingerprint and last login IP
UPDATE users 
SET device_fingerprint = 'device_abc123', 
    last_login_ip = '197.201.12.44',
    updated_at = NOW()
WHERE id = '88ec79be-d4b5-440b-8796-afddefcd2f07';

-- Verify the data
SELECT 'Users' as table_name, COUNT(*) as count FROM users WHERE id = '88ec79be-d4b5-440b-8796-afddefcd2f07'
UNION ALL
SELECT 'Wallets', COUNT(*) FROM wallets WHERE user_id = '88ec79be-d4b5-440b-8796-afddefcd2f07'
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions WHERE user_id = '88ec79be-d4b5-440b-8796-afddefcd2f07'
UNION ALL
SELECT 'Fraud Events', COUNT(*) FROM fraud_events fe 
JOIN transactions t ON fe.transaction_id = t.id 
WHERE t.user_id = '88ec79be-d4b5-440b-8796-afddefcd2f07';

