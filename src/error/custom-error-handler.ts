import { ErrorHandler } from '@angular/core';

export class CustomErrorHandler extends ErrorHandler {
  override handleError(error: any): void {
    if (!this.shouldSuppressError(error)) {
      super.handleError(error);
    }
  }

  shouldSuppressError(error: any): boolean {
    // 在此函數中，根據你的需求判斷是否應該抑制錯誤
    // 例如，你可以檢查錯誤的類型或其他條件
    // 如果滿足條件，則返回 true，否則返回 false
    return error instanceof SilentError;
  }
}

// 這是一個自定義的錯誤類，用於表示應該被抑制的錯誤
export class SilentError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'SilentError';
  }
}
