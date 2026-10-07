import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Rendered instead of a blank screen when a subtree throws. */
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

/**
 * Stops a single component's render error from unmounting the whole app.
 *
 * Without this, one throw (a malformed book record, a bad `cover_url`, a null
 * review) takes React down and the user gets a white screen with no explanation
 * and no way to recover other than a manual reload.
 *
 * `getDerivedStateFromError` is static and runs during render, so it may only
 * return state — logging belongs in `componentDidCatch`.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Unknown error' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled render error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4"
      >
        <div className="text-center bg-[var(--color-surface)] border border-[var(--border-soft)] rounded-2xl p-8 max-w-md w-full">
          <h1 className="font-display text-2xl text-[var(--color-text)] mb-2">
            Something went wrong
          </h1>
          <p className="text-[var(--color-muted)] text-sm mb-6 break-words">
            {this.state.message}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 min-h-[44px] bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold rounded-full transition-all hover:opacity-90"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-5 py-2.5 min-h-[44px] inline-flex items-center border border-[var(--border-soft)] text-[var(--color-text)] font-semibold rounded-full transition-all hover:border-[var(--color-accent)]"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
