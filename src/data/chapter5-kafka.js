export const chapter5 = {
  id: "ch5",
  emoji: "🌊",
  title: "Apache Kafka & Event Streaming",
  color: "#f59e0b",
  sections: [
    {
      id: "ch5s1",
      title: "Kafka Architecture — Deep Dive",
      blocks: [
        {
          type: "text",
          content: "Apache Kafka is a distributed event streaming platform that handles trillions of events per day with sub-10ms latency. It powers real-time pipelines at Netflix, Uber, LinkedIn, and thousands of other companies."
        },
        {
          type: "text",
          content: "The fundamental insight: traditional message queues DELETE messages after consumption. Kafka RETAINS messages for a configurable period. This means multiple consumers can independently read the same stream at their own pace, and you can replay historical events."
        },
        {
          type: "table",
          headers: ["Concept", "What It Is", "Practical Implication"],
          rows: [
            ["Event/Message", "Record with: key, value, timestamp, headers", "Key determines partition. Same key → same partition → ordered processing"],
            ["Topic", "Named category of events. Append-only immutable log", "Like a DB table but events are never updated/deleted"],
            ["Partition", "Topic split into N ordered logs for parallelism", "More partitions = more parallelism"],
            ["Broker", "A Kafka server. Stores partitions on disk", "3 brokers minimum for production"],
            ["Replication Factor", "How many copies of each partition", "RF=3 survives 2 broker failures"],
            ["Consumer Group", "Multiple consumers sharing work", "Each partition → exactly ONE consumer"],
            ["Offset", "Sequential ID of a message in a partition", "Commit after processing = at-least-once"]
          ]
        },
        {
          type: "info",
          label: "DELIVERY SEMANTICS",
          color: "#f59e0b",
          content: "At-most-once: commit offset BEFORE processing — no duplicates but can lose messages. At-least-once: commit AFTER processing — might process duplicate on retry, but no data loss. Exactly-once: idempotent producers + transactions — the holy grail."
        },
        {
          type: "code",
          label: "Python Producer & Consumer — Production Implementation",
          code: `from confluent_kafka import Producer, Consumer, KafkaException
import json
from datetime import datetime

# PRODUCER
producer = Producer({
    'bootstrap.servers': 'kafka1:9092,kafka2:9092',
    'acks': 'all',
    'enable.idempotence': True,
    'retries': 5,
    'compression.type': 'snappy',
    'batch.size': 65536,
    'linger.ms': 5,
})

def delivery_report(err, msg):
    if err:
        print(f"Delivery FAILED: {err}")
    else:
        print(f"Delivered to [{msg.partition()}] @ offset {msg.offset()}")

for order in orders:
    producer.produce(
        topic='order-events',
        key=str(order['customer_id']).encode(),
        value=json.dumps(order).encode(),
        on_delivery=delivery_report
    )
    producer.poll(0)

producer.flush()

# CONSUMER
consumer = Consumer({
    'bootstrap.servers': 'kafka1:9092,kafka2:9092',
    'group.id': 'order-processor',
    'auto.offset.reset': 'earliest',
    'enable.auto.commit': False,
})

consumer.subscribe(['order-events'])

try:
    while True:
        messages = consumer.consume(num_messages=100, timeout=1.0)
        if not messages:
            continue
        for msg in messages:
            if msg.error():
                raise KafkaException(msg.error())
            order = json.loads(msg.value().decode())
            try:
                process_order(order)
            except Exception as e:
                # Dead Letter Queue
                producer.produce('order-events-dlq', value=msg.value())
                producer.flush()
        consumer.commit(asynchronous=False)
finally:
    consumer.close()`
        }
      ],
      quiz: [
        {
          q: "How does Kafka fundamentally differ from traditional message queues?",
          opts: [
            "Kafka is faster but less reliable",
            "Kafka RETAINS messages after consumption; traditional queues DELETE them",
            "Kafka only works with JSON",
            "Traditional queues support more consumers"
          ],
          correct: 1,
          exp: "Kafka RETAINS messages for a configurable period, allowing multiple independent consumer groups and replay of historical events."
        },
        {
          q: "What determines which Kafka partition a message is routed to?",
          opts: [
            "Broker with least load",
            "The message KEY via hash(key) % num_partitions",
            "Random selection",
            "Consumer group configuration"
          ],
          correct: 1,
          exp: "Kafka routes messages via hash(key) % num_partitions. Same key ALWAYS goes to the same partition."
        },
        {
          q: "'At-least-once delivery' in Kafka means:",
          opts: [
            "Exactly once guaranteed",
            "Messages might be delivered more than once but never lost",
            "Messages might be lost but never duplicated",
            "Messages are batched"
          ],
          correct: 1,
          exp: "At-least-once: commit offset AFTER processing. If consumer crashes after processing but before committing, it reprocesses the same message."
        },
        {
          q: "What is a Dead Letter Queue (DLQ) in event streaming?",
          opts: [
            "Encrypted messages topic",
            "Topic for repeatedly-failing messages for investigation",
            "Primary topic for critical events",
            "Internal Kafka maintenance topic"
          ],
          correct: 1,
          exp: "A DLQ is where messages that FAIL processing are sent for investigation instead of blocking the pipeline."
        },
        {
          q: "In Kafka's replication with RF=3, how many broker failures can the cluster survive?",
          opts: ["0", "1", "2", "3"],
          correct: 2,
          exp: "With Replication Factor=3, the cluster can survive N-1 = 2 broker failures — one broker still has complete copies."
        }
      ]
    }
  ]
};