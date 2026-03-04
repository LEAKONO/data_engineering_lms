export const chapter2 = {
  id: "ch2",
  emoji: "🗄️",
  title: "SQL — The Language of Data",
  color: "#8b5cf6",
  sections: [
    {
      id: "ch2s1",
      title: "SQL Execution Order — Why It Matters",
      blocks: [
        {
          type: "text",
          content: "SQL execution order is one of the most commonly misunderstood topics in data engineering — and the source of countless bugs. The ORDER you write SQL and the ORDER the database executes it are completely different. This gap between logical writing order and physical execution order causes errors that stump even experienced engineers."
        },
        {
          type: "info",
          label: "THE MOST IMPORTANT RULE",
          color: "#8b5cf6",
          content: "You CANNOT reference a SELECT alias in WHERE, GROUP BY, or HAVING — because those clauses execute BEFORE SELECT defines the alias. The only exception: ORDER BY, which runs after SELECT. This single rule explains most 'column does not exist' errors."
        },
        {
          type: "table",
          headers: ["Execution Order", "Clause", "What It Does", "Common Gotcha"],
          rows: [
            ["1st", "FROM", "Identify all source tables", "Subqueries in FROM are fully evaluated first — can be expensive"],
            ["2nd", "JOIN", "Combine tables based on join conditions", "ALL rows initially combined BEFORE any WHERE filtering"],
            ["3rd", "WHERE", "Filter individual ROWS before grouping", "Cannot reference SELECT aliases. Cannot filter aggregations here."],
            ["4th", "GROUP BY", "Collapse rows into groups", "Any non-aggregated SELECT column MUST be in GROUP BY"],
            ["5th", "HAVING", "Filter GROUPS after aggregation", "CAN reference aggregates like SUM(). Cannot reference SELECT aliases."],
            ["6th", "SELECT", "Compute output columns, create aliases", "Aliases defined HERE are not visible to earlier clauses"],
            ["7th", "DISTINCT", "Remove duplicate rows from output", "Deduplication on final output values after SELECT computes them"],
            ["8th", "ORDER BY", "Sort the final result set", "Special exception: CAN use SELECT aliases here"],
            ["9th", "LIMIT/OFFSET", "Restrict rows returned", "Always the very last operation — applied to fully sorted results"]
          ]
        },
        {
          type: "code",
          label: "Execution Order Bugs — Common Mistakes & Fixes",
          code: `-- ✗ WRONG: Using SELECT alias in WHERE (WHERE runs before SELECT)
SELECT amount * 1.1 AS total_with_tax
FROM orders
WHERE total_with_tax > 100;       -- ERROR: column "total_with_tax" does not exist

-- ✓ CORRECT: Repeat the expression in WHERE
SELECT amount * 1.1 AS total_with_tax
FROM orders
WHERE amount * 1.1 > 100;         -- Works!

-- ✓ ALTERNATIVELY: Wrap in a subquery/CTE
SELECT total_with_tax FROM (
    SELECT amount * 1.1 AS total_with_tax FROM orders
) sub
WHERE total_with_tax > 100;        -- Alias is now visible!

-- ✗ WRONG: GROUP BY on SELECT alias (GROUP BY runs before SELECT)
SELECT YEAR(order_date) AS yr, SUM(amount)
FROM orders
GROUP BY yr;                       -- ERROR in most databases

-- ✓ CORRECT: Use the original expression in GROUP BY
SELECT YEAR(order_date) AS yr, SUM(amount)
FROM orders
GROUP BY YEAR(order_date);         -- Works!

-- ✗ WRONG: Filtering aggregation in WHERE (must use HAVING)
SELECT customer_id, SUM(amount) AS total
FROM orders
GROUP BY customer_id
WHERE SUM(amount) > 1000;          -- ERROR: aggregate in WHERE

-- ✓ CORRECT: HAVING filters groups AFTER aggregation
SELECT customer_id, SUM(amount) AS total
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 1000;         -- Works!

-- ✓ OK: ORDER BY CAN reference SELECT aliases (special exception)
SELECT amount * 1.1 AS total_with_tax FROM orders
ORDER BY total_with_tax DESC;      -- Works! ORDER BY runs after SELECT`
        }
      ],
      quiz: [
        {
          q: "In what order does SQL execute FROM, SELECT, WHERE, and GROUP BY?",
          opts: [
            "FROM → SELECT → WHERE → GROUP BY",
            "SELECT → FROM → WHERE → GROUP BY",
            "FROM → WHERE → GROUP BY → SELECT",
            "WHERE → FROM → GROUP BY → SELECT"
          ],
          correct: 2,
          exp: "FROM (step 1) → WHERE (step 3) → GROUP BY (step 4) → SELECT (step 6). This is why SELECT aliases don't exist yet when WHERE and GROUP BY run."
        },
        {
          q: "Why can you use a SELECT alias in ORDER BY but NOT in WHERE?",
          opts: [
            "It's a historical accident with no logical reason",
            "ORDER BY executes AFTER SELECT (special exception), while WHERE executes BEFORE SELECT",
            "SELECT aliases are only visible to ORDER BY by design choice",
            "Different database vendors chose different rules"
          ],
          correct: 1,
          exp: "ORDER BY is specifically designed to execute AFTER SELECT as an exception to the general rule."
        },
        {
          q: "You write: SELECT amount * 1.15 AS taxed FROM orders WHERE taxed > 100. What happens?",
          opts: [
            "Returns orders where the taxed amount exceeds 100",
            "Fails — WHERE cannot reference the SELECT alias 'taxed'",
            "Returns orders where amount > 100 (ignores the alias)",
            "Returns all orders regardless of amount"
          ],
          correct: 1,
          exp: "This query FAILS with 'column taxed does not exist'. WHERE executes BEFORE SELECT, so the alias 'taxed' doesn't exist yet."
        },
        {
          q: "What is the difference between WHERE and HAVING?",
          opts: [
            "WHERE is faster than HAVING",
            "WHERE filters rows BEFORE grouping; HAVING filters groups AFTER aggregation",
            "HAVING works on individual rows; WHERE works on groups",
            "They are interchangeable"
          ],
          correct: 1,
          exp: "WHERE filters INDIVIDUAL ROWS before GROUP BY runs — it cannot reference aggregates. HAVING filters GROUPS after GROUP BY and can reference aggregates."
        },
        {
          q: "A query has: GROUP BY region, year. The SELECT clause includes 'category'. What happens?",
          opts: [
            "Category is automatically included in each group",
            "The query fails — every non-aggregated SELECT column must be in GROUP BY",
            "Category shows as NULL for all rows",
            "The query runs but returns one random category per group"
          ],
          correct: 1,
          exp: "Every column in SELECT that is NOT inside an aggregate function MUST appear in GROUP BY. Otherwise the database doesn't know which value to show for each group."
        }
      ]
    },
    {
      id: "ch2s2",
      title: "SQL Fundamentals — CRUD, Filtering & Operators",
      blocks: [
        {
          type: "info",
          label: "SQL CORE COMMANDS",
          color: "#8b5cf6",
          content: "SQL (Structured Query Language) is divided into sublanguages: DDL (Data Definition Language) for structure, DML (Data Manipulation Language) for data, DQL (Data Query Language) for reading, DCL (Data Control Language) for permissions, and TCL (Transaction Control Language) for transactions."
        },
        {
          type: "code",
          label: "CRUD Operations — Create, Read, Update, Delete",
          code: `-- CREATE TABLE (DDL)
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    birth_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CREATE TABLE with foreign key
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    INDEX idx_customer (customer_id),
    INDEX idx_status (status)
);

-- CREATE TABLE AS SELECT (CTAS)
CREATE TABLE high_value_customers AS
SELECT customer_id, first_name, last_name, email, total_spent
FROM customers
WHERE total_spent > 10000;

-- ALTER TABLE (DDL modifications)
ALTER TABLE customers ADD COLUMN middle_name VARCHAR(50);
ALTER TABLE customers MODIFY COLUMN phone VARCHAR(20) NOT NULL;
ALTER TABLE customers DROP COLUMN middle_name;
ALTER TABLE customers RENAME COLUMN phone TO contact_number;
ALTER TABLE customers ADD CONSTRAINT unique_email UNIQUE (email);

-- DROP and TRUNCATE
DROP TABLE temp_customers;           -- Completely remove table
TRUNCATE TABLE staging_orders;        -- Remove all rows, keep structure

-- INSERT (DML)
INSERT INTO customers (first_name, last_name, email, phone, birth_date)
VALUES 
    ('John', 'Doe', 'john@email.com', '+1234567890', '1990-05-15'),
    ('Jane', 'Smith', 'jane@email.com', '+0987654321', '1988-12-22'),
    ('Bob', 'Johnson', 'bob@email.com', '+1122334455', '1995-03-10');

-- INSERT with SELECT
INSERT INTO premium_customers (customer_id, full_name, email)
SELECT 
    customer_id,
    CONCAT(first_name, ' ', last_name) AS full_name,
    email
FROM customers
WHERE is_active = TRUE
AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- INSERT IGNORE (skip duplicates)
INSERT IGNORE INTO customers (email, first_name, last_name)
VALUES ('john@email.com', 'John', 'Doe');  -- Won't error if duplicate

-- INSERT ON DUPLICATE KEY UPDATE (MySQL)
INSERT INTO customers (customer_id, email, visits)
VALUES (1, 'john@email.com', 1)
ON DUPLICATE KEY UPDATE 
    visits = visits + 1,
    last_visit = NOW();

-- INSERT ... ON CONFLICT (PostgreSQL)
INSERT INTO customers (customer_id, email, visits)
VALUES (1, 'john@email.com', 1)
ON CONFLICT (customer_id) DO UPDATE
SET 
    visits = customers.visits + 1,
    last_visit = NOW();

-- SELECT (DQL) — Read operations
SELECT * FROM customers;

SELECT 
    customer_id AS id,
    CONCAT(first_name, ' ', last_name) AS full_name,
    email AS contact_email
FROM customers;

-- SELECT DISTINCT (unique values)
SELECT DISTINCT city, country FROM customers;

-- SELECT with calculations
SELECT 
    order_id,
    quantity,
    unit_price,
    quantity * unit_price AS total_price,
    ROUND(quantity * unit_price * 0.1, 2) AS tax_amount
FROM order_items;

-- UPDATE (DML)
UPDATE customers 
SET phone = '+9998887777', updated_at = NOW()
WHERE customer_id = 1;

-- UPDATE with JOIN
UPDATE customers c
JOIN orders o ON c.customer_id = o.customer_id
SET c.is_active = FALSE
WHERE o.order_date < DATE_SUB(NOW(), INTERVAL 2 YEAR);

-- DELETE (DML) — Use with EXTREME caution!
DELETE FROM customers WHERE customer_id = 3;

-- DELETE with JOIN
DELETE c FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.customer_id IS NULL  -- Customers with no orders
AND c.created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Soft delete pattern (don't actually delete)
ALTER TABLE customers ADD COLUMN deleted_at TIMESTAMP NULL;
UPDATE customers SET deleted_at = NOW() WHERE customer_id = 2;`
        },
        {
          type: "code",
          label: "WHERE Clause — Complete Filtering Reference",
          code: `-- Comparison operators
SELECT * FROM orders WHERE amount > 100;
SELECT * FROM orders WHERE amount >= 100;
SELECT * FROM orders WHERE amount < 50;
SELECT * FROM orders WHERE amount <= 50;
SELECT * FROM orders WHERE amount = 99.99;
SELECT * FROM orders WHERE amount != 99.99;
SELECT * FROM orders WHERE amount <> 99.99;

-- Multiple conditions with AND/OR
SELECT * FROM orders
WHERE status = 'shipped' 
  AND amount > 100 
  AND order_date >= '2024-01-01';

SELECT * FROM customers
WHERE city = 'New York' OR city = 'Los Angeles' OR city = 'Chicago';

-- Combination with parentheses (AND has precedence)
SELECT * FROM employees
WHERE (department = 'Engineering' OR department = 'Product')
  AND salary > 80000
  AND (hire_date > '2023-01-01' OR is_manager = TRUE);

-- IN operator (multiple possible values)
SELECT * FROM products
WHERE category IN ('Electronics', 'Computers', 'Accessories');

SELECT * FROM orders
WHERE customer_id IN (
    SELECT customer_id FROM customers WHERE is_vip = TRUE
);

-- NOT IN (careful with NULLs!)
SELECT * FROM products
WHERE category NOT IN ('Electronics', 'Clothing');

-- BETWEEN operator (inclusive range)
SELECT * FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31';

SELECT * FROM products
WHERE price BETWEEN 50 AND 100;

-- NOT BETWEEN
SELECT * FROM products
WHERE price NOT BETWEEN 50 AND 100;

-- LIKE operator (pattern matching)
SELECT * FROM customers WHERE email LIKE '%@gmail.com';
SELECT * FROM customers WHERE first_name LIKE 'J%';
SELECT * FROM customers WHERE last_name LIKE '%son%';
SELECT * FROM products WHERE sku LIKE 'PROD-____-2024';

-- Escape characters in LIKE
SELECT * FROM comments
WHERE text LIKE '%100\\% increase%' ESCAPE '\\';

-- ILIKE (case-insensitive LIKE - PostgreSQL)
SELECT * FROM users WHERE username ILIKE 'admin%';

-- REGEXP / RLIKE (regular expressions)
SELECT * FROM customers
WHERE email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$';

SELECT * FROM products
WHERE sku REGEXP '^[A-Z]{3}-[0-9]{4}-[0-9]{2}$';

-- IS NULL / IS NOT NULL
SELECT * FROM customers WHERE phone IS NULL;
SELECT * FROM orders WHERE shipped_date IS NOT NULL;
SELECT * FROM employees WHERE manager_id IS NULL;

-- COALESCE — handle NULL values
SELECT 
    customer_id,
    COALESCE(phone, email, 'No contact') AS contact,
    COALESCE(bonus, 0) AS bonus_amount,
    COALESCE(age, 0) AS age
FROM customers;

-- NULLIF — returns NULL if values equal
SELECT 
    product_name,
    NULLIF(discounted_price, regular_price) AS savings_amount
FROM products;

-- Complex WHERE with EXISTS
SELECT c.customer_id, c.first_name, c.last_name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.customer_id 
    AND o.amount > 1000
    AND o.order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
);

-- WHERE with NOT EXISTS (anti-join)
SELECT p.product_id, p.product_name
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM order_items oi
    WHERE oi.product_id = p.product_id
    AND oi.order_date >= DATE_SUB(NOW(), INTERVAL 90 DAY)
);

-- WHERE with ALL
SELECT product_name, price
FROM products
WHERE price > ALL (
    SELECT price FROM products WHERE category = 'Basic'
);

-- WHERE with ANY/SOME
SELECT product_name, price
FROM products
WHERE price > ANY (
    SELECT price FROM products WHERE category = 'Basic'
);`
        },
        {
          type: "code",
          label: "ORDER BY — Advanced Sorting",
          code: `-- Basic sorting
SELECT * FROM customers ORDER BY last_name;
SELECT * FROM customers ORDER BY last_name ASC;
SELECT * FROM customers ORDER BY last_name DESC;

-- Multiple sort columns
SELECT * FROM employees
ORDER BY 
    department ASC,
    salary DESC,
    last_name ASC;

-- Sorting by expressions
SELECT 
    customer_id,
    first_name,
    last_name,
    TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age
FROM customers
ORDER BY age DESC;

-- Sorting with NULLs positioning (PostgreSQL)
SELECT * FROM orders
ORDER BY shipped_date ASC NULLS LAST;
SELECT * FROM orders
ORDER BY shipped_date DESC NULLS FIRST;

-- MySQL equivalent for NULLs positioning
SELECT * FROM orders
ORDER BY IFNULL(shipped_date, '9999-12-31') ASC;

-- ORDER BY with column position
SELECT first_name, last_name, salary
FROM employees
ORDER BY 3 DESC;

-- ORDER BY with CASE (custom sort order)
SELECT product_name, category, price
FROM products
ORDER BY 
    CASE category
        WHEN 'Premium' THEN 1
        WHEN 'Standard' THEN 2
        WHEN 'Economy' THEN 3
        ELSE 4
    END,
    price DESC;

-- ORDER BY with FIELD() (MySQL)
SELECT * FROM products
ORDER BY FIELD(category, 'Premium', 'Standard', 'Economy'), price;

-- ORDER BY with random
SELECT * FROM products ORDER BY RAND() LIMIT 10;     -- MySQL
SELECT * FROM products ORDER BY RANDOM() LIMIT 10;   -- PostgreSQL

-- ORDER BY with DISTINCT ON (PostgreSQL)
SELECT DISTINCT ON (category) 
    category, 
    product_name, 
    price
FROM products
ORDER BY category, price DESC;

-- LIMIT and OFFSET with ORDER BY
SELECT * FROM products ORDER BY price DESC LIMIT 10;
SELECT * FROM products ORDER BY price DESC LIMIT 10 OFFSET 10;
SELECT * FROM products ORDER BY price DESC LIMIT 10, 10; -- MySQL syntax

-- Get nth highest
SELECT * FROM products ORDER BY price DESC LIMIT 1 OFFSET 4; -- 5th highest

-- FETCH FIRST (ANSI SQL)
SELECT * FROM products
ORDER BY price DESC
FETCH FIRST 10 ROWS ONLY;

SELECT * FROM products
ORDER BY price DESC
OFFSET 10 ROWS FETCH FIRST 10 ROWS ONLY;`
        },
        {
          type: "code",
          label: "GROUP BY — Advanced Aggregation",
          code: `-- Basic GROUP BY
SELECT 
    status,
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount,
    MIN(amount) AS min_amount,
    MAX(amount) AS max_amount,
    STDDEV(amount) AS std_dev_amount,
    VARIANCE(amount) AS variance_amount
FROM orders
GROUP BY status;

-- GROUP BY with multiple columns
SELECT 
    YEAR(order_date) AS year,
    MONTH(order_date) AS month,
    status,
    COUNT(*) AS orders,
    SUM(amount) AS revenue
FROM orders
GROUP BY 
    YEAR(order_date),
    MONTH(order_date),
    status
ORDER BY year DESC, month DESC;

-- GROUP BY with ROLLUP (hierarchical subtotals)
SELECT 
    COALESCE(category, 'All Categories') AS category,
    COALESCE(subcategory, 'All Subcategories') AS subcategory,
    SUM(sales) AS total_sales,
    COUNT(*) AS product_count
FROM products
GROUP BY category, subcategory WITH ROLLUP;

-- GROUP BY with CUBE (all combinations)
SELECT 
    COALESCE(department, 'All') AS department,
    COALESCE(job_title, 'All') AS job_title,
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY CUBE(department, job_title);

-- GROUPING SETS (specific combinations)
SELECT 
    department,
    job_title,
    COUNT(*) AS count,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY GROUPING SETS (
    (department, job_title),
    (department),
    (job_title),
    ()
);

-- GROUP BY with FILTER (PostgreSQL)
SELECT 
    department,
    COUNT(*) AS total_employees,
    COUNT(*) FILTER (WHERE salary > 100000) AS high_earners,
    AVG(salary) FILTER (WHERE hire_date > '2020-01-01') AS avg_salary_new
FROM employees
GROUP BY department;

-- HAVING — filter groups after aggregation
SELECT 
    customer_id,
    COUNT(*) AS order_count,
    SUM(amount) AS total_spent,
    AVG(amount) AS avg_order
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 5 
   AND SUM(amount) > 1000
   AND AVG(amount) > 50;

-- GROUP_CONCAT / STRING_AGG (list values in group)
SELECT 
    department,
    COUNT(*) AS employee_count,
    GROUP_CONCAT(first_name ORDER BY salary DESC SEPARATOR ', ') AS top_earners,
    GROUP_CONCAT(DISTINCT job_title SEPARATOR ' | ') AS job_titles
FROM employees
GROUP BY department;

-- PostgreSQL version
SELECT 
    department,
    COUNT(*) AS employee_count,
    STRING_AGG(first_name, ', ' ORDER BY salary DESC) AS top_earners,
    STRING_AGG(DISTINCT job_title, ' | ') AS job_titles
FROM employees
GROUP BY department;

-- GROUP BY with JSON aggregation (MySQL)
SELECT 
    department,
    JSON_ARRAYAGG(first_name) AS employee_names,
    JSON_OBJECTAGG(employee_id, first_name) AS emp_map
FROM employees
GROUP BY department;

-- GROUP BY with conditional aggregation (pivot-like)
SELECT 
    YEAR(order_date) AS year,
    SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) AS completed_revenue,
    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending_revenue,
    SUM(CASE WHEN status = 'cancelled' THEN amount ELSE 0 END) AS cancelled_revenue
FROM orders
GROUP BY YEAR(order_date);

-- Group by date parts
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    WEEK(order_date) AS week_number,
    DAYNAME(order_date) AS day_name,
    COUNT(*) AS orders,
    SUM(amount) AS revenue
FROM orders
GROUP BY 
    DATE_FORMAT(order_date, '%Y-%m'),
    WEEK(order_date),
    DAYNAME(order_date);`
        }
      ]
    },
    {
      id: "ch2s3",
      title: "JOINs — All Types with Deep Examples",
      blocks: [
        {
          type: "text",
          content: "JOINs combine data from multiple tables. They are the heart of relational algebra. Most engineers know INNER JOIN well but struggle with the nuances of OUTER JOINs, SELF JOINs, and anti-join patterns."
        },
        {
          type: "table",
          headers: ["JOIN Type", "Returns", "Classic Use Case"],
          rows: [
            ["INNER JOIN", "Only rows where condition matches in BOTH tables", "Orders with their customer details"],
            ["LEFT (OUTER) JOIN", "ALL rows from left + matching right rows (NULL if no match)", "All customers, even those who never ordered"],
            ["RIGHT (OUTER) JOIN", "ALL rows from right + matching left (NULL if no match)", "Rare — rewrite as LEFT JOIN"],
            ["FULL OUTER JOIN", "ALL rows from BOTH tables (NULL on non-matching side)", "Find anomalies in BOTH directions"],
            ["CROSS JOIN", "Every row × every row (cartesian product)", "Generate all combinations: dates × products"],
            ["SELF JOIN", "Table joined to ITSELF using two aliases", "Org chart hierarchies"],
            ["ANTI JOIN", "Left rows with NO match in right (LEFT JOIN + IS NULL)", "Customers who never purchased"]
          ]
        },
        {
          type: "code",
          label: "INNER vs LEFT JOIN — The Critical Difference",
          code: `-- Sample Data:
-- customers: [1:Alice, 2:Bob, 3:Charlie]
-- orders:    [order 101: cust=1, order 102: cust=1, order 103: cust=2]

-- INNER JOIN: Only customers who have orders
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;
-- Result: Alice=2, Bob=1, Charlie is MISSING

-- LEFT JOIN: ALL customers, even those without orders
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;
-- Result: Alice=2, Bob=1, Charlie=0

-- ANTI-JOIN: Find customers who NEVER ordered
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.customer_id IS NULL;

-- Alternative using NOT EXISTS
SELECT c.name FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.id
);`
        },
        {
          type: "code",
          label: "SELF JOIN — Hierarchies and Row Comparisons",
          code: `-- SELF JOIN: same table, two different aliases

-- Org chart: find each employee's manager
SELECT
    e.name           AS employee,
    e.salary         AS emp_salary,
    m.name           AS manager,
    m.salary         AS mgr_salary
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.name;

-- Find all product pairs in the same category
SELECT a.name AS product_1, b.name AS product_2, a.category
FROM products a
JOIN products b
    ON a.category = b.category
    AND a.id < b.id
ORDER BY a.category;

-- Compare each day's revenue to the previous day
SELECT
    curr.date,
    curr.revenue,
    prev.revenue AS prev_revenue,
    curr.revenue - prev.revenue AS change
FROM daily_revenue curr
LEFT JOIN daily_revenue prev ON prev.date = curr.date - INTERVAL '1 day';`
        },
        {
          type: "code",
          label: "FULL OUTER JOIN & CROSS JOIN",
          code: `-- FULL OUTER JOIN: Find anomalies in both tables at once
SELECT
    CASE
        WHEN c.id IS NULL THEN 'Orphan Order — no customer exists!'
        WHEN o.id IS NULL THEN 'Customer has never ordered'
        ELSE 'Normal matched row'
    END AS status,
    c.name, o.order_id, o.amount
FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id
WHERE c.id IS NULL OR o.id IS NULL;

-- CROSS JOIN: Fill in zeros for missing date+product combinations
SELECT
    d.date,
    p.product_name,
    COALESCE(SUM(s.revenue), 0) AS daily_revenue
FROM (SELECT DISTINCT date FROM calendar) d
CROSS JOIN products p
LEFT JOIN sales s ON s.date = d.date AND s.product_id = p.id
GROUP BY d.date, p.product_name;`
        }
      ],
      quiz: [
        {
          q: "You LEFT JOIN customers (left) to orders (right). Customer Charlie has no orders. What appears for Charlie in results?",
          opts: [
            "Charlie is excluded from results",
            "Charlie appears with order columns showing NULL",
            "Charlie appears with order columns showing 0",
            "The query throws an error"
          ],
          correct: 1,
          exp: "LEFT JOIN KEEPS ALL ROWS from the LEFT table. When no match exists, columns from the right table are set to NULL."
        },
        {
          q: "What does an ANTI-JOIN return?",
          opts: [
            "All rows from both tables that DO match",
            "Only rows from the left table that have NO match in the right table",
            "A cartesian product of all rows",
            "Rows where the join condition produces NULL"
          ],
          correct: 1,
          exp: "Anti-join returns left-table rows with NO matching row in the right table. Implementation: LEFT JOIN ... WHERE right_table.key IS NULL."
        },
        {
          q: "CROSS JOIN between 100-row table and 50-row table produces how many rows?",
          opts: ["50 rows", "100 rows", "150 rows", "5,000 rows"],
          correct: 3,
          exp: "CROSS JOIN produces the CARTESIAN PRODUCT — every row from table 1 paired with every row from table 2. 100 × 50 = 5,000 rows."
        },
        {
          q: "In a SELF JOIN to find managers, how do you reference the same table twice?",
          opts: [
            "Create a duplicate table first",
            "Use two different aliases (e.g., 'e' and 'm')",
            "Use a subquery instead",
            "Use a RECURSIVE CTE"
          ],
          correct: 1,
          exp: "Self-joins use the same table with TWO DIFFERENT ALIASES: FROM employees e JOIN employees m ON e.manager_id = m.id"
        },
        {
          q: "When should you use FULL OUTER JOIN instead of LEFT JOIN?",
          opts: [
            "When you want better query performance",
            "When you need to find unmatched rows in BOTH tables simultaneously",
            "When joining more than two tables",
            "FULL OUTER is always better"
          ],
          correct: 1,
          exp: "Use FULL OUTER JOIN when you need anomalies in BOTH directions simultaneously — orphan orders AND customers with no orders in a single query."
        }
      ]
    },
    {
      id: "ch2s4",
      title: "Window Functions — The Analyst's Superpower",
      blocks: [
        {
          type: "info",
          label: "WINDOW vs GROUP BY — KEY DIFFERENCE",
          color: "#8b5cf6",
          content: "GROUP BY collapses rows: 1000 input rows → 10 output rows. Window functions PRESERVE all rows: 1000 input rows → 1000 output rows, each with a computed value based on its window."
        },
        {
          type: "code",
          label: "ROW_NUMBER, RANK, DENSE_RANK — With Examples",
          code: `-- Three ranking functions
SELECT
    name, dept, salary,
    ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn,
    RANK()       OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk,
    DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS drnk
FROM employees;

-- De-duplicate / get latest per group
WITH ranked AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY customer_id
            ORDER BY order_date DESC
        ) AS rn
    FROM orders
)
SELECT * FROM ranked WHERE rn = 1;

-- Top 3 products by revenue per category (ties included)
WITH ranked AS (
    SELECT *,
        DENSE_RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS dr
    FROM products
)
SELECT * FROM ranked WHERE dr <= 3;`
        },
        {
          type: "code",
          label: "LAG / LEAD — Period-over-Period Analysis",
          code: `-- LAG/LEAD for time series analysis
SELECT
    order_date,
    revenue,
    LAG(revenue, 1) OVER (ORDER BY order_date) AS prev_day_revenue,
    LEAD(revenue, 1) OVER (ORDER BY order_date) AS next_day_revenue,
    revenue - LAG(revenue, 1) OVER (ORDER BY order_date) AS daily_change,
    ROUND(
        (revenue - LAG(revenue, 1) OVER (ORDER BY order_date)) * 100.0 /
        NULLIF(LAG(revenue, 1) OVER (ORDER BY order_date), 0), 2
    ) AS pct_change,
    LAG(revenue, 365) OVER (ORDER BY order_date) AS same_day_last_year
FROM daily_revenue;

-- PARTITION BY with LAG
SELECT
    product_id, order_date, daily_units,
    LAG(daily_units) OVER (
        PARTITION BY product_id
        ORDER BY order_date
    ) AS prev_day_units
FROM daily_product_sales;`
        },
        {
          type: "code",
          label: "Frame Clauses — Running Totals & Moving Averages",
          code: `-- Running totals and moving averages
SELECT
    order_date,
    revenue,
    SUM(revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total,
    ROUND(AVG(revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 2) AS moving_avg_7d,
    MAX(revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS all_time_high,
    ROUND(revenue * 100.0 / SUM(revenue) OVER (), 2) AS pct_of_total,
    ROUND(revenue * 100.0 / SUM(revenue) OVER (
        PARTITION BY DATE_TRUNC('month', order_date)
    ), 2) AS pct_of_month
FROM daily_revenue;`
        }
      ],
      quiz: [
        {
          q: "An employee table has Alice ($150k), Bob ($140k), Charlie ($140k tie), Diana ($120k). DENSE_RANK() over salary DESC gives Diana what rank?",
          opts: ["Rank 3 (with gap)", "Rank 4", "Rank 3 (no gap)", "Rank 2"],
          correct: 2,
          exp: "DENSE_RANK(): Alice=1, Bob=2, Charlie=2, Diana=3. NO GAPS after ties."
        },
        {
          q: "LAG(revenue, 1) returns what value for the FIRST row in a partition?",
          opts: ["0", "The last row's revenue", "NULL", "An error"],
          correct: 2,
          exp: "For the FIRST row, there is no previous row — so LAG returns NULL by default."
        },
        {
          q: "What does ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW compute with SUM()?",
          opts: ["Sum of all rows", "7-day rolling sum", "Running total from first to current row", "Current row only"],
          correct: 2,
          exp: "This computes a RUNNING TOTAL that accumulates progressively from the first row through the current row."
        },
        {
          q: "You want exactly ONE most-recent order per customer. Which function is BEST?",
          opts: ["RANK()", "DENSE_RANK()", "ROW_NUMBER()", "MIN()"],
          correct: 2,
          exp: "ROW_NUMBER() guarantees EXACTLY ONE row gets rn=1 per partition (no ties possible)."
        },
        {
          q: "The difference between PARTITION BY and GROUP BY is:",
          opts: [
            "They are identical",
            "PARTITION BY preserves rows; GROUP BY collapses rows",
            "PARTITION BY is faster",
            "GROUP BY can use more functions"
          ],
          correct: 1,
          exp: "PARTITION BY defines windows WITHOUT removing rows — all original rows remain. GROUP BY COLLAPSES rows into one per group."
        }
      ]
    },
    {
      id: "ch2s5",
      title: "CTEs, Recursion & Query Optimization",
      blocks: [
        {
          type: "text",
          content: "CTEs (Common Table Expressions) transform complex nested SQL into readable, step-by-step logic. They let you build queries like intermediate variables in programming."
        },
        {
          type: "code",
          label: "CTEs — Building Complex Queries in Readable Steps",
          code: `-- Without CTEs: unreadable nested nightmare
SELECT customer_id, total FROM (
    SELECT customer_id, SUM(amount) AS total
    FROM (SELECT * FROM orders WHERE status = 'completed') completed
    GROUP BY customer_id HAVING SUM(amount) > 1000
) high_value;

-- WITH CTEs: same logic, completely readable
WITH
completed_orders AS (
    SELECT customer_id, amount, order_date
    FROM orders WHERE status = 'completed'
),
customer_totals AS (
    SELECT
        customer_id,
        SUM(amount) AS total_spend,
        COUNT(*) AS order_count
    FROM completed_orders GROUP BY customer_id
),
high_value AS (
    SELECT * FROM customer_totals WHERE total_spend > 1000
)
SELECT c.name, c.email, h.total_spend, h.order_count
FROM high_value h
JOIN customers c ON h.customer_id = c.id;

-- RECURSIVE CTE: Traverse org hierarchy
WITH RECURSIVE org AS (
    -- BASE: CEO (no manager)
    SELECT id, name, manager_id, 1 AS depth
    FROM employees WHERE manager_id IS NULL

    UNION ALL

    -- RECURSIVE: employees reporting to someone in org
    SELECT e.id, e.name, e.manager_id, o.depth+1
    FROM employees e JOIN org o ON e.manager_id = o.id
)
SELECT REPEAT('  ', depth-1) || '→ ' || name AS org_chart
FROM org;`
        },
        {
          type: "code",
          label: "Indexes — The Most Important Optimization Tool",
          code: `-- Without index: Full Table Scan — reads EVERY row
-- With index: Index Seek — jumps directly to matching rows

-- B-tree index (default, best for equality and range queries)
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- Composite index — ORDER MATTERS!
CREATE INDEX idx_orders_date_status ON orders(order_date, status);
-- ✓ Uses index: WHERE order_date = '2024-01-15' AND status = 'shipped'
-- ✓ Uses index: WHERE order_date = '2024-01-15'
-- ✗ CANNOT use: WHERE status = 'shipped' (non-leftmost column alone)

-- Partial index: only index rows meeting a condition
CREATE INDEX idx_pending ON orders(customer_id, created_at)
WHERE status = 'pending';

-- Covering index: query answered entirely from the index
CREATE INDEX idx_covering ON orders(customer_id)
INCLUDE (order_date, amount);  -- PostgreSQL

-- EXPLAIN ANALYZE: See exactly what the database is doing
EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, c.name FROM orders o JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2024-01-01' AND o.status = 'shipped';

-- Reading output:
-- "Seq Scan"        → BAD for large tables
-- "Index Scan"      → GOOD — using an index
-- "Index Only Scan" → BEST — never touches the table at all`
        }
      ],
      quiz: [
        {
          q: "What is the PRIMARY advantage of CTEs over nested subqueries?",
          opts: [
            "CTEs always execute faster",
            "CTEs make complex queries readable",
            "CTEs can access tables subqueries cannot",
            "CTEs automatically create indexes"
          ],
          correct: 1,
          exp: "The PRIMARY advantage of CTEs is READABILITY. They decompose complex queries into named logical steps."
        },
        {
          q: "For a composite index on (order_date, status), which WHERE clause CANNOT use this index?",
          opts: [
            "WHERE order_date = '2024-01-15' AND status = 'shipped'",
            "WHERE order_date = '2024-01-15'",
            "WHERE status = 'shipped'",
            "WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31'"
          ],
          correct: 2,
          exp: "Composite indexes use the LEFTMOST PREFIX RULE — cannot use when skipping the leftmost column."
        },
        {
          q: "A 'Covering Index' is special because:",
          opts: [
            "It covers all tables",
            "Query answered entirely from index without touching table",
            "It covers all columns",
            "It covers both reads and writes"
          ],
          correct: 1,
          exp: "A covering index allows 'Index Only Scan' — query answered entirely from index data without reading the actual table."
        },
        {
          q: "In a Recursive CTE, what does the UNION ALL connect?",
          opts: [
            "Two separate queries",
            "BASE CASE and RECURSIVE CASE",
            "Multiple CTEs",
            "CTE to final SELECT"
          ],
          correct: 1,
          exp: "UNION ALL connects the BASE CASE (starting rows) and the RECURSIVE CASE (rows that join back to the CTE itself)."
        },
        {
          q: "Why do indexes SLOW DOWN write operations?",
          opts: [
            "Index validation on reads",
            "Every INSERT/UPDATE/DELETE must update ALL indexes",
            "Indexes lock tables",
            "Indexes compress data"
          ],
          correct: 1,
          exp: "Every INSERT, UPDATE, or DELETE must update ALL indexes on that table to stay consistent."
        }
      ]
    }
  ]
};