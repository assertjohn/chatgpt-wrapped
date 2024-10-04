import { Stats } from '@/lib/utils';

function generatePersistentId() {
    let persistentId = localStorage.getItem('chatgpt_analyzer_id');
    
    if (!persistentId) {
      persistentId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('chatgpt_analyzer_id', persistentId);
    }
    
    return persistentId;
  }

async function submitToGoogleForm(jsonData: string) {
  const FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
  
  const formData = new URLSearchParams();
  formData.append('entry.ENTRY_ID', jsonData);

  try {
    const response = await fetch(FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    console.log('Data submitted successfully');
    return true;
  } catch (error) {
    console.error('Error submitting data:', error);
    throw error;
  }
}

export async function shareAnonymizedData(stats: Stats) {
  const persistentId = await generatePersistentId();

  const anonymizedData = {
    id: persistentId,
    timestamp: new Date().toISOString(),
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

  const jsonString = JSON.stringify(anonymizedData);

  try {
    await submitToGoogleForm(jsonString);
    console.log('Data shared successfully');
  } catch (error) {
    console.error('Error sharing data:', error);
  }
}