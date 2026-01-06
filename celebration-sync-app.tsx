import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  RefreshCcw, 
  Plus, 
  Trash2, 
  Gift, 
  Heart,
  ExternalLink,
  Search,
  Edit2
} from 'lucide-react';

// Types
type EventType = 'BIRTHDAY' | 'ANNIVERSARY';

interface Contact {
  id: string;
  name: string;
  phone: string;
  birthday?: string;
  anniversary?: string;
  relationship?: string;
}

interface CelebrationEvent {
  id: string;
  contactId: string;
  contactName: string;
  phone: string;
  type: EventType;
  date: string;
  status: 'pending' | 'sent';
  generatedMessage?: string;
}

const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<CelebrationEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'contacts'>('upcoming');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Load contacts from memory on mount
  useEffect(() => {
    const dummyContacts: Contact[] = [
      { id: '1', name: 'Alex Thompson', phone: '+11234567890', birthday: '1992-05-15', relationship: 'Best Friend' },
      { id: '2', name: 'Sarah Miller', phone: '+10987654321', anniversary: '2018-10-22', relationship: 'Sister' },
      { id: '3', name: 'Dad', phone: '+15551234444', birthday: '1965-08-10', relationship: 'Parent' },
      { id: '4', name: 'Jordan Lee', phone: '+12223334444', birthday: '1995-12-05', anniversary: '2021-06-12', relationship: 'Colleague' },
    ];
    setContacts(dummyContacts);
  }, []);

  // Update events based on contacts
  useEffect(() => {
    const newEvents: CelebrationEvent[] = [];
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    
    contacts.forEach(contact => {
      if (contact.birthday) {
        const eventMonth = contact.birthday.slice(5, 7);
        if (eventMonth === currentMonth) {
          newEvents.push({
            id: `${contact.id}-bday`,
            contactId: contact.id,
            contactName: contact.name,
            phone: contact.phone,
            type: 'BIRTHDAY',
            date: contact.birthday.slice(5),
            status: 'pending'
          });
        }
      }
      if (contact.anniversary) {
        const eventMonth = contact.anniversary.slice(5, 7);
        if (eventMonth === currentMonth) {
          newEvents.push({
            id: `${contact.id}-anniv`,
            contactId: contact.id,
            contactName: contact.name,
            phone: contact.phone,
            type: 'ANNIVERSARY',
            date: contact.anniversary.slice(5),
            status: 'pending'
          });
        }
      }
    });
    setEvents(newEvents);
  }, [contacts]);

  const generateMessage = (name: string, type: EventType, relationship?: string) => {
    const messages = {
      BIRTHDAY: [
        `Happy Birthday ${name}! 🎉 Wishing you an amazing day filled with joy and laughter!`,
        `🎂 Happy Birthday to an incredible ${relationship || 'person'}! Hope your day is as wonderful as you are, ${name}!`,
        `Happy Birthday ${name}! 🎈 May this year bring you happiness, success, and all your heart desires!`,
        `Wishing the happiest of birthdays to ${name}! 🎊 Enjoy your special day to the fullest!`
      ],
      ANNIVERSARY: [
        `Happy Anniversary ${name}! 💕 Wishing you both continued love and happiness!`,
        `Congratulations on your anniversary! 🥂 Here's to many more beautiful years together, ${name}!`,
        `Happy Anniversary! 💑 Your love story inspires us all. Cheers to you, ${name}!`,
        `Celebrating your special day with you! 🎉 Happy Anniversary ${name}!`
      ]
    };
    
    const typeMessages = messages[type];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  };

  const handleGenerateMessage = async (event: CelebrationEvent) => {
    setIsGenerating(event.id);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const contact = contacts.find(c => c.id === event.contactId);
    const message = generateMessage(event.contactName, event.type, contact?.relationship);
    
    setEvents(prev => prev.map(e => 
      e.id === event.id ? { ...e, generatedMessage: message } : e
    ));
    setIsGenerating(null);
  };

  const sendOnWhatsApp = (event: CelebrationEvent) => {
    if (!event.generatedMessage) return;
    const phone = event.phone.replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(event.generatedMessage);
    const url = `https://wa.me/${phone}?text=${encodedMsg}`;
    window.open(url, '_blank');
    
    setEvents(prev => prev.map(e => 
      e.id === event.id ? { ...e, status: 'sent' } : e
    ));
  };

  const handleAddContact = (formData: Partial<Contact>) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: formData.name || '',
      phone: formData.phone || '',
      birthday: formData.birthday,
      anniversary: formData.anniversary,
      relationship: formData.relationship
    };
    setContacts(prev => [...prev, newContact]);
    setShowAddContact(false);
  };

  const handleEditContact = (formData: Partial<Contact>) => {
    if (!editingContact) return;
    setContacts(prev => prev.map(c => 
      c.id === editingContact.id ? { ...c, ...formData } : c
    ));
    setEditingContact(null);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Delete this contact?')) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredEvents = events
    .filter(e => e.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.date.localeCompare(b.date));

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl text-white shadow-lg">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">CelebrationSync AI</h1>
              <p className="text-sm text-slate-500">Never miss a special moment</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-6">
        
        {/* Search & Tabs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${activeTab === 'upcoming' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Upcoming Events
            </button>
            <button 
              onClick={() => setActiveTab('contacts')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${activeTab === 'contacts' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Contacts
            </button>
          </div>
        </div>

        {activeTab === 'upcoming' ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-500" />
              This Month's Celebrations
            </h2>
            
            {filteredEvents.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No celebrations this month</p>
                <p className="text-slate-400 text-sm mt-1">Add contacts with birthdays or anniversaries!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredEvents.map(event => (
                  <div key={event.id} className="bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden">
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-inner ${event.type === 'BIRTHDAY' ? 'bg-gradient-to-br from-orange-400 to-pink-500 text-white' : 'bg-gradient-to-br from-red-400 to-pink-500 text-white'}`}>
                        {event.type === 'BIRTHDAY' ? <Gift className="w-7 h-7" /> : <Heart className="w-7 h-7" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg text-slate-900">{event.contactName}</h3>
                          <span className="text-sm font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                            {event.date}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm mt-0.5">
                          {event.type === 'BIRTHDAY' ? '🎂 Birthday' : '💑 Anniversary'}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {!event.generatedMessage ? (
                          <button 
                            onClick={() => handleGenerateMessage(event)}
                            disabled={isGenerating === event.id}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-md transition-all disabled:opacity-50"
                          >
                            <MessageSquare className={`w-4 h-4 ${isGenerating === event.id ? 'animate-bounce' : ''}`} />
                            {isGenerating === event.id ? 'Creating...' : 'Generate Message'}
                          </button>
                        ) : (
                          <button 
                            onClick={() => sendOnWhatsApp(event)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-md transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Send via WhatsApp
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {event.generatedMessage && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-t border-emerald-100 flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-slate-700 leading-relaxed">{event.generatedMessage}</p>
                          <button 
                            onClick={() => handleGenerateMessage(event)}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-2 flex items-center gap-1"
                          >
                            <RefreshCcw className="w-3 h-3" /> Generate new message
                          </button>
                        </div>
                        {event.status === 'sent' && (
                          <span className="text-[10px] font-bold uppercase bg-green-200 text-green-800 px-2 py-1 rounded-full">Sent ✓</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Your Contacts ({contacts.length})
              </h2>
              <button 
                onClick={() => setShowAddContact(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> Add Contact
              </button>
            </div>

            {filteredContacts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No contacts yet</p>
                <p className="text-slate-400 text-sm mt-1">Click "Add Contact" to get started!</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md divide-y divide-slate-100">
                {filteredContacts.map(contact => (
                  <div key={contact.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{contact.name}</h4>
                        <p className="text-xs text-slate-500">{contact.relationship || 'Contact'} • {contact.phone}</p>
                        <div className="flex gap-3 mt-1">
                          {contact.birthday && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                              🎂 {contact.birthday}
                            </span>
                          )}
                          {contact.anniversary && (
                            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">
                              💕 {contact.anniversary}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingContact(contact)}
                        className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Add/Edit Contact Modal */}
      {(showAddContact || editingContact) && (
        <ContactModal
          contact={editingContact}
          onSave={editingContact ? handleEditContact : handleAddContact}
          onClose={() => {
            setShowAddContact(false);
            setEditingContact(null);
          }}
        />
      )}

      <footer className="bg-white border-t border-slate-200 p-4 text-center text-slate-400 text-xs mt-8">
        Made with ❤️ by CelebrationSync AI
      </footer>
    </div>
  );
};

// Contact Modal Component
const ContactModal: React.FC<{
  contact: Contact | null;
  onSave: (data: Partial<Contact>) => void;
  onClose: () => void;
}> = ({ contact, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Contact>>(
    contact || { name: '', phone: '', birthday: '', anniversary: '', relationship: '' }
  );

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      alert('Name and phone are required!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-slate-900 mb-4">
          {contact ? 'Edit Contact' : 'Add New Contact'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone (with country code) *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
            <input
              type="text"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              placeholder="Friend, Family, Colleague..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Birthday</label>
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Anniversary</label>
            <input
              type="date"
              value={formData.anniversary}
              onChange={(e) => setFormData({ ...formData, anniversary: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium shadow-md transition-all"
            >
              Save Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;