export const chapter4 = {
  id: "ch4",
  emoji: "🔄",
  title: "ETL vs ELT & dbt",
  color: "#ec4899",
  sections: [
    {
      id: "ch4s1",
      title: "ETL vs ELT — Architecture & Philosophy",
      blocks: [
        {
          type: "text",
          content: "ETL (Extract, Transform, Load) and ELT (Extract, Load, Transform) represent fundamentally different philosophies for data pipeline architecture. With cheap cloud compute and powerful cloud warehouses, ELT has become the industry standard."
        },
        {
          type: "table",
          headers: ["Dimension", "ETL (Traditional)", "ELT (Modern)"],
          rows: [
            ["Transform Location", "External server before warehouse", "Inside the warehouse using SQL"],
            ["Raw Data", "Discarded after transformation", "Preserved forever for reprocessing"],
            ["Bug Recovery", "Re-extract from source (expensive)", "Fix SQL model, rerun (cheap)"],
            ["Iteration Speed", "Slow — full pipeline rerun", "Fast — change SQL, rerun in minutes"],
            ["Compute Cost", "ETL server sized for peak load", "Warehouse scales elastically"],
            ["Tooling (EL)", "Informatica, SSIS, Talend", "Fivetran, Airbyte"],
            ["Tooling (T)", "Custom Python, Spark", "dbt — SQL models"]
          ]
        },
        {
          type: "info",
          label: "WHY ELT WON",
          color: "#ec4899",
          content: "Three shifts enabled ELT dominance: (1) Cloud storage is cheap (~$23/TB). (2) Cloud warehouses (Snowflake/BigQuery) are incredibly fast. (3) dbt made SQL-based transformation engineering-grade with version control, testing, and documentation."
        },
        {
          type: "code",
          label: "dbt — The Standard ELT Transformation Tool",
          code: `-- dbt converts SELECT statements into warehouse tables/views.
-- Write SQL SELECTs → dbt compiles them into CREATE TABLE AS SELECT

-- models/staging/stg_orders.sql
{{ config(materialized='view') }}

SELECT
    id::bigint AS order_id,
    customer_id::bigint AS customer_id,
    amount::decimal(12,2) AS order_amount_usd,
    LOWER(TRIM(status)) AS order_status,
    created_at AT TIME ZONE 'UTC' AS created_at_utc
FROM {{ source('raw', 'orders') }}
WHERE id IS NOT NULL

-- models/marts/fact_orders.sql
{{ config(
    materialized='incremental',
    unique_key='order_id'
) }}

SELECT
    o.order_id,
    o.customer_id,
    c.country,
    o.order_amount_usd,
    o.created_at_utc,
    DATE_TRUNC('month', o.created_at_utc) AS order_month
FROM {{ ref('stg_orders') }} o
LEFT JOIN {{ ref('stg_customers') }} c ON o.customer_id = c.customer_id

{% if is_incremental() %}
WHERE o.created_at_utc > (SELECT MAX(created_at_utc) FROM {{ this }})
{% endif %}`
        },
        {
          type: "code",
          label: "dbt Tests — Automated Data Quality",
          code: `# schema.yml
models:
  - name: stg_orders
    columns:
      - name: order_id
        tests:
          - not_null
          - unique
      - name: order_status
        tests:
          - not_null
          - accepted_values:
              values: ['pending', 'shipped', 'completed', 'cancelled']
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('stg_customers')
              field: customer_id

# Run tests: dbt test
# Run + test together: dbt build`
        }
      ],
      quiz: [
        {
          q: "In ELT, where does the transformation happen?",
          opts: [
            "On a dedicated ETL server",
            "Inside the cloud data warehouse",
            "On the source system",
            "In memory on laptop"
          ],
          correct: 1,
          exp: "In ELT, transformation happens INSIDE the warehouse using SQL (via dbt), after raw data is loaded."
        },
        {
          q: "What does dbt's 'incremental' materialization do?",
          opts: [
            "Runs one row at a time",
            "Only processes NEW records since last run",
            "Compresses output",
            "Runs tests before building"
          ],
          correct: 1,
          exp: "Incremental materialization only processes NEW records since the last run, using a timestamp watermark."
        },
        {
          q: "Primary advantage of preserving raw data in ELT?",
          opts: [
            "Faster querying",
            "Reprocess from raw data if transformation bug found",
            "Takes less space",
            "GDPR compliance"
          ],
          correct: 1,
          exp: "Raw data preservation enables recoverability: fix SQL and rerun transformation without re-extracting from source."
        },
        {
          q: "dbt's 'relationships' test checks for:",
          opts: [
            "Same row count",
            "Referential integrity",
            "Matching column names",
            "Consistent data types"
          ],
          correct: 1,
          exp: "The 'relationships' test checks referential integrity: every foreign key value exists in the referenced table."
        },
        {
          q: "What does dbt's ref() function do?",
          opts: [
            "Faster than direct references",
            "Creates dependency relationships between models",
            "Handles schema migrations",
            "Provides lineage tracking"
          ],
          correct: 1,
          exp: "ref('model_name') tells dbt the current model DEPENDS ON another model, enabling correct execution order."
        }
      ]
    }
  ]
};