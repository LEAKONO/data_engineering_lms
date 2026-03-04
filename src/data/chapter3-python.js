export const chapter3 = {
  id: "ch3",
  emoji: "🐍",
  title: "Python for Data Engineering",
  color: "#10b981",
  sections: [
    {
      id: "ch3s1",
      title: "Python Fundamentals — Data Types & Structures",
      blocks: [
        {
          type: "info",
          label: "PYTHON CORE",
          color: "#10b981",
          content: "Python is an interpreted, dynamically-typed language. Everything in Python is an object. Understanding data structures and their methods is crucial for writing efficient data engineering code."
        },
        {
          type: "code",
          label: "Lists — Complete Reference",
          code: `# LISTS - Mutable, ordered sequences
# Creation
empty_list = []
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True, [1, 2]]
list_from_range = list(range(10))
list_from_string = list("hello")
list_comprehension = [x**2 for x in range(10)]

# Accessing elements
first = numbers[0]           # 1
last = numbers[-1]           # 5
sublist = numbers[1:4]       # [2, 3, 4]
step_slice = numbers[::2]    # [1, 3, 5]
reverse = numbers[::-1]      # [5, 4, 3, 2, 1]

# Adding elements
numbers.append(6)            # Add to end
numbers.insert(0, 0)         # Insert at index
numbers.extend([7, 8, 9])    # Add multiple
numbers += [10, 11]          # Same as extend

# Removing elements
last = numbers.pop()         # Remove and return last
first = numbers.pop(0)       # Remove and return index 0
numbers.remove(5)            # Remove first occurrence of value
del numbers[0]               # Delete by index
numbers.clear()              # Remove all elements

# Searching and counting
idx = numbers.index(3)       # Find index of first occurrence
count = numbers.count(2)     # Count occurrences
exists = 5 in numbers        # Check if exists

# Sorting and reversing
numbers.sort()               # Sort in-place (ascending)
numbers.sort(reverse=True)   # Sort descending
numbers.sort(key=len)        # Sort by length (for strings)
numbers.reverse()            # Reverse in-place
sorted_list = sorted(numbers) # Return new sorted list
sorted_desc = sorted(numbers, reverse=True)

# List operations
length = len(numbers)
maximum = max(numbers)
minimum = min(numbers)
total = sum(numbers)

# List comprehensions (advanced)
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
matrix = [[i+j for j in range(3)] for i in range(3)]
flattened = [num for row in matrix for num in row]
values = [x if x > 0 else 0 for x in [-2, -1, 0, 1, 2]]

# Zip and enumerate
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
pairs = list(zip(names, ages))
for idx, name in enumerate(names):
    print(f"{idx}: {name}")

# Advanced list methods
from collections import deque
d = deque([1, 2, 3])
d.appendleft(0)              # Add to beginning
d.popleft()                  # Remove from beginning

# Copying lists
shallow_copy = numbers.copy()
deep_copy = numbers[:]
import copy
deep_copy = copy.deepcopy(matrix)

# List as stack (LIFO)
stack = []
stack.append(1)              # push
stack.append(2)              # push
top = stack.pop()            # pop -> 2

# List as queue (FIFO) - use deque
queue = deque()
queue.append(1)              # enqueue
queue.append(2)              # enqueue
first = queue.popleft()      # dequeue -> 1

# List multiplication and repetition
zeros = [0] * 10
repeated = [1,2,3] * 3

# List slicing assignment
numbers = [1, 2, 3, 4, 5]
numbers[1:3] = [20, 30]       # [1,20,30,4,5]
numbers[1:4] = []             # Remove slice
numbers[1:1] = [2,3,4]        # Insert at position

# Functional programming with lists
from functools import reduce
numbers = [1,2,3,4,5]
squared = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
product = reduce(lambda x,y: x*y, numbers)`
        },
        {
          type: "code",
          label: "Tuples — Complete Reference",
          code: `# TUPLES - Immutable, ordered sequences
# Creation
empty_tuple = ()
single_item = (1,)                    # Note the comma
numbers = (1, 2, 3, 4, 5)
mixed = (1, "hello", 3.14, True)
from_list = tuple([1, 2, 3, 4, 5])
from_string = tuple("hello")

# Accessing
first = numbers[0]                     # 1
last = numbers[-1]                     # 5
slice_tuple = numbers[1:4]              # (2, 3, 4)
exists = 3 in numbers                   # True

# Tuple operations
length = len(numbers)
count = numbers.count(2)                # Count occurrences
index = numbers.index(3)                # Find first index

# Concatenation and repetition
tuple1 = (1, 2, 3)
tuple2 = (4, 5, 6)
combined = tuple1 + tuple2
repeated = tuple1 * 3

# Unpacking
a, b, c = (1, 2, 3)
first, *rest = (1, 2, 3, 4, 5)
*start, last = (1, 2, 3, 4, 5)
first, *middle, last = (1,2,3,4,5)

# Swapping variables (tuple unpacking)
a, b = b, a

# Multiple return values
def get_user():
    return (1, "Alice", "alice@email.com")

user_id, name, email = get_user()

# Named tuples
from collections import namedtuple

Point = namedtuple('Point', ['x', 'y'])
Person = namedtuple('Person', 'name age city')

p = Point(10, 20)
person = Person('Alice', 30, 'NYC')

x = p.x                                  # 10
y = p[1]                                 # 20

p_dict = p._asdict()                     # {'x': 10, 'y': 20}
p2 = p._replace(x=100)                   # Point(x=100, y=20)

# Make from dict
data = {'name': 'Bob', 'age': 25, 'city': 'LA'}
person2 = Person(**data)

# Named tuple with defaults (Python 3.6+)
from typing import NamedTuple

class Employee(NamedTuple):
    id: int
    name: str
    salary: float = 0.0
    department: str = 'Unknown'

emp = Employee(1, 'Alice')  # salary=0.0, department='Unknown'

# Use cases for tuples
# 1. Immutable data (coordinates, database records)
def get_user():
    return (1, "Alice", "alice@email.com")

# 2. Dictionary keys (lists can't be keys)
cache = {}
cache[(1, 2)] = "result"

# 3. Database rows
rows = [
    (1, "Alice", 50000),
    (2, "Bob", 60000),
    (3, "Charlie", 55000)
]

# 4. Swapping variables
a, b = b, a

# 5. Multiple return values
def min_max(numbers):
    return min(numbers), max(numbers)`
        },
        {
          type: "code",
          label: "Sets — Complete Reference",
          code: `# SETS - Unordered collections of unique elements
# Creation
empty_set = set()
numbers = {1, 2, 3, 4, 5}
mixed = {1, "hello", 3.14, True}
from_list = set([1, 2, 2, 3, 3, 4])  # {1, 2, 3, 4}
set_comprehension = {x**2 for x in range(10)}

# Adding elements
numbers.add(6)               # Add single element
numbers.update([7, 8, 9])    # Add multiple elements
numbers.update({10, 11}, [12, 13])

# Removing elements
numbers.remove(5)            # Remove - raises KeyError if missing
numbers.discard(10)          # Discard - no error if missing
popped = numbers.pop()       # Remove and return arbitrary element
numbers.clear()              # Remove all elements

# Set operations
set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}

# Union - all elements from both sets
union = set1 | set2
union = set1.union(set2)

# Intersection - elements in both sets
intersection = set1 & set2
intersection = set1.intersection(set2)

# Difference - elements in set1 but not in set2
difference = set1 - set2
difference = set1.difference(set2)

# Symmetric difference - elements in either but not both
sym_diff = set1 ^ set2
sym_diff = set1.symmetric_difference(set2)

# Subset/Superset checks
is_subset = set1.issubset(set2)
is_superset = set1.issuperset({1, 2})
is_disjoint = set1.isdisjoint({6, 7})

# Set comparisons
are_equal = set1 == set2
is_in = 3 in set1

# Immutable sets (frozenset)
frozen = frozenset([1, 2, 3, 4, 5])
# frozen.add(6)  # AttributeError

# Practical applications
# Remove duplicates from list
unique = list(set([1, 2, 2, 3, 3, 4, 4, 5]))

# Find common elements between lists
common = set(list1) & set(list2)

# Find unique elements in each list
unique_to_list1 = set(list1) - set(list2)
unique_to_list2 = set(list2) - set(list1)

# Check if all elements are unique
has_duplicates = len(list1) != len(set(list1))

# Count unique elements
unique_count = len(set(list1))

# Set operations with list of dicts
data = [{'id': 1}, {'id': 2}, {'id': 1}]
unique_data = {d['id'] for d in data}  # {1, 2}`
        },
        {
          type: "code",
          label: "Dictionaries — Complete Reference",
          code: `# DICTIONARIES - Key-value pairs
# Creation
empty_dict = {}
person = {
    'name': 'Alice',
    'age': 30,
    'city': 'New York',
    'skills': ['Python', 'SQL', 'Spark']
}
from_tuples = dict([('name', 'Bob'), ('age', 25), ('city', 'LA')])
from_keys = dict.fromkeys(['a', 'b', 'c'], 0)
dict_comprehension = {x: x**2 for x in range(5)}
zip_to_dict = dict(zip(['a', 'b', 'c'], [1, 2, 3]))

# Accessing elements
name = person['name']               # Raises KeyError if missing
age = person.get('age')              # Returns None if missing
city = person.get('city', 'Unknown') # Default if missing
exists = 'name' in person            # Check key exists

# Adding/Updating elements
person['email'] = 'alice@email.com'  # Add new key
person['age'] = 31                    # Update existing
person.update({'phone': '123-4567', 'age': 32})

# Removing elements
age = person.pop('age')               # Remove and return value
last_item = person.popitem()          # Remove and return last (key,value)
del person['city']                    # Delete by key
person.clear()                        # Remove all items

# Dictionary views
keys = person.keys()                   # dict_keys view
values = person.values()               # dict_values view
items = person.items()                 # dict_items view

# Iteration
for key in person:
    print(f"{key}: {person[key]}")

for key, value in person.items():
    print(f"{key}: {value}")

for value in person.values():
    print(value)

# Merging dictionaries (Python 3.9+)
dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}
merged = dict1 | dict2                  # {'a': 1, 'b': 3, 'c': 4}
merged = {**dict1, **dict2}             # Same (Python 3.5+)

# Nested dictionaries
users = {
    'alice': {
        'age': 30,
        'email': 'alice@email.com',
        'address': {
            'city': 'NYC',
            'zip': '10001'
        }
    },
    'bob': {
        'age': 25,
        'email': 'bob@email.com',
        'address': {
            'city': 'LA',
            'zip': '90001'
        }
    }
}

# Safe nested access
city = users.get('alice', {}).get('address', {}).get('city', 'Unknown')

# Dictionary comprehensions
squares = {x: x**2 for x in range(10)}
even_squares = {x: x**2 for x in range(20) if x % 2 == 0}
inverted = {v: k for k, v in original.items()}
filtered = {k: v for k, v in data.items() if v > threshold}

# Default dictionaries
from collections import defaultdict

word_count = defaultdict(int)           # Default 0 for missing keys
for word in words:
    word_count[word] += 1

group_by_first = defaultdict(list)      # Default empty list
for word in words:
    group_by_first[word[0]].append(word)

# Counter - specialized dictionary for counting
from collections import Counter
counter = Counter(['a', 'b', 'a', 'c', 'b', 'a'])
# Counter({'a': 3, 'b': 2, 'c': 1})
most_common = counter.most_common(2)    # [('a', 3), ('b', 2)]

# Dictionary as cache/memoization
cache = {}
def expensive_function(x):
    if x not in cache:
        cache[x] = x * x  # Simulate expensive computation
    return cache[x]

# Dictionary for switch/case simulation
def process_command(command, data):
    handlers = {
        'create': lambda d: f"Creating {d}",
        'update': lambda d: f"Updating {d}",
        'delete': lambda d: f"Deleting {d}",
        'read': lambda d: f"Reading {d}"
    }
    handler = handlers.get(command, lambda d: f"Unknown command: {command}")
    return handler(data)

# Grouping data
from itertools import groupby
data = [{'name': 'Alice', 'dept': 'Eng'}, 
        {'name': 'Bob', 'dept': 'Eng'},
        {'name': 'Charlie', 'dept': 'Sales'}]
grouped = {}
for item in data:
    grouped.setdefault(item['dept'], []).append(item['name'])`
        },
        {
          type: "code",
          label: "Functional Programming — Map, Filter, Reduce",
          code: `# MAP - Apply function to every item
numbers = [1, 2, 3, 4, 5]

# With lambda
squared = list(map(lambda x: x**2, numbers))        # [1,4,9,16,25]

# With named function
def double(x):
    return x * 2
doubled = list(map(double, numbers))                 # [2,4,6,8,10]

# With multiple iterables
a = [1, 2, 3]
b = [4, 5, 6]
sums = list(map(lambda x, y: x + y, a, b))          # [5,7,9]

# With methods
words = ['hello', 'world', 'python']
uppercase = list(map(str.upper, words))              # ['HELLO','WORLD','PYTHON']

# With None (identity function)
str_numbers = ['1', '2', '3', '4', '5']
int_numbers = list(map(int, str_numbers))            # [1,2,3,4,5]

# FILTER - Keep items where function returns True
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# With lambda
evens = list(filter(lambda x: x % 2 == 0, numbers))  # [2,4,6,8,10]

# With None (remove falsy values)
mixed = [0, 1, False, 2, '', 3, None, 4]
truthy = list(filter(None, mixed))                   # [1,2,3,4]

# With custom function
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

primes = list(filter(is_prime, range(50)))

# Filter on complex objects
users = [
    {'name': 'Alice', 'age': 30, 'active': True},
    {'name': 'Bob', 'age': 25, 'active': False},
    {'name': 'Charlie', 'age': 35, 'active': True},
]

active_users = list(filter(lambda u: u['active'], users))

# REDUCE - Accumulate results (from functools)
from functools import reduce

numbers = [1, 2, 3, 4, 5]

# Sum
total = reduce(lambda acc, x: acc + x, numbers)     # 15
total_with_initial = reduce(lambda acc, x: acc + x, numbers, 10)  # 25

# Product
product = reduce(lambda acc, x: acc * x, numbers)   # 120

# Max
maximum = reduce(lambda acc, x: x if x > acc else acc, numbers)

# Min
minimum = reduce(lambda acc, x: x if x < acc else acc, numbers)

# String concatenation
words = ['Hello', 'World', 'from', 'Python']
sentence = reduce(lambda acc, w: acc + ' ' + w, words)

# Advanced reduce examples
# Flatten list of lists
lists = [[1, 2], [3, 4, 5], [6]]
flattened = reduce(lambda acc, lst: acc + lst, lists, [])

# Group by key
pairs = [('a', 1), ('b', 2), ('a', 3), ('c', 4), ('b', 5)]

def group_by(acc, pair):
    key, value = pair
    acc[key] = acc.get(key, []) + [value]
    return acc

grouped = reduce(group_by, pairs, {})

# COMBINING MAP, FILTER, REDUCE
numbers = range(1, 21)

# Find sum of squares of even numbers
result = reduce(
    lambda acc, x: acc + x,
    map(lambda x: x**2,
        filter(lambda x: x % 2 == 0, numbers)
    )
)

# Using list comprehension (more readable)
result = sum(x**2 for x in numbers if x % 2 == 0)`
        }
      ],
      quiz: [
        {
          q: "What is the time complexity of checking if an item exists in a Python list?",
          opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correct: 2,
          exp: "List lookup is O(n) because it requires scanning through the list until the item is found."
        },
        {
          q: "What is the difference between list.append() and list.extend()?",
          opts: [
            "They do the same thing",
            "append() adds a single element, extend() adds each element from an iterable",
            "append() is faster than extend()",
            "extend() only works with tuples"
          ],
          correct: 1,
          exp: "append() adds its argument as a single element. extend() iterates through its argument and adds each element to the list."
        },
        {
          q: "What makes tuples different from lists?",
          opts: [
            "Tuples are faster",
            "Tuples are immutable",
            "Tuples use less memory",
            "All of the above"
          ],
          correct: 3,
          exp: "Tuples are immutable, which makes them faster, use less memory, and hashable (can be used as dictionary keys)."
        },
        {
          q: "What does defaultdict(int) do?",
          opts: [
            "Creates a dict with integer keys",
            "Returns 0 for missing keys instead of raising KeyError",
            "Only allows integer values",
            "Sorts the dictionary by keys"
          ],
          correct: 1,
          exp: "defaultdict(int) returns 0 (the default for int()) when accessing a missing key, instead of raising KeyError."
        },
        {
          q: "What does filter(None, list) do?",
          opts: [
            "Returns an empty list",
            "Removes all None values",
            "Removes all falsy values (None, False, 0, '', etc.)",
            "Raises an error"
          ],
          correct: 2,
          exp: "filter(None, iterable) removes all falsy values: None, False, 0, empty strings, empty collections."
        }
      ]
    },
    {
      id: "ch3s2",
      title: "File Handling & I/O Operations",
      blocks: [
        {
          type: "info",
          label: "FILE HANDLING BASICS",
          color: "#10b981",
          content: "File handling is crucial for ETL pipelines. Python provides built-in functions for reading/writing files, working with different formats, and handling large files efficiently."
        },
        {
          type: "code",
          label: "File Operations — Complete Guide",
          code: `# Basic file operations
# Writing to a file
with open('output.txt', 'w') as f:
    f.write('Hello, World!\\n')
    f.write('Second line\\n')

# Reading entire file
with open('input.txt', 'r') as f:
    content = f.read()
    print(content)

# Reading line by line (memory efficient for large files)
with open('large_file.txt', 'r') as f:
    for line in f:
        process_line(line.strip())

# Reading all lines into list
with open('input.txt', 'r') as f:
    lines = f.readlines()

# Reading with size limit
with open('large_file.txt', 'r') as f:
    while True:
        chunk = f.read(8192)  # Read 8KB at a time
        if not chunk:
            break
        process_chunk(chunk)

# File modes
# 'r' - read (default)
# 'w' - write (overwrites)
# 'a' - append
# 'x' - exclusive creation (fails if exists)
# 'b' - binary mode (rb, wb)
# '+' - read and write (r+, w+, a+)

# Binary files
with open('image.jpg', 'rb') as f:
    binary_data = f.read()

with open('output.jpg', 'wb') as f:
    f.write(binary_data)

# Working with encodings
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()

with open('file.txt', 'w', encoding='utf-8-sig') as f:
    f.write('Unicode text')

# File positioning
with open('file.txt', 'r') as f:
    print(f.tell())  # Current position
    f.seek(10)       # Move to byte 10
    f.seek(0, 2)     # Move to end

# CSV files
import csv

# Writing CSV
data = [
    ['Name', 'Age', 'City'],
    ['Alice', 30, 'New York'],
    ['Bob', 25, 'Los Angeles'],
]

with open('people.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data)

# Reading CSV
with open('people.csv', 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)

# CSV with DictWriter/DictReader
with open('people.csv', 'w', newline='') as f:
    fieldnames = ['Name', 'Age', 'City']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow({'Name': 'Alice', 'Age': 30, 'City': 'NYC'})

with open('people.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row['Name'], row['Age'])

# JSON files
import json

data = {
    'name': 'Alice',
    'age': 30,
    'city': 'New York',
    'skills': ['Python', 'SQL', 'Spark'],
    'active': True
}

# Writing JSON
with open('data.json', 'w') as f:
    json.dump(data, f, indent=2)

# Reading JSON
with open('data.json', 'r') as f:
    loaded = json.load(f)

# JSON Lines (each line is a JSON object)
with open('data.jsonl', 'w') as f:
    for item in items:
        f.write(json.dumps(item) + '\\n')

with open('data.jsonl', 'r') as f:
    for line in f:
        item = json.loads(line)
        process(item)

# YAML files
import yaml

config = {
    'database': {
        'host': 'localhost',
        'port': 5432,
        'name': 'mydb'
    }
}

with open('config.yaml', 'w') as f:
    yaml.dump(config, f, default_flow_style=False)

with open('config.yaml', 'r') as f:
    config = yaml.safe_load(f)

# XML files
import xml.etree.ElementTree as ET

tree = ET.parse('data.xml')
root = tree.getroot()
for child in root:
    print(child.tag, child.attrib)

# Working with paths
import os
from pathlib import Path

# Old way (os.path)
if os.path.exists('file.txt'):
    size = os.path.getsize('file.txt')
    join = os.path.join('dir', 'subdir', 'file.txt')

# New way (pathlib) - recommended
path = Path('file.txt')
if path.exists():
    size = path.stat().st_size
    name = path.name
    stem = path.stem
    suffix = path.suffix

# Directory operations
for file in Path('.').glob('*.txt'):
    print(file)

for file in Path('.').rglob('*.py'):
    print(file)

Path('new/dir/structure').mkdir(parents=True, exist_ok=True)

# Temp files
import tempfile

with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=True) as f:
    f.write('temporary data')
    f.flush()
    # Use f.name to get filename

with tempfile.TemporaryDirectory() as tmpdir:
    temp_path = Path(tmpdir) / 'file.txt'
    temp_path.write_text('data')

# Compression
import gzip
import zipfile

# GZIP
with gzip.open('file.txt.gz', 'wt') as f:
    f.write('compressed content')

with gzip.open('file.txt.gz', 'rt') as f:
    content = f.read()

# ZIP
with zipfile.ZipFile('archive.zip', 'w') as zipf:
    zipf.write('file1.txt')
    zipf.writestr('data.txt', 'string content')

with zipfile.ZipFile('archive.zip', 'r') as zipf:
    zipf.extractall('output_dir')`
        }
      ],
      quiz: [
        {
          q: "What does the 'with' statement do when opening files?",
          opts: [
            "Makes the file read-only",
            "Automatically closes the file after the block",
            "Increases read speed",
            "Encrypts the file"
          ],
          correct: 1,
          exp: "The 'with' statement ensures the file is properly closed after the block executes, even if an exception occurs."
        },
        {
          q: "What's the difference between 'r+' and 'a+' file modes?",
          opts: [
            "They are identical",
            "r+ starts at beginning, a+ starts at end for writing",
            "r+ is read-only, a+ is append-only",
            "r+ works with text, a+ with binary"
          ],
          correct: 1,
          exp: "r+ opens for reading and writing at the beginning. a+ opens for reading and appending at the end."
        },
        {
          q: "Why use Pathlib over os.path?",
          opts: [
            "Pathlib is faster",
            "Pathlib provides an object-oriented interface and is more readable",
            "os.path is deprecated",
            "Pathlib works on all operating systems"
          ],
          correct: 1,
          exp: "Pathlib provides an object-oriented interface that's more intuitive and readable than os.path functions."
        },
        {
          q: "What is JSON Lines format (.jsonl)?",
          opts: [
            "JSON with line numbers",
            "Each line is a separate JSON object, good for streaming",
            "Minified JSON without spaces",
            "JSON with line breaks"
          ],
          correct: 1,
          exp: "JSON Lines has one JSON object per line, making it ideal for streaming and processing large files line by line."
        },
        {
          q: "What does csv.DictReader() return?",
          opts: [
            "A list of dictionaries",
            "An iterator of dictionaries with column names as keys",
            "A dictionary of rows",
            "A CSV reader object"
          ],
          correct: 1,
          exp: "DictReader returns an iterator that yields dictionaries, where keys are the column headers from the first row."
        }
      ]
    },
    {
      id: "ch3s3",
      title: "Pandas — Complete Reference",
      blocks: [
        {
          type: "text",
          content: "Pandas is the workhorse of data manipulation in Python. Built on NumPy, it provides the DataFrame — an in-memory table with SQL-like operations and Python flexibility."
        },
        {
          type: "info",
          label: "PERFORMANCE RULES",
          color: "#10b981",
          content: "1. Avoid Python loops on DataFrames — use vectorized operations. 2. Use proper dtypes. 3. Read only needed columns. 4. Prefer Parquet over CSV. 5. Use .query() for readable filtering."
        },
        {
          type: "code",
          label: "Loading & Inspecting Data — Best Practices",
          code: `import pandas as pd
import numpy as np

# Reading Data
df = pd.read_csv('orders.csv',
    dtype={
        'order_id': 'int32',
        'customer_id': 'int32',
        'amount': 'float32',
        'region': 'category',
    },
    parse_dates=['order_date', 'shipped_date'],
    usecols=['order_id', 'customer_id', 'amount', 'region', 'order_date'],
    na_values=['N/A', 'null', '', 'NULL'],
)

# Prefer Parquet over CSV
df = pd.read_parquet('data.parquet', columns=['order_id', 'amount'])
df = pd.read_json('events.jsonl', lines=True)

# Essential Inspection
df.shape
df.dtypes
df.info()
df.describe()
df.head(5)
df.sample(10, random_state=42)

# Data Quality Checks
null_stats = pd.DataFrame({
    'null_count': df.isnull().sum(),
    'null_pct': (df.isnull().sum() / len(df) * 100).round(2)
})
print(null_stats[null_stats.null_count > 0])

print(f"Duplicates: {df.duplicated().sum():,}")

for col in df.select_dtypes('object').columns:
    print(f"\\n{col}: {df[col].nunique()} unique values")
    print(df[col].value_counts().head(5))`
        },
        {
          type: "code",
          label: "Transformations, Filtering & Aggregations",
          code: `# Filtering
high_value = df[df['amount'] > 1000]
us_eu = df[df['region'].isin(['US', 'EU', 'APAC'])]
recent = df[df['order_date'] >= '2024-01-01']
result = df.query("region == 'US' and amount > 500")

# Creating Columns
df['tax_amount'] = df['amount'] * 0.15
df['total'] = df['amount'] + df['tax_amount']
df['year'] = df['order_date'].dt.year
df['month'] = df['order_date'].dt.month
df['day_of_week'] = df['order_date'].dt.day_name()
df['days_since'] = (pd.Timestamp.now() - df['order_date']).dt.days

# Conditional column (SQL CASE WHEN)
df['segment'] = np.where(df['amount'] > 1000, 'VIP', 'Standard')

# Multiple conditions
conditions = [df['amount'] > 1000, df['amount'] > 500, df['amount'] > 100]
choices = ['Platinum', 'Gold', 'Silver']
df['tier'] = np.select(conditions, choices, default='Bronze')

# Map dictionary values
status_map = {'P': 'Pending', 'S': 'Shipped', 'C': 'Cancelled'}
df['status_label'] = df['status_code'].map(status_map)

# Aggregations (SQL GROUP BY)
summary = df.groupby(['region', 'year']).agg(
    total_revenue=('amount', 'sum'),
    avg_order_value=('amount', 'mean'),
    order_count=('order_id', 'count'),
    unique_customers=('customer_id', 'nunique'),
    p95_amount=('amount', lambda x: x.quantile(0.95))
).reset_index()

# Transform (SQL window functions)
df['region_avg'] = df.groupby('region')['amount'].transform('mean')
df['pct_of_region'] = df['amount'] / df.groupby('region')['amount'].transform('sum')
df['rank_in_region'] = df.groupby('region')['amount'].rank(ascending=False)`
        }
      ],
      quiz: [
        {
          q: "Why use 'usecols' when reading a large CSV file?",
          opts: [
            "Reads file in parallel",
            "Only specified columns are loaded — saving memory and time",
            "Automatically detects data types",
            "Enables faster writing"
          ],
          correct: 1,
          exp: "usecols loads only the specified columns, reducing memory usage and I/O time proportionally to skipped columns."
        },
        {
          q: "Difference between .agg() and .transform() after groupby?",
          opts: [
            "agg is faster, transform more accurate",
            "agg collapses rows, transform preserves rows",
            "transform only for numeric",
            "They produce identical results"
          ],
          correct: 1,
          exp: "agg() COLLAPSES to one row per group. transform() PRESERVES all rows, adding group-level values to each row."
        },
        {
          q: "Which method handles multiple CASE WHEN conditions?",
          opts: [
            "np.where()",
            "np.select(conditions, choices, default)",
            "pd.cut()",
            "df.map()"
          ],
          correct: 1,
          exp: "np.select handles MULTIPLE conditions with multiple corresponding values — equivalent to SQL CASE WHEN."
        },
        {
          q: "Why use 'category' dtype for low-cardinality strings?",
          opts: [
            "More operations supported",
            "Stores unique values once with integer codes — reduces memory",
            "Faster sorting",
            "Required for groupby"
          ],
          correct: 1,
          exp: "Category dtype stores unique strings once and uses integer codes per row, dramatically reducing memory for repeated values."
        },
        {
          q: "pd.to_numeric(col, errors='coerce') vs pd.to_numeric(col)?",
          opts: [
            "coerce is faster",
            "errors='coerce' converts invalid values to NaN instead of crashing",
            "Same for well-formatted data only",
            "Automatically fixes typos"
          ],
          correct: 1,
          exp: "errors='coerce' converts invalid values to NaN instead of crashing, allowing graceful handling of bad data."
        }
      ]
    },
    {
      id: "ch3s4",
      title: "Production ETL — Patterns & Best Practices",
      blocks: [
        {
          type: "text",
          content: "Writing ETL that runs reliably in production requires: proper error handling, structured logging, retry logic, idempotency, and alerting."
        },
        {
          type: "info",
          label: "THE THREE LAWS OF PRODUCTION ETL",
          color: "#10b981",
          content: "1. IDEMPOTENT: Running twice produces same result as once. 2. OBSERVABLE: Log everything with timestamps. 3. RECOVERABLE: Resume from failures without data loss."
        },
        {
          type: "code",
          label: "Complete Production ETL with Logging, Retry & Idempotency",
          code: `import pandas as pd
import requests
import logging
import time
import os
from datetime import datetime, timedelta
from functools import wraps
from sqlalchemy import create_engine, text

# Structured Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[logging.StreamHandler(), logging.FileHandler('pipeline.log')]
)
log = logging.getLogger('etl.orders')

# Retry Decorator
def retry(max_attempts=3, exceptions=(Exception,), backoff=2):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts:
                        log.error(f"{func.__name__} failed after {max_attempts} attempts: {e}")
                        raise
                    wait = backoff ** (attempt - 1)
                    log.warning(f"Attempt {attempt} failed. Retrying in {wait}s... {e}")
                    time.sleep(wait)
        return wrapper
    return decorator

# EXTRACT
@retry(max_attempts=3, exceptions=(requests.RequestException,))
def extract(start_date: str, api_key: str) -> pd.DataFrame:
    log.info(f"Extracting orders from {start_date}")
    resp = requests.get(
        'https://api.example.com/orders',
        headers={'Authorization': f'Bearer {api_key}'},
        params={'from': start_date, 'limit': 10_000},
        timeout=30
    )
    resp.raise_for_status()
    df = pd.DataFrame(resp.json()['results'])
    log.info(f"Extracted {len(df):,} records")
    return df

# TRANSFORM
def transform(df: pd.DataFrame) -> pd.DataFrame:
    original = len(df)
    log.info(f"Transforming {original:,} raw rows")

    df['order_id'] = pd.to_numeric(df['order_id'], errors='coerce')
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')

    before_dedup = len(df)
    df = df.drop_duplicates(subset=['order_id'])
    if (dropped := before_dedup - len(df)) > 0:
        log.warning(f"Dropped {dropped:,} duplicate order_ids")

    df = df.dropna(subset=['order_id', 'amount'])
    invalid = df[df['amount'] <= 0]
    if len(invalid) > 0:
        log.warning(f"Dropping {len(invalid):,} non-positive amounts")
        df = df[df['amount'] > 0]

    # Alert if too many rows dropped
    drop_rate = (original - len(df)) / original
    if drop_rate > 0.10:
        log.error(f"QUALITY ALERT: Dropped {drop_rate:.1%} of rows!")

    df['_loaded_at'] = datetime.utcnow()
    log.info(f"Transform done: {len(df):,} clean rows")
    return df

# LOAD (IDEMPOTENT upsert)
def load(df: pd.DataFrame, table: str, engine, key_cols: list):
    log.info(f"Loading {len(df):,} rows to {table}")
    df.to_sql(f"{table}_staging", engine, if_exists='replace', index=False)
    with engine.begin() as conn:
        conn.execute(text(f"""
            INSERT INTO {table} SELECT * FROM {table}_staging
            ON CONFLICT ({', '.join(key_cols)}) DO UPDATE SET
                amount = EXCLUDED.amount,
                _loaded_at = EXCLUDED._loaded_at;
        """))
    log.info("Load complete ✓")

if __name__ == '__main__':
    engine = create_engine(os.environ['DATABASE_URL'])
    yesterday = (datetime.utcnow() - timedelta(days=1)).strftime('%Y-%m-%d')
    raw = extract(yesterday, os.environ['API_KEY'])
    clean = transform(raw)
    load(clean, 'fact_orders', engine, key_cols=['order_id'])`
        }
      ],
      quiz: [
        {
          q: "What does 'idempotency' mean for ETL pipelines?",
          opts: [
            "Runs exactly once per day",
            "Running multiple times produces same result as once",
            "Auto-scales with data volume",
            "Runs in parallel"
          ],
          correct: 1,
          exp: "Idempotent pipelines produce the same final state whether run once or ten times. Achieved via UPSERT/MERGE."
        },
        {
          q: "Why never hardcode database credentials in ETL scripts?",
          opts: [
            "Makes code less readable",
            "Credentials get committed to git and can't be rotated",
            "Python can't use string literals",
            "Style preference only"
          ],
          correct: 1,
          exp: "Hardcoded credentials are a security vulnerability: they get committed to git, visible to all, and can't be easily rotated."
        },
        {
          q: "What is exponential backoff in retry logic?",
          opts: [
            "Speeds up retries exponentially",
            "Waits progressively longer between retries (1s, 2s, 4s)",
            "Retries with larger batch sizes",
            "Compresses data during retry"
          ],
          correct: 1,
          exp: "Exponential backoff waits LONGER between each retry to avoid overwhelming a struggling service."
        },
        {
          q: "Why load to staging table before merging?",
          opts: [
            "Staging is faster",
            "If load fails mid-way, target table is untouched. Can validate staging data before committing",
            "Required by all databases",
            "Reduces storage costs"
          ],
          correct: 1,
          exp: "Staging provides atomicity: if bulk load fails, target table is untouched. You can also validate staging data before final merge."
        },
        {
          q: "What does the @retry decorator provide that a try/except loop cannot?",
          opts: [
            "Faster execution",
            "Reusable retry logic applied to any function without duplicating loop code",
            "Handles more exception types",
            "Built-in logging"
          ],
          correct: 1,
          exp: "The @retry decorator provides REUSABILITY — write retry logic once and apply to any function with a single line."
        }
      ]
    }
  ]
};