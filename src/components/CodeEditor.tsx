'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Play, Save, RotateCcw, Smartphone } from 'lucide-react';

// Monaco Editor는 클라이언트 사이드에서만 로드
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onChange?: (value: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({
  initialCode = '// 여기에 코드를 작성하세요\nfunction factorial(n) {\n  // 재귀를 사용하여 팩토리얼을 구현해보세요\n  \n}',
  language = 'javascript',
  onChange,
  onRun,
  readOnly = false
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isMobile, setIsMobile] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onChange?.(newCode);
  };

  const handleRun = () => {
    onRun?.(code);
  };

  const handleReset = () => {
    setCode(initialCode);
    onChange?.(initialCode);
  };

  const toggleMobileView = () => {
    setIsMobile(!isMobile);
  };

  // 모바일 뷰 - 간단한 텍스트 영역
  if (isMobile) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">코드 에디터 (모바일)</h3>
          <Button variant="outline" size="sm" onClick={toggleMobileView}>
            <Smartphone className="w-4 h-4 mr-2" />
            데스크톱 모드
          </Button>
        </div>
        
        <textarea
          value={code}
          onChange={(e) => handleEditorChange(e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="여기에 JavaScript 코드를 작성하세요..."
          readOnly={readOnly}
        />
        
        <div className="flex gap-2 mt-4">
          <Button onClick={handleRun} className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            실행
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
        </div>
      </div>
    );
  }

  // 데스크톱 뷰 - Monaco Editor
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">코드 에디터</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleMobileView}>
            <Smartphone className="w-4 h-4 mr-2" />
            모바일 모드
          </Button>
        </div>
      </div>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <MonacoEditor
          height="400px"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            folding: false,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            readOnly: readOnly,
          }}
        />
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={handleRun} className="flex-1">
          <Play className="w-4 h-4 mr-2" />
          실행
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          초기화
        </Button>
        <Button variant="outline">
          <Save className="w-4 h-4 mr-2" />
          저장
        </Button>
      </div>
    </div>
  );
}