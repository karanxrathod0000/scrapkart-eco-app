# ScrapKart - Eco-Friendly Scrap Collection

ScrapKart is a modern web application designed to streamline the process of recycling. It connects users who want to sell their scrap materials with local collectors, promoting an eco-friendly and economically rewarding practice.

## Key Features

- **User Authentication:** Secure login/signup for users, collectors, and admins.
- **On-Demand Pickups:** Users can schedule scrap pickups at their convenience.
- **Real-Time Tracking:** Track the collector's location on a live map.
- **Instant Payments:** Seamless payment integration for on-the-spot transactions.
- **Role-Based Dashboards:** Tailored dashboards for users, collectors, and administrators.
- **Admin Panel:** Comprehensive tools for user management and platform analytics.
- **Collector Tools:** Route optimization and earnings tracking for collectors.
- **PWA Ready:** Installable on mobile devices for an app-like experience.

## Tech Stack

- **Frontend:** React, TypeScript
- **Backend & Database:** Firebase (Authentication, Firestore, Storage)
- **Mapping:** Leaflet.js
- **Charting:** Recharts
- **Payments:** Stripe

## Project Setup

Follow these steps to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A Firebase project. If you don't have one, create one at the [Firebase Console](https://console.firebase.google.com/).
- A Stripe account for payment processing.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd scrapkart
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Before running the application, you need to set up your environment variables.

1.  Create a file named `.env.local` in the root of the project.
2.  Copy the contents of the `.env` file into your new `.env.local` file.
3.  Replace the placeholder values with your actual Firebase project credentials and your Stripe public key. You can find your Firebase config in your Firebase project settings.

**Note:** The application's Firebase configuration file (`src/config/firebase.ts`) will need to be updated to read these environment variables (e.g., `import.meta.env.REACT_APP_API_KEY`) instead of using hardcoded placeholders.

## Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) (or a similar port) to view it in the browser.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run preview`: Serves the production build locally to preview it before deployment.

## Deployment to Firebase Hosting

This project is configured for easy deployment using Firebase Hosting.

1.  **Install Firebase CLI:**
    If you don't have it installed, run:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Log in to Firebase:**
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in your project:**
    If you are setting up for the first time:
    ```bash
    firebase init
    ```
    - When prompted, choose `Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys`.
    - Select `Use an existing project` and choose your Firebase project from the list.
    - For the public directory, enter `dist`.
    - When asked `Configure as a single-page app (rewrite all urls to /index.html)?`, answer `Yes`.
    - When asked `File dist/index.html already exists. Overwrite?`, answer `No`. This will use your existing settings.

4.  **Build the project:**
    Make sure you have your production environment variables set correctly before building.
    ```bash
    npm run build
    ```

5.  **Deploy to Firebase:**
    ```bash
    firebase deploy
    ```

After deployment, the CLI will provide you with the URL to your live application.
