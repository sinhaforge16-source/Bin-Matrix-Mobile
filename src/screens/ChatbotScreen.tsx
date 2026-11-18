import React, { useState, useRef } from 'react';
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

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  isImage?: boolean;
  isLocation?: boolean;
  time: string;
}

interface Props {
  language?: Language;
  onNavigateHome: () => void;
  onNavigateAccount: () => void;
}

export const ChatbotScreen: React.FC<Props> = ({
  language = 'en',
  onNavigateHome,
  onNavigateAccount,
}) => {
  const insets = useSafeAreaInsets();
  const t = TRANSLATIONS[language];
  const scrollViewRef = useRef<any>(null);
  const [inputText, setInputText] = useState('');

  // Initial messages matching the mockup with localization
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: t.botGreeting,
      time: '9.57 am',
    },
    {
      id: '2',
      sender: 'user',
      isImage: true,
      time: '9.58 am',
    },
    {
      id: '3',
      sender: 'bot',
      text: t.botAskLocation,
      time: '9.59 am',
    },
  ]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      time: '10.00 am',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulated intelligent bot reply
    setTimeout(() => {
      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text:
          language === 'si'
            ? 'ස්තූතියි! නාගරික අපද්‍රව්‍ය කළමනාකරණ කණ්ඩායම ඔබගේ ස්ථානයට පිටත් කර ඇත.'
            : 'Thank you! The municipal waste management team has been dispatched to your location.',
        time: '10.01 am',
      };
      setMessages((prev) => [...prev, botReply]);
    }, 900);
  };

  const handleSendLocation = () => {
    const locMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      isLocation: true,
      text: t.gpsReportedText,
      time: '10.00 am',
    };

    setMessages((prev) => [...prev, locMsg]);

    setTimeout(() => {
      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: t.botLocationConfirmed,
        time: '10.01 am',
      };
      setMessages((prev) => [...prev, botReply]);
    }, 900);
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>{t.chatbotTitle}</Text>
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
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              if (isBot) {
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

              // User message
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
              {/* Left Action Buttons */}
              <TouchableOpacity style={styles.inputActionBtn} activeOpacity={0.7}>
                <Text style={styles.plusSignText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.inputActionBtn} activeOpacity={0.7}>
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

              {/* Right Action Buttons */}
              <TouchableOpacity
                style={styles.inputActionBtn}
                onPress={handleSendLocation}
                activeOpacity={0.7}
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
    fontWeight: '600',
    color: '#64748B',
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
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  inputPillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5', // Soft pastel mint green from mockup
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  plusSignText: {
    fontSize: 22,
    color: '#15803D',
    fontWeight: 'bold',
    lineHeight: 24,
  },
  inputActionBtn: {
    padding: 6,
  },
  inputDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#6EE7B7',
    marginHorizontal: 4,
  },
  textInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  sendBtn: {
    padding: 6,
  },
  bottomNavBar: {
    backgroundColor: '#1E3A2F',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    padding: 8,
    borderRadius: 16,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
});
