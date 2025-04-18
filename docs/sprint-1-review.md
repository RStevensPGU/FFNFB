# Sprint 1 Review

## Sprint Summary:
Sprint 1 focused on building the foundational functionality for Friendly Foods’ check-in system, specifically supporting new visitor registration and returning visitor check-ins. The goal was to enforce the 7-day visit restriction while ensuring a smooth and user-friendly experience.

## Completed Work:
- Created registration form with validation for name and phone number
- Configured SQLExpress database and created users table
- Implemented API to store new user data with unique phone number constraint
- Developed check-in feature with last visit date logic
- Displayed appropriate messages based on eligibility to check in
- Logged check-ins with timestamp

## Demonstration:
The demo showcased the following functionality:
- A first-time visitor entering their name and phone number to register
- A successful check-in for a visitor who had not visited in 7+ days
- A returning visitor being shown a message stating how many days remain before they can return

## Feedback:
- Stakeholders were pleased with the simplicity and clarity of the check-in process.
- Requested future enhancements such as admin reporting tools and multi-language support.

## Velocity:
- Total Work Items Planned: 7  
- Work Items Completed: 7  
- Velocity: 7 story points (1 point per work item)

## Retrospective Notes:
**What went well:**
- Strong collaboration between front-end, back-end, and database teams
- Clear task breakdown and steady progress throughout sprint
- No major blockers

**What could improve:**
- Earlier QA involvement in test plan writing
- More detailed wireframes before development

**Action Items for Next Sprint:**
- Begin implementing admin access and reporting
- Add visitor history view for internal staff
- Include multilingual support exploration
