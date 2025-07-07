import { objectId } from "../../utils";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import { Career, CareerApplicant } from "./career.model";
import { CustomError } from "../../errors/custom.error";

class CareerService {
  constructor() {}

  // handler to check career id exist or not
  checkCareerHandler = async (id: string) => {
    const career = await Career.findById(id);

    if (!career) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.CAREER_ID_INVALID
      );
    }
    return career;
  };

  //   create career
  async createCareer({ params, body }) {
    const { id } = params;
    let career;
    career = await Career.findOne({ title: body.title });

    if (career) {
      return {
        message: ResponseMessage.CAREER_ALREADY_EXIST,
        statusCode: EHttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    career = await Career.create({ postedBy: id, ...body });
    return {
      message: ResponseMessage.CAREER_CREATED,
      statusCode: EHttpStatus.CREATED,
      data: career,
    };
  }

  //   add career applicant
  async addCareerApplicant({ payload, params, body }) {
    const { id } = params;
    const { _id: appliedBy } = payload;

    await this.checkCareerHandler(id);

    let applicant;
    applicant = await CareerApplicant.findOne({ appliedBy, career: id });

    if (applicant) {
      return {
        message: ResponseMessage.CAREER_APPLICANT_ALREADY_EXIST,
        statusCode: EHttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    applicant = await CareerApplicant.create({
      appliedBy,
      career: objectId(id),
      ...body,
    });
    return {
      message: ResponseMessage.CAREER_APPLICATION_SUCCESS,
      statusCode: EHttpStatus.CREATED,
      data: applicant,
    };
  }

  //  career list
  async careerList({ payload }) {
    const { _id } = payload;
    console.log(_id, "id...");
    const careers = await Career.aggregate([
      {
        $lookup: {
          from: "careerapplicants",
          localField: "_id",
          foreignField: "career",
          as: "careerApplicants",
        },
      },
      {
        $addFields: {
          isApplied: {
            $in: [objectId(_id), "$careerApplicants.appliedBy"],
          },
          totalApplicants: { $size: "$careerApplicants" },
        },
      },
      {
        $project: {
          careerApplicants: 0,
        },
      },
    ]);

    return {
      statusCode: EHttpStatus.OK,
      data: { careers },
    };
  }

  //  single career
  async singleCareer({ params }) {
    const { id } = params;

    const career = await Career.findById(id);

    if (!career) {
      return {
        message: ResponseMessage.CAREER_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: career,
    };
  }

  //  career applicants
  async careerApplicants({ params }) {
    const { id } = params;
    await this.checkCareerHandler(id);
    const applicants = await CareerApplicant.find({ career: id })
      .populate("career")
      .populate("appliedBy");

    return {
      statusCode: EHttpStatus.OK,
      data: { applicants },
    };
  }

  //  career single applicant
  async careerApplicant({ params }) {
    const { id } = params;

    const applicant = await CareerApplicant.findById(id).populate("career");

    if (!applicant) {
      return {
        message: ResponseMessage.CAREER_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: applicant,
    };
  }

  //  update career
  async updateCareer({ params, body }) {
    const { id } = params;
    await this.checkCareerHandler(id);
    const career = await Career.findByIdAndUpdate({ _id: id, $set: body });

    if (!career) {
      return {
        message: ResponseMessage.CAREER_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    if (!career) {
      return {
        message: ResponseMessage.CAREER_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.CAREER_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update career status
  async updateStatus({ params, body }) {
    const { id } = params;
    await this.checkCareerHandler(id);
    const career = await Career.findByIdAndUpdate({ _id: id }, { body });

    if (!career) {
      return {
        message: ResponseMessage.CAREER_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.CAREER_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  //  delete career
  async deleteCareer({ params }) {
    const { id } = params;
    await this.checkCareerHandler(id);
    await Career.findById({ _id: id });
    const deletedCareers = await CareerApplicant.deleteMany({ career: id });

    return {
      message: ResponseMessage.CAREER_DELETED,
      statusCode: EHttpStatus.OK,
      data: deletedCareers,
    };
  }
}

export default new CareerService();
