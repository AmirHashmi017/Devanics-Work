import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import Print from "./bluePrint.model";
import ChatGptHistory from "./chatgptHistory.model";
import mongoose from "mongoose";
const axios = require('axios');

class PrintService {
  constructor() {}
  // Return Chat Response
  async chatgptResponse(body)
  {
    let { userId, chatId, userMessage } = body;
    userId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userMessage },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
     const aiMessage = response.data.choices[0].message.content;
     if (!aiMessage) {
      return {
        message: ResponseMessage.CHATGPT_FAILURE,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }
    let chatHistory;
    if (chatId) {
      chatHistory = await ChatGptHistory.findOne({ _id: chatId, userId });
      if (chatHistory) {
        chatHistory.history.push({ message: userMessage, response: aiMessage });
        await chatHistory.save();
      }
    }
    if (!chatHistory) {
      chatHistory = new ChatGptHistory({
        userId,
        history: [{ message: userMessage, response: aiMessage }],
      });
      await chatHistory.save();
    }
    return {
      message: aiMessage,
      chatId: chatHistory._id,
      statusCode: EHttpStatus.CREATED,
    };
  }

async getChatHistory(body, userId) {
  userId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
  const { token } = body;
  const { offset = 0, limit = 25 } = body;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);
  const lastWeekStart = new Date(todayStart);
  lastWeekStart.setDate(todayStart.getDate() - 7);
  const lastMonthStart = new Date(todayStart);
  lastMonthStart.setMonth(todayStart.getMonth() - 1);

  let dateFilter = {};
  if (token === 'today') {
    dateFilter = { updatedAt: { $gte: todayStart } };
  } else if (token === 'yesterday') {
    dateFilter = { updatedAt: { $gte: yesterdayStart, $lt: todayStart } };
  } else if (token === 'lastweek') {
    dateFilter = { updatedAt: { $gte: lastWeekStart, $lt: yesterdayStart } };
  } else if (token === 'lastmonth') {
    dateFilter = { updatedAt: { $gte: lastMonthStart, $lt: lastWeekStart } };
  }

  const filter = { userId, ...dateFilter };
  const total = await ChatGptHistory.countDocuments(filter);
  const histories = await ChatGptHistory.find(filter)
    .sort({ updatedAt: -1 })
    .skip(Number(offset))
    .limit(Number(limit));

  return {
    statusCode: EHttpStatus.OK,
    data: {
      histories,
      pagination: {
        offset: Number(offset),
        limit: Number(limit),
        total,
      }
    }
  };
}

  async createPrint(body) {
    const { title, description, file } = body;

    console.log("Create print body:", body);

    const print = new Print({
      title: title,
      description: description,
      file: file,
    });

    const result = await print.save();

    if (!result) {
      return {
        message: ResponseMessage.PRINT_NOT_CREATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.PRINT_CREATED,
      statusCode: EHttpStatus.CREATED,
    };
  }

  //   Get blue print list
  async printList(body) {
    const { searchKeyword } = body;
    let query = {};

    if (searchKeyword) {
      query = {
        $or: [
          { title: { $regex: searchKeyword, $options: "i" } },
          { description: { $regex: searchKeyword, $options: "i" } },
        ],
      };
    }

    const prints = await Print.find(query);

    if (!prints || prints.length <= 0) {
      return {
        message: ResponseMessage.PRINT_NOT_EXISTS,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { prints },
    };
  }

  //   Get single blue print
  async singlePrint(body) {
    const { id } = body;

    const findPrint = await Print.findById({ _id: id });

    if (!findPrint) {
      return {
        message: ResponseMessage.PRINT_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { findPrint },
    };
  }

  //   Update blue priint
  async updatePrint(body) {
    const { id, title, description, file } = body;
    console.log("Update print body:", body);

    const findPrint = await Print.findById({ _id: id });

    if (!findPrint) {
      return {
        message: ResponseMessage.PRINT_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findPrint.description = description;
    findPrint.title = title;
    findPrint.file = file;

    const updatedPrint = await findPrint.save();

    if (!updatedPrint) {
      return {
        message: ResponseMessage.PRINT_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.PRINT_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update blue print status
  async updateStatus(body) {
    const { id, status } = body;

    const findPrint = await Print.findById({ _id: id });

    if (!findPrint) {
      return {
        message: ResponseMessage.PRINT_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findPrint.status = status;

    const updateStatus = await findPrint.save();

    if (!updateStatus) {
      return {
        message: ResponseMessage.PRINT_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.PRINT_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  //   Delete blue print
  async deletePrint(body) {
    const { id } = body;

    const findPrint = await Print.findById({ _id: id });

    if (!findPrint) {
      return {
        message: ResponseMessage.PRINT_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    const deletePrint = await Print.findByIdAndDelete({ _id: id });

    if (!deletePrint) {
      return {
        message: ResponseMessage.PRINT_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.PRINT_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }
}

export default new PrintService();
