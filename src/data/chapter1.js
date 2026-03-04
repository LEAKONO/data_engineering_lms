export const chapter1 = {
  id: "ch1",
  emoji: "🏗️",
  title: "What is Data Engineering?",
  color: "#06b6d4",
  sections: [
    {
      id: "ch1s1",
      title: "The Data Ecosystem & Pipeline Stages",
      blocks: [
        {
          type: "info",
          label: "WHAT IS DATA ENGINEERING?",
          color: "#06b6d4",
          content: "Data Engineering is the discipline of designing, building, and maintaining systems that allow organizations to collect, store, transform, and analyze data reliably at scale. Think of it like plumbing — nobody sees it, everyone depends on it, and when it breaks, everything stops. Before a Data Scientist builds a model or an Analyst creates a dashboard, a Data Engineer must ensure raw data is available, clean, properly formatted, and trustworthy."
        },
        {
          type: "text",
          content: "Data flows through a series of stages from its point of origin to where it is consumed. This pipeline is the fundamental mental model every data engineer must internalize. Each stage has its own tools, failure modes, and best practices."
        },
        {
          type: "table",
          headers: ["Stage", "What Happens", "Real Examples"],
          rows: [
            ["Source Systems", "Where data is born — applications, IoT devices, SaaS tools writing to databases", "PostgreSQL orders DB, Stripe payments API, mobile app click events, IoT temperature sensors, Salesforce CRM"],
            ["Ingestion", "Moving raw data from sources into your infrastructure — batch or streaming", "Fivetran syncing Salesforce nightly, Kafka capturing clickstream events in real-time, custom Python scripts"],
            ["Storage", "Persisting data in Data Lake (raw files), Warehouse (structured SQL), or Lakehouse (hybrid)", "S3 for raw Parquet/CSV, BigQuery for analytical queries, Delta Lake for ACID + analytics"],
            ["Processing/Transform", "Cleaning dirty data, joining tables, computing aggregates, applying business logic", "dbt models joining orders+customers, Spark job computing daily revenue, Python pandas cleaning nulls"],
            ["Serving", "Making processed data accessible to consumers via tables, APIs, feature stores", "Looker connects to BigQuery, ML pipeline reads from feature store, REST API returns user metrics"],
            ["Consumers", "Humans and systems using data to make decisions or build products", "Analyst building dashboards, Data Scientist training churn model, Product team A/B testing features"]
          ]
        },
        {
          type: "text",
          content: "The critical insight: data loses value over time. A fraud detection model that updates nightly can miss fraud patterns that emerge within hours. A recommendation engine trained on 6-month-old behavior data serves less relevant content. Data Engineering is fundamentally about making high-quality data available as fast as the business needs it, as cheaply as possible, with zero compromise on reliability."
        },
        {
          type: "code",
          label: "Data Flow Example — E-commerce Order Pipeline",
          code: `# Complete data flow for an e-commerce order event:

# 1. SOURCE: Customer places order → app writes to PostgreSQL
INSERT INTO orders (id, customer_id, amount, status, created_at)
VALUES (98765, 42, 149.99, 'pending', NOW());

# 2. INGESTION: Script extracts new rows every hour using watermark
# Detects new rows: WHERE created_at > last_run_timestamp
# Output: s3://datalake/raw/orders/dt=2024-01-15/data.parquet

# 3. PROCESSING: dbt/Spark transforms and enriches
SELECT
    o.id           AS order_id,
    o.customer_id,
    c.country,
    c.segment,       -- comes from customers dimension table
    o.amount,
    p.category       AS product_category
FROM raw.orders o
JOIN raw.customers c  ON o.customer_id = c.id
JOIN raw.products p   ON o.product_id  = p.id
WHERE o.status != 'cancelled'

# 4. SERVING: Result written to analytics.fact_orders in BigQuery
# Looker dashboard queries this for "Revenue by Country" charts
# Total latency goal: source event → dashboard = under 2 hours`
        }
      ],
      quiz: [
        {
          q: "What is the PRIMARY responsibility of a Data Engineer?",
          opts: [
            "Build machine learning models",
            "Create dashboards and reports",
            "Design and maintain data infrastructure for reliability and scalability",
            "Write SQL queries for business analysts"
          ],
          correct: 2,
          exp: "Data Engineers build and maintain the INFRASTRUCTURE — pipelines, storage systems, and processing frameworks. ML models and dashboards are built ON TOP of the infrastructure Data Engineers create. The DE role is foundational to all other data work."
        },
        {
          q: "In a data pipeline, the 'Ingestion' stage is responsible for:",
          opts: [
            "Cleaning and transforming raw data",
            "Applying ML models to incoming data",
            "Moving raw data from source systems into your infrastructure",
            "Serving processed data to BI tools"
          ],
          correct: 2,
          exp: "Ingestion is specifically about MOVING data — from where it originates (source systems) into your own infrastructure. No transformation happens yet. Sources can be databases, APIs, event streams, files. The ingestion stage just gets the data to where you control it."
        },
        {
          q: "Why does data lose value over time?",
          opts: [
            "Storage costs increase with age",
            "Older data contains more corruption",
            "Patterns and conditions change, making stale data less relevant for current decisions",
            "Processing older data takes longer"
          ],
          correct: 2,
          exp: "Business conditions change constantly. Customer behavior shifts, fraud patterns evolve, market trends move. Data that was perfectly relevant 6 months ago may not reflect current reality, making models and decisions based on it less accurate or even actively misleading. Freshness is a core data quality dimension."
        },
        {
          q: "What distinguishes a Data Lakehouse from a pure Data Lake?",
          opts: [
            "A Lakehouse stores less data",
            "A Lakehouse adds ACID transactions and SQL query capabilities on top of raw file storage",
            "A Lakehouse only stores structured data",
            "A Lakehouse requires more expensive hardware"
          ],
          correct: 1,
          exp: "A Lakehouse (Delta Lake, Apache Iceberg, Apache Hudi) combines the low-cost raw file storage of a Data Lake with ACID transactions, schema enforcement, and SQL query performance of a Data Warehouse. It's the modern evolution that eliminates the traditional choice between a Lake (cheap, unstructured) and Warehouse (expensive, structured)."
        },
        {
          q: "Which stage comes LAST in the data pipeline before reaching consumers?",
          opts: ["Ingestion", "Processing/Transform", "Storage", "Serving"],
          correct: 3,
          exp: "The Serving layer is the final stage — it makes processed, analytics-ready data accessible to consumers. This includes BI tool connections (Looker, Tableau), ML feature stores, REST APIs, and direct SQL access. Everything upstream (ingest → store → process) exists to produce high-quality data that the Serving layer makes available."
        }
      ]
    },
    {
      id: "ch1s2",
      title: "DE vs DS vs DA vs Analytics Engineer",
      blocks: [
        {
          type: "info",
          label: "KEY INSIGHT",
          color: "#06b6d4",
          content: "At startups, one person does all data roles. At large companies (Meta, Airbnb), each role is extremely specialized with hundreds of engineers per function. Understanding boundaries helps you collaborate effectively and know what skills to develop at each career stage."
        },
        {
          type: "text",
          content: "One of the most common sources of confusion in data teams is understanding where one role ends and another begins. The roles have evolved rapidly over the last decade, and new specializations keep emerging. Here's a precise breakdown of what each role owns:"
        },
        {
          type: "table",
          headers: ["Role", "Core Question They Answer", "Primary Tools", "Output"],
          rows: [
            ["Data Engineer", "How do we move, store, and process data reliably at scale?", "Spark, Airflow, Kafka, dbt, Python, SQL, AWS/GCP/Azure", "Pipelines, data models, infrastructure"],
            ["Data Scientist", "What does the data predict? What patterns exist?", "Python (sklearn, PyTorch, TF), R, Jupyter, Feature Stores", "ML models, statistical analyses, A/B experiments"],
            ["Data Analyst", "What happened and why? What should we do?", "SQL, Tableau, Power BI, Looker, Excel", "Dashboards, reports, ad-hoc analyses"],
            ["Analytics Engineer", "How do we turn raw data into clean business models?", "dbt, SQL, Git, warehouse SQL dialects", "Semantic data models, documented data marts"],
            ["ML Engineer", "How do we deploy models to production reliably?", "Docker, Kubernetes, MLflow, FastAPI, Ray", "Model serving APIs, MLOps pipelines"],
            ["Data Platform Eng", "How do we build the infrastructure data teams use?", "Terraform, Kubernetes, cloud services", "Self-serve platforms, cost optimization"]
          ]
        },
        {
          type: "text",
          content: "The Analytics Engineer role (popularized by dbt Labs around 2019) emerged because there was a critical gap: Data Engineers were great at pipelines but didn't always follow SQL modeling best practices, while Analysts knew the business logic but not software engineering. Analytics Engineers sit at that intersection — they own the transformation layer between raw pipeline data and business-ready models."
        },
        {
          type: "code",
          label: "How Roles Collaborate — Churn Prediction Feature",
          code: `# Scenario: Build a customer churn prediction feature

# DATA ENGINEER owns:
# - Pipeline: Kafka events → S3 (raw behavior data)
# - Spark job: aggregate events_last_30d, avg_session_time per customer
# - Write aggregated features to feature store (Feast/Tecton)
# - Ensure pipeline runs daily, with alerting on quality/failures

# ANALYTICS ENGINEER owns:
# - dbt models: stg_customers → int_customer_activity → mart_customer_health
# - Document each field, write tests (not_null, unique, referential integrity)
# - Create 'customer_360' model joining purchases + support + usage

# DATA SCIENTIST owns:
# - Read features from feature store
# - Train XGBoost churn model on 2 years of labeled data
# - Validate: AUC-ROC, precision/recall, fairness checks across segments

# ML ENGINEER owns:
# - Package model as Docker container
# - Deploy as REST API (FastAPI) on Kubernetes
# - Monitor prediction drift, latency, error rates in production

# DATA ANALYST owns:
# - "Customers at Risk" Looker dashboard
# - Deep-dive: which segments churn most? Why?
# - Weekly stakeholder presentation with recommendations

# The Data Engineer's work enables EVERYTHING else.
# If the pipeline breaks → everyone is blocked.`
        }
      ],
      quiz: [
        {
          q: "What is the PRIMARY difference between a Data Engineer and Data Scientist?",
          opts: [
            "Data Engineers use Python, Data Scientists use R",
            "Data Engineers build infrastructure and pipelines; Data Scientists build models and find patterns",
            "Data Engineers work only with structured data",
            "There is no meaningful difference — both write SQL"
          ],
          correct: 1,
          exp: "Data Engineers focus on INFRASTRUCTURE — how to reliably move, store, and process data. Data Scientists focus on INSIGHTS — building models, running experiments, discovering patterns in data. Both use Python and SQL, but their core outputs are fundamentally different: infrastructure vs. intelligence."
        },
        {
          q: "What specific gap did the 'Analytics Engineer' role emerge to solve?",
          opts: [
            "Too many dashboards being created by analysts",
            "The gap between pipeline building (DE) and business-logic SQL modeling (DA)",
            "The need for more real-time analytics processing",
            "Data Scientists not knowing SQL well enough"
          ],
          correct: 1,
          exp: "Analytics Engineers emerged because Data Engineers were great at pipelines but didn't always model data with business logic best practices, while Analysts knew the business but not software engineering. The AE role bridges this — using dbt to create clean, tested, documented, version-controlled data models that analysts can trust and query."
        },
        {
          q: "In the churn prediction scenario, what specifically does the Data Engineer provide?",
          opts: [
            "The churn prediction model itself",
            "The dashboard showing at-risk customers",
            "The feature pipeline, aggregated metrics, and reliable data infrastructure",
            "The business recommendations from the analysis"
          ],
          correct: 2,
          exp: "The DE owns DATA INFRASTRUCTURE: the Kafka→S3 pipeline, the Spark aggregation job, writing to the feature store, and ensuring everything runs daily with quality monitoring. Without this foundation, the Data Scientist has no reliable data to train on — making the DE's work literally prerequisite to all other roles."
        },
        {
          q: "An ML Engineer's PRIMARY focus is:",
          opts: [
            "Exploring data for statistical patterns",
            "Training ML models from labeled datasets",
            "Deploying and serving ML models reliably in production",
            "Building ETL pipelines for training data"
          ],
          correct: 2,
          exp: "ML Engineers specialize in OPERATIONALIZING models — taking a Data Scientist's trained model from a Jupyter notebook and deploying it as a production API with monitoring, scaling, and reliability. They use Docker, Kubernetes, MLflow for model registry, and implement continuous monitoring for prediction drift and data drift."
        },
        {
          q: "A startup's first data hire is best described as:",
          opts: [
            "A pure Data Engineer only",
            "A pure Data Scientist only",
            "A data generalist who does DE + DA + DS work",
            "A Data Catalog specialist"
          ],
          correct: 2,
          exp: "First data hires at startups almost always need to be generalists — building the initial pipelines (DE work), writing analytical queries (DA work), and potentially building simple models (DS work). Specialization comes later when the team grows and the scope of each function is large enough to justify dedicated roles."
        }
      ]
    },
    {
      id: "ch1s3",
      title: "The Modern Data Stack",
      blocks: [
        {
          type: "text",
          content: "The 'Modern Data Stack' (MDS) describes the cloud-native, managed tools that replaced complex on-premise Hadoop/HDFS infrastructure. The key philosophy: each layer should be handled by a specialized, best-in-class tool rather than one monolithic platform trying to do everything."
        },
        {
          type: "text",
          content: "Three technology shifts enabled the MDS: (1) Cloud storage costs dropped 100x in 10 years — $23/TB/month vs thousands for on-prem. (2) Managed services eliminated operational overhead — no more configuring YARN, tuning HDFS, patching Hadoop clusters. (3) Separation of storage and compute (pioneered by Snowflake) meant you could scale each independently and pay only when computing."
        },
        {
          type: "table",
          headers: ["Layer", "Purpose", "Leading Tools", "Cost Ballpark"],
          rows: [
            ["Data Ingestion (EL)", "Move data from sources into warehouse with minimal transformation", "Fivetran (managed), Airbyte (open-source), Stitch, custom Python", "$500–$5000/month"],
            ["Cloud Storage (Lake)", "Cheap, durable object storage for raw files at any scale", "AWS S3, Google Cloud Storage, Azure Data Lake", "~$23/TB/month"],
            ["Data Warehouse", "Columnar SQL engine for analytical queries at scale", "Snowflake, BigQuery, Redshift, Databricks SQL", "$1000–$10000/month"],
            ["Transformation (T)", "Transform raw data into clean analytical models using SQL", "dbt (industry standard), Apache Spark for massive scale", "Free OSS to $500/month"],
            ["Orchestration", "Schedule, monitor, and manage pipeline dependencies", "Apache Airflow, Prefect, Dagster", "Free OSS to $500/month"],
            ["Streaming", "Real-time event processing for sub-second latency", "Apache Kafka, AWS Kinesis, Pub/Sub, Flink", "Variable"],
            ["Data Quality", "Automated testing and monitoring of data accuracy", "Great Expectations, dbt tests, Monte Carlo, Soda", "Free to $5000/month"],
            ["BI / Visualization", "Dashboards, reports, self-serve analytics", "Looker, Metabase (OSS), Tableau, Power BI, Superset", "$500–$5000/month"]
          ]
        },
        {
          type: "info",
          label: "THE CORE PHILOSOPHY",
          color: "#06b6d4",
          content: "The MDS is built around composability: Fivetran handles EL only, dbt handles T only, Snowflake handles storage+compute, Airflow handles scheduling. Each tool does ONE thing excellently rather than everything mediocrely. This means you can swap components independently — upgrade from Airflow to Dagster without touching your dbt models."
        },
        {
          type: "code",
          label: "Full MDS Stack Setup — Cost Example for Mid-Size Company",
          code: `# Typical MDS for a company with 10M events/day and 2-person data team:

# INGESTION — Fivetran
#   Syncs: Salesforce + Stripe + PostgreSQL → Snowflake
#   Cost: ~$2,000-5,000/month (row-based pricing)
#   Setup time: 1 day (pre-built connectors, zero custom code)
#   Alternative: Airbyte OSS (free software, but you manage infrastructure)

# WAREHOUSE — Snowflake
#   Storage: ~$23/TB/month (compressed — usually 5-10x compression)
#   Compute: Medium virtual warehouse = ~$4/credit, auto-suspend when idle
#   Actual cost: often $3,000-8,000/month total

# TRANSFORMATION — dbt Cloud
#   SQL-based transformation with testing, docs, CI/CD
#   Cost: $50/seat/month for dbt Cloud (or free self-hosted dbt Core)

# ORCHESTRATION — Airflow (self-hosted on EC2)
#   Schedules dbt runs, triggers Fivetran syncs, runs custom Python
#   Cost: EC2 t3.medium = ~$30/month (or AWS MWAA = ~$300/month managed)

# BI — Metabase (OSS)
#   Free/OSS (self-hosted) — business-friendly self-serve analytics

# TOTAL: ~$6,000-15,000/month
# This replaces what previously required: 5 engineers + $200,000/month
# Previously: complex Hadoop cluster, custom ETL in Informatica, etc.`
        }
      ],
      quiz: [
        {
          q: "What was the PRIMARY reason the Modern Data Stack replaced Hadoop-era infrastructure?",
          opts: [
            "Hadoop was too slow for all use cases",
            "Cloud storage costs dropped dramatically and managed services eliminated operational complexity",
            "Hadoop couldn't handle structured data at all",
            "SQL wasn't available in Hadoop ecosystems"
          ],
          correct: 1,
          exp: "The economic and operational math changed: cloud storage became extremely cheap (~$23/TB vs thousands on-prem), managed services (Snowflake, BigQuery) eliminated the complexity of running Hadoop clusters, and compute/storage separation enabled elastic scaling. It's fundamentally an economics shift, not just a technology one."
        },
        {
          q: "In the MDS, what specifically does dbt handle?",
          opts: [
            "Ingesting data from source systems",
            "Storing raw data in cloud storage",
            "The Transformation layer — writing SQL SELECT statements that become tables/views in the warehouse",
            "Orchestrating and scheduling all pipeline runs"
          ],
          correct: 2,
          exp: "dbt handles ONLY the T in ELT — you write SELECT statements, dbt compiles them into CREATE TABLE AS SELECT, manages dependencies between models, runs automated tests, and generates documentation. It does NOT ingest data (that's Fivetran/Airbyte) or schedule pipeline runs (that's Airflow/Prefect)."
        },
        {
          q: "What does Snowflake's 'separation of compute and storage' mean practically?",
          opts: [
            "Snowflake stores data in a separate building from their servers",
            "Storage and compute are priced independently and scale independently — 10 teams can query the same data simultaneously without contention",
            "You can only use storage OR compute at any given time",
            "Storage and compute are managed by different cloud providers"
          ],
          correct: 1,
          exp: "Snowflake stores your data on S3 (always on, very cheap) and separates compute into Virtual Warehouses that ONLY run when queries execute. 10 teams running different queries simultaneously use 10 separate Virtual Warehouses all reading the SAME storage. You pay nothing for compute when idle (auto-suspend), and storage is always available for any number of compute clusters."
        },
        {
          q: "The 'composability' principle of the Modern Data Stack means:",
          opts: [
            "All tools must be from the same vendor",
            "Each tool does one thing well, and you can swap components independently without affecting other layers",
            "All tools must be open source",
            "The stack must be deployed in a single cloud provider"
          ],
          correct: 1,
          exp: "Composability means each tool has a single, focused responsibility and interacts with other tools through standard interfaces (SQL, Parquet files, REST APIs). This lets you upgrade Airflow to Dagster without touching dbt models, or swap Fivetran for Airbyte without changing your Snowflake warehouse. Independent layers = independent evolution."
        },
        {
          q: "For a startup's first data pipeline, which MDS combination requires the LEAST engineering effort to set up?",
          opts: [
            "Custom Python scripts + PostgreSQL + Jupyter notebooks",
            "Fivetran (EL) + Snowflake (storage+compute) + dbt Cloud (transform)",
            "Self-hosted Kafka + HDFS + Spark + custom dashboards",
            "AWS Glue + Redshift + Tableau Server"
          ],
          correct: 1,
          exp: "Fivetran + Snowflake + dbt Cloud is the fastest to get working with minimal engineering: Fivetran has pre-built connectors that sync to Snowflake in hours with zero custom code, Snowflake requires no infrastructure management, and dbt Cloud provides a web IDE with built-in CI/CD. A functional data warehouse can be running in days vs. weeks for other options."
        }
      ]
    }
  ]
};