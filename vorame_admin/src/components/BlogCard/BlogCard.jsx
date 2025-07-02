// components/BlogCard.jsx
const BlogCard = ({ title, content }) => {
  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p>{content}</p>
    </div>
  );
};

export default BlogCard;
