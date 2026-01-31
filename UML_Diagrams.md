# UML Diagrams for Lost & Found Application

## Class Diagram

```mermaid
classDiagram
    class User {
        -int id
        -string name
        -string email
        -string password
        -string role
        -timestamp created_at
        -timestamp updated_at
        +bool isAdmin()
        +hasMany Item items()
    }

    class Item {
        -int id
        -int user_id
        -string title
        -text description
        -enum type (lost, found)
        -string location
        -enum status (pending, claimed, resolved)
        -string contact_info
        -timestamp created_at
        -timestamp updated_at
        +belongsTo User user()
    }

    class AuthController {
        +register(request)
        +login(request)
        +logout()
        +me()
    }

    class ItemController {
        +index(request)
        +store(request)
        +show(item)
        +update(request, item)
        +destroy(item)
        +myItems()
    }

    class AdminMiddleware {
        +handle(request, next)
    }

    User ||--o{ Item : "has many"
    AuthController ..> User : "uses"
    ItemController ..> Item : "uses"
    ItemController ..> User : "uses"
    AdminMiddleware ..> User : "checks"
```

## Use Case Diagram

```mermaid
graph TD
    A[User] --> B[Register Account]
    A --> C[Login]
    A --> D[View Items]
    A --> E[Filter Items]
    A --> F[Report Item]
    A --> G[View Own Items]
    A --> H[Update Own Item]
    A --> I[Delete Own Item]
    
    J[Admin] --> K[Manage All Items]
    J --> L[Update Any Item Status]
    J --> M[Delete Any Item]
    J --> N[View All Reports]
    
    B --> O[Authenticate]
    C --> O
    D --> O
    E --> O
    F --> O
    G --> O
    H --> O
    I --> O
    K --> O
    L --> O
    M --> O
    N --> O
    
    O --> P[Access Database]
    P --> Q[Store/Retrieve Data]
```

## Sequence Diagram - User Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Navigate to Register page
    Frontend->>User: Show registration form
    User->>Frontend: Submit registration form
    Frontend->>Backend: POST /api/auth/register
    Backend->>Database: Create new user
    Database-->>Backend: Return created user
    Backend-->>Frontend: Return success response
    Frontend-->>User: Redirect to dashboard/home
```

## Sequence Diagram - Item Reporting Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Navigate to Report Item page
    Frontend->>User: Show item form
    User->>Frontend: Submit item details
    Frontend->>Backend: POST /api/items (with auth token)
    Backend->>Database: Create new item with user_id
    Database-->>Backend: Return created item
    Backend-->>Frontend: Return success response
    Frontend-->>User: Redirect to My Items page
```

## Component Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend]
        B[Tailwind CSS]
    end
    
    subgraph "Server Layer"
        C[Laravel Backend]
        D[API Controllers]
        E[Authentication Service]
    end
    
    subgraph "Database Layer"
        F[MySQL Database]
        G[User Table]
        H[Item Table]
    end
    
    subgraph "Infrastructure"
        I[Docker]
        J[Docker Compose]
    end
    
    A --> C
    B --> A
    C --> F
    D --> C
    E --> C
    G --> F
    H --> F
    I --> A
    I --> C
    J --> I
```