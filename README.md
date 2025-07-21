# Web Intern Project â€“ Order Management System

This is a full-stack web project that includes both backend (`order-api`) and frontend (`order-app`) components for managing orders.

## ðŸ“ Project Structure

```
project1/
â”œâ”€â”€ order-api/       # Backend - Node.js (Express)
â”œâ”€â”€ order-app/       # Frontend - React
```

---

## ðŸš€ Getting Started

### 1. Extract Project Files

Unzip both the `order-api` and `order-app` folders into a directory (e.g., `project1`).

---

## âš™ï¸ Backend Setup (`order-api`)

### 2. Configure Environment

Open `order-api` in VS Code and modify the `.env` file:

```env
DB_USER=root
DB_PASSWORD=your_mysql_password
```

### 3. Generate Hashed Password (For Admin User)

Create a new Node.js file with the following code to generate a bcrypt hash:

```js
const bcrypt = require('bcrypt');

const password = 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password:', hash);
});
```

Run it:

```bash
npm install bcrypt
node filename.js
```

Copy the hashed output for the next step.

### 4. Setup MySQL Database

1. Open MySQL Workbench.
2. Create a new database.
3. Run the SQL script from:

```
order-api/src/data/db.sql
```

### 5. Insert Admin User

Use the hashed password generated earlier:

```sql
INSERT INTO int_user (username, first_name, last_name, phone, email, password, role, status)
VALUES ('admin', 'Admin', 'User', '9876543210', 'admin@example.com',
'$2b$10$...your_generated_hash...', 'admin', 'A');
```

---

## ðŸ–¥ï¸ Run the Application

### 6. Start Backend

```bash
cd order-api
npm install
npm start
```

### 7. Start Frontend

```bash
cd order-app
npm install
npm start
```

Use **Google Chrome** for best compatibility.

---

## ðŸ” Admin Credentials

- **Username:** `admin`  
- **Password:** `admin123`

---

## ðŸ§¾ Notes

- Ensure MySQL is running locally.
- React and Node must be installed.
- Replace the default hash with your generated one for better security.