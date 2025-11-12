// Firebase Firestore Import Script for Beall's List
// Run this ONCE to populate your Firestore database

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase for Node environment
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const publishersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'predatory_publishers.json'), 'utf-8'));
const journalsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'predatory_journals.json'), 'utf-8'));

const BATCH_SIZE = 500; // Firestore batch limit

async function importToFirestore() {
  console.log('Starting Beall\'s List import...');
  
  try {
    // Import Publishers
    console.log(`Importing ${publishersData.length} publishers...`);
    let publisherCount = 0;
    
    for (let i = 0; i < publishersData.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const chunk = publishersData.slice(i, i + BATCH_SIZE);
      
      chunk.forEach((publisher: any) => {
        const docRef = doc(collection(db, 'predatory_publishers'));
        batch.set(docRef, {
          name: publisher.name,
          name_lowercase: publisher.name.toLowerCase(),
          imported_at: new Date()
        });
      });
      
      await batch.commit();
      publisherCount += chunk.length;
      console.log(`  Imported ${publisherCount}/${publishersData.length} publishers`);
    }
    
    // Import Journals
    console.log(`Importing ${journalsData.length} journals...`);
    let journalCount = 0;
    
    for (let i = 0; i < journalsData.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const chunk = journalsData.slice(i, i + BATCH_SIZE);
      
      chunk.forEach((journal: any) => {
        const docRef = doc(collection(db, 'predatory_journals'));
        batch.set(docRef, {
          name: journal.name,
          name_lowercase: journal.name.toLowerCase(),
          imported_at: new Date()
        });
      });
      
      await batch.commit();
      journalCount += chunk.length;
      console.log(`  Imported ${journalCount}/${journalsData.length} journals`);
    }
    
    console.log('✅ Import completed successfully!');
    console.log(`Total: ${publisherCount} publishers, ${journalCount} journals`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Run the import
importToFirestore();