
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-light to-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-medical-primary mb-2">MedInsight</h1>
        <h2 className="text-xl text-medical-dark">Medical Diagnostic Assistant</h2>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          Advanced multimodal analysis for healthcare professionals, powered by Gemini 2.0
        </p>
      </div>
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 MedInsight. All rights reserved.</p>
        <p className="mt-1">HIPAA Compliant • Secure • AI-Powered</p>
      </div>
    </div>
  );
};

export default Index;
