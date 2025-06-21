'use client';

import { useState, useEffect } from 'react';
import { Copy, Share2, Users, Gift, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/lib/supabase';

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  availableInvites: number;
  nextResetDate: string;
}

export default function ReferralsPage() {
  const [user, setUser] = useState<any>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalEarnings: 0,
    availableInvites: 0,
    nextResetDate: ''
  });
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        generateReferralLink(session.user.id);
        loadReferralStats(session.user.id);
      }
      setLoading(false);
    });
  }, []);

  const generateReferralLink = (userId: string) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/signup?ref=${userId}`;
    setReferralLink(link);
  };

  const loadReferralStats = async (userId: string) => {
    // This would be replaced with actual API calls
    // For now, using mock data
    setReferralStats({
      totalReferrals: 3,
      successfulReferrals: 2,
      pendingReferrals: 1,
      totalEarnings: 15.50,
      availableInvites: 5,
      nextResetDate: '2024-02-01'
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Voxtrav - Audio Tour Guide',
          text: 'Discover amazing audio tours with my referral link!',
          url: referralLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading referral program...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to access referrals</h1>
            <p className="text-gray-600">You need to be signed in to use the referral program.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Referral Program
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share Voxtrav with friends and earn amazing rewards! Get free months or cash rewards for every successful referral.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{referralStats.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{referralStats.successfulReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Invites</p>
                <p className="text-2xl font-bold text-gray-900">{referralStats.availableInvites}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${referralStats.totalEarnings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Referral Link</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={shareReferralLink}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Share this link with friends. When they sign up and subscribe, you'll earn rewards!
          </p>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Reward Structure */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reward Structure</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Free Month Rewards</h3>
                  <p className="text-gray-600 text-sm">
                    Earn free months when friends subscribe! Monthly users get 1 free month, yearly users get 3 free months per referral.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quota Limits</h3>
                  <p className="text-gray-600 text-sm">
                    Monthly users can earn up to 3 additional months, yearly users up to 6 additional months.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cash Rewards</h3>
                  <p className="text-gray-600 text-sm">
                    After hitting your quota, earn 40% cash commission on every referral purchase!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Invite System */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Invite System</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-yellow-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Free Users</h3>
                  <p className="text-gray-600 text-sm">
                    Get 2 invite links (one-time). Upgrade to any paid plan for more invites.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Paid Users</h3>
                  <p className="text-gray-600 text-sm">
                    Get 5 invite links per month (resets monthly, no carry forward).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-purple-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Premium Users</h3>
                  <p className="text-gray-600 text-sm">
                    Get 10 invite links per month with enhanced referral rewards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Withdraw Earnings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Available for Withdrawal</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-gray-900">${referralStats.totalEarnings}</p>
                <p className="text-sm text-gray-600">Minimum withdrawal: $25</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Withdrawal Form</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>PayPal</option>
                    <option>Bank Transfer</option>
                    <option>Stripe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="25"
                    max={referralStats.totalEarnings}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter amount"
                  />
                </div>
                <button
                  type="submit"
                  disabled={referralStats.totalEarnings < 25}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Request Withdrawal
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">When do I receive my rewards?</h3>
              <p className="text-gray-600">Free month rewards are applied immediately when your referral subscribes. Cash rewards are available for withdrawal once you reach the $25 minimum.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">What happens if my referral cancels?</h3>
              <p className="text-gray-600">If a referral cancels within 30 days, the reward will be reversed. After 30 days, the reward is permanent.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">How long do invite links last?</h3>
              <p className="text-gray-600">Invite links never expire, but your monthly quota resets on the 1st of each month.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Can I refer myself?</h3>
              <p className="text-gray-600">No, self-referrals are not allowed and will result in account suspension.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 