'use client';

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import { products } from '@/lib/data';
import { Product } from '@/types';

interface QuizProps {
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

interface QuizAnswer {
  faceShape?: string;
  style?: string;
  color?: string;
  occasion?: string;
}

const quizQuestions = [
  {
    id: 'faceShape',
    question: "What's your face shape?",
    subtitle: "This helps us find frames that complement your features",
    options: [
      { value: 'round', label: 'Round', desc: 'Full cheeks, rounded chin', icon: '⭕' },
      { value: 'square', label: 'Square', desc: 'Strong jaw, broad forehead', icon: '⬜' },
      { value: 'oval', label: 'Oval', desc: 'Balanced proportions', icon: '⬡' },
      { value: 'heart', label: 'Heart', desc: 'Wide forehead, narrow chin', icon: '💗' },
    ]
  },
  {
    id: 'style',
    question: "What's your style?",
    subtitle: "Choose the look that speaks to you",
    options: [
      { value: 'classic', label: 'Classic', desc: 'Timeless & elegant', icon: '✨' },
      { value: 'trendy', label: 'Trendy', desc: 'Fashion-forward', icon: '🔥' },
      { value: 'minimal', label: 'Minimal', desc: 'Clean & simple', icon: '⚪' },
      { value: 'bold', label: 'Bold', desc: 'Make a statement', icon: '⚡' },
    ]
  },
  {
    id: 'color',
    question: "Preferred frame color?",
    subtitle: "Pick your signature shade",
    options: [
      { value: 'black', label: 'Black', desc: 'Classic & versatile', icon: '⚫' },
      { value: 'tortoise', label: 'Tortoise', desc: 'Warm & sophisticated', icon: '🐢' },
      { value: 'metal', label: 'Metal', desc: 'Sleek & modern', icon: '🔩' },
      { value: 'clear', label: 'Clear/Colorful', desc: 'Playful & unique', icon: '💎' },
    ]
  },
  {
    id: 'occasion',
    question: "Where will you wear them most?",
    subtitle: "We'll match the perfect frames to your lifestyle",
    options: [
      { value: 'daily', label: 'Everyday', desc: 'All-day comfort', icon: '🌟' },
      { value: 'work', label: 'Work', desc: 'Professional look', icon: '💼' },
      { value: 'weekend', label: 'Weekend', desc: 'Casual & relaxed', icon: '☕' },
      { value: 'special', label: 'Special Events', desc: 'Stand out', icon: '🎉' },
    ]
  }
];

function calculateRecommendations(answers: QuizAnswer): Product[] {
  let scored = products.map(product => {
    let score = 0;
    
    // 根据脸型匹配
    if (answers.faceShape === 'round' && ['8096', '8097'].includes(product.id)) score += 2;
    if (answers.faceShape === 'square' && ['8095', 'du303'].includes(product.id)) score += 2;
    if (answers.faceShape === 'oval' && ['du301', 'du302', '8098'].includes(product.id)) score += 2;
    if (answers.faceShape === 'heart' && ['8095', 'du303'].includes(product.id)) score += 2;
    
    // 根据风格匹配
    if (answers.style === 'classic' && product.id.startsWith('du')) score += 2;
    if (answers.style === 'bold' && ['8097', '8098'].includes(product.id)) score += 2;
    if (answers.style === 'minimal' && ['og203', 'a003'].includes(product.id)) score += 2;
    
    // 根据颜色匹配
    if (answers.color === 'black' && product.colors.includes('Black')) score += 1;
    if (answers.color === 'tortoise' && product.colors.includes('Tortoise')) score += 1;
    if (answers.color === 'metal' && (product.material === 'Titanium' || product.colors.includes('Gold') || product.colors.includes('Silver'))) score += 1;
    if (answers.color === 'clear' && (product.colors.includes('Clear') || product.colors.includes('Clear Tea') || product.colors.includes('Clear Grey'))) score += 1;
    
    // 根据场合匹配
    if (answers.occasion === 'work' && product.category === 'standard') score += 1;
    if (answers.occasion === 'weekend' && product.category === 'asiafit') score += 1;
    
    return { product, score };
  });
  
  // 按分数排序，返回前3个
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(s => s.product);
}

export default function Quiz({ onClose, onProductClick }: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [showResults, setShowResults] = useState(false);
  
  const currentQuestion = quizQuestions[step];
  const isLastQuestion = step === quizQuestions.length - 1;
  
  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  };
  
  const recommendations = showResults ? calculateRecommendations(answers) : [];
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b">
          <span className="text-xl font-light tracking-widest">GETOOUP</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        
        {!showResults ? (
          <div className="p-6">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              {quizQuestions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded ${idx <= step ? 'bg-black' : 'bg-gray-200'}`}
                />
              ))}
            </div>
            
            {/* Question */}
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-2">
                Question {step + 1} of {quizQuestions.length}
              </p>
              <h2 className="text-2xl font-medium mb-2">{currentQuestion.question}</h2>
              <p className="text-gray-500">{currentQuestion.subtitle}</p>
            </div>
            
            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-black transition-colors text-left"
                >
                  <span className="text-3xl mb-3 block">{option.icon}</span>
                  <span className="font-medium block">{option.label}</span>
                  <span className="text-sm text-gray-500">{option.desc}</span>
                </button>
              ))}
            </div>
            
            {/* Back button */}
            {step > 0 && (
              <button
                onClick={handleBack}
                className="mt-6 flex items-center gap-2 text-gray-500 hover:text-black"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
            {/* Results */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium mb-2">Your Perfect Matches</h2>
              <p className="text-gray-500">Based on your answers, we recommend these frames</p>
            </div>
            
            {/* Recommendations */}
            <div className="space-y-4 mb-8">
              {recommendations.map((product, idx) => (
                <div
                  key={product.id}
                  onClick={() => onProductClick(product)}
                  className="flex gap-4 p-4 border rounded-lg hover:border-black cursor-pointer transition-colors"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👓</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-black text-white text-xs px-2 py-0.5 rounded">
                        #{idx + 1} Pick
                      </span>
                      {product.bestSeller && (
                        <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded">
                          Best Seller
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{product.description}</p>
                    <p className="font-medium">${product.price}</p>
                  </div>
                  <ChevronRight className="text-gray-300" />
                </div>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 py-3 rounded hover:border-black"
              >
                <RefreshCw size={18} />
                Retake Quiz
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800"
              >
                Browse All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
