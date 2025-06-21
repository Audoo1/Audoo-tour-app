'use client';

import { useState, useEffect } from 'react';
import { Copy, Share2, Users, Gift, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
    // For now, using realistic mock data based on user plan
    // Free users can only earn free months, not cash
    const isFreeUser = true; // This should be determined from user's subscription status
    const isNewUser = true; // This should be determined from user's referral history
    
    if (isNewUser) {
      // New user stats - only show available invites
      setReferralStats({
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalEarnings: 0,
        availableInvites: isFreeUser ? 2 : 5, // Free users get 2, paid users get 5
        nextResetDate: isFreeUser ? 'N/A' : '2024-02-01'
      });
    } else if (isFreeUser) {
      // Existing free user with referrals
      setReferralStats({
        totalReferrals: 2,
        successfulReferrals: 2,
        pendingReferrals: 0,
        totalEarnings: 0, // Free users don't earn cash
        availableInvites: 0, // Used up their 2 invites
        nextResetDate: 'N/A' // No monthly reset for free users
      });
    } else {
      // Paid user stats
      setReferralStats({
        totalReferrals: 3,
        successfulReferrals: 2,
        pendingReferrals: 1,
        totalEarnings: 15.50,
        availableInvites: 5,
        nextResetDate: '2024-02-01'
      });
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Referral Program
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share Voxtrav with friends and earn amazing rewards! Get free months or cash rewards for every successful referral.
          </p>
        </div>
        
        {!user ? (
          <div className="text-center">
            <p className="text-gray-600 mb-6">Please sign in to view your referral program.</p>
            <Link
              href="/signin"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {referralStats.totalReferrals > 0 && (
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
              )}

              {referralStats.successfulReferrals > 0 && (
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
              )}

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

              {referralStats.successfulReferrals > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {referralStats.totalEarnings > 0 ? 'Total Earnings' : 'Free Months Earned'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {referralStats.totalEarnings > 0 ? `$${referralStats.totalEarnings}` : `${referralStats.successfulReferrals} months`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Free User Upgrade Notice */}
            {referralStats.totalEarnings === 0 && referralStats.successfulReferrals > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🎉</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Congratulations!</h3>
                    <p className="text-gray-600">
                      You've earned {referralStats.successfulReferrals} free month{referralStats.successfulReferrals > 1 ? 's' : ''}! 
                      Upgrade to a paid plan to start earning cash rewards and get more invite links.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* New Free User Notice */}
            {referralStats.totalEarnings === 0 && referralStats.successfulReferrals === 0 && referralStats.availableInvites > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Start Earning Today!</h3>
                    <p className="text-gray-600">
                      You have {referralStats.availableInvites} invite{referralStats.availableInvites > 1 ? 's' : ''} available. 
                      Share with friends and earn <strong>Upto $15 instant benefit. Leverage your network for unlimited earning possibilities</strong>! 
                      Successful referrals can also help you upgrade to a paid plan.
                    </p>
                  </div>
                </div>
              </div>
            )}

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

            {/* Withdrawal Section - Only for paid users */}
            {referralStats.totalEarnings > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Withdraw Earnings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Available for Withdrawal</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-3xl font-bold text-gray-900">${referralStats.totalEarnings}</p>
                      <p className="text-sm text-gray-600">Withdraw any amount</p>
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
                          max={referralStats.totalEarnings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter amount"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={referralStats.totalEarnings <= 0}
                        className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Request Withdrawal
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 