'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Terminal } from 'lucide-react';

interface OutputLine {
  type: 'log' | 'error' | 'result' | 'test';
  content: string;
  timestamp?: string;
}

interface CodeOutputProps {
  output: OutputLine[];
  isRunning?: boolean;
}

export default function CodeOutput({ output, isRunning = false }: CodeOutputProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getIcon = (type: OutputLine['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'result':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'test':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Terminal className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTextColor = (type: OutputLine['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'result':
        return 'text-green-600 dark:text-green-400';
      case 'test':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-600 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            출력 결과
          </h3>
          {isRunning && (
            <div className="flex items-center gap-2 ml-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-sm text-purple-600">실행 중...</span>
            </div>
          )}
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {output.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>코드를 실행하면 결과가 여기에 표시됩니다.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {output.map((line, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded">
                  {getIcon(line.type)}
                  <div className="flex-1">
                    <pre className={`font-mono text-sm whitespace-pre-wrap ${getTextColor(line.type)}`}>
                      {line.content}
                    </pre>
                    {line.timestamp && (
                      <div className="text-xs text-gray-500 mt-1">
                        {line.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}