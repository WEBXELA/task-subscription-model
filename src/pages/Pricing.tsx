import React, { useEffect, useState } from 'react';
import { Check, Sparkles, Cpu, Brain, Building, ArrowRight, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out our AI capabilities',
    icon: Sparkles,
    features: [
      '100 AI queries/month',
      'Basic text generation',
      'Standard response time',
      'Community support',
      'Basic prompt templates'
    ],
    buttonText: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For professionals and content creators',
    icon: Cpu,
    features: [
      '2,000 AI queries/month',
      'Advanced text generation',
      'Fast response time',
      'Priority email support',
      'Custom prompt templates',
      'API access',
      'Content optimization tools'
    ],
    buttonText: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Business',
    price: '$99',
    description: 'For growing teams and businesses',
    icon: Brain,
    features: [
      '10,000 AI queries/month',
      'Enterprise-grade AI models',
      'Ultra-fast response time',
      '24/7 priority support',
      'Advanced analytics',
      'Team collaboration',
      'Custom model fine-tuning'
    ],
    buttonText: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Custom AI solutions for large organizations',
    icon: Building,
    features: [
      'Unlimited AI queries',
      'Custom AI model development',
      'Dedicated infrastructure',
      'Dedicated success manager',
      'SLA guarantee',
      'On-premise deployment',
      'Custom security controls'
    ],
    buttonText: 'Contact Sales',
    popular: false
  }
];

export function Pricing() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/pricing');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700 text-sm">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
            AI-Powered Solutions for Your Business
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Harness the power of advanced GPT models with flexible pricing plans designed to scale with your needs.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl ${
                  tier.popular
                    ? 'border-2 border-black shadow-2xl'
                    : 'border border-gray-200'
                } p-8 transition-all duration-300 hover:scale-105`}
              >
                {tier.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gray-100 mx-auto">
                  <Icon className="h-6 w-6 text-gray-900" />
                </div>

                <h3 className="text-xl font-bold text-center mt-4">{tier.name}</h3>
                <p className="mt-2 text-gray-500 text-sm text-center">
                  {tier.description}
                </p>

                <div className="mt-4 text-center">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.price !== 'Custom' && (
                    <span className="text-gray-500">/month</span>
                  )}
                </div>

                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-gray-900 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={user ? '/dashboard' : '/signup'}
                  className={`mt-8 w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    tier.popular
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } flex items-center justify-center`}
                >
                  {tier.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Enterprise Contact Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom AI Solution?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Our enterprise plan offers dedicated AI infrastructure, custom model development, and
            tailored solutions for your specific business needs.
          </p>
          <button className="inline-flex items-center px-6 py-3 border-2 border-black text-lg font-semibold rounded-lg hover:bg-black hover:text-white transition-colors">
            Schedule a Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}