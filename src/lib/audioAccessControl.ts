import { supabase } from './supabase';

export interface AudioAccessResult {
  canAccess: boolean;
  reason?: string;
  remainingCount?: number;
  maxCount?: number;
}

export class AudioAccessControl {
  private static instance: AudioAccessControl;
  private deviceFingerprint: string | null = null;

  private constructor() {
    this.initializeDeviceFingerprint();
  }

  public static getInstance(): AudioAccessControl {
    if (!AudioAccessControl.instance) {
      AudioAccessControl.instance = new AudioAccessControl();
    }
    return AudioAccessControl.instance;
  }

  private async initializeDeviceFingerprint(): Promise<void> {
    // Generate a simple device fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
      const fingerprint = canvas.toDataURL();
      
      // Combine with other device characteristics
      const deviceInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        canvas: fingerprint
      };
      
      this.deviceFingerprint = btoa(JSON.stringify(deviceInfo)).slice(0, 32);
    }
  }

  private async getDeviceTracking(): Promise<any> {
    if (!this.deviceFingerprint) {
      await this.initializeDeviceFingerprint();
    }

    const { data, error } = await supabase
      .from('device_tracking')
      .select('*')
      .eq('device_fingerprint', this.deviceFingerprint)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching device tracking:', error);
      return null;
    }

    return data;
  }

  private async updateDeviceTracking(count: number): Promise<void> {
    if (!this.deviceFingerprint) {
      await this.initializeDeviceFingerprint();
    }

    const { error } = await supabase
      .from('device_tracking')
      .upsert({
        device_fingerprint: this.deviceFingerprint,
        audio_tours_accessed: count,
        last_accessed: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating device tracking:', error);
    }
  }

  public async checkAudioAccess(tourId: string): Promise<AudioAccessResult> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      return this.checkLoggedUserAccess(session.user.id, tourId);
    } else {
      return this.checkNonLoggedUserAccess(tourId);
    }
  }

  private async checkLoggedUserAccess(userId: string, tourId: string): Promise<AudioAccessResult> {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_plan, monthly_audio_count, yearly_audio_count')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return {
          canAccess: false,
          reason: 'User profile not found'
        };
      }

      // Free plan restrictions
      if (profile.subscription_plan === 'free') {
        if (profile.monthly_audio_count >= 3) {
          return {
            canAccess: false,
            reason: 'Monthly limit reached. Upgrade to access more audio tours.',
            remainingCount: 0,
            maxCount: 3
          };
        }

        if (profile.yearly_audio_count >= 5) {
          return {
            canAccess: false,
            reason: 'Yearly limit reached. Upgrade to access unlimited audio tours.',
            remainingCount: 0,
            maxCount: 5
          };
        }

        return {
          canAccess: true,
          remainingCount: Math.min(3 - profile.monthly_audio_count, 5 - profile.yearly_audio_count),
          maxCount: Math.min(3, 5 - profile.yearly_audio_count)
        };
      }

      // Paid plans have unlimited access
      return {
        canAccess: true,
        remainingCount: -1, // Unlimited
        maxCount: -1
      };
    } catch (error) {
      console.error('Error checking logged user access:', error);
      return {
        canAccess: false,
        reason: 'Error checking access permissions'
      };
    }
  }

  private async checkNonLoggedUserAccess(tourId: string): Promise<AudioAccessResult> {
    try {
      const deviceTracking = await this.getDeviceTracking();
      const currentCount = deviceTracking?.audio_tours_accessed || 0;

      if (currentCount >= 2) {
        return {
          canAccess: false,
          reason: 'Sign up to access more audio tours',
          remainingCount: 0,
          maxCount: 2
        };
      }

      return {
        canAccess: true,
        remainingCount: 2 - currentCount,
        maxCount: 2
      };
    } catch (error) {
      console.error('Error checking non-logged user access:', error);
      return {
        canAccess: false,
        reason: 'Error checking access permissions'
      };
    }
  }

  public async recordAudioAccess(tourId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      await this.recordLoggedUserAccess(session.user.id, tourId);
    } else {
      await this.recordNonLoggedUserAccess(tourId);
    }
  }

  private async recordLoggedUserAccess(userId: string, tourId: string): Promise<void> {
    try {
      // Update audio count
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          monthly_audio_count: supabase.sql`monthly_audio_count + 1`,
          yearly_audio_count: supabase.sql`yearly_audio_count + 1`
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating audio count:', updateError);
      }

      // Record in tour history
      const { error: historyError } = await supabase
        .from('tour_history')
        .insert({
          user_id: userId,
          tour_id: tourId,
          audio_duration: 0, // Will be updated when audio completes
          completed: false
        });

      if (historyError) {
        console.error('Error recording tour history:', historyError);
      }
    } catch (error) {
      console.error('Error recording logged user access:', error);
    }
  }

  private async recordNonLoggedUserAccess(tourId: string): Promise<void> {
    try {
      const deviceTracking = await this.getDeviceTracking();
      const currentCount = deviceTracking?.audio_tours_accessed || 0;
      
      await this.updateDeviceTracking(currentCount + 1);
    } catch (error) {
      console.error('Error recording non-logged user access:', error);
    }
  }

  public async getAccessInfo(): Promise<{
    isLoggedIn: boolean;
    plan?: string;
    monthlyCount?: number;
    yearlyCount?: number;
    remainingCount?: number;
    maxCount?: number;
  }> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_plan, monthly_audio_count, yearly_audio_count')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        if (profile.subscription_plan === 'free') {
          const remaining = Math.min(3 - profile.monthly_audio_count, 5 - profile.yearly_audio_count);
          return {
            isLoggedIn: true,
            plan: profile.subscription_plan,
            monthlyCount: profile.monthly_audio_count,
            yearlyCount: profile.yearly_audio_count,
            remainingCount: Math.max(0, remaining),
            maxCount: Math.min(3, 5 - profile.yearly_audio_count)
          };
        } else {
          return {
            isLoggedIn: true,
            plan: profile.subscription_plan,
            remainingCount: -1, // Unlimited
            maxCount: -1
          };
        }
      }
    } else {
      const deviceTracking = await this.getDeviceTracking();
      const currentCount = deviceTracking?.audio_tours_accessed || 0;
      
      return {
        isLoggedIn: false,
        remainingCount: Math.max(0, 2 - currentCount),
        maxCount: 2
      };
    }

    return { isLoggedIn: false };
  }
}

export const audioAccessControl = AudioAccessControl.getInstance(); 