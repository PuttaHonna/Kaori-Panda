import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import type { N5Lesson } from '@/types/lesson';
import { FuriganaText } from '@/components/shared/FuriganaText';

interface LessonPlayerProps {
    lesson: N5Lesson;
    onStartQuiz: (lessonNumber: number) => void;
    onBack?: () => void;
}

export function LessonPlayer({ lesson, onStartQuiz, onBack }: LessonPlayerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-gray-50 z-50 flex flex-col font-sans"
        >
            {/* Header */}
            <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                            <ChevronRight className="w-6 h-6 rotate-180" />
                        </button>
                    )}
                    <div>
                        <div className="text-xs font-bold text-bamboo-500 uppercase tracking-wider mb-0.5">
                            Lesson {lesson.lessonNumber}
                        </div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            {lesson.title}
                        </h1>
                    </div>
                </div>
            </header>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Grammar Points */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-200 pb-2">
                            <BookOpen className="w-5 h-5 text-bamboo-500" />
                            <h2 className="font-bold text-xl">Grammar & Patterns</h2>
                        </div>

                        <div className="space-y-6">
                            {lesson.grammar.map((point, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                                >
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{point.rule}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{point.explanation}</p>
                                    </div>

                                    {point.examples.length > 0 && (
                                        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                                            {point.examples.map((ex, exIndex) => (
                                                <div key={exIndex} className="space-y-1">
                                                    <div className="text-lg text-gray-900 font-medium jp-text">
                                                        <FuriganaText text={ex.jp} />
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {ex.en}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Bottom Bar: Action */}
            <div className="bg-white border-t border-gray-100 p-4 sticky bottom-0 z-10 pb-safe">
                <a
                    href={`/quiz/${lesson.lessonNumber}`}
                    onClick={(e) => {
                        if (onStartQuiz) {
                            e.preventDefault();
                            onStartQuiz(lesson.lessonNumber);
                        }
                    }}
                    className="w-full max-w-2xl mx-auto flex items-center justify-center bg-bamboo-500 hover:bg-bamboo-600 text-white font-bold text-lg py-4 rounded-2xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-colors active:scale-[0.98]"
                >
                    Start Quiz
                </a>
            </div>
        </motion.div>
    );
}
