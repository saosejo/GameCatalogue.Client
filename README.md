# GameCatalogueClient
# VideoGames Full-Stack Application

## Overview
This repository contains the **VideoGames application**, including:

- **Backend API** built with ASP.NET Core  
- **Frontend client** built with Angular  

The application allows users to manage video games with full CRUD operations, search, filtering, and pagination.

---

## Technologies

**Backend:**
- .NET 8 / .NET 7 / .NET 6  
- C#  
- Entity Framework Core  
- xUnit + Moq + FluentAssertions for unit testing  

**Frontend:**
- Angular 16+  
- TypeScript  
- RxJS for reactive programming  
- SCSS / CSS for styling  

---

## Prerequisites

- Back end up and running in http://localhost:5017
- SQL Server LocalDB (already configured in backend connection string)  
- [Node.js](https://nodejs.org/) (v18+ recommended)  
- npm or yarn  
- Optional: Angular CLI  

---

## Getting Started

### Backend

1. **Clone the backend repository**

git clone <https://github.com/saosejo/GameCatalogue.Backend>
cd VideoGames.Backend

```bash
dotnet run
```

1. **Clone the repository**

git clone <https://github.com/saosejo/GameCatalogue.Client>
cd GameCatalogue.Client

```bash
npm install
```

```bash
ng serve
```

    -App runs on: http://localhost:4200

    -Communicates automatically with the backend API using environment configuration:
