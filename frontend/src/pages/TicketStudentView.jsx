import React, { useState, useEffect } from 'react';
import { ticketService } from '../services/ticketService';
import TicketDetailsModal from '../components/TicketDetailsModal';
import CreateTicketModal from '../components/CreateTicketModal';

const TicketStudentView = ({ userEmail }) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, tickets]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getUserTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...tickets];

    if (statusFilter !== 'ALL') {
      data = data.filter(t => t.status === statusFilter);
    }

    if (search) {
      data = data.filter(
        t =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.id.toString().includes(search)
      );
    }

    setFilteredTickets(data);
  };

  const handleView = async (id) => {
    const ticket = await ticketService.getTicketById(id);
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const total = tickets.length;
  const active = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const resolved = tickets.filter(t => t.status === 'RESOLVED').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-600';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-600';
      case 'RESOLVED':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            My Support Tickets
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage your requests
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-purple-600 text-white px-6 py-2.5 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition"
        >
          + New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[ 
          { label: 'Total', value: total },
          { label: 'Active', value: active },
          { label: 'Resolved', value: resolved }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <p className="text-gray-400 text-sm">{item.label}</p>
            <h2 className="text-3xl font-semibold text-gray-900 mt-1">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 flex gap-3">
        <input
          type="text"
          placeholder="Search tickets..."
          className="flex-1 px-4 py-2 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select 
          className="px-4 py-2 rounded-xl bg-gray-100 focus:outline-none" 
          onChange={(e) => setCategoryFilter(e.target.value)}
        > 
          <option value="ALL">All Categories</option>
          <option value="ACADEMIC">Academic</option>
          <option value="IT_SUPPORT">IT Support</option>
          <option value="ELECTRICAL">Electrical</option>
          <option value="PLUMBING">Plumbing</option>
          <option value="CLEANING">Cleaning</option>
          <option value="SECURITY">Sequrity</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          className="px-4 py-2 rounded-xl bg-gray-100 focus:outline-none"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-5/6 mb-4"></div>
              <div className="h-8 bg-gray-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No tickets found
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => handleView(ticket.id)}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-900">
                  {ticket.title}
                </h3>
                <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-5">
                {ticket.description?.slice(0, 90)}...
              </p>

              <div className="flex justify-between text-xs text-gray-400">
                <span>#{ticket.id}</span>
                <span>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userEmail={userEmail}
        onTicketUpdated={fetchTickets}
      />

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTicketCreated={fetchTickets}
      />
    </div>
  );
};

export default TicketStudentView;