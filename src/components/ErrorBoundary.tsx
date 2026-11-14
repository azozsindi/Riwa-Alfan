import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Caught application error in ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4" dir="rtl">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h2 className="text-lg font-bold text-white font-brand-arabic">
              حدث خطأ غير متوقع أثناء تحميل الصفحة
            </h2>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              يرجى تحديث الصفحة أو المحاولة مجدداً. إذا استمرت المشكلة يرجى مراسلتنا مباشرة.
            </p>

            <button
              onClick={this.handleReload}
              className="gold-gradient-btn w-full py-3 px-4 rounded-xl text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة تحديث الصفحة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
