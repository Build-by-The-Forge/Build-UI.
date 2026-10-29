import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { Fonts } from '@/constants/theme';
import { ChatMessage } from '@/types/dashboard';

const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  background: '#FFFFFF',
  surface: '#F3F4F6',
  online: '#22C55E',
};

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  image?: boolean;
  read?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'them',
    text: 'Hey! Have you seen the new Python challenge posted in the group? 🐍',
    time: '10:24 AM',
  },
  {
    id: 'm2',
    sender: 'me',
    text: 'Not yet! Just finished the Integration Techniques notes. Is it about data structures?',
    time: '10:26 AM',
    read: true,
  },
  {
    id: 'm3',
    sender: 'them',
    image: true,
    text: "Exactly! It's focused on Big O optimization. Check this snippet.",
    time: '10:27 AM',
  },
  {
    id: 'm4',
    sender: 'me',
    text: "Looks great! I'll test it in the study workspace now.",
    time: '10:28 AM',
    read: true,
  },
];

const FRIENDS = [
  { name: 'Sarah Jenkins', preview: 'Looks great! I’ll test it in the study workspace now.', time: '10:28', color: '#2563EB', unread: 0 },
  { name: 'Michael Ade', preview: 'Are you joining the revision session today?', time: '09:42', color: '#0D9488', unread: 2 },
  { name: 'Amina Bello', preview: 'I sent you the lecture notes.', time: 'Yesterday', color: '#E87944', unread: 0 },
  { name: 'David Okafor', preview: 'Thanks for the help with that question!', time: 'Yesterday', color: '#8B5CF6', unread: 0 },
];

