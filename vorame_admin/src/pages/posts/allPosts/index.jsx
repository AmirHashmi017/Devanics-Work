import React, { useEffect, useState, useCallback } from "react";
import PostCard from "./components/SinglePlan";
import Loader from "../../../components/Loader";
import Error from "components/Error";
import NoData from "components/NoData";
import PostApi from "services/api/post";

// Utility to format numbers as K/M
const formatNumber = (num) => {
  if (!num || num === 0) return '0';
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';
  } else {
    return num.toString();
  }
};

const AllPosts = ({ searchTerm = "" }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 25;

  const fetchPosts = useCallback(async (reset = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiResponse = await PostApi.getPosts({ limit, offset: reset ? 0 : offset });
      const messages = apiResponse?.data?.messages || [];
      if (reset) {
        setPosts(messages);
      } else {
        setPosts(prev => [...prev, ...messages]);
      }
      setHasMore(messages.length === limit);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchPosts(true);
    setOffset(0);
  }, [searchTerm]);

  const handleShowMore = () => {
    setOffset(prev => prev + limit);
  };

  useEffect(() => {
    if (offset !== 0) {
      fetchPosts();
    }
    // eslint-disable-next-line
  }, [offset]);

  // Map backend post to PostCard expected format
  const mapPost = (post) => {
    let pollData = undefined;
    if (post.msgType === "poll") {
      const totalVotes = post.totalVotes || 0;
      pollData = {
        options: (post.pollOptions || []).map((opt, idx) => {
          const votes = post.votesPerOption && post.votesPerOption[idx]
            ? post.votesPerOption[idx].voteCount
            : 0;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          return {
            label: opt,
            percentage,
            selected: false,
          };
        }),
        totalVotes,
        timeLeft: "",
      };
    }
    return {
      id: post._id,
      profileImage: post.postedBy?.avatar || "/avatar.jpg",
      fullName: post.postedBy?.name || "-",
      username: post.postedBy?.email ? `@${post.postedBy.email.split("@")[0]}` : "",
      text: post.message || post.pollDescription || "",
      pollData,
      totalimpressions: post.readBy?.length || 0,
      totallikes: post.likes || 0,
      totalcomments: post.comments || 0,
      report: post.reportBy?.length || 0,
      files: post.files || [],
      title: post.title || "",
    };
  };

  // Filter posts by search term (case-insensitive, checks title and text)
  const filteredPosts = posts.filter((post) => {
    const mapped = mapPost(post);
    const search = searchTerm.toLowerCase();
    return (
      mapped.text.toLowerCase().includes(search) ||
      mapped.title.toLowerCase().includes(search)
    );
  });

  if (isLoading && posts.length === 0) return <Loader />;
  if (error) return <Error error={error} />;

  return (
    <div>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => {
          const mapped = mapPost(post);
          return (
            <PostCard
              key={post._id}
              data={{
                ...mapped,
                totalimpressions: formatNumber(mapped.totalimpressions),
                totallikes: formatNumber(mapped.totallikes),
                totalcomments: formatNumber(mapped.totalcomments),
                report: formatNumber(mapped.report),
                postedBy: post.postedBy // Pass the full user object for block/unblock
              }}
              refetchPosts={() => fetchPosts(true)}
            />
          );
        })
      ) : (
        <NoData />
      )}
      {hasMore && !isLoading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button onClick={handleShowMore} style={{ padding: '8px 24px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
            Show More
          </button>
        </div>
      )}
      {isLoading && posts.length > 0 && <Loader />}
    </div>
  );
};

export default AllPosts;
