# FinanceFusion

FinanceFusion is a powerful, AI-driven finance management web application that allows users to track their expenses, incomes, and manage their finances with ease. Built with Next.js, Prisma, and OpenAI's GPT-3.5 Turbo model, this app provides an intelligent chatbot assistant that can answer financial queries and provide personalized advice.

## Features

- **AI Chatbot**: Interact with an AI assistant to get insights and answers related to your finances.
- **Expense & Income Tracking**: Keep track of your income and expenses with simple data management.
- **Financial Reports**: Generate monthly reports on income, expenses, and special payments.
- **User Management**: Manage and organize user data securely.
- **Calendar Integration**: Set reminders for special payments and recurring expenses.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered (SSR) web applications.
- **Prisma**: An ORM for managing the database, ensuring smooth interaction between the backend and the database.
- **OpenAI GPT-3.5**: Used to power the chatbot assistant and handle natural language processing.
- **MongoDB**: A NoSQL database used for storing and managing user data.
- **Tailwind CSS**: A utility-first CSS framework used for styling the app.

## Setup Instructions

### Prerequisites

- **Node.js**: Install the latest version of Node.js (LTS recommended).
- **MongoDB**: You can use a local MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting.
- **Prisma**: Install Prisma CLI to manage the database schema and migrations.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YourUsername/FinanceFusion.git
   cd FinanceFusion
   
2.Install the required dependencies:

npm install

3.Set up your environment variables. Create a .env file in the root directory with the following:

NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
DATABASE_URL="your-database-url"

4.Run Prisma migrations to set up your database schema:

npx prisma migrate dev

5.Start the development server:

npm run dev
Open your browser and navigate to http://localhost:3000 to start using the application.

### Contributing
We welcome contributions to FinanceFusion. If you'd like to contribute, please follow these steps:

1.Fork the repository.

2.Create a new branch for your changes.

3.Commit your changes with a descriptive commit message.

4.Push to your forked repository.

5.Open a pull request with a clear description of the changes.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments
Next.js for providing the framework.

Prisma for the ORM and database management.

OpenAI for GPT-3.5, powering the intelligent assistant.

Tailwind CSS for making styling easy and efficient.

### Contact
For any queries or feedback, feel free to contact me:

Email: buddhikaroshanofficial@gmail.com

GitHub: BuddhikaRoshan

👥 Team Members
Bandara L.P.B.R. (IT22564122)

Udesha S.M.S. (IT22586902)

Niwanthika M.A.H. (IT22570758)

Liyanahetti L.H.R.S.D. (IT22592088)

🚀 Project Goals
Build a Comprehensive Financial Assistant: Develop an AI-powered chatbot that can answer user questions related to their personal finances and provide useful insights and recommendations.

Provide Seamless Expense and Income Tracking: Allow users to easily input and track their income and expenses over time, with the ability to categorize entries and generate detailed reports.

Enhance Financial Awareness: Help users become more aware of their financial situation by providing them with key metrics such as monthly income, expenses, savings, and more.

Create User-Centric Reports: Implement features to generate user-friendly reports that summarize income, expenses, special payments, and more.

Ensure Secure Data Management: Make use of industry-standard security practices to keep users' financial data safe, with an easy-to-use authentication and authorization system.

Enable Future Expansion: Allow for easy integration with other financial tools and services to provide a more comprehensive experience for users in the future.
