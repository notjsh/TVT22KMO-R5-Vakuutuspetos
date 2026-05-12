# R5-Vakuutuspetos

A React Native (Expo) mobile application for reporting and managing insurance claims. The app supports three user roles — **customer**, **broker**, and **admin** — and is backed by Firebase.

## Features

- **Customer**: Submit insurance claim reports with a title, category, damage value, description, and an optional photo
- **Broker**: View and process incoming claims filtered by their assigned category (Cars, Home & Property, or Other)
- **Admin**: Manage user roles (promote/demote users between customer, broker, and admin)
- **Messaging**: In-app messaging between customers and brokers
- **Authentication**: Email/password login and registration with Firebase Auth, with persistent sessions via AsyncStorage
- **Image upload**: Attach photos to claims using the device image library (Firebase Storage)

## User Roles

| Role | Description |
|------|-------------|
| Customer | Default role. Can submit and view own claims. |
| Broker | Assigned to a category (Cars / Home & Property / Other). Can view and respond to claims in their category. |
| Admin | Can view all users and change their roles. |

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native + Expo (~49) | Cross-platform mobile framework |
| Firebase Auth | User authentication |
| Cloud Firestore | Real-time database |
| Firebase Storage | Image/file storage |
| React Navigation (Stack + Bottom Tabs) | App navigation |
| Formik + Yup | Form management and validation |
| AsyncStorage | Local session persistence |
| Expo Image Picker | Camera / gallery access |

## Project Structure

```
├── App.js                  # Root component, navigation setup, auth state
├── app.json                # Expo configuration
├── Firebase/
│   └── Config.js           # Firebase initialization and exports
├── Helpers/
│   ├── AuthContext.js      # Auth context (sign-in, sign-out, role helpers)
│   └── Timestamp.js        # Firebase timestamp converter
├── navigation/
│   ├── AccInfoNavigation.js
│   ├── BrokerHomeNavigation.js
│   └── FeedNavigation.js
├── Views/                  # Screen components
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeSreen.js        # Customer home
│   ├── Lomake.js           # Claim submission form
│   ├── ListingDetailsScreen.js
│   ├── BrokerHome.js
│   ├── BrokerListingDetailsScreen.js
│   ├── BrokerMessages.js
│   ├── MessagesScreen.js
│   ├── AdminHome.js
│   ├── Account.js
│   ├── AccountInfo.js
│   ├── ChangePassword.js
│   ├── ContactInfo.js
│   ├── ReauthModal.js
│   └── modals/
│       └── TypeChangeModal.js
└── components/             # Reusable UI components
    ├── forms/              # Form components (AppForm, AppFormField, etc.)
    └── ...
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- A Firebase project with **Authentication**, **Firestore**, and **Storage** enabled

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TVT22KMO-R5-Vakuutuspetos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with your Firebase credentials:
   ```env
   EXPO_PUBLIC_API_KEY=your_api_key
   EXPO_PUBLIC_AUTH=your_auth_domain
   EXPO_PUBLIC_PROJECT_ID=your_project_id
   EXPO_PUBLIC_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

   Then scan the QR code with the [Expo Go](https://expo.dev/client) app, or press `a` for Android / `i` for iOS emulator.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Start on Android emulator/device |
| `npm run ios` | Start on iOS simulator/device |
| `npm run web` | Start in web browser |

## Claim Categories

- **Autot** – Vehicle insurance claims
- **Koti ja irtaimisto** – Home and personal property claims
- **Muu omaisuus** – Other property claims
