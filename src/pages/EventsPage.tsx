import React, { useState, useEffect, useMemo } from 'react';
import { TechnicalEvent, EventCategory } from '../types';
import { api } from '../services/api';
import { EventCard } from '../components/EventCard';
import {
  Search,
  Filter,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  X,
  RefreshCw,
} from 'lucide-react';

interface EventsPageProps {
  navigate: (path: string) => void;
  initialCategory?: string;
  onSelectEvent: (id: string) => void;
  onRegisterEvent: (event: TechnicalEvent) => void;
  registeredEventIds: Set<string>;
}

const ALL_CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Hackathons',
  'Coding Competitions',
  'Robotics',
  'Workshops',
  'Project Exhibitions',
  'Paper Presentations',
  'Technical Quizzes',
];

export const EventsPage: React.FC<EventsPageProps> = ({
  initialCategory = 'All',
  onSelectEvent,
  onRegisterEvent,
  registeredEventIds,
}) => {
  const [events, setEvents] = useState<TechnicalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | EventCategory>(
    (initialCategory as any) || 'All'
  );
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'open' | 'available_seats'>('all');
  const [sortBy, setSortBy] = useState<'date_asc' | 'seats_available' | 'newest'>('date_asc');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getEvents();
      setEvents(res.events);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((e) => e.category === selectedCategory);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.organizer_name.toLowerCase().includes(q)
      );
    }

    // Availability filter
    if (availabilityFilter === 'open') {
      const now = new Date();
      result = result.filter(
        (e) =>
          e.status === 'published' &&
          new Date(e.registration_deadline) > now &&
          (e.registered_count || 0) < e.max_participants
      );
    } else if (availabilityFilter === 'available_seats') {
      result = result.filter((e) => (e.available_seats || 0) > 0);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date_asc') {
        return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      }
      if (sortBy === 'seats_available') {
        return (b.available_seats || 0) - (a.available_seats || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

    return result;
  }, [events, selectedCategory, search, availabilityFilter, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setAvailabilityFilter('all');
    setSortBy('date_asc');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategory !== 'All' ||
    availabilityFilter !== 'all' ||
    sortBy !== 'date_asc';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Discover & Register</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Technical Events</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and register for hackathons, paper presentations, coding contests, and robotics showcases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'Event found' : 'Events found'}
          </span>
          <button
            onClick={fetchEvents}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh events list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by event title, venue, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0E1424] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Availability Filter */}
          <div className="md:col-span-3">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1424] border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Registrations</option>
              <option value="open">Open For Registration Only</option>
              <option value="available_seats">Has Available Seats</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1424] border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="date_asc">Sort: Event Date (Soonest)</option>
              <option value="seats_available">Sort: Most Seats Remaining</option>
              <option value="newest">Sort: Recently Added</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 scale-105'
                    : 'bg-[#0E1424] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1 shrink-0 ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Events Grid / Empty State / Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#0E1424] border border-slate-800/80 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No technical events found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, category selection, or availability filters to see more events.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onSelect={onSelectEvent}
              onRegisterClick={onRegisterEvent}
              isRegistered={registeredEventIds.has(evt.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
