import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }
  
  private handleTryAgain = () => {
    // Attempt a recovery by reloading the page
    window.location.reload();
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
            <h2>Something went wrong.</h2>
            <p>We're sorry for the inconvenience. Please try refreshing the page or report this issue.</p>
            <details style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
                {this.state.error && this.state.error.toString()}
            </details>
            <button onClick={this.handleTryAgain}>
                Try again
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
