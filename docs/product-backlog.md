# Product Backlog – Sprint 1

## User Story 1: New Visitor Registration
**Work Items:**
- Design registration form (name and phone number fields)
- Set up database table for users
- Implement form validation
- Create user registration endpoint (API)
- Save new user to database
- Confirm success message display

## User Story 2: Returning Visitor Check-In
**Work Items:**
- Create check-in form (phone number input only)
- Set up database check for user existence
- Query most recent check-in date
- Calculate days since last visit
- Display appropriate message:
  - Allow check-in if > 7 days
  - Show message if not eligible
- Log check-in timestamp to database

# Product Backlog – Sprint 2

## User Story 3: Admin Login & Dashboard
**Work Items:**
- Display daily metrics in dashboard
- Implement 7-day chart using Chart.js
- Build search feature and display results
- Style admin dashboard for responsiveness

## User Story 4: Search Visitor History
**Work Items:**
- Build `/adminLogin.html` UI
- Create session-based login check

# Product Backlog - Sprint 3

### User Story 5: Prevent Check-in Within 7 Days  
**Work Items:**
- Track and calculate last visit vs. current date (1 pt)  
- Display message with remaining wait time if restricted (1 pt)

### User Story 6: Session Timeout / Auto-Logout  
**Work Items:**  
- Implement session timeout logic (1 pt)  
- Auto-redirect to login screen (1 pt)

# Product Backlog - Sprint 4

### User Story 7: Multilingual Support 
**Work Items:**
- Add language selector toggle (1 pt)  
- Translate key UI labels to Spanish (1 pt)

### User Story 8: Final UI Enhancement 
**Work Items:**  
- Finalize UI with mobile responsiveness (1 pt)
