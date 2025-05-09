
import React from 'react';
import { 
  CartesianGrid, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Tooltip, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample data - would be replaced with actual data from a backend
const dummyFrequentQuestions = [
  { name: "Q1: Algorithm Complexity", frequency: 24 },
  { name: "Q2: Data Structures", frequency: 18 },
  { name: "Q3: Database Design", frequency: 15 },
  { name: "Q4: System Design", frequency: 12 },
  { name: "Q5: Network Protocols", frequency: 8 }
];

const dummyScoresByQuestion = [
  { name: "Q1", score: 85 },
  { name: "Q2", score: 72 },
  { name: "Q3", score: 93 },
  { name: "Q4", score: 65 },
  { name: "Q5", score: 78 }
];

const dummyScoreDistribution = [
  { name: '90-100', value: 15 },
  { name: '80-89', value: 30 },
  { name: '70-79', value: 25 },
  { name: '60-69', value: 20 },
  { name: 'Below 60', value: 10 }
];

const dummyQuestionOptions = [
  { id: 'q1', name: 'Q1: Algorithm Complexity' },
  { id: 'q2', name: 'Q2: Data Structures' },
  { id: 'q3', name: 'Q3: Database Design' },
  { id: 'q4', name: 'Q4: System Design' },
  { id: 'q5', name: 'Q5: Network Protocols' }
];

const dummyQuestionScores = {
  'q1': [
    { name: 'Excellent', value: 40 },
    { name: 'Good', value: 30 },
    { name: 'Average', value: 20 },
    { name: 'Poor', value: 10 }
  ],
  'q2': [
    { name: 'Excellent', value: 25 },
    { name: 'Good', value: 45 },
    { name: 'Average', value: 20 },
    { name: 'Poor', value: 10 }
  ],
  'q3': [
    { name: 'Excellent', value: 50 },
    { name: 'Good', value: 25 },
    { name: 'Average', value: 15 },
    { name: 'Poor', value: 10 }
  ],
  'q4': [
    { name: 'Excellent', value: 20 },
    { name: 'Good', value: 25 },
    { name: 'Average', value: 40 },
    { name: 'Poor', value: 15 }
  ],
  'q5': [
    { name: 'Excellent', value: 35 },
    { name: 'Good', value: 30 },
    { name: 'Average', value: 25 },
    { name: 'Poor', value: 10 }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = React.useState('q1');

  return (
    <div className="h-full w-full">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col p-4 pb-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-foreground text-xl font-medium">Analytics Dashboard</h2>
            <Button 
              variant="ghost"
              onClick={() => navigate('/ai-chat')}
              className="text-appText hover:text-appGreen"
            >
              <MessageCircle size={18} className="mr-2" />
              AI Chat
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
            {/* Frequently Asked Questions */}
            <div className="bg-appBlue p-4 rounded-lg border border-appBorder">
              <h3 className="text-foreground text-lg font-medium mb-4">Frequently Asked Questions</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dummyFrequentQuestions}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                    <XAxis dataKey="name" stroke="var(--app-text)" />
                    <YAxis stroke="var(--app-text)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)' }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="frequency" 
                      name="Frequency"
                      stroke="var(--app-green)" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Graph of Scores */}
            <div className="bg-appBlue p-4 rounded-lg border border-appBorder">
              <h3 className="text-foreground text-lg font-medium mb-4">Score by Question</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dummyScoresByQuestion}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                    <XAxis dataKey="name" stroke="var(--app-text)" />
                    <YAxis stroke="var(--app-text)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)' }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      name="Average Score"
                      stroke="var(--app-green)" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score Distribution Pie Chart */}
            <div className="bg-appBlue p-4 rounded-lg border border-appBorder">
              <h3 className="text-foreground text-lg font-medium mb-4">Overall Score Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dummyScoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {dummyScoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dynamic Score Pie Chart */}
            <div className="bg-appBlue p-4 rounded-lg border border-appBorder">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h3 className="text-foreground text-lg font-medium">Question-Specific Scores</h3>
                <div className="mt-2 md:mt-0 w-full md:w-auto">
                  <Select 
                    value={selectedQuestion} 
                    onValueChange={setSelectedQuestion}
                  >
                    <SelectTrigger className="w-full md:w-[200px] bg-appDark border-appBorder focus:ring-appGreen">
                      <SelectValue placeholder="Select Question" />
                    </SelectTrigger>
                    <SelectContent className="bg-appBlue border-appBorder">
                      {dummyQuestionOptions.map((q) => (
                        <SelectItem key={q.id} value={q.id}>{q.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dummyQuestionScores[selectedQuestion as keyof typeof dummyQuestionScores]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {dummyQuestionScores[selectedQuestion as keyof typeof dummyQuestionScores].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Analytics;
