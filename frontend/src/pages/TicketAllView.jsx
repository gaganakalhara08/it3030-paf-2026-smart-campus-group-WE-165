import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ticketService } from '../services/ticketService';
import TicketDetailsModal from '../components/TicketDetailsModal';
import AdminSidebar from '../components/admin/AdminSidebar';
import { API_BASE_URL } from '../services/api';
// ✅ Chart imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ✅ Icons
import {
  FaTicketAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaFire,
} from 'react-icons/fa';

const TicketAllView = ({ userEmail, userName }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRoles] = useState(['ROLE_ADMIN']);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to load admin profile', err);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      let data;
      if (filterStatus === 'ALL') {
        data = await ticketService.getAllTickets();
      } else {
        data = await ticketService.getAllTicketsByStatus(filterStatus);
      }
      setTickets(data);
    } catch (err) {
      setError('Failed to load tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = async (ticketId) => {
    try {
      const ticket = await ticketService.getTicketById(ticketId);
      setSelectedTicket(ticket);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to load ticket');
      console.error(err);
    }
  };

  const handleTicketUpdated = () => {
    if (selectedTicket) {
      fetchTickets();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-600 bg-red-50';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      ELECTRICAL: '⚡',
      PLUMBING: '🔧',
      HVAC: '❄️',
      FURNITURE: '🪑',
      EQUIPMENT: '🖥️',
      CLEANING: '🧹',
      SECURITY: '🔐',
      IT_SUPPORT: '💻',
      STRUCTURAL: '🏗️',
      OTHER: '📋',
    };
    return emojis[category] || '📋';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // ✅ Category chart data
  const categoryData = Object.values(
    tickets.reduce((acc, t) => {
      acc[t.category] = acc[t.category] || { name: t.category, count: 0 };
      acc[t.category].count++;
      return acc;
    }, {})
  );

 // ✅ Stats
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'OPEN').length,
    inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
    urgent: tickets.filter((t) => t.priority === 'URGENT').length,
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 ml-64 p-6 overflow-y-auto bg-white">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all maintenance tickets</p>
          </div>
          {/* <div className="text-right">
            <p className="text-gray-900 font-semibold">{user?.name || userName || 'Admin'}</p>
            <p className="text-gray-500 text-sm">{user?.email || userEmail || ''}</p>
          </div> */}
        </div>

        {/* ✅ STAT CARDS WITH ICONS */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">

  {/* TOTAL */}
  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl shadow-sm">
    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xl">
      <FaTicketAlt />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Total Tickets</p>
      <h2 className="text-2xl font-bold text-gray-900">{stats.total}</h2>
    </div>
    
  </div>

  {/* OPEN */}
  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl shadow-sm">
    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl">
      <FaExclamationCircle />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Open</p>
      <h2 className="text-2xl font-bold text-gray-900">{stats.open}</h2>
    </div>  
  </div>

  {/* IN PROGRESS */}
  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl shadow-sm">
    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl">
      <FaSpinner />
    </div>
    <div>
      <p className="text-gray-500 text-sm">In Progress</p>
      <h2 className="text-2xl font-bold text-gray-900">{stats.inProgress}</h2>
    </div>
  </div>

  {/* RESOLVED */}
  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl shadow-sm">
    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl">
      <FaCheckCircle />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Resolved</p>
      <h2 className="text-2xl font-bold text-gray-900">{stats.resolved}</h2>
    </div>
  </div>

  {/* URGENT */}
  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl shadow-sm">
    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-xl">
      <FaFire />
    </div>
    <div>
      <p className="text-gray-500 text-sm">Urgent</p>
      <h2 className="text-2xl font-bold text-gray-900">{stats.urgent}</h2>
    </div>
  </div>

</div>

        {/* ✅ CATEGORY CHART */}
        <div className="bg-white p-5 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Tickets by Category</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#7C3AED" /> {/* PURPLE */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ticket ID, title, resource, or user..."
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'IN_PROGRESS' ? 'IN PROGRESS' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-gray-600 mt-4">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-700 text-lg font-medium">No tickets found</p>
            <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {/* <th className="p-3 text-left">TICKET ID</th> */}
                  <th className="p-3 text-left">SUBJECT</th>
                  <th className="p-3 text-left">CATEGORY</th>
                  <th className="p-3 text-left">STATUS</th>
                  <th className="p-3 text-left">PRIORITY</th>
                  <th className="p-3 text-left">REPORTER</th>
                  <th className="p-3 text-left">RESOURCE</th>
                  <th className="p-3 text-left">TECHNICIAN</th>
                  <th className="p-3 text-left">CREATED</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => handleViewTicket(ticket.id)}
                    className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {/* <td className="p-3 font-medium text-blue-700">{ticket.id}</td> */}
                    <td className="p-3">
                      <p className="font-semibold text-gray-900">{ticket.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[220px]">
                        {ticket.description}
                      </p>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        <span>{getCategoryEmoji(ticket.category)}</span>
                        <span>{ticket.category.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-3 text-gray-800">{ticket.userName}</td>
                    <td className="p-3">
                      <p className="font-medium text-gray-800">{ticket.resourceName}</p>
                      <p className="text-xs text-gray-500">{ticket.resourceLocation}</p>
                    </td>
                    <td className="p-3">
                      {ticket.assignedToName ? (
                        <span className="text-blue-700 font-medium">{ticket.assignedToName}</span>
                      ) : (
                        <span className="text-yellow-700 font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-600">{formatDate(ticket.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        userEmail={userEmail}
        userRoles={['ROLE_ADMIN']}
        onTicketUpdated={handleTicketUpdated}
      />
    </div>
  );
};

export default TicketAllView;
