# 🚀 API Performance & Optimization Metrics

> **Purpose:** This document tracks the performance benchmarks of the NexusBlog API. It highlights the impact of Redis caching on Concurrency, Throughput, Request Per Second (RPS) and Latency. These metrics are excellent data points to include in a developer portfolio or resume.

## 🛠 Testing Methodology
- **Tool Used:** [autocannon](https://github.com/mcollina/autocannon)
- **Command:** `npx autocannon -c 100 -d 10 <API_URL>`
- **Concurrency:** 100 simultaneous connections
- **Duration:** 10 seconds per test

---

## 📊 Benchmark Results: Get Popular Posts (`GET /api/post/popular?limit=5&timeframe=day`)

## Command: npx autocannon -c 100 -d 10 http://localhost:5000/api/posts/popular?limit=5&timeframe=day

### Phase 1: Baseline (Unoptimized / No Redis)
*The raw performance of the endpoint relying entirely on PostgreSQL/Prisma without any caching.*

| Metric | Result |
| :--- | :--- |
| **Requests Per Second (RPS)** | `[17.2]` |
| **Average Latency** | `[5274.7 ms]` |
| **Total Requests Handled** | `[272 requests in 10s]` |
| **Errors / Timeouts** | `[0 Errors/Timeouts]` |

### Phase 2: With Redis Caching
*Performance after implementing Redis to serve the payload directly from memory on subsequent requests.*

| Metric | Result | Improvement % |
| :--- | :--- | :--- |
| **Requests Per Second (RPS)** | `[Enter RPS here]` | `[+X%]` |
| **Average Latency** | `[Enter ms here]` | `[-X%]` |

---

## 📈 Resume / Portfolio Talking Points
*Use these bullet points for your resume once your testing is complete:*

- **Performance Optimization:** Successfully identified database bottlenecks using `autocannon` and implemented compound indexing in PostgreSQL via Prisma, decreasing query latency by **[X]%**.
- **In-Memory Caching:** Integrated Redis to cache high-traffic read operations, resulting in a **[X]%** increase in Requests Per Second (RPS), scaling the API to handle over **[X,XXX]** concurrent requests.
- **Scalability Testing:** Designed and executed load testing strategies simulating high-concurrency environments to ensure production readiness.

---
*Note: Run your benchmarks locally on the same machine under similar conditions for the most accurate comparative data.*
