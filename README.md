🚀 Skill-Swap Barter Exchange (Spring Boot Backend)
📌 Overview
Skill-Swap is a credit-based peer-to-peer learning platform that enables users to exchange skills without money. Instead of paying with currency, users earn and spend time credits by teaching and learning from others.

💡 Example: Teach Java for 1 hour → Earn 1 credit → Use it to learn Guitar.

🧠 Core Concept
This system simulates a micro-economy where:

Credits act as currency
Skills act as tradable assets
Transactions are handled with ACID-compliant logic
🏗️ Architecture
The backend follows a layered architecture:

Controller Layer → Handles REST APIs
Service Layer → Business logic & validations
Repository Layer → Database interaction (JPA)
Entity Layer → Database models
⚙️ Tech Stack
Java 17
Spring Boot
Spring Data JPA
MySQL
Maven
Lombok
💥 Key Features
🔹 Credit-Based Economy
Users earn credits by teaching
Spend credits to learn
🔹 Transaction System (ACID)
Atomic credit transfer using @Transactional
Prevents inconsistent states
🔹 Credit Ledger (Audit System)
Tracks every credit movement
Ensures transparency and debugging
🔹 Skill Marketplace
Users can list and discover skills
🔹 Scalable Architecture
Clean separation using Service & Repository layers
🗄️ Database Design
Core Entities:

Users
Skills
UserSkills (Many-to-Many)
Transactions
CreditLedger
🔄 Transaction Flow
Validate user credits
Deduct credits from learner
Add credits to teacher
Record transaction
Insert ledger entries
Commit transaction
🌐 API Endpoints (Sample)
Complete Skill Swap
POST /api/transactions/complete
Parameters:
learnerId
teacherId
hours
🧪 Running the Project
1. Clone Repository
git clone https://github.com/YOUR_USERNAME/skillswap-backend.git
2. Configure Database
Update application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/skillswap_db
spring.datasource.username=root
spring.datasource.password=yourpassword
3. Run Application
mvn spring-boot:run
📊 Future Enhancements
Authentication (JWT)
Skill matching algorithm
Ratings & reputation system
Real-time notifications
Deployment on AWS
🎯 Why This Project?
This project demonstrates:

Strong understanding of transaction management
Real-world system design (credit economy)
Clean backend architecture
Database integrity & audit systems
👨‍💻 Author
Yash Gupta

⭐ Contribution
Feel free to fork, improve, and contribute!
