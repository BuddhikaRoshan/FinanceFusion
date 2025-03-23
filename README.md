# FinanceFusion Web Application

## Overview
FinanceFusion is a **text and voice-enabled expense and income manager** with smart analytics. This web application allows users to manage their income and expenses efficiently while leveraging AI for insights and automation. The system supports detailed financial reporting, user management, and scheduled payments.

The **FinanceFusion AI Chatbot** is a separate module integrated into this application. It enhances user interaction by allowing users to manage their finances using text and voice commands.

## Features
- **Text & Voice Interaction** (via AI Chatbot)
- **Expense & Income Management**
- **Smart Financial Analytics**
  - Monthly Payment Reports
  - Monthly Income Reports
  - Monthly Expense Reports
- **Search Function**
- **User Management**
- **Special Payments Calendar**
- **PDF Report Generation**

## Technology Stack
- **Backend**: Node.js with Express.js
- **Frontend**: Next.js with React.js
- **Database**: MongoDB (via Prisma ORM)
- **AI & NLP**: OpenAI
- **Voice Processing**: Web Speech API & Google Speech-to-Text
- **ORM**: Prisma ORM for database interactions
- **Validation**: Zod for schema validation
- **UI Components**: ShadCN (built on Radix UI & Tailwind CSS)
- **PDF Generation**: jsPDF

## Setup & Installation
### Prerequisites
- Node.js & npm installed
- MongoDB setup
- Prisma ORM installed

### Installation Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/BuddhikaRoshan/financefusion.git
   cd financefusion
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_api_key
   PORT=3000
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

## Usage
- Use text or voice commands via the chatbot.
- Use the web UI for financial management.
- Generate and download financial reports in PDF format.

## Contribution
Feel free to contribute by submitting issues or feature requests. Fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License.




