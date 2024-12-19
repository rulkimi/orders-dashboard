## Getting Started

Follow the steps below to set up and run the project locally.

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js) or **yarn**

### Installation

1. **Clone the Repository**
   
   Clone this repository to your local machine:

   ```bash
   git clone https://github.com/rulkimi/orders-dashboard.git
   ```

2. **Install Dependencies**

   Navigate to the project directory and install the required dependencies:

   ```bash
   cd orders-dashboard
   npm install
   ```

3. **Set Up Fake API**

   Before running the development server, you need to set up a fake API using `json-server`:

   - Navigate to the `/fake-api` directory:

     ```bash
     cd fake-api
     ```

   - Start the `json-server` with the specified port (since the default port conflicts with Next.js):

     ```bash
     npx json-server db.json --port 8000
     ```

   This will serve the API at `http://localhost:8000`.

4. **Run the Development Server**

   Open a new terminal to the main project directory and start the development server:

   ```bash
   npm run dev
   ```

5. **View the Application**

   Open your browser and visit:

   ```
   http://localhost:3000
   ```

   You should see the application running.

## Project Structure

A brief overview of the project structure:

- `/fake-api`: Contains the `db.json` file and is used to mock a RESTful API with `json-server`.
- `/app`: Includes the main application pages for the Next.js app.
- `/components`: Contains reusable UI components.

## Notes

- Make sure the `json-server` is running on port 8000 before starting the Next.js server to avoid port conflicts.
- For any changes to the `db.json` file, restart the `json-server` to apply the updates.
- Making changes to the table data, e.g., the status, order details, or deleting the data, will result in change for `db.json`, and git will detect the changes. 

## Dependencies

- **Next.js**: Framework for server-side rendered React applications.
- **json-server**: Provides a full fake REST API with zero coding.

