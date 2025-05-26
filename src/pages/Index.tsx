
import React from 'react';
import CodeEvaluator from '@/components/CodeEvaluator';
import EnumerationChecker from '@/components/EnumerationChecker';
import Analytics from '@/components/Analytics';

interface IndexProps {
  activeTab: string; // This will be passed from the router setup in App.tsx
}

const Index: React.FC<IndexProps> = ({ activeTab }) => {
  return (
    <div className="flex-grow flex flex-col h-full w-full">
      {/* The old Tabs header is removed */}
      <div className="flex-grow h-full w-full">
        {activeTab === "evaluate" && <CodeEvaluator />}
        {activeTab === "enumeration" && <EnumerationChecker />}
        {activeTab === "analytics" && <Analytics />}
      </div>
    </div>
  );
};

export default Index;

