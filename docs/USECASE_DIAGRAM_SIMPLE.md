# 🎭 PersonaForge Use Cases - Portrait Mode

```mermaid
graph TD
    %% Actors on the left side
    User["<b>👥 User</b><br/>Primary Actor"]
    AI["<b>🤖 AI System</b><br/>AI Services"]
    Admin["<b>👨‍💼 Admin</b><br/>System Admin"]

    %% Authentication Features
    subgraph AUTH["🔐 AUTHENTICATION"]
        UC1["🆕 Register"]
        UC2["🔑 Login"]
        UC3["🚪 Logout"]
    end

    %% Goal Management
    subgraph GOALS["🎯 GOAL MANAGEMENT"]
        UC5["➕ Create Goal"]
        UC6["📊 Track Progress"]
        UC7["✨ Complete Goal"]
    end

    %% Skills Tracking
    subgraph SKILLS["⭐ SKILLS"]
        UC8["➕ Add Skill"]
        UC9["📈 Track Skills"]
    end

    %% Habit Tracking
    subgraph HABITS["✅ HABITS"]
        UC10["➕ Create Habit"]
        UC11["✔️ Log Habit"]
        UC12["🔥 View Streak"]
    end

    %% Journal
    subgraph JOURNAL["📔 JOURNAL"]
        UC13["✍️ Write Entry"]
        UC14["📖 View Entries"]
    end

    %% Assessment
    subgraph ASSESS["📊 ASSESSMENT"]
        UC15["🧪 Take Test"]
        UC16["📋 View Results"]
    end

    %% Learning Paths
    subgraph LEARNING["📚 LEARNING"]
        UC17["📝 Create Path"]
        UC18["📌 Track Progress"]
    end

    %% AI Features
    subgraph AIFEATS["🤖 AI FEATURES"]
        UC19["💡 Recommendations"]
        UC20["💬 AI Chat"]
        UC21["🎯 Goal Suggestions"]
        UC22["📈 Analytics"]
        UC26["🧠 Insights"]
    end

    %% Settings & Admin
    subgraph SETTINGS["⚙️ SETTINGS"]
        UC24["👤 Edit Profile"]
        UC25["🔒 Privacy Settings"]
        UC23["🔔 Notifications"]
        UC27["💾 Export Data"]
    end

    %% User connections
    User -->|Access| AUTH
    User -->|Manage| GOALS
    User -->|Build| SKILLS
    User -->|Track| HABITS
    User -->|Record| JOURNAL
    User -->|Complete| ASSESS
    User -->|Follow| LEARNING
    User -->|Receive| AIFEATS
    User -->|Configure| SETTINGS

    %% AI System connections
    AI -->|Powers| UC19
    AI -->|Provides| UC20
    AI -->|Generates| UC21
    AI -->|Calculates| UC22
    AI -->|Analyzes| UC26

    %% Admin connections
    Admin -->|Oversee| UC25
    Admin -->|Enable| UC27

    %% Styling
    style User fill:#4CAF50,stroke:#2E7D32,stroke-width:3px,color:#fff
    style AI fill:#2196F3,stroke:#1565C0,stroke-width:3px,color:#fff
    style Admin fill:#FF9800,stroke:#E65100,stroke-width:3px,color:#fff
    
    style AUTH fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px,color:#000
    style GOALS fill:#E3F2FD,stroke:#2196F3,stroke-width:2px,color:#000
    style SKILLS fill:#FFF3E0,stroke:#FF9800,stroke-width:2px,color:#000
    style HABITS fill:#F3E5F5,stroke:#9C27B0,stroke-width:2px,color:#000
    style JOURNAL fill:#FCE4EC,stroke:#E91E63,stroke-width:2px,color:#000
    style ASSESS fill:#F1F8E9,stroke:#689F38,stroke-width:2px,color:#000
    style LEARNING fill:#E0F2F1,stroke:#009688,stroke-width:2px,color:#000
    style AIFEATS fill:#EDE7F6,stroke:#5E35B1,stroke-width:2px,color:#000
    style SETTINGS fill:#FFFDE7,stroke:#F9A825,stroke-width:2px,color:#000
```

## Use Case Summary

| Category | Use Cases | Description |
|----------|-----------|-------------|
| **Authentication** | Register, Login, Logout | User account management |
| **Goals** | Create, Track Progress, Complete | Goal lifecycle management |
| **Skills** | Add Skill, Track Skills | Skill inventory and tracking |
| **Habits** | Create, Log, View Streak | Habit formation and tracking |
| **Journal** | Write Entry, View Entries | Personal journaling |
| **Assessment** | Take Test, View Results | Personality assessment |
| **Learning** | Create Path, Track Progress | Learning path management |
| **AI Features** | Recommendations, Chat, Goal Suggestions, Analytics, Insights | AI-powered features |
| **Settings** | Edit Profile, Privacy, Notifications, Export Data | System and user management |

### Actors
- 👥 **User**: Main system user performing all features
- 🤖 **AI System**: Powers recommendation, chat, and analytics features
- 👨‍💼 **Admin**: Manages privacy settings and data export

### Key Relationships
- User creates and manages all personal data
- AI System provides intelligent recommendations
- All features feed data for AI-powered analytics
- Export and privacy controls managed by Admin