function ChatInbox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const friends = FRIENDS.filter(friend => friend.name.toLowerCase().includes(query.toLowerCase()));
  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.inboxHeader}><View><Text style={styles.inboxTitle}>Chats</Text><Text style={styles.inboxSubtitle}>Stay connected with your friends</Text></View><Ionicons name="chatbubbles-outline" size={24} color={COLORS.primary} /></View>
    <View style={styles.inboxSearch}><Ionicons name="search-outline" size={20} color={COLORS.textMuted} /><TextInput value={query} onChangeText={setQuery} placeholder="Search friends" placeholderTextColor={COLORS.textMuted} style={styles.inboxSearchInput} /></View>
    <ScrollView contentContainerStyle={styles.inboxList} keyboardShouldPersistTaps="handled">
      <Text style={styles.inboxLabel}>MESSAGES</Text>
      {friends.length ? friends.map(friend => <TouchableOpacity key={friend.name} style={styles.friendRow} onPress={() => router.push({ pathname: '/dashboard/chatscreen', params: { name: friend.name } })} activeOpacity={0.75}>
        <View style={[styles.friendAvatar, { backgroundColor: friend.color }]}><Text style={styles.friendInitials}>{friend.name.split(' ').map(part => part[0]).join('')}</Text></View>
        <View style={styles.friendInfo}><View style={styles.friendTop}><Text style={styles.friendName}>{friend.name}</Text><Text style={styles.friendTime}>{friend.time}</Text></View><View style={styles.friendBottom}><Text style={styles.friendPreview} numberOfLines={1}>{friend.preview}</Text>{friend.unread > 0 && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{friend.unread}</Text></View>}</View></View>
      </TouchableOpacity>) : <Text style={styles.noFriends}>No friends match your search.</Text>}
    </ScrollView>
    <DashboardBottomNav activeTab="chat" />
  </SafeAreaView>;
}

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string }>();
  const [messages, setMessages] = useState<Message[]>(params.name === 'Sarah Jenkins' ? INITIAL_MESSAGES : []);
  const [draft, setDraft] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const contactName = params.name || '';
  useEffect(() => { setMessages(contactName === 'Sarah Jenkins' ? INITIAL_MESSAGES : []); }, [contactName]);

  const sendMessage = () => {
    if (!draft.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setDraft('');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (!contactName) return <ChatInbox />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/dashboard/chatscreen')} hitSlop={8} style={styles.backButton} accessibilityLabel="Back to chats">
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerAvatarWrap}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarInitials}>
                {contactName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </Text>
            </View>
          </View>
          <View style={styles.headerTitles}>
            <Text style={styles.headerName}>{contactName}</Text>
            <Text style={styles.headerStatus}>Conversation</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon} accessibilityLabel="Voice call">
            <Ionicons name="call-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} accessibilityLabel="Video call">
            <Ionicons name="videocam-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.dayDividerWrap}>
            <View style={styles.dayDividerPill}>
              <Text style={styles.dayDividerText}>TODAY</Text>
            </View>
          </View>

          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <View
                key={msg.id}
                style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}
              >
                {!isMe && (
                  <View style={styles.messageAvatar}>
                    <Text style={styles.messageAvatarText}>{contactName.split(' ').map(part => part[0]).join('').slice(0, 2)}</Text>
                  </View>
                )}
                <View style={{ maxWidth: '75%' }}>
                  <View
                    style={[
                      styles.bubble,
                      isMe ? styles.bubbleMe : styles.bubbleThem,
                      msg.image && styles.bubbleWithImage,
                    ]}
                  >
                    {msg.image && (
                      <View style={styles.codeImage}>
                        <Text style={styles.codeImageText}>{'</> function bigO(n) { return O(1); }'}</Text>
                      </View>
                    )}
                    <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{msg.text}</Text>
                  </View>
                  <View style={[styles.metaRow, isMe && styles.metaRowMe]}>
                    <Text style={styles.timeText}>{msg.time}</Text>
                    {isMe && msg.read && <Text style={styles.readTick}> ✓✓</Text>}
                  </View>
                </View>
              </View>
            );
          })}

          {messages.length === 0 && <Text style={styles.emptyConversation}>Start your conversation with {contactName}.</Text>}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachmentButton} hitSlop={8} accessibilityLabel="Attach a file">
            <Ionicons name="attach" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textMuted}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.emojiButton} hitSlop={8} accessibilityLabel="Choose an emoji">
            <Ionicons name="happy-outline" size={22} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} activeOpacity={0.8}>
            <Ionicons name="send" size={17} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  inboxHeader: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inboxTitle: { color: COLORS.textPrimary, fontSize: 28, fontWeight: '800', fontFamily: Fonts.bold },
  inboxSubtitle: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  inboxSearch: { marginHorizontal: 20, paddingHorizontal: 14, height: 46, borderRadius: 14, backgroundColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', gap: 10 },
  inboxSearchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary, height: 44 },
  inboxList: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 130 },
  inboxLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  friendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 13 },
  friendAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  friendInitials: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  friendInfo: { flex: 1, gap: 5 }, friendTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  friendName: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', flexShrink: 1 },
  friendTime: { color: COLORS.textMuted, fontSize: 11 }, friendBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  friendPreview: { color: COLORS.textSecondary, fontSize: 12, flex: 1 },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  noFriends: { color: COLORS.textMuted, textAlign: 'center', marginTop: 40 },
  emptyConversation: { color: COLORS.textMuted, textAlign: 'center', marginTop: 50, fontSize: 13 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  backButton: { width: 32, height: 38, alignItems: 'flex-start', justifyContent: 'center', marginRight: 4 },
  headerAvatarWrap: { position: 'relative', marginRight: 10 },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarInitials: { color: COLORS.primary, fontWeight: '800', fontSize: 13 },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: COLORS.online,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitles: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '800', fontFamily: Fonts.bold, color: COLORS.textPrimary },
  headerStatus: { fontSize: 11.5, color: COLORS.online, marginTop: 1, fontFamily: Fonts.medium, fontWeight: '600' },
  headerIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', marginLeft: 4, borderRadius: 19, backgroundColor: '#F1F5F9' },

  messagesContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 140 },

  dayDividerWrap: { alignItems: 'center', marginBottom: 16 },
  dayDividerPill: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayDividerText: { fontSize: 10, color: COLORS.textMuted, fontWeight: '800', fontFamily: Fonts.bold, letterSpacing: 0.5 },

  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14 },
  messageRowThem: { justifyContent: 'flex-start' },
  messageRowMe: { justifyContent: 'flex-end' },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E7FF',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageAvatarText: { color: '#4338CA', fontSize: 10, fontWeight: '800', fontFamily: Fonts.bold },

  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleThem: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 4,
  },
  bubbleMe: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleWithImage: { padding: 10 },
  bubbleText: { fontSize: 14, color: COLORS.textPrimary, fontFamily: Fonts.regular, lineHeight: 20 },
  bubbleTextMe: { color: '#fff', fontWeight: '500', fontFamily: Fonts.medium },

  codeImage: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    minHeight: 60,
    justifyContent: 'center',
  },
  codeImageText: { color: '#38BDF8', fontSize: 12, fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }) },

  metaRow: { flexDirection: 'row', marginTop: 4, paddingHorizontal: 2 },
  metaRowMe: { justifyContent: 'flex-end' },
  timeText: { fontSize: 10.5, color: COLORS.textMuted, fontWeight: '500' },
  readTick: { fontSize: 10.5, color: COLORS.primary, fontWeight: '700' },

  typingBubble: { paddingVertical: 10, paddingHorizontal: 14 },
  typingDots: { fontSize: 14, color: COLORS.textMuted, letterSpacing: 2 },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
    gap: 8,
  },
  attachmentButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiButton: { width: 34, height: 38, alignItems: 'center', justifyContent: 'center' },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
