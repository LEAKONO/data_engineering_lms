export const chapter7 = {
  id: "ch7",
  emoji: "✅",
  title: "Data Quality & Observability",
  color: "#10b981",
  sections: [
    {
      id: "ch7s1",
      title: "The 6 Dimensions + Automated Testing",
      blocks: [
        {
          type: "text",
          content: "Data quality is the foundation of trust in data-driven organizations. When Data Engineers build pipelines without quality guarantees, they're handing scientists and analysts a ticking time bomb."
        },
        {
          type: "info",
          label: "THE GOLDEN RULE",
          color: "#10b981",
          content: "Your consumers should NEVER discover a data quality issue before you do. Instrument everything. Alert on anomalies."
        },
        {
          type: "table",
          headers: ["Dimension", "Definition", "Example Checks"],
          rows: [
            ["Completeness", "No unexpected nulls or missing records", "NULL rate < 1%. Row count within ±10% of average"],
            ["Accuracy", "Data reflects reality", "Range checks. Pattern validation"],
            ["Consistency", "Coherent across tables", "Referential integrity"],
            ["Timeliness", "Data is fresh enough", "MAX(updated_at) < NOW() - 25hr"],
            ["Validity", "Conforms to business rules", "Status in allowed list"],
            ["Uniqueness", "No unexpected duplicates", "COUNT(*) = COUNT(DISTINCT pk)"]
          ]
        },
        {
          type: "code",
          label: "Great Expectations — Automated Data Quality",
          code: `import great_expectations as gx

context = gx.get_context()

# Define Expectations
validator.expect_column_values_to_not_be_null('order_id')
validator.expect_column_values_to_be_unique('order_id')
validator.expect_column_values_to_be_in_set('status',
    ['pending', 'shipped', 'completed', 'cancelled'])
validator.expect_column_values_to_be_between('amount', min_value=0, max_value=1_000_000)
validator.expect_column_values_to_match_regex('email',
    r'^[\\w.-]+@[\\w.-]+\\.\\w+$')
validator.expect_table_row_count_to_be_between(
    min_value=10_000,
    max_value=5_000_000
)

# Run Validation
result = checkpoint.run()

if not result.success:
    send_slack_alert(f"DATA QUALITY FAILURE: {result.statistics}")
    raise Exception("Quality checks failed")

# Python-based checks
def run_quality_checks(df: pd.DataFrame, table_name: str):
    checks = []
    
    for col in ['order_id', 'customer_id', 'amount']:
        null_rate = df[col].isnull().mean()
        checks.append({
            'check': f'{col}_null_rate',
            'value': null_rate,
            'passed': null_rate < 0.01
        })
    
    dup_rate = df.duplicated(subset=['order_id']).mean()
    checks.append({'check': 'uniqueness', 'value': dup_rate, 'passed': dup_rate == 0})
    
    neg_pct = (df['amount'] < 0).mean()
    checks.append({'check': 'no_negative', 'value': neg_pct, 'passed': neg_pct == 0})
    
    failed = [c for c in checks if not c['passed']]
    if failed:
        raise ValueError(f"Quality checks failed: {failed}")
    return True`
        }
      ],
      quiz: [
        {
          q: "Which dimension checks that every order's customer_id exists in customers table?",
          opts: ["Completeness", "Accuracy", "Consistency", "Uniqueness"],
          correct: 2,
          exp: "CONSISTENCY checks referential integrity — every foreign key value exists in the referenced table."
        },
        {
          q: "What does Great Expectations' 'checkpoint.run()' return?",
          opts: [
            "Number of rows passed",
            "Result object with success/failure status and statistics",
            "Corrected data",
            "List of bad rows"
          ],
          correct: 1,
          exp: "checkpoint.run() returns a ValidationResult with success status and detailed statistics on which expectations failed."
        },
        {
          q: "Daily row count within ±20% of yesterday checks which dimensions?",
          opts: [
            "Accuracy",
            "Completeness and Timeliness",
            "Uniqueness",
            "Validity"
          ],
          correct: 1,
          exp: "Row count anomalies indicate COMPLETENESS (missing records) and TIMELINESS (data delayed) issues."
        },
        {
          q: "Why run quality checks BEFORE loading to target table?",
          opts: [
            "Faster",
            "If checks fail, target table remains in clean state",
            "Post-load checks impossible",
            "Target tables can't be read/written simultaneously"
          ],
          correct: 1,
          exp: "Running checks before loading is a safety gate: if checks fail, target table remains in previous clean state."
        },
        {
          q: "What is a 'data SLA' in observability?",
          opts: [
            "Legal contract with vendors",
            "Service-level agreement defining freshness and quality guarantees",
            "Query performance tool",
            "Data cleaning script"
          ],
          correct: 1,
          exp: "A data SLA defines measurable quality commitments: freshness by 7AM, null rate < 0.1%, row count within ±15%."
        }
      ]
    }
  ]
};