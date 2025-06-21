'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Edit3, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function SelfNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_notes')
        .insert([
          {
            user_id: user.id,
            content: newNote.trim()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setNotes([data, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNote = async (noteId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('user_notes')
        .update({ content: editContent.trim() })
        .eq('id', noteId);

      if (error) throw error;
      
      setNotes(notes.map(note => 
        note.id === noteId 
          ? { ...note, content: editContent.trim() }
          : note
      ));
      setEditingNote(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setEditContent('');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="text-2xl mr-2">📝</span>
        Self Notes
      </h3>
      
      {/* Add New Note */}
      <div className="mb-6">
        <div className="flex gap-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note to yourself..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                addNote();
              }
            }}
          />
          <button
            onClick={addNote}
            disabled={!newNote.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Press Ctrl+Enter to save</p>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>No notes yet. Start writing your thoughts!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="relative bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm"
            >
              {editingNote === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateNote(note.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors duration-200 flex items-center"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(note)}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 