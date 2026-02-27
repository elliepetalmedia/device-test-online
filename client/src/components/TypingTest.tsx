import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Trophy, Target, Type, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { testStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// Common English words for the test
const WORD_LIST = [
    "the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "with", "as", "I", "his", "they", "be", "at", "one", "have", "this", "from", "or", "had", "by", "hot", "but", "some", "what", "there", "we", "can", "out", "other", "were", "all", "your", "when", "up", "use", "word", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "would", "write", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "could", "go", "come", "did", "my", "sound", "no", "most", "number", "who", "over", "know", "water", "than", "call", "first", "people", "may", "down", "side", "been", "now", "find", "any", "new", "work", "part", "take", "get", "place", "made", "live", "where", "after", "back", "little", "only", "round", "man", "year", "came", "show", "every", "good", "me", "give", "our", "under", "name", "very", "through", "just", "form", "much", "great", "think", "say", "help", "low", "line", "before", "turn", "cause", "same", "mean", "differ", "move", "right", "boy", "old", "too", "does", "tell", "sentence", "set", "three", "want", "air", "well", "also", "play", "small", "end", "put", "home", "read", "hand", "port", "large", "spell", "add", "even", "land", "here", "must", "big", "high", "such", "follow", "act", "why", "ask", "men", "change", "went", "light", "kind", "off", "need", "house", "picture", "try", "us", "again", "animal", "point", "mother", "world", "near", "build", "self", "earth", "father", "head", "stand", "own", "page", "should", "country", "found", "answer", "school", "grow", "study", "still", "learn", "plant", "cover", "food", "sun", "four", "thought", "let", "keep", "eye", "never", "last", "door", "between", "city", "tree", "cross", "since", "hard", "start", "might", "story", "saw", "far", "sea", "draw", "left", "late", "run", "don't", "while", "press", "close", "night", "real", "life", "few", "stop", "open", "seem", "together", "next", "white", "children", "begin", "got", "walk", "example", "ease", "paper", "often", "always", "music", "those", "both", "mark", "book", "letter", "until", "mile", "river", "car", "feet", "care", "second", "group", "carry", "took", "rain", "eat", "room", "friend", "began", "idea", "fish", "mountain", "north", "once", "base", "hear", "horse", "cut", "sure", "watch", "color", "face", "wood", "main", "enough", "plain", "girl", "usual", "young", "ready", "above", "ever", "red", "list", "though", "feel", "talk", "bird", "soon", "body", "dog", "family", "direct", "pose", "leave", "song", "measure", "state", "product", "black", "short", "numeral", "class", "wind", "question", "happen", "complete", "ship", "area", "half", "rock", "order", "fire", "south", "problem", "piece", "told", "knew", "pass", "farm", "top", "whole", "king", "size", "heard", "best", "hour", "better", "true", "during", "hundred", "am", "remember", "step", "early", "hold", "west", "ground", "interest", "reach", "fast", "five", "sing", "listen", "six", "table", "travel", "less", "morning", "ten", "simple", "several", "vowel", "toward", "war", "lay", "against", "pattern", "slow", "center", "love", "person", "money", "serve", "appear", "road", "map", "science", "rule", "govern", "pull", "cold", "notice", "voice", "fall", "power", "town", "fine", "certain", "fly", "unit", "lead", "cry", "dark", "machine", "note", "wait", "plan", "figure", "star", "box", "noun", "field", "rest", "correct", "able", "pound", "done", "beauty", "drive", "stood", "contain", "front", "teach", "week", "final", "gave", "green", "oh", "quick", "develop", "sleep", "warm", "free", "minute", "strong", "special", "mind", "behind", "clear", "tail", "produce", "fact", "street", "inch", "lot", "nothing", "course", "stay", "wheel", "full", "force", "blue", "object", "decide", "surface", "deep", "moon", "island", "foot", "yet", "busy", "test", "record", "boat", "common", "gold", "possible", "plane", "age", "dry", "wonder", "laugh", "thousand", "ago", "ran", "check", "game", "shape", "yes", "hot", "miss", "brought", "heat", "snow", "bed", "bring", "sit", "perhaps", "fill", "east", "weight", "language", "among"
];

const TEST_DURATION = 60; // 60 seconds
const WORDS_TO_GENERATE = 50;

export function TypingTest() {
    const [words, setWords] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState("");
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
    const [isTestActive, setIsTestActive] = useState(false);
    const [isTestFinished, setIsTestFinished] = useState(false);

    // Stats
    const [correctKeyStrokes, setCorrectKeyStrokes] = useState(0);
    const [incorrectKeyStrokes, setIncorrectKeyStrokes] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    // Track status of typed words: null (untyped), true (correct), false (incorrect)
    const [wordResults, setWordResults] = useState<(boolean | null)[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const generateWords = useCallback(() => {
        const shuffled = [...WORD_LIST].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, WORDS_TO_GENERATE);
        setWords(selected);
        setWordResults(new Array(WORDS_TO_GENERATE).fill(null));
    }, []);

    useEffect(() => {
        generateWords();
    }, [generateWords]);

    useEffect(() => {
        if (isTestActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTestActive) {
            finishTest();
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTestActive, timeLeft]);

    const calculateWPM = (correctKeys: number, elapsedMinutes: number) => {
        // Standard WPM formula: (total correct keystrokes / 5) / elapsed minutes
        if (elapsedMinutes === 0) return 0;
        const wordsTyped = (correctKeys / 5);
        return Math.round(wordsTyped / elapsedMinutes);
    };

    const finishTest = useCallback(() => {
        setIsTestActive(false);
        setIsTestFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);

        const elapsedMinutes = (TEST_DURATION - timeLeft) / 60;
        const finalWPM = calculateWPM(correctKeyStrokes, TEST_DURATION / 60); // calculate total WPM based on 60s
        const finalAccuracy = (correctKeyStrokes + incorrectKeyStrokes) > 0
            ? Math.round((correctKeyStrokes / (correctKeyStrokes + incorrectKeyStrokes)) * 100)
            : 0;

        setWpm(finalWPM);
        setAccuracy(finalAccuracy);

        testStore.addResult('typing', 'tested', {
            wpm: `${finalWPM} WPM`,
            accuracy: `${finalAccuracy}%`,
            correctKeys: correctKeyStrokes,
            errors: incorrectKeyStrokes
        });
    }, [correctKeyStrokes, incorrectKeyStrokes, timeLeft]);

    const resetTest = () => {
        setIsTestActive(false);
        setIsTestFinished(false);
        setTimeLeft(TEST_DURATION);
        setActiveWordIndex(0);
        setCurrentInput("");
        setCorrectKeyStrokes(0);
        setIncorrectKeyStrokes(0);
        setWpm(0);
        setAccuracy(100);
        generateWords();
        setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
        }, 100);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (!isTestActive && !isTestFinished && value.length === 1) {
            setIsTestActive(true);
        }

        if (isTestFinished) return;

        // Handle Spacebar (word completion)
        if (value.endsWith(' ')) {
            const typedWord = value.trim();
            const targetWord = words[activeWordIndex];

            if (typedWord === targetWord) {
                setCorrectKeyStrokes(prev => prev + targetWord.length + 1); // +1 for the space
                setWordResults(prev => {
                    const next = [...prev];
                    next[activeWordIndex] = true;
                    return next;
                });
            } else {
                setIncorrectKeyStrokes(prev => prev + Math.max(typedWord.length, targetWord.length) + 1);
                setWordResults(prev => {
                    const next = [...prev];
                    next[activeWordIndex] = false;
                    return next;
                });
            }

            setCurrentInput("");

            // If we reach the end of the word list, append more words
            if (activeWordIndex === words.length - 1) {
                const shuffled = [...WORD_LIST].sort(() => 0.5 - Math.random());
                const newWords = shuffled.slice(0, WORDS_TO_GENERATE);
                setWords(prev => [...prev, ...newWords]);
                setWordResults(prev => [...prev, ...new Array(WORDS_TO_GENERATE).fill(null)]);
            }

            setActiveWordIndex(prev => prev + 1);
        } else {
            setCurrentInput(value);

            // Real-time accuracy tracking (optional, but let's just do it at the end of word for now to save performance, 
            // or we can count individual stroke correctness but the prompt didn't strictly require it. I will keep it simple and clean).

            // Update running WPM and Accuracy
            const elapsedMinutes = (TEST_DURATION - timeLeft) / 60;
            if (elapsedMinutes > 0) {
                setWpm(calculateWPM(correctKeyStrokes, elapsedMinutes));
                const totalStrokes = correctKeyStrokes + incorrectKeyStrokes;
                setAccuracy(totalStrokes > 0 ? Math.round((correctKeyStrokes / totalStrokes) * 100) : 100);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Prevent ctrl+backspace from breaking the index if we wanted to support it, 
        // but for standard typing tests, backspace within a word is fine.
        if (e.key === 'Backspace' && currentInput === '') {
            // Allow going back to previous word to fix it? Most modern tests allow this if it's the current line.
            // For simplicity, we disable going back to a finished word.
            e.preventDefault();
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Live Stats sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="p-6 bg-surface border border-secondary/30 text-center flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Timer className="w-16 h-16 text-primary" />
                        </div>
                        <h4 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest z-10">Time Remaining</h4>
                        <div className={cn("text-5xl font-orbitron z-10", timeLeft <= 10 && isTestActive ? "text-neon-red animate-pulse" : "text-foreground")}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                    </Card>

                    <Card className="p-6 bg-surface border border-secondary/30 text-center flex flex-col items-center justify-center space-y-2">
                        <h4 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest">Live WPM</h4>
                        <div className="text-4xl font-orbitron text-primary glow-text">{wpm}</div>
                    </Card>

                    <Card className="p-6 bg-surface border border-secondary/30 text-center flex flex-col items-center justify-center space-y-2">
                        <h4 className="font-orbitron text-sm text-muted-foreground uppercase tracking-widest">Accuracy</h4>
                        <div className="text-4xl font-orbitron text-neon-green">{accuracy}%</div>
                    </Card>

                    <Button onClick={resetTest} variant="outline" className="w-full font-orbitron text-muted-foreground hover:text-white border-secondary/50">
                        <RotateCcw className="w-4 h-4 mr-2" /> Restart Test
                    </Button>
                </div>

                {/* Main Test Area */}
                <div className="lg:col-span-3 space-y-6">
                    {!isTestFinished ? (
                        <>
                            <Card className="p-6 md:p-10 bg-black/40 border m-0 border-secondary/20 min-h-[250px] relative overflow-hidden backdrop-blur-md">
                                {/* Word Display */}
                                <div
                                    className="font-roboto-mono text-2xl md:text-3xl leading-relaxed flex flex-wrap gap-x-3 gap-y-4 select-none relative"
                                    onClick={() => inputRef.current?.focus()}
                                >
                                    <div className={cn(
                                        "absolute inset-0 z-20 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300",
                                        isTestActive || timeLeft < TEST_DURATION ? "opacity-0 pointer-events-none" : "opacity-100"
                                    )}>
                                        <span className="text-primary font-orbitron tracking-widest animate-pulse border border-primary/50 bg-primary/10 px-6 py-3 rounded-full">
                                            Start typing to begin
                                        </span>
                                    </div>

                                    {words.map((word, index) => {
                                        // Only render a window of words around the active one for performance and visibility
                                        if (index < activeWordIndex - 10 || index > activeWordIndex + 20) return null;

                                        const isActive = index === activeWordIndex;
                                        const result = wordResults[index];

                                        let colorClass = "text-muted-foreground/60";
                                        if (isActive) colorClass = "text-foreground font-bold underline decoration-primary underline-offset-4";
                                        else if (result === true) colorClass = "text-neon-green/80";
                                        else if (result === false) colorClass = "text-neon-red/80 line-through decoration-neon-red/50";

                                        return (
                                            <span key={index} className={cn("transition-colors duration-100", colorClass)}>
                                                {word}
                                            </span>
                                        );
                                    })}
                                </div>
                            </Card>

                            <div className="relative">
                                <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={currentInput}
                                    onChange={handleInput}
                                    onKeyDown={handleKeyDown}
                                    disabled={isTestFinished}
                                    autoFocus
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    className="w-full bg-surface border-2 border-primary/50 rounded-xl py-4 pl-12 pr-4 text-xl font-roboto-mono text-white focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(102,252,241,0.3)] transition-all placeholder:text-muted-foreground/30"
                                    placeholder="Type the highlighted word and press space..."
                                />
                            </div>
                        </>
                    ) : (
                        <Card className="p-10 bg-black/40 border border-primary/30 min-h-[350px] flex flex-col items-center justify-center text-center relative overflow-hidden animate-in zoom-in-95 duration-500">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Trophy className="w-64 h-64 text-primary" />
                            </div>

                            <Trophy className="w-16 h-16 text-primary mb-6" />
                            <h2 className="text-3xl font-orbitron font-bold text-white mb-2 tracking-widest uppercase">Test Complete</h2>
                            <p className="text-muted-foreground mb-10 font-mono">Here are your final typing statistics</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-10 z-10">
                                <div className="bg-surface p-4 rounded-lg border border-secondary/20">
                                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Speed</div>
                                    <div className="text-3xl font-orbitron text-primary">{wpm} <span className="text-sm">WPM</span></div>
                                </div>
                                <div className="bg-surface p-4 rounded-lg border border-secondary/20">
                                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Accuracy</div>
                                    <div className="text-3xl font-orbitron text-neon-green">{accuracy}%</div>
                                </div>
                                <div className="bg-surface p-4 rounded-lg border border-secondary/20">
                                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Correct Strokes</div>
                                    <div className="text-2xl font-orbitron text-white mt-1">{correctKeyStrokes}</div>
                                </div>
                                <div className="bg-surface p-4 rounded-lg border border-secondary/20">
                                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Error Strokes</div>
                                    <div className="text-2xl font-orbitron text-neon-red mt-1">{incorrectKeyStrokes}</div>
                                </div>
                            </div>

                            <Button onClick={resetTest} size="lg" className="bg-primary text-black hover:bg-primary/80 font-orbitron tracking-widest relative z-10">
                                <RotateCcw className="w-5 h-5 mr-2" /> TAKE TEST AGAIN
                            </Button>
                        </Card>
                    )}
                </div>
            </div>

            <div className="p-8 bg-surface border border-secondary/30 rounded-lg">
                <h2 className="text-primary font-orbitron text-2xl mb-6 uppercase tracking-widest border-b border-secondary/30 pb-4">Understanding Your Typing Speed & Accuracy</h2>
                <div className="space-y-4 text-lg text-muted-foreground font-roboto-mono leading-relaxed">
                    <p>
                        This 60-second typing test is designed to measure your Words Per Minute (WPM) and absolute typing accuracy using a standardized algorithm. Whether you're a gamer, a software engineer, or performing data entry, knowing your true typing baseline helps you choose the right mechanical keyboard switches or layout.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong className="text-primary">How WPM is Calculated:</strong> Our test uses the international standard for calculating WPM. We do not count raw words. Instead, we take the total number of correct keystrokes you made during the 60-second window and divide it by five (the standardized length of a "word"). This ensures fair scoring even if you receive a sequence of exceptionally long words.</li>
                        <li><strong className="text-primary">Average Typing Speeds:</strong> The average person types around 40 WPM. Professional typists usually clock in at 65-75 WPM, while advanced competitive typists (and many software engineers) frequently exceed 100-120 WPM.</li>
                        <li><strong className="text-primary">Accuracy Tracking:</strong> We track every correct and incorrect keystroke. A high WPM with low accuracy (below 94%) often indicates you are typing beyond your comfort threshold. Focus on reaching 98% accuracy first; speed naturally follows muscle memory.</li>
                    </ul>
                </div>
            </div>

        </div>
    );
}
