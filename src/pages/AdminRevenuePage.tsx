import React, { useEffect, useState } from 'react';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

type RevenueStats = {
  weekly: number;
  monthly: number;
  yearly: number;
};

type MonthlyRevenue = {
  month: string;
  total: number;
};

export const AdminRevenuePage: React.FC = () => {
  const { userProfile } = useAuth();

  const [stats, setStats] = useState<RevenueStats>({
    weekly: 0,
    monthly: 0,
    yearly: 0,
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [animateBars, setAnimateBars] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      loadRevenue();
    }
  }, [userProfile]);

  const loadRevenue = async () => {
    try {
      setLoading(true);
      setAnimateBars(false);

      const { data, error } = await supabase
        .from('service_records')
        .select('date, total');

      if (error) throw error;

      const now = new Date();
      const year = now.getFullYear();

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());

      const startOfMonth = new Date(year, now.getMonth(), 1);
      const startOfYear = new Date(year, 0, 1);

      let weekly = 0;
      let monthly = 0;
      let yearly = 0;

      const monthlyMap: Record<number, number> = {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
        6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0,
      };

      data?.forEach(record => {
        const d = new Date(record.date);
        const amount = record.total || 0;

        if (d >= startOfWeek) weekly += amount;
        if (d >= startOfMonth) monthly += amount;
        if (d >= startOfYear) yearly += amount;

        if (d.getFullYear() === year) {
          monthlyMap[d.getMonth()] += amount;
        }
      });

      setStats({ weekly, monthly, yearly });

      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      setMonthlyRevenue(
        monthNames.map((name, index) => ({
          month: name,
          total: monthlyMap[index],
        }))
      );
    } catch (err) {
      console.error('Failed to load revenue stats', err);
    } finally {
      setLoading(false);

      // 🔥 animate AFTER render
      setTimeout(() => setAnimateBars(true), 0);
    }
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="text-center py-20 text-gray-500">
        🚫 You do not have access to this section
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  const maxMonthly = Math.max(...monthlyRevenue.map(m => m.total), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Revenue Statistics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your business performance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RevenueCard
          title="This Week"
          value={stats.weekly}
          icon={<Calendar className="w-6 h-6 text-blue-500" />}
        />
        <RevenueCard
          title="This Month"
          value={stats.monthly}
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
        />
        <RevenueCard
          title="This Year"
          value={stats.yearly}
          icon={<DollarSign className="w-6 h-6 text-purple-500" />}
        />
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Revenue ({new Date().getFullYear()})
        </h2>

        <div className="flex items-end gap-3 h-52">
          {monthlyRevenue.map((m, index) => (
            <div key={m.month} className="flex-1 flex flex-col items-center">
              <div
 className="w-full h-full bg-slate-700/30 rounded-md flex items-end">
  <div
    className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-md
               transition-[height] duration-700 ease-out"
    style={{
      height: animateBars
        ? `${Math.max((m.total / maxMonthly) * 100, 2)}%`
        : '0%',
      transitionDelay: `${index * 80}ms`,
    }}
    title={`€${m.total.toFixed(2)}`}
  />
</div>

              <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {m.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RevenueCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
    <div className="flex items-center space-x-3 mb-2">
      <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
        {icon}
      </div>
      <h3 className="text-sm text-gray-600 dark:text-gray-400">
        {title}
      </h3>
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">
      €{value.toFixed(2)}
    </p>
  </div>
);
