# UX Reference Study — Indian On-Demand Service Marketplaces
*Internal SIH 2026 — SevaConnect UX Foundation Document*

## 1. Executive Summary & Core Principles
This document synthesizes structural UX, navigation, and state-communication patterns commonly observed in Indian on-demand service platforms (e.g., Urban Company, Housejoy, Timesaverz). SevaConnect adopts these functional heuristics—prioritizing clarity, low cognitive load, and instant trust for blue-collar services—while retaining its own distinct cooperative identity and clean visual design.

---

## 2. Customer Navigation Patterns
- **Top Context Bar**: Displays user's current detected/chosen locality (e.g., "Kothrud, Pune") prominently with quick change modal.
- **Search & Quick Categories**: Prominently situated at the top of the viewport with visual category chips (Plumbing, Electrical, Carpentry, Cleaning, Painting, Appliance Repair) below the search bar.
- **Emergency Action Utility**: Prominent one-tap emergency access button placed above the fold for critical breakdowns (water leakage, power outage, lock failure).
- **Bottom / Responsive Header Navigation**:
  - `Discover / Home`: Category browsing, search, top verified cooperative workers.
  - `My Bookings`: Active, upcoming, and past service requests.
  - `Profile / Help`: Personal contact details, saved addresses, cooperative helpline.

---

## 3. Worker Navigation Patterns
- **Operational Header**: High-contrast availability toggle (`Available for Work` vs. `Offline / Busy`) visible on every worker screen.
- **Action-Oriented Dashboard**:
  - `New Requests Tab`: Time-sensitive incoming service leads with clear distance, requirement, and action buttons (`Accept` / `Decline`).
  - `Active Job Card`: Persistent card at the top whenever a job is in progress with one-tap status updates (`Start Service` / `Complete`).
  - `Earnings & Welfare Hub`: Aggregated earnings, completed tasks, cooperative welfare fund balance, and certification badges.
  - `Profile & Verification`: KYC status tracker (`Pending`, `Verified`, `Rejected`) and service radius settings.

---

## 4. Booking-Flow Sequencing
1. **Category & Intent Selection**: User selects service type (e.g., "Plumber") or searches specific task ("tap repair").
2. **Worker Selection / FairMatch**: List of verified cooperative workers sorted by proximity, rating, and FairMatch workload distribution. Single "Recommended for you" badge indicates optimal match.
3. **Requirement Details & Slot**: Minimal input form:
   - Specific issue / requirement description.
   - Date & preferred time slot (Morning, Afternoon, Evening, or Urgent/Immediate).
   - Service location confirmation.
4. **Request Dispatch & Worker Acceptance**: Booking status enters `REQUESTED`. Worker reviews details and accepts (`ACCEPTED`).
5. **Service Execution**: Worker updates state to `IN_PROGRESS` upon arrival.
6. **Completion & Settlement**: Worker marks `COMPLETED` -> Customer receives payment breakdown -> Simulated Payment -> 5-Star Rating & Review.

---

## 5. Card & List Structural Patterns
- **Service Card**: Crisp rounded card with iconography, title, starting rate indication, and tap-to-explore trigger.
- **Worker Card**:
  - Avatar / Initials + Name.
  - Verification & Cooperative badge ("Verified Cooperative Member").
  - Primary skill tag, years of experience, average star rating + review count.
  - Proximity/distance indicator + "Request Service" CTA button.
  - *Zero sensitive government IDs exposed.*
- **Booking Card**:
  - Header: Service type + Booking ID + Timestamp.
  - Body: Worker name/photo, location, scheduled date/time.
  - Dynamic Footer: Context-sensitive action button based on current status (e.g., "Track", "Pay Now", "Rate Worker").

---

## 6. Status & Progress Patterns
- Standardized status lifecycle:
  - `REQUESTED` (Yellow/Amber badge: Pending worker response)
  - `ACCEPTED` (Blue badge: Worker confirmed & scheduled)
  - `IN_PROGRESS` (Purple badge: Worker on-site / service started)
  - `COMPLETED` (Green badge: Service finished, pending or completed payment)
  - `DECLINED` / `CANCELLED` (Red/Slate badge: Resolved or refunded)
- Step tracker / timeline visualization for live customer transparency.
