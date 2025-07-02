# Smart Team Collaboration + Retrospective Dashboard

A cloud-native, Slack-integrated collaboration tool for remote teams featuring realtime whiteboarding, AI-generated retrospectives, and team sentiment analytics.

## Features

- **Realtime Collaboration** (drawing, voting, brainstorming)
- **AI-powered Meeting Summaries, Action Items, Sentiment Analytics** (via GPT-4)
- **Exportable Retrospectives** (PDF, Slack notifications)
- **Role-based Access & Audit Logs**
- **DevOps**: CI/CD via GitHub Actions, Docker, Kubernetes-ready

## Tech Stack

- **Frontend**: React + Redux, WebSocket
- **Backend**: Node.js (TypeScript), WebSocket, PostgreSQL, Redis
- **AI**: OpenAI GPT-4 API
- **DevOps**: Docker, Kubernetes, GitHub Actions

## Development

### Prerequisites

- Node.js (v20+)
- Docker & Docker Compose
- PostgreSQL & Redis

### Local Setup

```bash
git clone https://github.com/<your-username>/smart-team-retro.git
cd smart-team-retro
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)

### Deployment

See [`k8s/deployment.yaml`](k8s/deployment.yaml) for Kubernetes deployment.

---