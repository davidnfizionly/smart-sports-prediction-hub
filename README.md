# **Smart Sports Prediction Hub – AI-Powered Insights for Global Competitions**

## 🎯 Project Overview

**Smart Sports Prediction Hub** is a containerized cloud platform that **collects, stores, and analyzes real-time sports statistics** from major global competitions (Champions League, NBA, top European leagues, etc.).

Its goal is to provide **AI-driven predictions** on:

- 🏆 **Likely winning teams** in major competitions.
- 👟 **Top individual performers** (Golden Boot, MVP, Pichichi, etc.).
- 📈 **Projected rankings** based on historical performance.

💡 Powered by GPT‑4, the AI doesn't just predict—it **explains the reasoning** based on trends, advanced stats, and context.

---

## 🧱 Technologies & AWS Stack

| Technology | Purpose |
|------------|---------|
| **Docker + ECS Fargate** | Containerized hosting for Collector API and frontend UI |
| **Amazon ECR** | Docker image registry |
| **Amazon Kinesis** | Real-time sports data streaming |
| **Amazon DynamoDB** | NoSQL storage for live player/team stats |
| **Amazon S3** | Data Lake for historical dataset archiving |
| **AWS Lambda** | Analytics, stat aggregation, and GPT-4 prediction engine |
| **API Gateway** | Secure REST API endpoint for the UI |
| **CloudWatch** | Logs, metrics, and monitoring |
| **OpenAI GPT‑4 API** | Generates textual predictions and insights |
|**CI/CD (GitHub Actions)**|
| **NBA-API&NBA-FOOTBALL** | 

---

## 🎮 How It Works

1. **Collector API (ECS Fargate)**:
   - Connects to external sports APIs (Football‑Data, API‑Football, SportsData.io).
   - Fetches match/player stats (goals, assists, rankings, etc.).
   - Sends real-time events to **Amazon Kinesis**.

2. **Kinesis Stream → Lambda Consumer**:
   - Consumes streaming events.
   - Stores in **DynamoDB** (live stats) and **S3** (history).

3. **Analytics Lambda (with GPT‑4)**:
   - Analyzes data (form, performance).
   - Calls **OpenAI GPT-4 API** to generate predictions like winners, MVPs, top scorers.

4. **API Gateway**:
   - Exposes `/getPredictions` and `/getStats` endpoints.

5. **UI (ECS Fargate)**:
   - Users select a competition or player.
   - Displays interactive charts, trends, and **AI predictions**.

6. **CI/CD (GitHub Actions)**:
   - Each update triggers Docker build → ECR push → ECS deploy.

---

## ✅ Why This Project Stands Out

- **Advanced AWS architecture**: real-time streaming, serverless, containers, CI/CD.
- **Integrated AI**: GPT-4 provides insightful, contextual predictions.
- **Real sports data**: fetched from public APIs via a complete pipeline.
- **Engaging user experience**: interactive UI with explainable AI insights.

---

## 🛠️ Development Phases

### ✅ Phase 1 – Frontend UI

- Built in **HTML/CSS/JS** with **Chart.js**.
- Interactive dropdowns for competition, season, awards.
- Dockerized and ready for ECS deployment.

### ✅ Phase 2 – Collector API

- Node.js microservice to fetch sports data.
- Unified JSON format `{ competition, team/player, stats, timestamp }`.
- Dockerized and deployed on ECS via ECR.

### ✅ Phase 3 – AWS Real-Time Pipeline

- Kinesis Data Stream (`SportsStatsStream`).
- Lambda consumer stores data in **DynamoDB** and archives in **S3**.

### ✅ Phase 4 – Analytics & Predictions

- Lambda analyzes stats and calls **OpenAI GPT‑4 API**.
- Returns predictions like `{ teams, players, aiPrediction }`.

### ✅ Phase 5 – API Gateway

- Exposes secure REST endpoint (`/getPredictions`, `/getStats`).
- Configured with proper CORS settings.

### ✅ Phase 6 – ECS Deployment

- Deployed UI and Collector API on ECS Fargate behind a Load Balancer.
- CI/CD via **GitHub Actions**: build, push, and deploy automated.

### ✅ Phase 7 – Monitoring & Optimization

- CloudWatch Logs for ECS, Lambda, and API Gateway.
- IAM roles optimized for least privilege.
- Kinesis usage tuned to stay in Free Tier.

### ✅ Phase 8 – Screenshots for Portfolio

Captured:
- ✅ UI showing AI predictions
- ✅ CloudWatch logs (Kinesis → Lambda)
- ✅ DynamoDB stats
- ✅ S3 historical datasets
- ✅ ECS service deployments
- ✅ API Gateway endpoints

### ✅ Phase 9 – AWS Resource Cleanup

- Deleted:
  - ECS services, ECR images, Kinesis stream
  - DynamoDB table, S3 buckets, API Gateway
  - All temporary IAM roles
- Verified Free Tier usage via Billing console

---

## 📸 Project Preview

![UI Screenshot](screenshots/smart-sports-ui.png)
![CloudWatch](screenshots/cloudwatch-logs.png)
![DynamoDB](screenshots/dynamodb-table.png)

---

## 📂 Folder Structure

```
Smart-Sports-Prediction-Hub/
│
├── collector-api/            # Node.js API to fetch live stats
├── smart-sports-ui/          # Static UI (HTML/CSS/JS)
├── Analytics-function/       # Lambda for prediction (GPT-4)
├── .github/workflows/        # GitHub Actions CI/CD
├── Dockerfile, .env, README.md, etc.
```

---

## 🧠 Built With Passion for Sports + AI + Cloud ☁️⚽🏀