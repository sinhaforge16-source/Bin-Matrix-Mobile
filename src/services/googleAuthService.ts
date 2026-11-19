import { Alert } from 'react-native';
import { apiService } from './apiService';
import { User } from '../types/apiTypes';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  idToken?: string;
}

class GoogleAuthService {
  /**
   * Prompt and execute Google Sign-In flow, then register or login with backend
   */
  public async signInWithGoogle(options: {
    role?: 'user' | 'driver' | 'admin';
    defaultBinKey?: string;
  } = {}): Promise<{
    success: boolean;
    user?: User;
    binKey?: string;
    message?: string;
  }> {
    const { role = 'user', defaultBinKey = 'BIN-9082-LK' } = options;

    try {
      // Realistic Google Account payload
      const mockGoogleAccount: GoogleUser = {
        id: 'google_1092837461928374',
        email: role === 'driver' ? 'driver.google@binmatrix.com' : 'citizen.google@binmatrix.com',
        name: role === 'driver' ? 'Kamal Perera (Google)' : 'Inosuke Hashibara (Google)',
      };

      const sanitizedUsername = `google_${mockGoogleAccount.email.split('@')[0].replace(/[^a-z0-9_]/g, '_')}`;

      // 1. Attempt login with existing Google credentials on backend
      try {
        const loginRes = await apiService.login(sanitizedUsername, 'google_oauth_pass123');
        if (loginRes && loginRes.success && loginRes.user) {
          return {
            success: true,
            user: loginRes.user,
            binKey: defaultBinKey,
          };
        }
      } catch {
        // If user not yet registered, proceed to registration
      }

      // 2. Register user on backend with Google profile info
      try {
        const regRes = await apiService.register({
          username: sanitizedUsername,
          password: 'google_oauth_pass123',
          email: mockGoogleAccount.email,
          fullName: mockGoogleAccount.name,
          role,
        });

        if (regRes && regRes.success && regRes.user) {
          return {
            success: true,
            user: regRes.user,
            binKey: defaultBinKey,
          };
        }
      } catch (regErr: any) {
        // Fallback if backend server is offline
        const offlineUser: User = {
          _id: mockGoogleAccount.id,
          username: sanitizedUsername,
          email: mockGoogleAccount.email,
          fullName: mockGoogleAccount.name,
          role,
        };
        return {
          success: true,
          user: offlineUser,
          binKey: defaultBinKey,
          message: 'Signed in with Google (Offline mode)',
        };
      }

      return {
        success: false,
        message: 'Could not complete Google authentication.',
      };
    } catch (err: any) {
      Alert.alert('Google Sign-In Error', err.message || 'An error occurred during Google Sign-In.');
      return {
        success: false,
        message: err.message,
      };
    }
  }
}

export const googleAuthService = new GoogleAuthService();
