```mermaid
classDiagram
    class User {
        <<Model>>
        +int id
        +string name
        +string email
        +string password
        +string role
        +timestamps created_at
        +timestamps updated_at
        +hasMany items
        +hasMany verifiedItems
    }

    class Item {
        <<Model>>
        +int id
        +int user_id
        +string title
        +string description
        +string type
        +string location
        +string status
        +string contact_info
        +string image_url
        +string verification_status
        +int verified_by
        +timestamps created_at
        +timestamps updated_at
        +belongsTo user
        +hasOne verifier
    }

    class AuthController {
        <<Controller>>
        +register()
        +login()
        +logout()
        +getCurrentUser()
    }

    class ItemController {
        <<Controller>>
        +index()
        +show()
        +store()
        +update()
        +destroy()
        +getMyItems()
        +getItemsForVerification()
        +verifyItem()
        +extractPublicIdFromUrl()
    }

    class CloudinaryService {
        <<Service>>
        -string cloudName
        -string apiKey
        -string apiSecret
        +uploadImage()
        +deleteImage()
    }

    class AuthService {
        <<Service>>
        +register()
        +login()
        +logout()
        +getCurrentUser()
    }

    class ItemService {
        <<Service>>
        +getItems()
        +getItemById()
        +createItem()
        +updateItem()
        +deleteItem()
        +getMyItems()
        +getAllItems()
        +getItemsForVerification()
        +verifyItem()
    }

    class AuthContext {
        <<Context>>
        -User user
        -bool loading
        +login()
        +register()
        +logout()
        +isAuthenticated()
    }

    class ItemForm {
        <<Component>>
        -formData
        -image
        -previewUrl
        +handleChange()
        +handleImageChange()
        +handleSubmit()
    }

    class Navbar {
        <<Component>>
        +render()
    }

    %% Relationships
    User ||--o{ Item : "owns"
    User ||--o{ Item : "verifies"
    AuthController ..> AuthService : "uses"
    ItemController ..> ItemService : "uses"
    ItemController ..> CloudinaryService : "uses"
    ItemForm ..> ItemService : "uses"
    Navbar ..> AuthContext : "uses"
    AuthContext ..> AuthService : "uses"
```