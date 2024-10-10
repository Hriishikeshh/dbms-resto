# Restaurant Management System

This is a Restaurant Management System created to gain hands-on experience with Next.js and MySQL. The system manages various aspects of a restaurant, including user management and billing.

## Technologies Used
- **Next.js**: Frontend framework for server-side rendering and building React applications.
- **MySQL**: Relational database for data storage.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Prerequisites
- Node.js (version 16 or later)
- MySQL server

## Getting Started

Follow these steps to set up the project on your local machine:

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-folder>
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Download and install MySQL on your PC.

4. Open `connection.js` located in the `/pages` folder.

5. Add your MySQL credentials:
    ```js
    const connection = mysql.createConnection({
      host: 'your-database-host',
      user: 'your-username',
      password: 'your-password',
      database: 'your-database-name'
    });
    ```

6. Run the development server:
    ```sh
    npm run dev
    ```
