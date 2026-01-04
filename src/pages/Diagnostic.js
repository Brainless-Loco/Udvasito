import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Button, Divider, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getDepartmentDisplayName } from '../utils/departmentHelper';

const DiagnosticPage = () => {
  const [diagnostics, setDiagnostics] = useState({
    totalUniversities: 0,
    totalDepartments: 0,
    totalDonors: 0,
    universities: [],
    loading: true,
    error: null,
  });

  const runDiagnostics = async () => {
    try {
      setDiagnostics(prev => ({ ...prev, loading: true, error: null }));

      console.log('🔍 Starting diagnostics...');

      const donorsRef = collection(db, 'donors');
      const uniDocs = await getDocs(donorsRef);

      console.log('📚 Universities found:', uniDocs.docs.length);

      const universities = [];
      let totalDepartments = 0;
      let totalDonors = 0;

      for (const uniDoc of uniDocs.docs) {
        console.log(`\n📍 Processing university: ${uniDoc.id}`);

        const deptRef = collection(uniDoc.ref, 'departments');
        const deptDocs = await getDocs(deptRef);

        console.log(`   Departments: ${deptDocs.docs.length}`);

        const departments = [];
        let uniDonorCount = 0;

        for (const deptDoc of deptDocs.docs) {
          const donorRef = collection(deptDoc.ref, 'donorList');
          const donorDocs = await getDocs(donorRef);

          const fullDeptName = getDepartmentDisplayName(deptDoc.id);
          console.log(`   📂 ${deptDoc.id} (${fullDeptName}): ${donorDocs.docs.length} donors`);

          departments.push({
            id: deptDoc.id,
            displayName: fullDeptName,
            donorCount: donorDocs.docs.length,
          });

          uniDonorCount += donorDocs.docs.length;
          totalDonors += donorDocs.docs.length;
        }

        totalDepartments += deptDocs.docs.length;

        universities.push({
          id: uniDoc.id,
          departmentCount: deptDocs.docs.length,
          donorCount: uniDonorCount,
          departments,
        });
      }

      console.log('\n✅ Diagnostics complete!');
      console.log(`Total: ${universities.length} universities, ${totalDepartments} departments, ${totalDonors} donors`);

      setDiagnostics({
        totalUniversities: universities.length,
        totalDepartments,
        totalDonors,
        universities,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('❌ Diagnostic error:', error);
      setDiagnostics(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, bgcolor: '#f5f5f5' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1d3557' }}>
          🔍 Database Diagnostic Report
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This page shows the current state of your donor database structure.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {diagnostics.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : diagnostics.error ? (
          <Typography color="error" sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
            ❌ Error: {diagnostics.error}
          </Typography>
        ) : (
          <>
            {/* Summary Stats */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
              <Paper sx={{ p: 3, bgcolor: '#e3f2fd', textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  {diagnostics.totalUniversities}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Universities
                </Typography>
              </Paper>
              <Paper sx={{ p: 3, bgcolor: '#f3e5f5', textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
                  {diagnostics.totalDepartments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Departments
                </Typography>
              </Paper>
              <Paper sx={{ p: 3, bgcolor: '#e8f5e9', textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: '#388e3c', fontWeight: 'bold' }}>
                  {diagnostics.totalDonors}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Donors
                </Typography>
              </Paper>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Detailed Breakdown */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 2 }}>
              📊 Detailed Breakdown:
            </Typography>

            {diagnostics.universities.length === 0 ? (
              <Typography color="error" sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
                ⚠️ No universities found! Your donors collection might be empty.
              </Typography>
            ) : (
              diagnostics.universities.map((uni) => (
                <Paper key={uni.id} sx={{ p: 3, mb: 2, bgcolor: '#fafafa', border: '1px solid #ddd' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1d3557' }}>
                    📍 {uni.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {uni.donorCount} donors in {uni.departmentCount} departments
                  </Typography>

                  <List sx={{ ml: 2 }}>
                    {uni.departments.map((dept) => (
                      <ListItem key={dept.id} sx={{ py: 1, pl: 0 }}>
                        <ListItemText
                          primary={`📂 ${dept.id}`}
                          secondary={`${dept.displayName} (${dept.donorCount} donors)`}
                          primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500, fontFamily: 'monospace' } }}
                          secondaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ))
            )}

            <Button
              variant="contained"
              sx={{ mt: 3, bgcolor: '#1d3557' }}
              onClick={runDiagnostics}
            >
              🔄 Refresh Diagnostics
            </Button>
          </>
        )}

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, p: 2, bgcolor: '#fff3cd', borderRadius: 1 }}>
          💡 <strong>Tip:</strong> Check your browser console (F12) for detailed logs during diagnostics.
        </Typography>
      </Paper>
    </Container>
  );
};

export default DiagnosticPage;
