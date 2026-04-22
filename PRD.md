# SAMAYRA | Luxury Fashion House
## Product Requirements Document (PRD)

### 1. Vision
To create a premium, high-end digital experience for a luxury fashion house that offers personalized style recommendations through modern web technologies and AI-driven insights (simulated).

### 2. User Personas
*   **Aparna (Style Enthusiast)**: Wants to find clothes that fit her specific body type without the trial-and-error of traditional shopping.
*   **Rohit (Gift Shopper)**: Looking for high-quality traditional or party wear for special occasions.

### 3. Core Features
#### Phase 1: Foundation (Completed)
*   **Visual Identity**: Minimalist, high-contrast UI with luxury typography.
*   **Category Navigation**: Easy access to Casuals, Traditionals, and Party Wear.
*   **Authentication**: Basic signup and login system to secure user data.

#### Phase 2: Personalization (Current)
*   **Fit Look Quiz**: An interactive questionnaire to determine the user's silhouette.
*   **AI Posture Analysis (Beta)**: Real-time camera feed to analyze posture (simulated confidence score).
*   **Personalized Collection**: The homepage and collection grid automatically highlight items based on the user's "Fit" profile.

#### Phase 3: Engagement (Planned)
*   **Lookbook Expansion**: Dynamic gallery with editorial-style fashion shoots.
*   **Profile Dashboard**: Users can view their fit history and saved styles.
*   **Cart & Checkout**: Full e-commerce functionality integration.

### 4. Technical Stack
*   **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Vanilla ES6).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Atlas).
*   **State Management**: LocalStorage for UI persistence, MongoDB for permanent record.

### 5. Missing Files & Roadmap (Todo)
#### Architecture Improvements
- [ ] **Backend Modularization**: Split `server.js` into `/routes` and `/controllers`.
- [ ] **Frontend Script Consolidation**: Move inline `<script>` logic to `frontend/js/app.js`.
- [ ] **Environment Seeding**: Create a script to seed initial fashion items into MongoDB.

#### New Features
- [ ] **`frontend/profile.html`**: A dedicated page for users to view their saved silhouette and recommended outfits.
- [ ] **`frontend/dashboard.html`**: Admin view to manage the collection grid.
- [ ] **Image Optimization Pipeling**: Script to compress high-res assets for faster loading.
