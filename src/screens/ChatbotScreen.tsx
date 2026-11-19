import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  NavHomeIcon,
  NavSmartBinIcon,
  NavProfileIcon,
} from '../components/CommonIcons';
import {
  BotAvatarVector,
  CameraIcon,
  LocationPinIcon,
  SendIcon,
} from '../components/ChatIcons';
import { ReportedWasteVector } from '../components/ReportedWasteVector';
import { Language, TRANSLATIONS } from '../utils/translations';
import { apiService } from '../services/apiService';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'operator';
  text?: string;
  isImage?: boolean;
  imageUri?: string;
  isLocation?: boolean;
  locationUrl?: string;
  time: string;
}

interface Props {
  language?: Language;
  onNavigateHome: () => void;
  onNavigateAccount: () => void;
  userProfile?: {
    name?: string;
    email?: string;
    location?: string;
    binKey?: string;
  } | null;
}

export const ChatbotScreen: React.FC<Props> = ({
  language = 'en',
  onNavigateHome,
  onNavigateAccount,
  userProfile,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];
  const scrollViewRef = useRef<any>(null);
  const [inputText, setInputText] = useState('');

  const currentUserId = userProfile?.binKey || userProfile?.email || 'VI-123';
  const currentUserName = userProfile?.name || 'Kasun Perera';

  const formatCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${hours}.${minutes} ${ampm}`;
  };

  // Initial messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: t.botGreeting,
      time: '9.57 am',
    },
  ]);

  // Load chat messages from backend on mount and poll for operator updates
  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await apiService.getChatMessages(currentUserId);
        if (isMounted && res && res.data && res.data.length > 0) {
          const backendMessages: ChatMessage[] = res.data.map((m: any) => ({
            id: String(m.id || m._id),
            sender:
              m.senderRole === 'operator'
                ? 'operator'
                : m.senderRole === 'bot'
                ? 'bot'
                : 'user',
            text: m.messageText,
            isImage: Boolean(m.imageAttachment || m.type === 'image'),
            imageUri: m.imageAttachment,
            isLocation: Boolean(m.mapLocationPin || m.locationUrl),
            locationUrl: m.mapLocationPin?.url || m.locationUrl,
            time: m.timeString || formatCurrentTime(),
          }));

          setMessages(backendMessages);
        }
      } catch (err) {
        // Graceful offline fallback
      }
    };

    fetchMessages();
    const pollInterval = setInterval(fetchMessages, 3500);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [currentUserId]);

  // 1. Citizen sends garbage photo -> Bot automatically asks: "Sir, please send your current location"
  const handleSendImage = async () => {
    const timeStr = formatCurrentTime();
    const tempId = 'temp-' + Date.now();

    const userImgMsg: ChatMessage = {
      id: tempId,
      sender: 'user',
      isImage: true,
      text: 'Reported garbage photo',
      time: timeStr,
    };

    setMessages((prev) => [...prev, userImgMsg]);

    try {
      const res = await apiService.sendChatMessage({
        userId: currentUserId,
        senderName: currentUserName,
        senderRole: 'user',
        channel: 'mobile_app',
        imageAttachment:
          'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
        messageText: 'Reported garbage photo from mobile app',
      });

      if (res && res.botReply) {
        const botReplyMsg: ChatMessage = {
          id: String(res.botReply._id || Date.now() + 1),
          sender: 'bot',
          text: res.botReply.messageText || t.botAskLocation,
          time: res.botReply.timeString || timeStr,
        };
        setMessages((prev) => [...prev, botReplyMsg]);
      } else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: String(Date.now() + 1),
              sender: 'bot',
              text: t.botAskLocation,
              time: timeStr,
            },
          ]);
        }, 500);
      }
    } catch (err) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'bot',
            text: t.botAskLocation,
            time: timeStr,
          },
        ]);
      }, 500);
    }
  };

  // 2. Citizen sends location coordinates -> Bot acknowledges, web user can now save manually
  const handleSendLocation = async () => {
    const timeStr = formatCurrentTime();
    const tempId = 'temp-' + Date.now();

    const locMsg: ChatMessage = {
      id: tempId,
      sender: 'user',
      isLocation: true,
      text: t.gpsReportedText,
      time: timeStr,
    };

    setMessages((prev) => [...prev, locMsg]);

    try {
      const res = await apiService.sendChatMessage({
        userId: currentUserId,
        senderName: currentUserName,
        senderRole: 'user',
        channel: 'mobile_app',
        mapLocationPin: {
          lat: 6.9388,
          lng: 80.0160,
          address: 'Ranala Junction, Hanwella Road',
          url: 'https://www.google.com/maps/search/?api=1&query=6.9388,80.0160',
        },
        messageText: 'https://maps.app.goo.gl/iXuHwxJhcifJZUT7A',
      });

      if (res && res.botReply) {
        const botReplyMsg: ChatMessage = {
          id: String(res.botReply._id || Date.now() + 1),
          sender: 'bot',
          text: res.botReply.messageText || t.botLocationConfirmed,
          time: res.botReply.timeString || timeStr,
        };
        setMessages((prev) => [...prev, botReplyMsg]);
      } else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: String(Date.now() + 1),
              sender: 'bot',
              text: t.botLocationConfirmed,
              time: timeStr,
            },
          ]);
        }, 500);
      }
    } catch (err) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'bot',
            text: t.botLocationConfirmed,
            time: timeStr,
          },
        ]);
      }, 500);
    }
  };

  // 3. Citizen sends text message
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const timeStr = formatCurrentTime();
    setInputText('');

    const userMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      sender: 'user',
      text: userText,
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await apiService.sendChatMessage({
        userId: currentUserId,
        senderName: currentUserName,
        senderRole: 'user',
        channel: 'mobile_app',
        messageText: userText,
      });

      if (res && res.botReply) {
        const botReplyMsg: ChatMessage = {
          id: String(res.botReply._id || Date.now() + 1),
          sender: 'bot',
          text: res.botReply.messageText,
          time: res.botReply.timeString || timeStr,
        };
        setMessages((prev) => [...prev, botReplyMsg]);
      }
    } catch (err) {
      // Non-blocking
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.headerTitle}>{t.chatbotTitle}</Text>
            <Text style={styles.headerSubtitle}>
              Connected to Municipal Bot • 24/7 Live
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={onNavigateAccount}
            activeOpacity={0.7}
          >
            <NavProfileIcon size={30} color="#2D6A4F" />
          </TouchableOpacity>
        </View>

        {/* Chat Messages Body */}
        <KeyboardAvoidingView
          style={styles.chatArea}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((msg) => {
              // 1. Municipal Operator Message (Saved Location Confirmation)
              if (msg.sender === 'operator') {
                return (
                  <View key={msg.id} style={styles.operatorMessageRow}>
                    <View style={styles.operatorAvatarWrapper}>
                      <Text style={styles.operatorBadgeIcon}>🛡️</Text>
                    </View>
                    <View style={styles.operatorBubble}>
                      <Text style={styles.operatorHeader}>
                        Municipal Operator Verified
                      </Text>
                      <Text style={styles.operatorMessageText}>{msg.text}</Text>
                      <Text style={styles.operatorTimeText}>{msg.time}</Text>
                    </View>
                  </View>
                );
              }

              // 2. Automated Bot Reply Message
              if (msg.sender === 'bot') {
                return (
                  <View key={msg.id} style={styles.botMessageRow}>
                    <View style={styles.botAvatarWrapper}>
                      <BotAvatarVector size={30} />
                    </View>
                    <View style={styles.botBubble}>
                      <Text style={styles.botMessageText}>{msg.text}</Text>
                      <Text style={styles.botTimeText}>{msg.time}</Text>
                    </View>
                  </View>
                );
              }

              // 3. User Message (Garbage photo, GPS location, or text)
              return (
                <View key={msg.id} style={styles.userMessageRow}>
                  {msg.isImage ? (
                    <View style={styles.userImageBubble}>
                      <ReportedWasteVector />
                      <View style={styles.imageTimeBadge}>
                        <Text style={styles.imageTimeText}>{msg.time}</Text>
                      </View>
                    </View>
                  ) : msg.isLocation ? (
                    <View style={styles.userLocationBubble}>
                      <Text style={styles.userLocationText}>{msg.text}</Text>
                      <Text style={styles.userTimeText}>{msg.time}</Text>
                    </View>
                  ) : (
                    <View style={styles.userTextBubble}>
                      <Text style={styles.userMessageText}>{msg.text}</Text>
                      <Text style={styles.userTimeText}>{msg.time}</Text>
                    </View>
                  )}

                  {/* User Profile Avatar Pill on bottom right */}
                  <View style={styles.userAvatarBubble}>
                    <NavProfileIcon size={20} color="#1E293B" />
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Floating Pill Chat Input Bar */}
          <View style={styles.inputBarWrapper}>
            <View style={styles.inputPillBar}>
              {/* Left Action Buttons: Send Photo / Camera */}
              <TouchableOpacity
                style={styles.inputActionBtn}
                activeOpacity={0.7}
                onPress={handleSendImage}
                testID="btn-send-image"
              >
                <Text style={styles.plusSignText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inputActionBtn}
                activeOpacity={0.7}
                onPress={handleSendImage}
                testID="btn-camera-upload"
              >
                <CameraIcon size={20} color="#15803D" />
              </TouchableOpacity>

              <View style={styles.inputDivider} />

              {/* Text Input */}
              <TextInput
                style={styles.textInput}
                placeholder={t.chatPlaceholder}
                placeholderTextColor="#64748B"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />

              {/* Right Action Buttons: Location Pin & Send */}
              <TouchableOpacity
                style={styles.inputActionBtn}
                onPress={handleSendLocation}
                activeOpacity={0.7}
                testID="btn-send-location"
              >
                <LocationPinIcon size={20} color="#15803D" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSendMessage}
                activeOpacity={0.7}
              >
                <SendIcon size={18} color="#15803D" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Bottom Footer Navbar */}
        <View
          style={[
            styles.bottomNavBar,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          {/* Home Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateHome}
            activeOpacity={0.7}
          >
            <NavHomeIcon size={26} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Chatbot Tab (Active) */}
          <TouchableOpacity
            style={[styles.navItem, styles.navItemActive]}
            activeOpacity={0.7}
          >
            <NavSmartBinIcon size={26} color="#86EFAC" />
          </TouchableOpacity>

          {/* Account Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateAccount}
            activeOpacity={0.7}
          >
            <NavProfileIcon size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  topHeader: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '500',
    marginTop: 1,
  },
  profileBtn: {
    padding: 4,
  },
  chatArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 18,
  },
  botMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    maxWidth: '85%',
  },
  botAvatarWrapper: {
    marginTop: 2,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  botMessageText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#0F172A',
    fontWeight: '400',
  },
  botTimeText: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 4,
  },
  operatorMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    maxWidth: '85%',
  },
  operatorAvatarWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  operatorBadgeIcon: {
    fontSize: 14,
  },
  operatorBubble: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  operatorHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 2,
  },
  operatorMessageText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#0F172A',
  },
  operatorTimeText: {
    fontSize: 10,
    color: '#0284C7',
    textAlign: 'right',
    marginTop: 4,
  },
  userMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 8,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  userImageBubble: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  imageTimeBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  imageTimeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  userTextBubble: {
    backgroundColor: '#2D6A4F',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '85%',
  },
  userLocationBubble: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  userMessageText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  userLocationText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#15803D',
    fontWeight: '600',
  },
  userTimeText: {
    fontSize: 10,
    color: '#CBD5E1',
    textAlign: 'right',
    marginTop: 4,
  },
  userAvatarBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  inputBarWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
  inputPillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  inputActionBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  plusSignText: {
    fontSize: 22,
    color: '#64748B',
    fontWeight: '300',
    marginTop: -2,
  },
  inputDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  sendBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  bottomNavBar: {
    backgroundColor: '#2D6A4F',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  navItemActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#86EFAC',
  },
});

export default ChatbotScreen;
