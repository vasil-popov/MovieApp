// ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { LoginButton, LoginManager } from 'react-native-fbsdk-next';
import { initializeFacebookSDK, getAccessToken, getUserData } from '../facebookApi';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserInfoState {
  id?: string;
  name?: string;
  email?: string;
  picture?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfoState>({});
  const [isSDKInitialized, setIsSDKInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupFacebook = async () => {
      try {
        await initializeFacebookSDK();
        setIsSDKInitialized(true);

        const accessToken = await getAccessToken();
        if (accessToken) {
          const userData = await getUserData(accessToken);
          if (userData) {
            setUserInfo(userData);
            await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
            console.log('User info saved to AsyncStorage:', userData);
          }
        }
      } catch (error) {
        console.error('Error setting up Facebook SDK:', error);
      } finally {
        setLoading(false);
      }
    };
    setupFacebook();
  }, []);

  const handleLoginFinished = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const userData = await getUserData(accessToken);
        if (userData) {
          setUserInfo(userData);
          await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
          console.log('User info saved to AsyncStorage after login:', userData);
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    LoginManager.logOut();
    setUserInfo({});
    await AsyncStorage.removeItem('userInfo');
    router.push('/');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerGradient}>
        <View style={styles.profileHeader}>
          {userInfo.picture ? (
            <Image source={{ uri: userInfo.picture }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="person" size={80} color="#888" />
            </View>
          )}
          
          <Text style={styles.userName}>{userInfo.name || 'Гост'}</Text>
          {userInfo.email && <Text style={styles.userEmail}>{userInfo.email}</Text>}
          {userInfo.id && <Text style={styles.userId}>ID: {userInfo.id}</Text>}
        </View>
      </View>
      
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Акаунт</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="#BBB" />
          <Text style={styles.menuText}>Настройки</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevron} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#BBB" />
          <Text style={styles.menuText}>Известия</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevron} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>Поддръжка</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#BBB" />
          <Text style={styles.menuText}>Център за помощ</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevron} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={24} color="#BBB" />
          <Text style={styles.menuText}>За нас</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevron} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.fbButtonContainer}>
        <LoginButton
          onLoginFinished={handleLoginFinished}
          onLogoutFinished={handleLogout}
          permissions={['public_profile', 'email']}
          style={styles.loginButton}
        />
      </View>
      
      <Text style={styles.versionText}>Версия 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  headerGradient: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#E50914',
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 16,
  },
  placeholderContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userId: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 4,
  },
  contentSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E50914',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 16,
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  fbButtonContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  loginButton: {
    width: 220,
    height: 30,
  },
  versionText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 10,
  },
});
