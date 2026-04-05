import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, TrendingUp, TrendingDown, IndianRupee, Trash2, Wallet } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, netBalance: 0 });
  const [records, setRecords] = useState([]);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Expense');
  const [category, setCategory] = useState('Food');
  const [notes, setNotes] = useState('');

  const fetchDashboardData = async () => {
    try {
      const summaryRes = await api.get('/dashboard/summary');
      setSummary(summaryRes.data.summary);

      const recordsRes = await api.get('/records?limit=10');
      setRecords(recordsRes.data.data);
    } catch (err) {
      if (err.response && err.response.status === 401) handleLogout();
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
    } else {
      setUser(JSON.parse(storedUser));
      fetchDashboardData();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      await api.post('/records', {
        amount: parseFloat(amount),
        type,
        category,
        notes
      });
      setAmount(''); setNotes('');
      fetchDashboardData(); // Refresh UI
    } catch (err) {
      console.error(err);
      alert('Failed to add record');
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await api.delete(`/records/${id}`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Header */}
      <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wallet color="var(--accent-primary)" size={28} />
          <h2>Finance Dashboard</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, <strong>{user?.name || 'User'}</strong> ({user?.role})</span>
          <button onClick={handleLogout} style={{ width: 'auto', padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'transparent', border: '1px solid var(--glass-border)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
            <IndianRupee size={20} /> Current Balance
          </div>
          <h1 style={{ fontSize: '32px', marginTop: '10px' }}>₹{summary.netBalance.toLocaleString()}</h1>
        </div>
        <div className="glass-panel" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
            <TrendingUp size={20} color="var(--success)" /> Total Income
          </div>
          <h1 style={{ fontSize: '32px', marginTop: '10px', color: 'var(--success)' }}>₹{summary.totalIncome.toLocaleString()}</h1>
        </div>
        <div className="glass-panel" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
            <TrendingDown size={20} color="var(--danger)" /> Total Expenses
          </div>
          <h1 style={{ fontSize: '32px', marginTop: '10px', color: 'var(--danger)' }}>₹{summary.totalExpenses.toLocaleString()}</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
        {/* Add Record Form */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><PlusCircle size={20} /> Add Record</h3>
          <form onSubmit={handleAddRecord}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{ flex: 1 }}>
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: 1 }}>
                {type === 'Expense' ? (
                  <>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Housing">Housing</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Investment">Investment</option>
                    <option value="Gift">Gift</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
            </div>
            
            <input 
              type="number" 
              placeholder="Amount (₹)" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              required 
            />
            <textarea 
              placeholder="Notes/Description (optional)" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
            
            <button type="submit">Save Record</button>
          </form>
        </div>

        {/* Recent Records Table */}
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '20px' }}>Recent Data</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Type</th>
                <th style={{ padding: '12px' }}>Category</th>
                <th style={{ padding: '12px' }}>Notes</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No records found.</td></tr>
              ) : (
                records.map(record => (
                  <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px' }}>{new Date(record.date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                        backgroundColor: record.type === 'Income' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: record.type === 'Income' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {record.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{record.category}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{record.notes || '-'}</td>
                    <td style={{ padding: '12px', fontWeight: '600', color: record.type === 'Income' ? 'var(--success)' : 'var(--text-primary)' }}>
                      {record.type === 'Income' ? '+' : '-'}₹{record.amount}
                    </td>
                    <td style={{ padding: '12px' }}>
                       <button className="danger-btn" onClick={() => handleDeleteRecord(record.id)} style={{ padding: '6px', width: 'auto', display: 'flex' }}>
                         <Trash2 size={14} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
