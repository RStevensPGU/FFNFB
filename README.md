# Friendly Foods National Food Bank - Check-In App

## Overview

This web-based check-in application is designed for use at the entrance of the Friendly Foods National Food Bank. It ensures that customers only visit once every 7 days. Visitors can check in using their phone number, and new visitors can register.

The system tracks check-ins, prevents duplicate visits within a 7-day period, and supports a simple registration and check-in flow.

---

## Prerequisites

Before running the app, ensure that you have the following:

- **Microsoft SQL Server** (or SQL Server Express) installed.
- **SQL Server Management Studio (SSMS)** to manage the database.
- **Node.js** (if you're running a local development environment for the app).

---

## Setting Up the Database

### 1. Create the Database

To create the database and add initial test data, follow these steps:

1. Open **SQL Server Management Studio (SSMS)**.
2. Connect to your SQL Server instance (e.g., `localhost\SQLEXPRESS`).
3. Open a new query window.
4. Paste the contents of the `docs/create-database.sql` script.
5. Execute the script (Press **F5** or click **Execute**).

This will create the database `FriendlyFoodsDB`, with the necessary `Visitors` and `CheckIns` tables, and insert three test users.

### 2. Attach the Database

To attach the database manually, follow these steps:

1. In SSMS, right-click on **Databases**.
2. Click **Attach...**.
3. In the Attach Databases dialog, click **Add...**.
4. Browse to the location of the `FriendlyFoodsDB.mdf` file in your project (`db/attached/`) and select it.
5. Click **OK** to attach the database.

---

## Application Setup

1. **Clone the repository** or download the project files.
2. Open the project folder and ensure all dependencies are installed.
3. To run the app, open a terminal and navigate to the root directory.
4. Use the following command to install the required dependencies:
   ```bash
   npm install
