'use client';

import { Button } from '@/components/ui/Button';
import { User, LogIn } from 'lucide-react';

export default function AuthButton() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => alert('인증 기능은 곧 활성화됩니다!')}
      >
        <User className="w-4 h-4 mr-1" />
        게스트
      </Button>
      <Button
        size="sm"
        onClick={() => alert('인증 기능은 곧 활성화됩니다!')}
      >
        <LogIn className="w-4 h-4 mr-1" />
        로그인
      </Button>
    </div>
  );
}