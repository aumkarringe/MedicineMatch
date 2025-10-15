import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Medicine } from '@/types/medicine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Award, Activity } from 'lucide-react';

interface StatisticsSectionProps {
  medicines: Medicine[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--chart-5))'];

export const StatisticsSection = ({ medicines }: StatisticsSectionProps) => {
  const statistics = useMemo(() => {
    // Top manufacturers
    const manufacturerCount: Record<string, number> = {};
    medicines.forEach(med => {
      manufacturerCount[med.manufacturer] = (manufacturerCount[med.manufacturer] || 0) + 1;
    });
    
    const topManufacturers = Object.entries(manufacturerCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name: name.split(' ').slice(0, 2).join(' '), value }));

    // Rating distribution
    const ratingDistribution = [
      { name: '0-1', value: medicines.filter(m => m.rating && m.rating < 1).length },
      { name: '1-2', value: medicines.filter(m => m.rating && m.rating >= 1 && m.rating < 2).length },
      { name: '2-3', value: medicines.filter(m => m.rating && m.rating >= 2 && m.rating < 3).length },
      { name: '3-4', value: medicines.filter(m => m.rating && m.rating >= 3 && m.rating < 4).length },
      { name: '4-5', value: medicines.filter(m => m.rating && m.rating >= 4).length },
    ];

    // Average rating
    const avgRating = medicines.reduce((acc, med) => acc + (med.rating || 0), 0) / medicines.length;

    // Top rated
    const topRated = [...medicines].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

    return {
      topManufacturers,
      ratingDistribution,
      avgRating,
      topRated,
      totalMedicines: medicines.length
    };
  }, [medicines]);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-accent/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Medicine Database Statistics
          </h2>
          <p className="text-muted-foreground">
            Insights from our comprehensive medicine database
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="text-primary" size={20} />
                  Total Medicines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.p
                  className="text-4xl font-bold text-primary"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  {statistics.totalMedicines.toLocaleString()}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="text-accent" size={20} />
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.p
                  className="text-4xl font-bold text-accent"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: 0.3 }}
                >
                  {statistics.avgRating.toFixed(2)} ★
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="text-warning" size={20} />
                  Top Rated (4+)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.p
                  className="text-4xl font-bold text-warning"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: 0.4 }}
                >
                  {statistics.ratingDistribution[4].value}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Top Manufacturers</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statistics.topManufacturers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statistics.ratingDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statistics.ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
