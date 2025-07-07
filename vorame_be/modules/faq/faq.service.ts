import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import Faq from "./faq.model";

class FaqService {
  constructor() {}
  //   Create faq
  async createFaq(body) {
    const { question, description } = body;

    const faq = new Faq({
      question: question,
      description: description,
    });

    const result = await faq.save();

    if (!result) {
      return {
        message: ResponseMessage.FAQ_NOT_CREATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.FAQ_CREATED,
      statusCode: EHttpStatus.CREATED,
    };
  }

  //   Get faq list
  async faqList() {
    const faqs = await Faq.find({});

    return {
      statusCode: EHttpStatus.OK,
      data: { faqs },
    };
  }

  //   Get single faq
  async singleFaq(body) {
    const { id } = body;

    const findFaq = await Faq.findById({ _id: id });

    if (!findFaq) {
      return {
        message: ResponseMessage.FAQ_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { findFaq },
    };
  }

  //   Update faq
  async updateFaq(body) {
    const { id, question, description } = body;

    const findFaq = await Faq.findById({ _id: id });

    if (!findFaq) {
      return {
        message: ResponseMessage.FAQ_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findFaq.question = question;
    findFaq.description = description;

    const updatedFaq = await findFaq.save();

    if (!updatedFaq) {
      return {
        message: ResponseMessage.FAQ_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.FAQ_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update faq status
  async updateStatus(body) {
    const { id, status } = body;

    const findTape = await Faq.findById({ _id: id });

    if (!findTape) {
      return {
        message: ResponseMessage.FAQ_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findTape.status = status;

    const updateStatus = await findTape.save();

    if (!updateStatus) {
      return {
        message: ResponseMessage.FAQ_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.FAQ_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  //   Delete faq
  async deleteFaq(body) {
    const { id } = body;

    const findFaq = await Faq.findById({ _id: id });

    if (!findFaq) {
      return {
        message: ResponseMessage.FAQ_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    const deletedFaq = await Faq.findByIdAndDelete({ _id: id });

    if (!deletedFaq) {
      return {
        message: ResponseMessage.FAQ_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.FAQ_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }
}

export default new FaqService();
