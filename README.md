# AI-Powered SaaS Platform

A modern, subscription-based SaaS platform built with React, Supabase, and Tailwind CSS. This platform offers tiered pricing plans with AI capabilities, secure authentication, and real-time subscription management.

![Platform Preview](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80)

## Features

- 🔐 Secure authentication with Supabase
- 💳 Tiered subscription plans (Free, Pro, Business, Enterprise)
- 📊 Real-time subscription management
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔄 Automatic subscription history tracking
- ⚡ Built with Vite for optimal performance

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Environment Setup

1. Clone the repository
2. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Database Schema

### Subscriptions Table
```sql
subscriptions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  plan text CHECK (plan IN ('free', 'pro', 'business', 'enterprise')),
  status text CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
```

### Subscription History Table
```sql
subscription_history (
  id uuid PRIMARY KEY,
  subscription_id uuid REFERENCES subscriptions,
  event_type text CHECK (event_type IN ('created', 'updated', 'canceled')),
  previous_plan text,
  new_plan text,
  created_at timestamptz
)
```

## Security Features

- Row Level Security (RLS) enabled on all tables
- Secure authentication flow
- Protected API routes
- Automatic subscription tracking
- User-specific data access policies

## Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── lib/           # Utilities and configurations
│   ├── hooks/         # Custom React hooks
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── supabase/
    └── migrations/    # Database migrations
```

## Authentication Flow

1. User signs up/signs in
2. Supabase handles authentication
3. On successful signup:
   - User record created in auth.users
   - Default 'free' subscription created
   - User redirected to dashboard

## Subscription Management

- Automatic subscription creation for new users
- Real-time subscription status updates
- Historical tracking of subscription changes
- Automatic period management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@yourdomain.com or join our Slack channel.