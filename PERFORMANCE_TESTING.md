# 🚀 API Performance & Optimization Metrics

> **Purpose:** This document tracks the performance benchmarks of the NexusBlog API. It highlights the impact of Redis caching on Concurrency, Throughput, Request Per Second (RPS) and Latency. These metrics are excellent data points to include in a developer portfolio or resume.

## 🛠 Testing Methodology
- **Tool Used:** [autocannon](https://github.com/mcollina/autocannon)
- **Command:** `npx autocannon -c 100 -d 10 <API_URL>`
- **Concurrency:** 100 simultaneous connections
- **Duration:** 10 seconds per test

---

## 📊 Benchmark Results: Get All Posts (`GET /api/v1/post`) 

## Command: npx autocannon -c 100 -d 10 http://localhost:5000/api/posts

### Phase 1: Baseline (Unoptimized / No Redis)
*The raw performance of the endpoint relying entirely on PostgreSQL/Prisma without any caching.*

| Metric | Result |
| :--- | :--- |
| **Requests Per Second (RPS)** | `[40]` |
| **Average Latency** | `[2,426 ms (almost 2.5 seconds)]` |
| **Total Requests Handled** | `[500 (in 10 seconds)]` |
| **Errors / Timeouts** | `[0 errors/timeouts (Survived, but bottlenecked)]` |

### 🔍 Case Study: The "N+1 & Over-Fetching" Bottleneck
*Perfect for LinkedIn and Resume Discussions*

**The Problem (Why it was slow):**
During initial load testing of the `getAllPosts` API at 100 concurrent connections, the server struggled with an unacceptably low 40 RPS and 2.4s latency. 
The bottleneck was identified in the database layer. The ORM (Prisma) was executing heavy, sequential, relational queries. Specifically:
1. It was over-fetching raw data by `including` the entire comment payload for every single post just to display a comment count.
2. The primary `findMany` query and the pagination `count` query were being executed sequentially, blocking the event loop and wasting valuable I/O wait time.

**The Solution (How it was solved):**
1. **Parallel Execution:** Refactored the sequential `findMany` and `count` database calls into a non-blocking `Promise.all` array, drastically reducing raw execution time.
2. **Selective Querying:** Replaced the heavy relational `include` statement with a lean `select` object. Instead of fetching nested comment data, I utilized Prisma's `_count` aggregate feature to calculate relations at the SQL level.
3. **In-Memory Caching:** (Phase 2) Integrated Redis to intercept read-heavy operations, bypassing the database entirely for repeated requests.

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
