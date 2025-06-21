'use client';

import { useState } from 'react';
import { Check, X, Star, Crown } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import Link from 'next/link';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      price: 0,
      originalPrice: null,
      yearlyPrice: 0,
      yearlyOriginalPrice: null,
      description: 'Perfect for occasional travelers',
      features: [
        '3 places per month',
        'Max 5 places per year',
        'Basic audio quality',
        'Standard voice guides',
        'Web access only',
        'Community support'
      ],
      limitations: [
        'No offline access',
        'No premium voices',
        'No referral rewards',
        'Limited to 2 invite links'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'secondary',
      popular: false,
      premium: false
    },
    {
      name: 'Monthly',
      price: 2.5,
      originalPrice: 8,
      yearlyPrice: 20,
      yearlyOriginalPrice: 75,
      description: 'Great for regular travelers',
      features: [
        'Unlimited places',
        'Unlimited audio tours',
        'High-quality audio',
        'Offline access',
        '5 invite links per month',
        'Referral rewards',
        'Priority support',
        'No yearly limits'
      ],
      limitations: [],
      buttonText: 'Start Monthly Plan',
      buttonVariant: 'primary',
      popular: true,
      premium: false
    },
    {
      name: 'Premium Yearly',
      price: 250,
      originalPrice: null,
      yearlyPrice: 250,
      yearlyOriginalPrice: null,
      description: 'Ultimate experience for serious travelers',
      features: [
        'Everything in Monthly plan',
        'Choice of voice & accent',
        'Premium voice guides',
        'Exclusive premium tours',
        'Priority customer support',
        'Early access to new features',
        'Custom tour requests',
        '10 invite links per month',
        'Enhanced referral rewards'
      ],
      limitations: [],
      buttonText: 'Get Premium',
      buttonVariant: 'premium',
      popular: false,
      premium: true
    }
  ];

  const getButtonClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 hover:bg-primary-700 text-white';
      case 'premium':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-700';
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start exploring the world with immersive audio tours. Choose the plan that fits your travel style.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save up to 73%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-xl shadow-sm border-2 p-8 ${
                plan.popular ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200'
              } ${plan.premium ? 'bg-gradient-to-b from-white to-purple-50' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Premium Badge */}
              {plan.premium && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                {/* Pricing */}
                <div className="mb-4">
                  {billingCycle === 'monthly' ? (
                    <div>
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                      {plan.originalPrice && (
                        <div className="mt-1">
                          <span className="text-lg text-gray-400 line-through">${plan.originalPrice}</span>
                          <span className="ml-2 text-sm text-green-600 font-medium">69% off</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-gray-900">${plan.yearlyPrice}</span>
                      <span className="text-gray-600">/year</span>
                      {plan.yearlyOriginalPrice && (
                        <div className="mt-1">
                          <span className="text-lg text-gray-400 line-through">${plan.yearlyOriginalPrice}</span>
                          <span className="ml-2 text-sm text-green-600 font-medium">73% off</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-900">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900 mt-6">Limitations:</h4>
                    <ul className="space-y-3">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <li key={limitationIndex} className="flex items-start">
                          <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${getButtonClasses(plan.buttonVariant)}`}
                disabled={plan.name === 'Free'}
              >
                {plan.buttonText}
              </button>

              {/* Referral Info */}
              {plan.name !== 'Free' && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    💡 Earn free months with referrals!
                  </p>
                  <Link 
                    href="/referrals" 
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Learn more →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Can I switch plans anytime?</h3>
              <p className="text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">What happens when I reach my free plan limit?</h3>
              <p className="text-gray-600">You'll see a message asking you to upgrade to continue accessing audio tours. You can still browse all content.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">How do referral rewards work?</h3>
              <p className="text-gray-600">Earn free months when friends subscribe! Monthly users get 1 free month, yearly users get 3 free months per referral.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a money-back guarantee?</h3>
              <p className="text-gray-600">Yes! We offer a 30-day money-back guarantee on all paid plans.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 