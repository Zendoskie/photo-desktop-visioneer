
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import CodeEvaluator from '@/components/CodeEvaluator';
import EnumerationChecker from '@/components/EnumerationChecker';
import Analytics from '@/components/Analytics';

interface IndexProps {
  activeTab?: string;
}

const Index: React.FC<IndexProps> = ({ activeTab = "evaluate" }) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = React.useState(activeTab);

  React.useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    navigate(`/${value}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-appBorder bg-appBlue p-2">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="evaluate" className="data-[state=active]:text-appGreen">
              Evaluate
            </TabsTrigger>
            <TabsTrigger value="enumeration" className="data-[state=active]:text-appGreen">
              Enumeration
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:text-appGreen">
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-grow">
        {currentTab === "evaluate" && <CodeEvaluator />}
        {currentTab === "enumeration" && <EnumerationChecker />}
        {currentTab === "analytics" && <Analytics />}
      </div>
    </div>
  );
};

export default Index;
