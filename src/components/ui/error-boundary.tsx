import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("ErrorBoundary caught:", error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<div className="flex min-h-screen items-center justify-center bg-slate-50">
						<div className="text-center">
							<h1 className="text-lg font-semibold text-slate-900">
								Something went wrong
							</h1>
							<button
								type="button"
								onClick={() => this.setState({ hasError: false })}
								className="mt-3 text-sm text-blue-600 hover:underline"
							>
								Try again
							</button>
						</div>
					</div>
				)
			);
		}
		return this.props.children;
	}
}
