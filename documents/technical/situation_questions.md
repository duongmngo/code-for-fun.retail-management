# Technical Interview Questions & Answers

A collection of common technical questions and their answers for backend/frontend development.

> **Rule:** Each question should include code examples for **Java (Spring Boot)**, **NestJS**, **Express.js**, and **FastAPI (Python)** when applicable.

---

## Q1: If an API works in Postman but fails in the browser, what could be the issue?

**Answer:** This is usually due to environment differences between Postman and browsers.

### Common Causes:

| # | Cause | Explanation |
|---|-------|-------------|
| 1 | **CORS issue** (Most common) | Browser blocks cross-origin requests, Postman doesn't. Backend must allow frontend origin. |
| 2 | **Preflight (OPTIONS) not handled** | Browser sends an OPTIONS request first. If server doesn't allow it → request fails. |
| 3 | **Missing Headers** | `Authorization`, `Content-Type`, or custom headers may not be sent from frontend properly. |
| 4 | **Authentication issue** | Token or cookies may not be attached in browser request. |
| 5 | **HTTPS vs HTTP (Mixed Content)** | Browser blocks HTTP APIs when frontend is running on HTTPS. |
| 6 | **CSRF Protection** | Backend may require CSRF token for browser requests. |
| 7 | **Cookie / SameSite policy** | Browser enforces cookie security rules, Postman doesn't. |
| 8 | **Wrong API URL / Environment** | Frontend may be pointing to different environment. |

### How to Debug:

1. Open Browser DevTools → **Network tab**
2. Find the failing request
3. Compare request headers/body with Postman
4. Identify the difference
5. Fix backend (CORS config) or frontend (headers/auth)

### CORS Fix Examples:

#### Java (Spring Boot)

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

#### NestJS

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  await app.listen(3001);
}
bootstrap();
```

#### Express.js

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Or manual middleware:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
```

#### FastAPI (Python)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
```

---

## Q2: (Add your next question here)

**Answer:**

---
