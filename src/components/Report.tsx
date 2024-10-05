import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Stats, prepareChartData, prepareChatLengthHistogram } from "@/lib/utils";
import { format } from "date-fns";
import { BarChart as BarChartIcon, PieChart as PieChartIcon, MessageSquare, User, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportProps {
  stats: Stats;
  onClear: () => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6B6B", "#4ECDC4", "#A28DFF", "#45B7D1"];

export function Report({ stats, onClear }: ReportProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl py-4 font-semibold">Your usage summary</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<MessageSquare size={24} />}
          title="Total Messages"
          value={stats.userMessageCount + stats.assistantMessageCount}
        />
        <StatCard icon={<User size={24} />} title="Conversations" value={stats.conversationCount} />
        <StatCard
          icon={<BarChartIcon size={24} />}
          title="Avg Messages/Day"
          value={stats.averageMessagesPerDay.toFixed(1)}
        />
        <StatCard icon={<PieChartIcon size={24} />} title="Models Used" value={Object.keys(stats.modelCounts).length} />
        <StatCard
          icon={<Calendar size={24} />}
          title="First Message"
          value={format(stats.firstMessageDate, "MMM d, yyyy")}
        />
        <StatCard icon={<Clock size={24} />} title="Longest Chat" value={`${stats.longestChat} messages`} />
      </section>

      <section className="bg-white/5 rounded-lg p-6 border border-white/10 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Weekly Message Count</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={prepareChartData(stats)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis
              dataKey="week"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={3}
              tickFormatter={(value) => value.split(",")[0]}
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
            />
            <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <Tooltip contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", borderRadius: "4px" }} />
            <Legend />
            {Object.keys(stats.modelCounts).map((model, index) => (
              <Bar key={model} dataKey={model} stackId="a" fill={COLORS[index % COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-white/5 rounded-lg p-6 border border-white/10 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Messages by Model</h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            {Object.entries(stats.modelCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([model, count], index) => (
                <div key={model} className="flex items-center mb-2">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="flex-grow">{model}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
          </div>
          <div className="w-full md:w-2/3">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={Object.entries(stats.modelCounts).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => {
                    if (percent > 0.05) {
                      return `${name} ${(percent * 100).toFixed(0)}%`;
                    }
                    return null;
                  }}
                >
                  {Object.entries(stats.modelCounts).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="bg-white/5 rounded-lg p-6 border border-white/10 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Chat Length Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={prepareChatLengthHistogram(stats.chatLengths)}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="range"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
            />
            <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <Tooltip contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", borderRadius: "4px" }} />
            <Bar dataKey="count" fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <div className="mt-8 text-center">
        <Button
          onClick={onClear}
          variant="outline"
          className="bg-white/10 hover:bg-white/20 hover:text-white w-full py-6 text-white border-white/20"
        >
          Clear and Analyze Another File
        </Button>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: number | string }) {
  return (
    <div className="bg-white/5 p-6 rounded-lg shadow-lg border border-white/10 flex items-center">
      <div className="mr-4 text-blue-400">{icon}</div>
      <div>
        <h3 className="text-lg font-medium text-gray-300 mb-1">{title}</h3>
        <p className="text-3xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
      </div>
    </div>
  );
}
