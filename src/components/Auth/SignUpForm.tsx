'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Gift, AlertCircle } from 'lucide-react'
import Logo from '@/components/UI/Logo'

interface SignUpFormProps {
  onSuccess: () => void
  onSwitchToSignIn: () => void
}

export default function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inviteValid, setInviteValid] = useState(false)
  const [inviteLoading, setInviteLoading] = useState(false)

  // Check for referral code in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const refCode = urlParams.get('ref')
    if (refCode) {
      setReferralCode(refCode)
      validateInvite(refCode)
    }
  }, [])

  const validateInvite = async (code: string) => {
    setInviteLoading(true)
    try {
      // Check if the referral code exists and is valid
      const { data: user, error } = await supabase
        .from('profiles')
        .select('id, name, subscription_plan')
        .eq('id', code)
        .single()

      if (error || !user) {
        setError('Invalid or expired invite link')
        setInviteValid(false)
        return
      }

      // Check if the referrer has available invites
      const { data: inviteCount } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', code)
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

      const maxInvites = user.subscription_plan === 'premium' ? 10 : 
                        user.subscription_plan === 'monthly' ? 5 : 2

      if (inviteCount && inviteCount.length >= maxInvites) {
        setError('This user has reached their monthly invite limit')
        setInviteValid(false)
        return
      }

      setInviteValid(true)
      setError('')
    } catch (err) {
      setError('Failed to validate invite')
      setInviteValid(false)
    } finally {
      setInviteLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate invite if no referral code is provided
    if (!referralCode) {
      setError('An invite link is required to create an account')
      setLoading(false)
      return
    }

    if (!inviteValid) {
      setError('Please provide a valid invite link')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            referred_by: referralCode,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        // Create referral record
        await supabase.from('referrals').insert({
          referrer_id: referralCode,
          referred_id: data.user.id,
          status: 'pending'
        })

        onSuccess()
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleReferralCodeChange = (code: string) => {
    setReferralCode(code)
    if (code.length > 0) {
      validateInvite(code)
    } else {
      setInviteValid(false)
      setError('')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo with Home Link */}
      <div className="text-center mb-8">
        <Logo size="md" className="mx-auto" />
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join Voxtrav with an invite</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Invite Code Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Gift className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Invite Required</h3>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Voxtrav is invite-only. You need a valid invite link to create an account.
            </p>
            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-blue-900 mb-2">
                Invite Code
              </label>
              <div className="relative">
                <input
                  id="referralCode"
                  type="text"
                  value={referralCode}
                  onChange={(e) => handleReferralCodeChange(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    inviteValid ? 'border-green-300 bg-green-50' : 
                    referralCode.length > 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter invite code or paste invite link"
                  required
                />
                {inviteLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
                {inviteValid && !inviteLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
              {referralCode.length > 0 && !inviteValid && !inviteLoading && (
                <p className="text-sm text-red-600 mt-1">Invalid or expired invite code</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Create a password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !inviteValid}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToSignIn}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Need an invite section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Don't have an invite?</p>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                • Ask a friend who uses Voxtrav for an invite
              </p>
              <p className="text-xs text-gray-500">
                • Contact us at support@voxtrav.info
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 