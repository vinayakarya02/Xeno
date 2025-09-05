# Xeno CRM Platform



A modern Customer Relationship Management platform built for the Xeno SDE Internship Assignment 2025. This platform enables intelligent customer segmentation, personalized campaign delivery, and AI-powered insights.

---

## 📖 Project Purpose

Xeno CRM is designed to help businesses intelligently segment customers, create and deliver personalized campaigns, and gain actionable insights using AI. Built as part of the Xeno SDE Internship Assignment 2025, it demonstrates modern web development, AI integration, and scalable architecture.

## 🚀 Features

### ✅ Core Requirements Implemented

1. **Data Ingestion APIs**
   - Secure REST APIs for customers and orders data
   - Comprehensive validation and error handling
   - Swagger-compatible API documentation

2. **Campaign Creation UI**
   - Dynamic rule builder with AND/OR logic
   - Real-time audience size preview
   - Campaign history with delivery statistics
   - Intuitive drag-and-drop interface

3. **Campaign Delivery & Logging**
   - Automated campaign delivery system
   - Communication logging with delivery status tracking
   - Simulated vendor API with 90% success rate
   - Delivery receipt API for status updates

4. **Authentication**
   - Google OAuth 2.0 integration
   - Protected routes for authenticated users
   - Session management

5. **AI Integration**
   - **Natural Language to Segment Rules**: Convert plain English queries to logical rules
   - **AI Message Generation**: Generate personalized campaign messages
   - **Campaign Performance Insights**: AI-powered performance summaries
   - **Auto-tagging**: Intelligent campaign categorization

### 🎯 AI Features Showcase

#### 1. Natural Language Rule Builder
```text
Input: "People who haven't shopped in 6 months and spent over ₹5K"
Output: Automatically generates rules for lastVisit > 180 days AND totalSpent > 5000
```

#### 2. Smart Message Generation
- Context-aware message suggestions based on campaign objectives
- Personalization with customer name variables
- Tone and audience-appropriate content

#### 3. Performance Insights
- AI-generated campaign summaries
- Delivery rate analysis with actionable recommendations
- Audience performance comparisons

#### 4. Auto-tagging System
- Automatic campaign categorization (Win-back, High Value, Product Launch, etc.)
- Keyword-based intelligent labeling

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Database**: In-memory storage (easily replaceable with MySQL/MongoDB)
- **AI Integration**: Custom AI simulation (ready for OpenAI/Google Vertex AI)
- **Authentication**: NextAuth.js (Google OAuth ready)
- **Deployment**: Vercel-ready

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd xeno-crm
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Add your environment variables to `.env.local`:
```env
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key (optional)
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Go to [http://localhost:3000](http://localhost:3000)

## 🏗 Architecture

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Frontend    │    │   API Layer   │    │  AI Services  │
│   (Next.js)   │◄──►│ (API Routes)  │◄──►│ (OpenAI/etc)  │
└───────────────┘    └───────────────┘    └───────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ UI Components │    │  Data Layer   │    │ External APIs │
│  (shadcn/ui)  │    │ (In-memory)   │    │ (Vendor API)  │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Key Components

- **Campaign Builder**: Dynamic rule creation with visual feedback
- **AI Engine**: Natural language processing and message generation
- **Delivery System**: Asynchronous campaign processing
- **Analytics Dashboard**: Real-time performance monitoring

## 🔌 API Endpoints

### Customer Management
- `GET /api/customers` - Fetch customers with pagination
- `POST /api/customers` - Create new customer

### Order Management  
- `GET /api/orders` - Fetch orders with filtering
- `POST /api/orders` - Create new order

### Campaign Management
- `GET /api/campaigns` - Fetch campaigns
- `POST /api/campaigns` - Create and launch campaign

### AI Services
- `POST /api/ai/natural-language` - Convert natural language to rules
- `POST /api/ai/generate-message` - Generate AI messages

### Delivery System
- `POST /api/vendor/send-message` - Vendor message API
- `POST /api/delivery-receipt` - Delivery status webhook

## 🤖 AI Implementation Details

### Natural Language Processing
The platform uses pattern matching and keyword extraction to convert natural language queries into structured rules. In a production environment, this would integrate with advanced NLP services like OpenAI GPT or Google's Natural Language AI.

### Message Generation
AI-powered message generation considers:
- Campaign objective
- Target audience characteristics  
- Brand tone and style
- Personalization requirements

### Performance Analytics
The AI analytics engine provides:
- Delivery rate analysis
- Audience segment performance comparison
- Optimization recommendations
- Trend identification

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
```bash
npm i -g vercel
vercel
```

2. **Set environment variables in Vercel dashboard**

3. **Deploy**
```bash
vercel --prod
```

### Alternative Deployment Options
- Railway
- Render
- Netlify
- AWS/GCP/Azure

## 🧪 Testing

### API Testing
Use the included Postman collection or test endpoints directly:

```bash
# Test customer creation
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"+91-9876543210"}'

# Test natural language processing
curl -X POST http://localhost:3000/api/ai/natural-language \
  -H "Content-Type: application/json" \
  -d '{"query":"People who haven't shopped in 6 months and spent over ₹5K"}'
```

## 📊 Performance Considerations

### Scalability Features
- **Pagination**: All list endpoints support pagination
- **Filtering**: Advanced filtering capabilities
- **Caching**: Ready for Redis integration
- **Async Processing**: Campaign delivery runs asynchronously

### Future Enhancements
- **Pub-Sub Architecture**: Ready for Kafka/RabbitMQ integration
- **Database Migration**: Easy switch to MySQL/MongoDB
- **Advanced AI**: Integration with production AI services
- **Real-time Updates**: WebSocket support for live campaign tracking

## 🔒 Security

- Input validation on all endpoints
- SQL injection prevention (when using SQL databases)
- Rate limiting ready
- Authentication middleware
- CORS configuration

## 🐛 Known Limitations

1. **In-Memory Storage**: Data resets on server restart (easily replaceable with persistent database)
2. **Simulated AI**: Uses pattern matching instead of real AI (ready for production AI integration)
3. **Mock Vendor API**: Simulated message delivery (ready for real vendor integration)
4. **Basic Authentication**: Google OAuth setup required for full functionality

## 🤝 Contributing

This project was built as part of the Xeno SDE Internship Assignment. The implementation demonstrates:

- Clean, maintainable code architecture
- Modern React/Next.js best practices
- RESTful API design
- AI integration patterns
- Responsive UI/UX design
- Production-ready deployment setup

## 📝 License

This project is part of the Xeno SDE Internship Assignment 2025.

---

**Built with ❤️ for Xeno CRM Platform**

## Authentication Setup (Google Sign-In)

1. Create OAuth credentials in the Google Cloud Console:
   - Redirect URI: `http://localhost:3000/api/auth/callback/google`
2. Add these variables to your `.env.local` file:
   - `GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`
   - `NEXTAUTH_SECRET=...`
3. Install NextAuth.js:
   ```bash
   npm install next-auth --legacy-peer-deps
   ```
4. Now, Sign In with Google and protected routes will work!

## 📬 Contact

For questions, feedback, or contributions, please contact:
- Anirudh pal
- palanirudh8299@gmail.com
