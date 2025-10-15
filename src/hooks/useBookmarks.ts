import { useState, useEffect } from 'react';
import { Medicine } from '@/types/medicine';

const BOOKMARKS_KEY = 'medicine_bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Medicine[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse bookmarks', e);
      }
    }
  }, []);

  const saveBookmarks = (newBookmarks: Medicine[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  };

  const addBookmark = (medicine: Medicine) => {
    const exists = bookmarks.find(b => b.name === medicine.name);
    if (!exists) {
      const newBookmarks = [...bookmarks, medicine];
      saveBookmarks(newBookmarks);
      return true;
    }
    return false;
  };

  const removeBookmark = (medicineName: string) => {
    const newBookmarks = bookmarks.filter(b => b.name !== medicineName);
    saveBookmarks(newBookmarks);
  };

  const isBookmarked = (medicineName: string) => {
    return bookmarks.some(b => b.name === medicineName);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked
  };
};
