import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import Blog from "./blog.model";

class BlogService {
  constructor() {}
  // Create blog
  async createBlog(body) {
    const { title, description, file } = body;

    const blog = new Blog({
      title: title,
      description: description,
      file: file,
    });

    const result = await blog.save();

    if (!result) {
      return {
        message: ResponseMessage.BLOG_NOT_CREATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.BLOG_CREATED,
      statusCode: EHttpStatus.CREATED,
    };
  }

  //   Get blogs list
  async blogList(query) {
    const {offset='0',limit='25'}= query
    const blogOffset=parseInt(offset as string)
    const blogLimit=parseInt(limit as string)

    const totalCount=await Blog.countDocuments()
    const blogs = await Blog.find({}).skip(blogOffset).limit(blogLimit);

    if (!blogs || blogs.length <= 0) {
      return {
        message: ResponseMessage.BLOG_NOT_EXISTS,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { blogs,
        pagination:
        {
        totalRecords:totalCount,
        offset: blogOffset
        }
       },
    };
  }

  // Get  blogs by favorite value
  async favouriteBlogs(body) {
    const { favourite } = body;

    const blogList = await Blog.find({ favourite: favourite });

    if (!blogList || blogList.length <= 0) {
      return {
        message: ResponseMessage.BLOG_NOT_EXISTS,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { blogList },
    };
  }

  //   Get single blog
  async singleBlog(body) {
    const { id } = body;

    const findBlog = await Blog.findById({ _id: id });

    if (!findBlog) {
      return {
        message: ResponseMessage.BLOG_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { findBlog },
    };
  }

  //   Update blog
  async updateBlog(body) {
    const { id, title, description, file } = body;

    const findBlog = await Blog.findById({ _id: id });

    if (!findBlog) {
      return {
        message: ResponseMessage.BLOG_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findBlog.title = title;
    findBlog.description = description;
    findBlog.file = file;

    const updatedClip = await findBlog.save();

    if (!updatedClip) {
      return {
        message: ResponseMessage.BLOG_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.BLOG_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update blog status
  async updateStatus(body) {
    const { id, status } = body;

    const findBlog = await Blog.findById({ _id: id });

    if (!findBlog) {
      return {
        message: ResponseMessage.BLOG_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findBlog.status = status;

    const updateStatus = await findBlog.save();

    if (!updateStatus) {
      return {
        message: ResponseMessage.BLOG_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.BLOG_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update  blogfavourite
  async updateFavourite(body) {
    const { id, favourite } = body;

    const findBlog = await Blog.findById({ _id: id });

    if (!findBlog) {
      return {
        message: ResponseMessage.BLOG_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findBlog.favourite = favourite;

    const updateFavourite = await findBlog.save();

    if (!updateFavourite) {
      return {
        message: ResponseMessage.BLOG_FAVOURITE_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.BLOG_FAVOURITE_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  //   Delete book club
  async deleteBlog(body) {
    const { id } = body;

    const findClip = await Blog.findById({ _id: id });

    if (!findClip) {
      return {
        message: ResponseMessage.BLOG_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    const deleteBook = await Blog.findByIdAndDelete({ _id: id });

    if (!deleteBook) {
      return {
        message: ResponseMessage.BLOG_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.BLOG_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }
}

export default new BlogService();
