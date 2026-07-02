# Heleani Animal Health 

A veterinary care system where users can schedule appointments with verified veterinarians and keep a full history of their visits, including diagnoses.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| ORM | Drizzle ORM |
| Database | PostgreSQL (Neon) |
| Authentication | JWT (JSON Web Tokens) |
| Validation | Zod |
| Password Hashing | bcrypt |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A [Neon](https://neon.tech) account with a PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ricardozsp1515-stack/HeleaniRepository.git
cd YOUR_REPO_NAME
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root of the project based on the example below:

```env
APP_STAGE=dev
PORT=3000
DATABASE_URL=postgresql://your_user:your_password@your_host/your_db?sslmode=require
JWT_SECRET=your_jwt_secret
```

4. Push the database schema to Neon:

```bash
npx drizzle-kit push
```

5. Seed the database with initial data (roles, default images, admin user):

```bash
npx tsx src/db/seeders/seeders.ts
```

6. Start the development server:

```bash
npm run dev
```

The server will be running at `http://localhost:3000`.

---

## Authentication

This API uses **Bearer Token** authentication. After logging in, include the token in the `Authorization` header of every protected request:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Roles

| Role | Description |
|---|---|
| `Regular` | Default role. Can manage their own pets and appointments. |
| `Veterinarian` | Verified veterinarian. Can view appointments and add diagnoses. |
| `admin` | Full access to all resources and user management. |

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive a JWT token | No |

---

### Users

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| `GET` | `/api/users` | Get all users | Yes | admin |
| `GET` | `/api/users/get_user` | Get authenticated user'data | Yes | any |
| `GET` | `/api/users/:id` | Get a user by ID | Yes | admin |
| `PUT` | `/api/users` | Update authenticated user's profile | Yes | Any |
| `PUT` | `/api/users/:id` | Update user profile by ID | Yes | admin |
| `DELETE` | `/api/users` | Delete own account | Yes | Any |
| `DELETE` | `/api/users/:id` | Delete any user by ID | Yes | admin |

---

### Pets

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| `GET` | `/api/pets` | Get authenticated user's pets | Yes | Any |
| `GET` | `/api/pets/:id` | Get other user's pets | Yes | Admin / Veterinarian |
| `GET` | `/api/pets/pet/:id` | Get a pet by ID | Yes | Any |
| `GET` | `/api/pets/name/:name` | Get a pets by name | Yes | Any |
| `POST` | `/api/pets` | Create a new pet | Yes | Any |
| `PUT` | `/api/pets/:id` | Update a pet | Yes | Any |
| `DELETE` | `/api/pets/:id` | Delete a pet | Yes | Any |

> Admins and veterinarians can pass `?user=uuid` to query parameters to access another user's pet.

---

### Veterinarians

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| `GET` | `/api/veterinarians` | Get all veterinarians | Yes | Any |
| `GET` | `/api/veterinarians/vets_name/:name` | Get veterinarian by name | Yes | Any |
| `GET` | `/api/veterinarians/vets_id/:id` | Get veterinarian by ID | Yes | Any |
| `GET` | `/api/veterinarians/vets_from_center/:id` | Get all vets from a center | Yes | Any |
| `POST` | `/api/veterinarians/requests` | Submit a request to become a vet | Yes | Any |
| `GET` | `/api/veterinarians/requests` | Get all pending vet requests | Yes | Admin |
| `PUT` | `/api/veterinarians/:id/approve` | Approve a vet request | Yes | Admin |
| `PUT` | `/api/veterinarians/:id/reject` | Reject a vet request | Yes | Admin |
| `GET` | `/api/veterinarians/processed` | Get processed requests (approved/rejected) | Yes | Any |

---

### Veterinary Centers

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| `GET` | `/api/centers` | Get all veterinary centers | Yes | Any |
| `GET` | `/api/centers/center_name/:name` | Get center by name | Yes | Any |
| `GET` | `/api/centers/center_id/:id` | Get center by ID | Yes | Any |
| `PUT` | `/api/centers/:id` | Update a center | Yes | Owner / Admin |
| `DELETE` | `/api/centers/:id` | Delete a center | Yes | Owner / Admin |
| `POST` | `/api/centers/requests` | Submit a request to create a center | Yes | Any |
| `GET` | `/api/centers/requests` | Get all pending center requests | Yes | Admin |
| `PUT` | `/api/centers/:id/approve` | Approve a center request | Yes | Admin |
| `PUT` | `/api/centers/:id/reject` | Reject a center request | Yes | Admin |
| `GET` | `/api/centers/processed` | Get processed center requests (approved/rejected) | Yes | Any |


---

### Appointments

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| `POST` | `/api/appointments` | Schedule a new appointment | Yes | Any |
| `GET` | `/api/appointments/user_pet/:id` | Get appointments for a specific pet | Yes | Any |
| `GET` | `/api/appointments/vet` | Get authenticated vet's appointments | Yes | Veterinarian |
| `PUT` | `/api/appointments/:id` | Update appointment and add diagnosis | Yes | Admin / Veterinarian |
| `DELETE` | `/api/appointments/:id` | Cancel an appointment | Yes | Owner / Admin |

---

### Comments

| Method | Endpoint | Description | Auth | Role |
|---|---|---|---|---|
| `POST` | `/api/comments` | Leave a comment on a vet or center | Yes | Any |
| `GET` | `/api/comments/vet/:id` | Get all comments for a veterinarian | Yes | Any |
| `GET` | `/api/comments/center/:id` | Get all comments for a center | Yes | Any |
| `PUT` | `/api/comments/:id` | Update a comment | Yes | Any |
| `DELETE` | `/api/comments/:id` | Delete a comment | Yes | Author / Admin |

---

## Project Structure

```
src/
├── controllers/        # Route handlers and business logic
├── db/
│   ├── schema/         # Drizzle table definitions
│   └── seeders/
|   └──  seeders.ts     # Database seed script
├── middleware/         # JWT validation, role authorization, body validation
├── routes/             # Express routers
└── server.ts           # App entry point
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `APP_STAGE` | Application environment (`dev` || `production` || `test`) |
| `PORT` | Port the server listens on |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |

---

## Authors

- **Johan Ricardo Zúniga Sánchez** — [johan.zunigasanchez@ucr.ac.cr]
- **Fiorella Rodríguez Salazar** — [fiorella.rodriguezsalazar@ucr.ac.cr]

---

## License

This project was developed as a university assignment for **Universidad de Costa Rica**, **Desarrollo de aplicaciones interactivas II TM-5100**, **3rd year**.
