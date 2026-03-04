export const chapter6 = {
  id: "ch6",
  emoji: "💥",
  title: "Apache Spark & PySpark",
  color: "#ef4444",
  sections: [
    {
      id: "ch6s1",
      title: "Spark Architecture & Core Concepts",
      blocks: [
        {
          type: "text",
          content: "Apache Spark is the dominant framework for large-scale data processing. Where Pandas works with data in a single machine's memory (GBs), Spark distributes computation across a cluster (TBs to PBs)."
        },
        {
          type: "table",
          headers: ["Component", "Role", "Key Detail"],
          rows: [
            ["Driver", "Coordinates the Spark application", "Runs main() code. Creates SparkContext. Schedules tasks."],
            ["Executor", "Runs actual computation tasks", "JVM processes with CPU cores + memory"],
            ["Partition", "A chunk of data processed by one task", "Default: 128MB per partition"],
            ["Task", "One unit of computation on one partition", "One task = one partition"],
            ["Stage", "Group of tasks that can run without a shuffle", "Stages separated by shuffles"],
            ["Shuffle", "Redistributing data across partitions", "Expensive! Requires network transfer"],
            ["DAG", "The Catalyst optimizer's execution plan", "Optimized before execution"]
          ]
        },
        {
          type: "info",
          label: "LAZY EVALUATION",
          color: "#ef4444",
          content: "Spark does NOT execute transformations when called. It builds a LOGICAL PLAN. Only when you call an ACTION does Spark execute — and the Catalyst optimizer can reorder operations for maximum efficiency."
        },
        {
          type: "code",
          label: "PySpark — Complete ETL Reference",
          code: `from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *
from pyspark.sql.window import Window

spark = SparkSession.builder \\
    .appName('SalesETL') \\
    .config('spark.sql.shuffle.partitions', '200') \\
    .config('spark.sql.adaptive.enabled', 'true') \\
    .getOrCreate()

# ALWAYS define schema explicitly
schema = StructType([
    StructField('order_id', LongType(), nullable=False),
    StructField('customer_id', LongType(), nullable=True),
    StructField('amount', DoubleType(), nullable=True),
    StructField('status', StringType(), nullable=True),
    StructField('order_date', DateType(), nullable=True),
])

df = spark.read.schema(schema).parquet('s3://bucket/orders/')

# Transformations (all LAZY)
df = df \\
    .filter(F.col('amount') > 0) \\
    .filter(F.col('status').isin(['completed', 'shipped'])) \\
    .withColumn('amount_eur', F.col('amount') * 0.92) \\
    .withColumn('year', F.year('order_date')) \\
    .withColumn('month', F.month('order_date')) \\
    .withColumn('is_vip', F.when(F.col('amount') > 1000, True).otherwise(False))

# Aggregations
summary = df.groupBy('region', 'year', 'month') \\
    .agg(
        F.sum('amount').alias('total_revenue'),
        F.avg('amount').alias('avg_order_value'),
        F.count('*').alias('order_count'),
        F.countDistinct('customer_id').alias('unique_customers')
    )

# Window Functions
w = Window.partitionBy('region').orderBy(F.col('amount').desc())
df = df.withColumn('rank_in_region', F.rank().over(w))

# Write (ACTION)
summary.write \\
    .mode('overwrite') \\
    .partitionBy('year', 'month') \\
    .parquet('s3://bucket/processed/sales_summary/')`
        },
        {
          type: "code",
          label: "Performance Optimization — Joins, Skew & Caching",
          code: `from pyspark.sql.functions import broadcast

# BROADCAST JOIN — eliminate shuffle for small table joins
result = large_orders.join(
    broadcast(product_lookup),
    on='product_id',
    how='left'
)

# DETECTING DATA SKEW
df.groupBy('customer_id').count().orderBy(F.col('count').desc()).show(10)

# FIXING SKEW with SALTING
N = 20
df_salted = df.withColumn('salt', (F.rand() * N).cast('int'))
df_salted = df_salted.withColumn('salted_key',
    F.concat(F.col('customer_id').cast('string'), F.lit('_'), F.col('salt').cast('string')))

lookup_salted = lookup \\
    .withColumn('salt_arr', F.array([F.lit(i) for i in range(N)])) \\
    .withColumn('salt', F.explode('salt_arr')) \\
    .withColumn('salted_key',
        F.concat(F.col('customer_id').cast('string'), F.lit('_'), F.col('salt').cast('string')))

result = df_salted.join(lookup_salted, on='salted_key').drop('salt', 'salted_key')

# CACHING
df_filtered = df.filter(F.col('year') == 2024)
df_filtered.cache()
df_filtered.count()  # Materialize cache
revenue = df_filtered.groupBy('region').agg(F.sum('amount'))
df_filtered.unpersist()`
        }
      ],
      quiz: [
        {
          q: "What is 'lazy evaluation' in Spark?",
          opts: [
            "Processes data slowly",
            "Records transformations but doesn't execute until an action",
            "Caches intermediate results",
            "Configuration to reduce costs"
          ],
          correct: 1,
          exp: "Lazy evaluation means Spark records transformations without executing until an action is called, enabling full-plan optimization."
        },
        {
          q: "When to use a broadcast join?",
          opts: [
            "Always",
            "When one table is small enough to fit in executor memory",
            "When joining large tables",
            "For complex join conditions"
          ],
          correct: 1,
          exp: "Broadcast join is optimal when one table is SMALL. Spark copies it to every executor, eliminating shuffle."
        },
        {
          q: "What is a 'shuffle' in Spark and why is it expensive?",
          opts: [
            "Random sampling",
            "Data redistribution requiring network transfer",
            "Sorting within a partition",
            "Compression algorithm"
          ],
          correct: 1,
          exp: "A shuffle moves data across partitions, requiring serialization, network transfer, and deserialization."
        },
        {
          q: "Data skew in Spark means:",
          opts: [
            "Incorrect values",
            "One key has disproportionately many rows, causing one executor to do most work",
            "Partitions too small",
            "Missing values"
          ],
          correct: 1,
          exp: "Data skew occurs when one key has many rows, causing one executor to process the hot key while others idle."
        },
        {
          q: "Why call df.count() after df.cache()?",
          opts: [
            "Registers cache with cluster manager",
            "cache() marks for caching, count() triggers execution to materialize cache",
            "Validates cached data",
            "Not required"
          ],
          correct: 1,
          exp: "cache() is lazy — it only marks for caching. count() forces execution and materializes the cache in memory."
        }
      ]
    }
  ]
};