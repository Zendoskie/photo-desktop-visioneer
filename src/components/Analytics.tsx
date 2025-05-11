
import React, { useState } from 'react';
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
import { MessageCircle, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

type ChartType = 'frequent' | 'scores' | 'distribution' | 'question';

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = React.useState('q1');
  const [expandedChart, setExpandedChart] = useState<ChartType | null>(null);

  const handleExpandChart = (chartType: ChartType) => {
    setExpandedChart(chartType);
  };

  const handleCloseDialog = () => {
    setExpandedChart(null);
  };

  return (
    <div className="h-full w-full">
      <div className="p-1 h-full bg-appDark">
        <div className="flex justify-between items-center mb-0.5">
          <h2 className="text-foreground text-lg font-medium">Analytics Dashboard</h2>
          <Button 
            variant="ghost"
            onClick={() => navigate('/ai-chat')}
            className="text-appText hover:text-appGreen"
          >
            <MessageCircle size={16} className="mr-1" />
            AI Chat
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Frequently Asked Questions */}
          <div className="bg-appBlue p-1.5 rounded-lg border border-appBorder relative">
            <div className="flex justify-between items-center">
              <h3 className="text-foreground text-xs font-medium">Frequently Asked Questions</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 hover:text-appGreen"
                onClick={() => handleExpandChart('frequent')}
              >
                <Maximize2 size={12} />
              </Button>
            </div>
            <div className="h-[22vh]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dummyFrequentQuestions}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                  <XAxis dataKey="name" stroke="var(--app-text)" fontSize={7} tick={{fontSize: 7}} />
                  <YAxis stroke="var(--app-text)" fontSize={7} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '8px' }} 
                  />
                  <Legend wrapperStyle={{fontSize: '7px'}} />
                  <Line 
                    type="monotone" 
                    dataKey="frequency" 
                    name="Frequency"
                    stroke="var(--app-green)" 
                    activeDot={{ r: 4 }} 
                    strokeWidth={1.5}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Graph of Scores */}
          <div className="bg-appBlue p-1.5 rounded-lg border border-appBorder relative">
            <div className="flex justify-between items-center">
              <h3 className="text-foreground text-xs font-medium">Score by Question</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 hover:text-appGreen"
                onClick={() => handleExpandChart('scores')}
              >
                <Maximize2 size={12} />
              </Button>
            </div>
            <div className="h-[22vh]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dummyScoresByQuestion}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                  <XAxis dataKey="name" stroke="var(--app-text)" fontSize={7} />
                  <YAxis stroke="var(--app-text)" fontSize={7} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '8px' }} 
                  />
                  <Legend wrapperStyle={{fontSize: '7px'}} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Average Score"
                    stroke="var(--app-green)" 
                    activeDot={{ r: 4 }} 
                    strokeWidth={1.5}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Score Distribution Pie Chart */}
          <div className="bg-appBlue p-1.5 rounded-lg border border-appBorder relative">
            <div className="flex justify-between items-center">
              <h3 className="text-foreground text-xs font-medium">Overall Score Distribution</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 hover:text-appGreen"
                onClick={() => handleExpandChart('distribution')}
              >
                <Maximize2 size={12} />
              </Button>
            </div>
            <div className="h-[22vh]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={dummyScoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={45}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    fontSize={7}
                  >
                    {dummyScoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '8px' }} 
                  />
                  <Legend wrapperStyle={{fontSize: '7px'}} layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic Score Pie Chart */}
          <div className="bg-appBlue p-1.5 rounded-lg border border-appBorder relative">
            <div className="flex justify-between items-center">
              <h3 className="text-foreground text-xs font-medium">Question-Specific Scores</h3>
              <div className="flex items-center">
                <Select 
                  value={selectedQuestion} 
                  onValueChange={setSelectedQuestion}
                >
                  <SelectTrigger className="w-[100px] h-5 bg-appDark border-appBorder focus:ring-appGreen text-xs mr-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-appBlue border-appBorder">
                    {dummyQuestionOptions.map((q) => (
                      <SelectItem key={q.id} value={q.id} className="text-xs">{q.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 hover:text-appGreen"
                  onClick={() => handleExpandChart('question')}
                >
                  <Maximize2 size={12} />
                </Button>
              </div>
            </div>
            <div className="h-[22vh]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={dummyQuestionScores[selectedQuestion as keyof typeof dummyQuestionScores]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={45}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    fontSize={7}
                  >
                    {dummyQuestionScores[selectedQuestion as keyof typeof dummyQuestionScores].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '8px' }} 
                  />
                  <Legend wrapperStyle={{fontSize: '7px'}} layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for Expanded Charts */}
      <Dialog open={expandedChart !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-appDark border-appBorder max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {expandedChart === 'frequent' && 'Frequently Asked Questions'}
              {expandedChart === 'scores' && 'Score by Question'}
              {expandedChart === 'distribution' && 'Overall Score Distribution'}
              {expandedChart === 'question' && `Question-Specific Scores: ${dummyQuestionOptions.find(q => q.id === selectedQuestion)?.name}`}
            </DialogTitle>
          </DialogHeader>
          <div className="h-[70vh]">
            {expandedChart === 'frequent' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dummyFrequentQuestions}
                  margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                  <XAxis dataKey="name" stroke="var(--app-text)" />
                  <YAxis stroke="var(--app-text)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="frequency" name="Frequency" stroke="var(--app-green)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
            
            {expandedChart === 'scores' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dummyScoresByQuestion}
                  margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                  <XAxis dataKey="name" stroke="var(--app-text)" />
                  <YAxis stroke="var(--app-text)" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="score" name="Average Score" stroke="var(--app-green)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
            
            {expandedChart === 'distribution' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dummyScoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={200}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dummyScoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {expandedChart === 'question' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dummyQuestionScores[selectedQuestion as keyof typeof dummyQuestionScores]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={200}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dummyQuestionScores[selectedQuestion as keyof typeof dummyQuestionScores].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Analytics;
