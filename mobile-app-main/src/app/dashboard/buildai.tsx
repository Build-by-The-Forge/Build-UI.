import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { useThemedStyles } from '@/hooks/useThemedStyles';

type Message = { id: number; role: 'user' | 'assistant'; content: string };
const prompts = ['Explain a difficult topic', 'Help me plan my study time', 'Quiz me on a course'];
const endpoint = process.env.EXPO_PUBLIC_BUILD_AI_API_URL;

export default function BuildAIScreen() {
  const ui = useThemedStyles(styles);
  const { width } = useWindowDimensions();
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const scroll = useRef<ScrollView>(null);
  const narrow = width < 600;

  async function send(value = draft) {
    const content = value.trim();
    if (!content || busy) return;
    const next: Message[] = [...messages, { id: Date.now(), role: 'user', content }];
    setMessages(next);
    setDraft('');
    setError('');
    if (!endpoint) {
      setError('BUILD AI chat needs an AI service connection before it can reply.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content: text }) => ({ role, content: text })) }),
      });
      if (!response.ok) throw new Error(`Service returned ${response.status}`);
      const data = await response.json();
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('No reply received');
      setMessages(current => [...current, { id: Date.now() + 1, role: 'assistant', content: data.reply.trim() }]);
    } catch {
      setError('BUILD AI could not reply. Check the connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={ui.page}>
      <KeyboardAvoidingView style={ui.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[ui.content, { maxWidth: narrow ? undefined : 820 }]}>
          <View style={ui.header}>
            <Image source={require('@/assets/images/build-ai-logo.png')} resizeMode="contain" style={ui.logo} />
            <View><Text style={ui.title}>BUILD AI</Text><Text style={ui.subtitle}>Your campus study companion</Text></View>
          </View>
          <ScrollView ref={scroll} style={ui.fill} contentContainerStyle={ui.messages} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} keyboardShouldPersistTaps="handled">
            {messages.length === 0 ? (
              <View style={ui.welcome}>
                <Image source={require('@/assets/images/build-ai-logo.png')} resizeMode="contain" style={ui.welcomeLogo} />
                <Text style={ui.welcomeTitle}>What can I help you learn?</Text>
                <Text style={ui.welcomeText}>Ask a question, work through a concept, or make a plan for your next study session.</Text>
                <View style={ui.prompts}>{prompts.map(prompt => <TouchableOpacity key={prompt} style={ui.prompt} onPress={() => send(prompt)}><Text style={ui.promptText}>{prompt}</Text><Ionicons name="arrow-up-outline" size={16} color="#2563EB" /></TouchableOpacity>)}</View>
              </View>
            ) : messages.map(message => <View key={message.id} style={[ui.bubble, message.role === 'user' ? ui.userBubble : ui.aiBubble]}><Text style={[ui.bubbleText, message.role === 'user' && ui.userText]}>{message.content}</Text></View>)}
            {busy && <ActivityIndicator style={ui.loading} color="#2563EB" />}
            {!!error && <Text style={ui.error}>{error}</Text>}
          </ScrollView>
          <View style={ui.composer}><TextInput value={draft} onChangeText={setDraft} placeholder="Message BUILD AI" placeholderTextColor="#94A3B8" multiline style={ui.input} accessibilityLabel="Message BUILD AI" /><TouchableOpacity onPress={() => send()} disabled={!draft.trim() || busy} style={[ui.send, (!draft.trim() || busy) && ui.sendDisabled]} accessibilityLabel="Send message"><Ionicons name="arrow-up" size={20} color="#FFFFFF" /></TouchableOpacity></View>
          <Text style={ui.note}>Check important answers against your course materials.</Text>
        </View>
      </KeyboardAvoidingView>
      <DashboardBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F8FAFC' }, fill: { flex: 1 }, content: { width: '100%', flex: 1, alignSelf: 'center', paddingTop: 24, paddingHorizontal: 18, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }, logo: { width: 38, height: 42 }, title: { fontSize: 20, fontWeight: '800', color: '#0F172A' }, subtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  messages: { flexGrow: 1, paddingVertical: 24, gap: 14 }, welcome: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 36 }, welcomeLogo: { width: 66, height: 74 }, welcomeTitle: { fontSize: 23, fontWeight: '800', color: '#0F172A', marginTop: 18, textAlign: 'center' }, welcomeText: { color: '#64748B', textAlign: 'center', lineHeight: 22, maxWidth: 400, marginTop: 10 }, prompts: { width: '100%', maxWidth: 410, gap: 10, marginTop: 28 }, prompt: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DBEAFE', borderRadius: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, promptText: { color: '#1E3A8A', fontWeight: '600', flexShrink: 1 },
  bubble: { maxWidth: '85%', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12 }, userBubble: { alignSelf: 'flex-end', backgroundColor: '#2563EB', borderBottomRightRadius: 5 }, aiBubble: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 5 }, bubbleText: { color: '#1E293B', fontSize: 15, lineHeight: 22 }, userText: { color: '#FFFFFF' }, loading: { alignSelf: 'flex-start', margin: 10 }, error: { color: '#B45309', backgroundColor: '#FFFBEB', padding: 12, borderRadius: 10, lineHeight: 19 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderWidth: 1, borderRadius: 20, padding: 8, gap: 8 }, input: { flex: 1, maxHeight: 120, minHeight: 38, paddingHorizontal: 10, paddingVertical: 8, fontSize: 15, color: '#0F172A' }, send: { backgroundColor: '#2563EB', width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, sendDisabled: { backgroundColor: '#94A3B8' }, note: { color: '#94A3B8', fontSize: 11, textAlign: 'center', marginTop: 8 },
});
