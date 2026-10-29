import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DocumentPickerAsset } from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { z } from 'zod';

const KEY = 'build.study-shelf.v1';
const DB = 'build-study-notes';
const STORE = 'files';
const courseSchema = z.object({ id: z.string(), code: z.string(), name: z.string() });
const noteSchema = z.object({ id: z.string(), name: z.string(), uri: z.string(), courseId: z.string().nullable(), size: z.number(), addedAt: z.number() });
const shelfSchema = z.object({ courses: z.array(courseSchema), notes: z.array(noteSchema) });

export type ShelfCourse = z.infer<typeof courseSchema>;
export type ShelfNote = z.infer<typeof noteSchema>;
export type StudyShelf = { courses: ShelfCourse[]; notes: ShelfNote[] };

export async function loadStudyShelf(): Promise<StudyShelf> {
  const value = await AsyncStorage.getItem(KEY);
  if (!value) return { courses: [], notes: [] };
  return shelfSchema.parse(JSON.parse(value));
}

export async function saveStudyShelf(shelf: StudyShelf): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(shelfSchema.parse(shelf)));
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putWebFile(id: string, file: globalThis.File): Promise<void> {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE, 'readwrite');
      transaction.objectStore(STORE).put(file, id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } finally { db.close(); }
}

async function getWebFile(id: string): Promise<Blob | undefined> {
  const db = await openDb();
  try {
    return await new Promise<Blob | undefined>((resolve, reject) => {
      const transaction = db.transaction(STORE, 'readonly');
      const request = transaction.objectStore(STORE).get(id);
      request.onsuccess = () => resolve(request.result as Blob | undefined);
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}

export async function storePickedNote(asset: DocumentPickerAsset, courseId: string | null): Promise<ShelfNote> {
  if (asset.size && asset.size > 25 * 1024 * 1024) throw new Error('Choose a file smaller than 25 MB.');
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  let uri = asset.uri;
  if (Platform.OS === 'web') {
    if (!asset.file) throw new Error('This browser could not read the selected file.');
    await putWebFile(id, asset.file);
    uri = `indexeddb:${id}`;
  } else {
    const folder = new Directory(Paths.document, 'study-notes');
    await folder.create({ idempotent: true, intermediates: true });
    const extension = asset.name.match(/\.[a-z0-9]+$/i)?.[0] || '';
    const destination = new File(folder, `${id}${extension}`);
    await new File(asset.uri).copy(destination);
    uri = destination.uri;
  }
  return { id, name: asset.name, uri, courseId, size: asset.size || 0, addedAt: Date.now() };
}

export async function openStudyNote(note: ShelfNote): Promise<void> {
  if (Platform.OS === 'web') {
    const file = await getWebFile(note.id);
    if (!file) throw new Error('The saved file is no longer available in this browser.');
    const url = URL.createObjectURL(file);
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
      URL.revokeObjectURL(url);
      throw new Error('Allow pop-ups to open this lecture note.');
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } else {
    if (!new File(note.uri).exists) throw new Error('The saved file is no longer available on this device.');
    if (!(await Sharing.isAvailableAsync())) throw new Error('No app is available to open this file.');
    await Sharing.shareAsync(note.uri, { dialogTitle: note.name });
  }
}
