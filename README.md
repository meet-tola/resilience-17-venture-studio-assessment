# Creator Card Microservice API

An exceptional, high-performance RESTful microservice API built for the **Resilience 17 Venture Studio 2026 Backend Assessment**. This service allows content creators to publish shareable profile cards featuring their links and service rates, supporting both public visibility and pin-protected private access controls.

---

## 🏗️ Architectural Overview & Design Patterns

This microservice is engineered on top of the custom Resilience 17 boilerplate architecture, adhering strictly to the required decoupled structural patterns:

* **FileSystem Core Router Engine**: Endpoints are modularly mapped under `endpoints/creator-cards/` and auto-scanned directly onto the root URL with zero versioning path overhead.
* **Encapsulated Service Layer**: All core business operations, transactional boundary rules, and nested payload evaluations live isolated within `services/creator-cards/`.
* **Centralized Message Domain Dictionary**: Hardcoded string literals are entirely eliminated. Validation and custom business errors are mapped to decoupled key-value registries inside `messages/`.
* **Custom ORM Schema Mappings**: Leverages the internal `@app-core/mongoose` wrapper engine to enforce indexing on query boundaries (`slug`, `creator_reference`) and transparently translates document `_id` configurations to outward-facing `id` structures during serialization transitions.

---

## 🛠️ Tech Stack & Key Core Modules

* **Runtime Environment:** Node.js (v22+)
* **Routing Framework:** Express.js (via internal framework server wrappers)
* **Database Persistent Layer:** MongoDB Atlas (via `@app-core/mongoose` custom wrapper)
* **Unique Identifier Generator:** ULID (Universally Unique Lexicographically Sortable Identifier)

---

## 🚀 Getting Started Locally

### 1. Environmental Prerequisites
Create a `.env` configuration file at your root directory by cloning the repository blueprint:
```bash
cp .env.example .env
