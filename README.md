# Recepto Assignment

A lead generation platform dashboard that shows curated high-intent leads from different sources.

## Features

- Dashboard with two types of leads (Recepto Network and Organization Network)
- Lead management with unlock, assign, like/dislike functionality
- Team analytics page with graphs for lead metrics
- Organization user management
- Persistent data using localStorage
- Consistent UI across multiple users from the same organization

## Login Information

The following credentials can be used to login to the application:

| Username | Password | Role |
|----------|----------|------|
| admin    | admin123 | Admin |
| user1    | pass123  | Manager |
| user2    | pass123  | Agent |

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open the application in your browser at `http://localhost:5173`

## Technologies Used

- React + Vite
- React Router
- Tailwind CSS
- Recharts for data visualization
- LocalStorage for data persistence

## Project Structure

```
src/
  components/       # Reusable UI components
  pages/            # Main application pages
  assets/           # Static assets and images
```

## Note

This is a frontend-only application with no backend. All data is stored in localStorage and will persist between sessions.
