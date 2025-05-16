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

// Sample data - would be replaced with actual data from a backend
const dummyFrequentQuestions = [
  { name: "Q1", frequency: 24 },
  { name: "Q2", frequency: 18 },
  { name: "Q3", frequency: 15 },
  { name: "Q4", frequency: 12 },
  { name: "Q5", frequency: 8 }
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
  { id: 'q1', name: 'Q1' },
  { id: 'q2', name: 'Q2' },
  { id: 'q3', name: 'Q3' },
  { id: 'q4', name: 'Q4' },
  { id: 'q5', name: 'Q5' }
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

  // Custom label for pie charts to ensure labels are visible
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    // Check if chart is expanded to adjust label position and size
    const isExpanded = expandedChart !== null;
    const labelRadiusMultiplier = isExpanded ? 0.6 : 0.5; // Adjust label position for smaller charts
    const actualRadius = innerRadius + (outerRadius - innerRadius) * labelRadiusMultiplier;

    const x = cx + actualRadius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + actualRadius * Math.sin(-midAngle * Math.PI / 180);
    
    // Ensure text is visible on smaller slices
    if (percent < 0.05 && !isExpanded) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={isExpanded ? 14 : 10} // Larger font for expanded, adjusted for main view
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-full w-full">
      <div className="p-1 h-full bg-appDark">
        <div className="flex justify-between items-center mb-0.5">
          <h2 className="text-foreground text-xs font-medium">Analytics Dashboard</h2>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ai-chat')}
            className="text-appText hover:text-appGreen"
          >
            <MessageCircle size={12} className="mr-1" />
            AI Chat
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Frequently Asked Questions */}
          <div className="bg-appBlue p-1 rounded-lg border border-appBorder relative">
            <div className="flex justify-between items-center">
              <h3 className="text-foreground text-sm font-medium">Frequently Asked Questions</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hover:text-appGreen" // Increased button size
                onClick={() => handleExpandChart('frequent')}
              >
                <Maximize2 size={14} /> {/* Increased icon size */}
              </Button>
            </div>
            <div className="h-[25vh]"> {/* Increased height */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dummyFrequentQuestions}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }} // Adjusted margins
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                  <XAxis dataKey="name" stroke="var(--app-text)" fontSize={10} /> {/* Increased font size */}
                  <YAxis stroke="var(--app-text)" fontSize={10} /> {/* Increased font size */}
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '10px' }} 
                    itemStyle={{ fontSize: '10px' }}
                    labelStyle={{ fontSize: '10px' }}
                  />
                  <Legend wrapperStyle={{fontSize: '10px'}} /> {/* Increased font size */}
                  <Line 
                    type="monotone" 
                    dataKey="frequency" 
                    name="Frequency"
                    stroke="var(--app-green)" 
                    activeDot={{ r: 4 }} 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Graph of Scores */}
          <div className="bg-appBlue p-1 rounded-lg border border-appBorder relative">
            <div className="flex justify-between items-center">
              <h3 className="text-foreground text-sm font-medium">Score by Question</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hover:text-appGreen" // Increased button size
                onClick={() => handleExpandChart('scores')}
              >
                <Maximize2 size={14} /> {/* Increased icon size */}
              </Button>
            </div>
            <div className="h-[25vh]"> {/* Increased height */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dummyScoresByQuestion}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }} // Adjusted margins
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                  <XAxis dataKey="name" stroke="var(--app-text)" fontSize={10} /> {/* Increased font size */}
                  <YAxis stroke="var(--app-text)" fontSize={10} domain={[0, 100]} /> {/* Increased font size */}
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '10px' }} 
                    itemStyle={{ fontSize: '10px' }}
                    labelStyle={{ fontSize: '10px' }}
                  />
                  <Legend wrapperStyle={{fontSize: '10px'}} /> {/* Increased font size */}
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Average Score"
                    stroke="var(--app-green)" 
                    activeDot={{ r: 4 }} 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Score Distribution Pie Chart */}
          <div className="bg-appBlue p-1 rounded-lg border border-appBorder relative">
            <div className="flex justify-between items-center">
              <h3 className="text-foreground text-sm font-medium">Overall Score Distribution</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hover:text-appGreen" // Increased button size
                onClick={() => handleExpandChart('distribution')}
              >
                <Maximize2 size={14} /> {/* Increased icon size */}
              </Button>
            </div>
            <div className="h-[25vh]"> {/* Increased height */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 20 }}> {/* Adjusted bottom margin for legend */}
                  <Pie
                    data={dummyScoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70} // Increased outerRadius
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={renderCustomizedLabel}
                  >
                    {dummyScoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '10px' }} 
                    itemStyle={{ fontSize: '10px' }}
                    labelStyle={{ fontSize: '10px' }}
                  />
                  <Legend 
                    wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} // Increased font size and added padding
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    iconSize={10} 
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic Score Pie Chart */}
          <div className="bg-appBlue p-1 rounded-lg border border-appBorder relative">
            <div className="flex justify-between items-center">
              <h3 className="text-foreground text-sm font-medium">Question-Specific Scores</h3>
              <div className="flex items-center">
                <Select 
                  value={selectedQuestion} 
                  onValueChange={setSelectedQuestion}
                >
                  <SelectTrigger className="w-[60px] h-6 bg-appDark border-appBorder focus:ring-appGreen text-xs mr-1 px-2"> {/* Adjusted size & font */}
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
                  className="h-6 w-6 hover:text-appGreen" // Increased button size
                  onClick={() => handleExpandChart('question')}
                >
                  <Maximize2 size={14} /> {/* Increased icon size */}
                </Button>
              </div>
            </div>
            <div className="h-[25vh]"> {/* Increased height */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 20 }}> {/* Adjusted bottom margin for legend */}
                  <Pie
                    data={dummyQuestionScores[selectedQuestion as keyof typeof dummyQuestionScores]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70} // Increased outerRadius
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={renderCustomizedLabel}
                  >
                    {dummyQuestionScores[selectedQuestion as keyof typeof dummyQuestionScores].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '10px' }} 
                    itemStyle={{ fontSize: '10px' }}
                    labelStyle={{ fontSize: '10px' }}
                  />
                  <Legend 
                    wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} // Increased font size and added padding
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center" 
                    iconSize={10} 
                    iconType="circle"
                  />
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
                  <XAxis dataKey="name" stroke="var(--app-text)" fontSize={12} />
                  <YAxis stroke="var(--app-text)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '12px' }} itemStyle={{fontSize: '12px'}} labelStyle={{fontSize: '12px'}} />
                  <Legend wrapperStyle={{fontSize: '12px'}}/>
                  <Line type="monotone" dataKey="frequency" name="Frequency" stroke="var(--app-green)" activeDot={{ r: 8 }} strokeWidth={2}/>
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
                  <XAxis dataKey="name" stroke="var(--app-text)" fontSize={12}/>
                  <YAxis stroke="var(--app-text)" domain={[0, 100]} fontSize={12}/>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '12px' }} itemStyle={{fontSize: '12px'}} labelStyle={{fontSize: '12px'}} />
                  <Legend wrapperStyle={{fontSize: '12px'}}/>
                  <Line type="monotone" dataKey="score" name="Average Score" stroke="var(--app-green)" activeDot={{ r: 8 }} strokeWidth={2}/>
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
                    labelLine={false}
                    outerRadius={180} // Kept large for expanded view
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={renderCustomizedLabel} // Uses the updated renderCustomizedLabel
                  >
                    {dummyScoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '12px' }} itemStyle={{fontSize: '12px'}} labelStyle={{fontSize: '12px'}} />
                  <Legend wrapperStyle={{fontSize: '12px'}}/>
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
                    labelLine={false}
                    outerRadius={180} // Kept large for expanded view
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={renderCustomizedLabel} // Uses the updated renderCustomizedLabel
                  >
                    {dummyQuestionScores[selectedQuestion as keyof typeof dummyQuestionScores].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--app-blue)', borderColor: 'var(--app-border)', fontSize: '12px' }} itemStyle={{fontSize: '12px'}} labelStyle={{fontSize: '12px'}} />
                  <Legend wrapperStyle={{fontSize: '12px'}}/>
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
