import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RequestTrendChart = ({ labels, data }) => {
  // Transform data for recharts
  const chartData = labels.map((label, index) => ({
    date: label,
    requests: data[index],
  }));

  return (
    <Paper sx={{ p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #457b9d 0%, #2a6a7a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
          }}
        >
          📊
        </Box>
        <Typography variant="h6" fontWeight={700} color="#1d3557">
          Availability Requests - Last 30 Days
        </Typography>
      </Box>

      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Number of Requests', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
              }}
              formatter={(value) => [`${value} requests`, 'Submissions']}
              labelStyle={{ color: '#1d3557', fontWeight: 'bold' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#457b9d"
              strokeWidth={2}
              dot={{ fill: '#457b9d', r: 4 }}
              activeDot={{ r: 6 }}
              name="Requests"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          📈 Shows the number of availability status change requests submitted each day over the last 30 days.
        </Typography>
      </Box>
    </Paper>
  );
};

export default RequestTrendChart;
