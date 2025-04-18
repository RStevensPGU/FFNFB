# User Stories – Sprint 1

## User Story 1: New Visitor Registration
**As a** first-time visitor,  
**I want** to be able to register with my name and phone number,  
**So that** I can be added to the system and check in at the food bank.

### Acceptance Criteria:
- Registration form includes name and phone number.
- Phone number must be unique in the database.
- Successful registration confirms the user is added.

---

## User Story 2: Returning Visitor Check-In
**As a** returning visitor,  
**I want** to check in using my phone number,  
**So that** I can receive food assistance if I haven't visited in the past 7 days.

### Acceptance Criteria:
- System checks if phone number exists.
- If last check-in was more than 7 days ago, allow check-in.
- If user has already visited within the last 7 days, show a message:  
  “You may return in X days.”

---
