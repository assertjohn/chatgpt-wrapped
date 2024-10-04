import { parseISO, format, startOfWeek, addWeeks, differenceInDays } from 'date-fns'

export interface ChatMessage {
  message?: {
    author?: {
      role?: string;
    };
    content?: {
      parts?: string[];
    };
    create_time?: number;
  };
}

export interface Conversation {
  mapping: {
    [key: string]: ChatMessage;
  };
  default_model_slug?: string;
}

export interface Stats {
  userMessageCount: number;
  assistantMessageCount: number;
  userCharCount: number;
  assistantCharCount: number;
  conversationCount: number;
  modelCounts: { [key: string]: number };
  weeklyMessages: { [key: string]: { [key: string]: number } };
  chatLengths: number[];
  firstMessageDate: Date;
  longestChat: number;
  averageMessagesPerDay: number;
}

export const analyzeData = (data: Conversation[]): Stats => {
  const stats: Stats = {
    userMessageCount: 0,
    assistantMessageCount: 0,
    userCharCount: 0,
    assistantCharCount: 0,
    conversationCount: data.length,
    modelCounts: {},
    weeklyMessages: {},
    chatLengths: [],
    firstMessageDate: new Date(),
    longestChat: 0,
    averageMessagesPerDay: 0,
  }

  let latestMessageDate = new Date(0);

  data.forEach(conversation => {
    const model = conversation.default_model_slug || 'Unknown'
    let chatLength = 0

    Object.values(conversation.mapping).forEach(item => {
      if (item.message) {
        const role = item.message.author?.role
        const content = item.message.content?.parts?.join('') || ''
        const createTime = item.message.create_time || Date.now() / 1000
        const messageDate = new Date(createTime * 1000)
        const weekKey = format(startOfWeek(messageDate), 'yyyy-MM-dd')

        chatLength++

        if (messageDate < stats.firstMessageDate) {
          stats.firstMessageDate = messageDate
        }
        if (messageDate > latestMessageDate) {
          latestMessageDate = messageDate
        }

        if (role === 'user') {
          stats.userMessageCount++
          stats.userCharCount += content.length
        } else if (role === 'assistant') {
          stats.assistantMessageCount++
          stats.assistantCharCount += content.length
          stats.modelCounts[model] = (stats.modelCounts[model] || 0) + 1
        }

        if (!stats.weeklyMessages[weekKey]) {
          stats.weeklyMessages[weekKey] = {}
        }
        stats.weeklyMessages[weekKey][model] = (stats.weeklyMessages[weekKey][model] || 0) + 1
      }
    })

    stats.chatLengths.push(chatLength)
    stats.longestChat = Math.max(stats.longestChat, chatLength)
  })

  const totalDays = differenceInDays(latestMessageDate, stats.firstMessageDate) + 1
  const totalMessages = stats.userMessageCount + stats.assistantMessageCount
  stats.averageMessagesPerDay = totalMessages / totalDays

  return stats
}

export const prepareChartData = (stats: Stats) => {
  const sortedWeeks = Object.keys(stats.weeklyMessages).sort()
  const firstWeek = parseISO(sortedWeeks[0])
  const lastWeek = parseISO(sortedWeeks[sortedWeeks.length - 1])

  let currentWeek = firstWeek
  const allWeeks = []

  while (currentWeek <= lastWeek) {
    allWeeks.push(format(currentWeek, 'yyyy-MM-dd'))
    currentWeek = addWeeks(currentWeek, 1)
  }

  return allWeeks.map(week => ({
    week: format(parseISO(week), 'MMM d, yyyy'),
    ...stats.weeklyMessages[week],
    total: stats.weeklyMessages[week] 
      ? Object.values(stats.weeklyMessages[week]).reduce((sum, count) => sum + count, 0)
      : 0
  }))
}

export const prepareChatLengthHistogram = (chatLengths: number[]) => {
  const bins = Array.from({ length: 20 }, (_, i) => ({
    range: `${i * 5 + 1}-${(i + 1) * 5}`,
    count: 0
  }))
  bins.push({ range: '100+', count: 0 })

  chatLengths.forEach(length => {
    if (length > 100) {
      bins[20].count++
    } else {
      const binIndex = Math.floor((length - 1) / 5)
      bins[binIndex].count++
    }
  })

  return bins
}