/* eslint-disable */

import { Stats } from '@/lib/utils';
import { SHA256 } from 'crypto-js';

function generatePersistentId() {
  let persistentId = localStorage.getItem('chatgpt_analyzer_id');
  
  if (!persistentId) {
    persistentId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chatgpt_analyzer_id', persistentId);
  }
  
  return persistentId;
}

function generateUniqueHash(id: string, timestamp: string) {
  return SHA256(id + timestamp).toString();
}

export async function shareAnonymizedData(stats: Stats) {
  const persistentId = generatePersistentId();
  const timestamp = new Date().toISOString();
  const uniqueHash = generateUniqueHash(persistentId, timestamp);

  const anonymizedData = {
    submissionId: persistentId,
    timestamp: timestamp,
    totalMessages: stats.userMessageCount + stats.assistantMessageCount,
    conversationCount: stats.conversationCount,
    averageMessagesPerDay: stats.averageMessagesPerDay,
    modelsUsed: Object.keys(stats.modelCounts).length,
    firstMessageDate: stats.firstMessageDate.toISOString(),
    longestChat: stats.longestChat,
    modelCounts: stats.modelCounts,
    weeklyMessageCounts: stats.weeklyMessages,
    chatLengthDistribution: stats.chatLengths,
  };

  try {
    const response = await fetch('https://gptwrapped.husaria.dev/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Data-Hash': uniqueHash,
      },
      body: JSON.stringify(anonymizedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to submit data: ${errorText}`);
    }

    console.log('Data shared successfully');
  } catch (error) {
    console.error('Error sharing data:', error);
    throw error; // Re-throw the error so it can be handled by the calling code
  }
}