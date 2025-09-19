import React, { useState, useEffect } from 'react';
import { Users, FileText, Trash2, Search, AlertCircle, CheckCircle, LogOut, Calendar, Mail } from 'lucide-react';
import API from "../api";  // path aapke folder structure ke hisaab se

const AdminDashboard = ({ token, user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);


// Fetch all users
const fetchUsers = async () => {
  setLoading(true);
  setError('');
  try {
    const { data } = await API.get("/admin/users");
    setUsers(Array.isArray(data) ? data : []);
  } catch (err) {
    setError(`Failed to fetch users: ${err.response?.data?.message || err.message}`);
  } finally {
    setLoading(false);
  }
};

// Fetch all notes
const fetchAllNotes = async () => {
  setLoading(true);
  setError('');
  try {
    const { data } = await API.get("/admin/notes");
    setAllNotes(Array.isArray(data) ? data : []);
  } catch (err) {
    setError(`Failed to fetch notes: ${err.response?.data?.message || err.message}`);
  } finally {
    setLoading(false);
  }
};

// Delete note
const deleteNote = async (noteId) => {
  if (!window.confirm('Are you sure you want to delete this note?')) return;

  try {
    await API.delete(`/admin/notes/${noteId}`);
    setSuccess('Note deleted successfully!');
    fetchAllNotes();
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    setError(`Failed to delete note: ${err.response?.data?.message || err.message}`);
  }
};


  // Get notes for specific user
  const getNotesForUser = (userId) => {
    return allNotes.filter(note => note?.user?._id === userId);
  };

  // Filter users
  const filteredUsers = users.filter(u => 
    (u?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (u?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Filter notes
  const filteredNotes = allNotes.filter(n => 
    (n?.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (n?.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (n?.user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
    fetchAllNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-6">
        <h1 className="text-white text-xl font-semibold">Notes Manager</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </nav>

      {/* Main Container */}
      <div className="flex items-center justify-center px-6 pb-6">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
            <p className="text-gray-600">
              Welcome back, <span className="font-semibold text-indigo-600">{user?.name || "Super Admin"}</span>! 
              Manage all users and their notes
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
              <button onClick={() => setError('')} className="ml-auto text-red-500 text-xl">×</button>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700">{success}</span>
              <button onClick={() => setSuccess('')} className="ml-auto text-green-500 text-xl">×</button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Total Users</p>
                  <p className="text-3xl font-bold">{users?.length || 0}</p>
                </div>
                <Users className="w-12 h-12 text-indigo-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Notes</p>
                  <p className="text-3xl font-bold">{allNotes?.length || 0}</p>
                </div>
                <FileText className="w-12 h-12 text-purple-200" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center px-6 py-3 rounded-md font-medium text-sm transition-colors ${
                  activeTab === 'users' 
                    ? 'bg-indigo-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Users ({users?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center px-6 py-3 rounded-md font-medium text-sm transition-colors ${
                  activeTab === 'notes' 
                    ? 'bg-indigo-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                All Notes ({allNotes?.length || 0})
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && !loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map(u => {
                const userNotes = getNotesForUser(u?._id) || [];
                return (
                  <div key={u?._id || Math.random()} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-bold text-gray-900">{u?.name || "Unnamed User"}</h3>
                        <p className="text-gray-500 text-sm flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {u?.email || "No email"}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        u?.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {u?.role || "user"}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Notes:</span>
                        <span className="font-semibold text-indigo-600">{userNotes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined:
                        </span>
                        <span className="font-medium">
                          {u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>

                    {userNotes.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Notes:</h4>
                        {userNotes.slice(0, 2).map(note => (
                          <div key={note?._id || Math.random()} className="text-xs text-gray-600 mb-1 bg-gray-50 rounded p-2">
                            • {note?.title 
                                ? (note.title.length > 25 ? note.title.substring(0, 25) + '...' : note.title)
                                : "(Untitled)"}
                          </div>
                        ))}
                        {userNotes.length > 2 && (
                          <p className="text-xs text-indigo-600 font-semibold">+{userNotes.length - 2} more notes</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && !loading && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredNotes.map(note => (
                      <tr key={note?._id || Math.random()} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {note?.title || "(Untitled)"}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {note?.description 
                                  ? (note.description.length > 80 
                                      ? note.description.substring(0, 80) + '...' 
                                      : note.description)
                                  : "(No description)"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{note?.user?.name || "Unknown"}</div>
                          <div className="text-sm text-gray-500">{note?.user?.email || "No email"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {note?.createdAt ? new Date(note.createdAt).toLocaleDateString() : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => deleteNote(note?._id)}
                            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center text-sm"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredNotes.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notes found</p>
                </div>
              )}
            </div>
          )}

          {/* Empty States */}
          {!loading && activeTab === 'users' && filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;