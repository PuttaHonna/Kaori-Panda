import { useState } from 'react';
import { ChevronLeft, Mail, Calendar, MessageCircle, User, Languages, AlertTriangle, RotateCcw, Bell, Trash2, Target, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useNotifications } from '@/hooks/useNotifications';
import { ELEVENLABS_VOICES } from '@/lib/elevenlabs';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { state, dispatch } = useApp();
  const { isRemindersEnabled, toggleReminders } = useNotifications();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleSettingChange = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } as Partial<typeof state.settings> });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_PROGRESS' });
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-white z-50 flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center px-4 h-14 border-b border-gray-100">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-gray-900">Settings</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Account Information */}
        <section className="py-4">
          <h2 className="px-4 text-sm font-semibold text-gray-900 mb-3">Account Information</h2>
          <div className="px-4 space-y-1">
            <div className="flex items-center gap-4 py-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{state.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="text-gray-900">{formatDate(state.user.createdAt)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conversation Settings */}
        <section className="py-4 border-t border-gray-100">
          <h2 className="px-4 text-sm font-semibold text-gray-900 mb-3">Conversation Settings</h2>
          <div className="px-4 space-y-1">
            {/* Difficulty */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-bamboo-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-bamboo-500" />
                </div>
                <span className="text-gray-900">Difficulty</span>
              </div>
              <select
                value={state.settings.difficulty}
                onChange={(e) => handleSettingChange('difficulty', e.target.value)}
                className={cn('appearance-none bg-transparent text-right text-gray-600 pr-6', 'focus:outline-none cursor-pointer')}
              >
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </div>

            {/* Voice Gender */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-bamboo-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-bamboo-500" />
                </div>
                <span className="text-gray-900">Voice Gender</span>
              </div>
              <select
                value={state.settings.voiceGender}
                onChange={(e) => {
                  const newGender = e.target.value;
                  handleSettingChange('voiceGender', newGender);
                  // Automatically switch the selected premium voice to match the new gender
                  const firstVoice = ELEVENLABS_VOICES.find(v => v.gender === newGender);
                  if (firstVoice) {
                    dispatch({ type: 'UPDATE_SETTINGS', payload: { voiceGender: newGender as "male" | "female", elevenLabsVoiceId: firstVoice.id } });
                  }
                }}
                className={cn('appearance-none bg-transparent text-right text-gray-600 pr-6', 'focus:outline-none cursor-pointer')}
              >
                <option value="female">female</option>
                <option value="male">male</option>
              </select>
            </div>

            {/* AI Custom Voice */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-bamboo-100 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-bamboo-500" />
                </div>
                <span className="text-gray-900">AI Premium Voice</span>
              </div>
              <select
                value={state.settings.elevenLabsVoiceId || 'wcs09USXSN5Bl7FXohVZ'}
                onChange={(e) => handleSettingChange('elevenLabsVoiceId', e.target.value)}
                className={cn('appearance-none bg-transparent text-right text-gray-600 pr-6 w-48 truncate', 'focus:outline-none cursor-pointer')}
              >
                {ELEVENLABS_VOICES.filter(v => v.gender === state.settings.voiceGender).map(voice => (
                  <option key={voice.id} value={voice.id}>{voice.name}</option>
                ))}
              </select>
            </div>

            {/* Display Mode */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-bamboo-100 flex items-center justify-center">
                  <Languages className="w-5 h-5 text-bamboo-500" />
                </div>
                <span className="text-gray-900">Furigana/Romaji</span>
              </div>
              <select
                value={state.settings.displayMode}
                onChange={(e) => handleSettingChange('displayMode', e.target.value)}
                className={cn('appearance-none bg-transparent text-right text-gray-600 pr-6', 'focus:outline-none cursor-pointer')}
              >
                <option value="romaji">romaji</option>
                <option value="furigana">furigana</option>
                <option value="both">both</option>
              </select>
            </div>

            {/* Target JLPT Level */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-bamboo-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-bamboo-500" />
                </div>
                <span className="text-gray-900">JLPT Goal</span>
              </div>
              <select
                value={state.targetJlpt}
                onChange={(e) => dispatch({ type: 'SET_TARGET_JLPT', payload: e.target.value as "N5" | "N4" | "N3" | "N2" | "N1" })}
                className={cn('appearance-none bg-transparent text-right text-gray-600 pr-6 font-bold', 'focus:outline-none cursor-pointer')}
              >
                <option value="N5">N5 (Beginner)</option>
                <option value="N4">N4 (Basic)</option>
                <option value="N3">N3 (Intermediate)</option>
                <option value="N2">N2 (Advanced)</option>
                <option value="N1">N1 (Fluent)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="py-4 border-t border-gray-100">
          <h2 className="px-4 text-sm font-semibold text-gray-900 mb-3">Notifications</h2>
          <div className="px-4 space-y-1">
            <div className="flex items-center justify-between py-3 cursor-pointer select-none" onClick={() => toggleReminders(!isRemindersEnabled)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <span className="text-gray-900 block">Daily Reminders</span>
                  <span className="text-xs text-gray-400">Never lose your streak</span>
                </div>
              </div>

              {/* iOS Toggle Switch */}
              <div className={cn(
                "w-12 h-6 rounded-full transition-colors relative flex items-center",
                isRemindersEnabled ? "bg-green-500" : "bg-gray-200"
              )}>
                <motion.div
                  layout
                  className="w-5 h-5 bg-white rounded-full shadow-sm absolute"
                  animate={{ left: isRemindersEnabled ? "calc(100% - 1.25rem - 2px)" : "2px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Account Actions */}
        <section className="py-4 border-t border-gray-100">
          <h2 className="px-4 text-sm font-semibold text-gray-900 mb-3">Account Actions</h2>
          <div className="px-4 space-y-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50',
                'text-left transition-colors hover:bg-red-100 active:scale-[0.98]'
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-red-700">Reset Progress</p>
                <p className="text-sm text-red-500">Clear all stats, words, and history</p>
              </div>
            </button>

            <AnimatePresence>
              {resetDone && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-green-700 text-sm"
                >
                  ✅ Progress has been reset.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <button className="hover:text-gray-600 transition-colors">Privacy</button>
            <button className="hover:text-gray-600 transition-colors">Terms</button>
            <span>v2.5.0</span>
          </div>
        </footer>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Reset Progress?
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm mt-2">
            This will permanently delete all your stats, conversation history, and word bank. This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => setShowResetConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
              onClick={handleReset}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
