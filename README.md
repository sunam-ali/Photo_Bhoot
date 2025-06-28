# 📸 Photo Booth - Social Media Platform (React)

Welcome to **Photo Booth** — a social media platform built using **React** where users can register, log in, post photos, like and comment on others' posts, edit profiles, and view notifications


## 🚀 Features

### ✅ Authentication (JWT Based)
- Login & Registration using `/login` and `/register` routes
- JWT stored in `localStorage`
- Protected routes based on auth status

### ✅ Home Feed ("/")
- Load posts with pagination and infinite scroll
- If unauthenticated, show only 3-4 posts
- On scroll, show **Login/Register popup**
- View post details, like, comment, and share

### ✅ Post Features
- View post image, caption, likes, comments, timestamp
- **Truncated captions** with “Show More/Show Less”
- **Like** and **Comment** for authenticated users
- **Share** button copies post link to clipboard
- View all comments in **Post Details** page
- **Delete/Edit** comments (if user is the commenter)
- View list of users who liked a post

### ✅ Post Details Page
- Full view of post with all comments
- Option to like/comment from here
- Show **more posts by the author** under the post

### ✅ Profile Management
- View any user's profile with their posts
- View own profile with “Edit Profile” option
- Edit fields: Profile Picture, Website, Bio, Gender, Password
- Password strength meter with 4 color logic (Red, Orange, Yellow, Green)

### ✅ Navigation (Global)
- Side Navigation with routes: Home, Notification, Create, Profile
- Active link highlighting
- Hidden on `/login` and `/register` routes

### ✅ Notification Page
- Shows notifications for **likes** and **comments**
- Clicking notification navigates to related post details

### ✅ Create Post Page
- Upload image and write caption
- Validates both fields are filled
- Shows error/success dialogs

### ✅ Global Features
- Custom error/loading/success states
- Responsive and clean UI
- Follows best practices in file structure and state management

---

## 🛠️ Tech Stack

- **Frontend**: React
- **Styling**: Tailwind CSS
- **State Management**: useContext, useReducer, Custom Hooks
- **Routing**: React Router DOM
- **Auth**: JWT (Stored in localStorage)
- **API**: REST APIs (hosted locally at `http://localhost:3000`)


## 🔑 Environment Variables

Create a `.env` file at the root:

```env
VITE_SERVER_BASE_URL=http://localhost:3000
