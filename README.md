# Project Overview

A wellness game that rewards you everytime you complete a challenge. When you earn enough points, you level up. When you level up, you can get weapons. Those weapons are stored in your inventory.

## Folder Structure
```
bed-ca1-p2500164-DAAA1B02
├──public/
|  ├──css/
|     ├── style.css
|  ├──js/
|     ├── challenges.js
|     ├── inventory.js
|     ├── loginUser.js
|     ├── players.js
|     ├── profile.js
|     ├── queryCmds.js
|     ├── registerUser.js
|     ├── userNavbarToggle.js
|     ├── weapons.js
|  ├── challenges.html
|  ├── index.html
|  ├── inventory.html
|  ├── login.html
|  ├── players.html
|  ├── profile.html
|  ├── register.html
|  ├── weapons.html
├── src/
│   ├── configs/            # Database initialization and schema setup scripts
│   │   ├── createSchema.js
│   │   └── initTables.js    # SQL table creation and seed data
│   ├── controllers/        # Request handling logic for each entity
│   │   ├── challengesController.js
│   │   ├── completionsController.js
│   │   ├── levelsController.js
│   │   ├── usersController.js
│   │   └── weaponsController.js
│   ├── middlewares/ 
|       ├── bcryptMiddleware.js
|       ├── jwtMiddleware.js
│   ├── models/             # Database queries and data schemas
│   │   ├── challengesModel.js
│   │   ├── completionsModel.js
│   │   ├── levelsModel.js
│   │   ├── usersModel.js
│   │   └── weaponsModel.js
│   ├── routes/             # API endpoint definitions
│   │   ├── challengesRoutes.js
│   │   ├── completionsRoutes.js
│   │   ├── levelsRoutes.js
│   │   ├── mainRoutes.js    # Entry point for all sub-routes
│   │   ├── usersRoutes.js
│   │   └── weaponsRoutes.js
│   ├── services/           # External service configurations (DB connection)
│   │   └── db.js
│   └── app.js              # Express application configuration
├── .env                    # Environment variables (DB credentials, etc.)
├── .gitignore              # Files to exclude from Git (node_modules, .env)
├── index.js                # Main entry point to start the server
├── package.json            # NPM dependencies and scripts
└── README.md               # Project documentation             
```

## Clone the Repository

1. Open Visual Studio Code (VSCode) on your local machine.

2. Click on the "Source Control" icon in the left sidebar (the icon looks like a branch).

3. Click on the "Clone Repository" button.

4. In the repository URL input field, enter `https://github.com/ST0503-BED/your-repository-name.git`.

5. Choose a local directory where you want to clone the repository.

6. Click on the "Clone" button to start the cloning process.

## Set Up the Environment

1. In the project root directory, create a new file named `.env`.

2. Open the `.env` file in a text editor.

3. Copy the following example environment variables into the `.env` file:

   ```plaintext
   DB_HOST="localhost"
   DB_USER="root"
   DB_PASSWORD="1234"
   DB_DATABASE="ca1"
   ```

   Update the values of the environment variables according to your MySQL database configuration.

## Install Dependencies

1. Open the terminal in VSCode by going to `View` > `Terminal` or using the shortcut `Ctrl + ``.

2. Navigate to the project root directory.

3. Install the required dependencies using npm:

   ```
   npm install
   ```

## Database Initialization

1. Make sure you have a MySQL database available for the mock test. Update the database configuration details in the `.env` file.

2. To initialize the database tables and populate them with sample data, open the terminal in VSCode and run the following command:

   ```
   npm run init_tables
   ```


