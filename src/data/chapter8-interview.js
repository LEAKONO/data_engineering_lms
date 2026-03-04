export const chapter8 = {
  id: "ch8",
  emoji: "🎯",
  title: "Interview Prep & System Design",
  color: "#8b5cf6",
  sections: [
    {
      id: "ch8s1",
      title: "Top SQL Interview Questions",
      blocks: [
        {
          type: "text",
          content: "SQL interviews for Data Engineer roles typically test window functions, CTEs, aggregations, and tricky edge cases."
        },
        {
          type: "code",
          label: "Q1: 2nd Highest Salary / Nth Highest",
          code: `-- Approach 1: Subquery
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Approach 2: DENSE_RANK
WITH ranked AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr
    FROM employees
)
SELECT salary FROM ranked WHERE dr = 2;

-- Approach 3: LIMIT + OFFSET
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;`
        },
        {
          type: "code",
          label: "Q2: Customers Active Every Month of 2024",
          code: `SELECT customer_id
FROM orders
WHERE EXTRACT(YEAR FROM order_date) = 2024
GROUP BY customer_id
HAVING COUNT(DISTINCT EXTRACT(MONTH FROM order_date)) = 12;`
        },
        {
          type: "code",
          label: "Q3: Month-over-Month User Retention",
          code: `WITH monthly_active AS (
    SELECT DISTINCT user_id,
        DATE_TRUNC('month', event_date) AS month
    FROM user_events
),
retention AS (
    SELECT
        curr.month,
        COUNT(DISTINCT curr.user_id) AS active_users,
        COUNT(DISTINCT prev.user_id) AS retained_users,
        ROUND(
            COUNT(DISTINCT prev.user_id) * 100.0 /
            NULLIF(COUNT(DISTINCT curr.user_id), 0), 2
        ) AS retention_pct
    FROM monthly_active curr
    LEFT JOIN monthly_active prev
        ON curr.user_id = prev.user_id
        AND prev.month = curr.month - INTERVAL '1 month'
    GROUP BY curr.month
)
SELECT * FROM retention ORDER BY month;`
        },
        {
          type: "code",
          label: "Q4: Remove Duplicates Keeping Latest Row",
          code: `WITH ranked AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY email
            ORDER BY created_at DESC
        ) AS rn
    FROM customers
)
DELETE FROM customers
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);`
        },
        {
          type: "code",
          label: "System Design Framework",
          code: `# DATA ENGINEER INTERVIEW — SYSTEM DESIGN FRAMEWORK

# STEP 1: CLARIFY REQUIREMENTS
# - How many events/day? Real-time or batch? Latency SLA?
# - Who are consumers? Budget constraints? Compliance needs?

# STEP 2: HIGH-LEVEL ARCHITECTURE
# - Draw sources → ingest → store → process → serve
# - Name specific tools at each layer, explain WHY

# STEP 3: DEEP DIVE on hardest component
# - Schema design, partitioning strategy, state management

# STEP 4: FAILURE HANDLING
# - How does each component fail? Recovery without data loss?

# STEP 5: SCALING + TRADE-OFFS
# - How does design go from 1M to 1B events/day?

# EXAMPLE: Real-Time Fraud Detection
# Requirements: 10M txns/day, flag in < 500ms, 99.99% uptime

# Architecture:
# Kafka (50 partitions, RF=3) ← transaction service
#   ↓
# Flink → checks rules against Redis → alert if suspicious
#   ↓
# Kafka fraud-alerts topic → block transaction service
#
# Kafka → Consumer → S3 (Parquet, partitioned by date)
#   ↓
# Airflow → Spark on EMR → feature engineering
#   ↓
# Redshift → Looker dashboard`
        }
      ],
      quiz: [
        {
          q: "Find users active in January but NOT in February. What pattern?",
          opts: [
            "INNER JOIN",
            "HAVING COUNT = 1",
            "ANTI-JOIN: Jan LEFT JOIN Feb WHERE Feb IS NULL",
            "FULL OUTER JOIN"
          ],
          correct: 2,
          exp: "Anti-join: SELECT user_id FROM jan LEFT JOIN feb ON same WHERE feb.user_id IS NULL"
        },
        {
          q: "Why use NULLIF() in retention rate calculations?",
          opts: [
            "Faster than CASE",
            "Prevents division by zero error",
            "Rounds to 2 decimals",
            "Required syntax"
          ],
          correct: 1,
          exp: "NULLIF(COUNT(active), 0) returns NULL when denominator is 0, making division result NULL instead of error."
        },
        {
          q: "Why always start system design with clarify requirements?",
          opts: [
            "Politeness",
            "Prevents building wrong system",
            "Required etiquette",
            "Impresses interviewers"
          ],
          correct: 1,
          exp: "Requirements drive architecture. 10 minutes clarifying can prevent 20 minutes designing the wrong system."
        },
        {
          q: "Lambda vs Kappa Architecture?",
          opts: [
            "Lambda uses Python, Kappa Java",
            "Lambda has batch + speed layers; Kappa uses streaming only",
            "Lambda for small data, Kappa for big",
            "Functionally identical"
          ],
          correct: 1,
          exp: "Lambda = two parallel paths (batch + speed). Kappa = single streaming pipeline for everything."
        },
        {
          q: "Best approach for GDPR right-to-erasure in warehouse?",
          opts: [
            "Delete entire customer record",
            "Encrypt data, delete key",
            "Store PII in separate table with surrogate key",
            "GDPR doesn't apply"
          ],
          correct: 2,
          exp: "Store PII in separate table with surrogate key. On erasure, delete that row — fact tables automatically anonymized."
        }
      ]
    }
  ]
};