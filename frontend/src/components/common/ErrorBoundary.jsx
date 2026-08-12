import React from 'react';

class ErrorBoundary extends React.Component {
 constructor(props) {
 super(props);
 this.state = { hasError: false, error: null };
 }

 static getDerivedStateFromError(error) {
 return { hasError: true, error };
 }

 componentDidCatch(error, errorInfo) {
 console.error('Frontend Error Caught:', error, errorInfo);
 }

 render() {
 if (this.state.hasError) {
 return (
 <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
 <div className="bg-bg-surface p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
 <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">!</div>
 <h1 className="text-2xl font-black text-text-main mb-2">Oops, something broke.</h1>
 <p className="text-text-sub mb-6 font-medium text-sm">We've encountered an unexpected error. Don't worry, just refresh the page to get back on track.</p>
 <button
 onClick={() => window.location.reload()}
 className="bg-[#4f46e5] text-white px-6 py-2.5 rounded-xl font-bold w-full shadow-md hover:bg-[#4338ca] transition-colors"
 >
 Refresh Page
 </button>
 </div>
 </div>
 );
 }

 return this.props.children;
 }
}

export default ErrorBoundary;
