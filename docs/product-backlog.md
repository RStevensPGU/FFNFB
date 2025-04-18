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
