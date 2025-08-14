import React, { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTab } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const HomePage = () => {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");

  let categories = [
    "cooking",
    "education",
    "tech",
    "politics",
    "sports",
    "finance",
    "news",
    "history",
    "art",
    "travel",
  ];

  const fetchLatestBlogs = ({ page = 1 }) => {
    const serverDomain = import.meta.env.VITE_SERVER_DOMAIN || "https://connectbackend.llp.trizenventures.com";
    console.log("Using server domain:", serverDomain);
    axios
      .post(serverDomain + "/latest-blogs", {
        page,
      })
      .then(async ({ data }) => {
        console.log("Latest blogs data:", data.blogs);
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/count-blogs",
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBlogsByCategory = ({ page = 1 }) => {
    const serverDomain = import.meta.env.VITE_SERVER_DOMAIN || "https://connectbackend.llp.trizenventures.com";
    axios
      .post(serverDomain + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-count-blogs",
          data_to_send: { tag: pageState },
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlogs = () => {
    const serverDomain = import.meta.env.VITE_SERVER_DOMAIN || "https://connectbackend.llp.trizenventures.com";
    console.log("Using server domain for trending:", serverDomain);
    axios
      .get(serverDomain + "/trending-blogs")
      .then(({ data }) => {
        console.log("Trending blogs data:", data.blogs);
        setTrendingBlogs(data.blogs);

        // console.log(trendingBlogs)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadBlogCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlogs(null);

    if (pageState === category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  useEffect(() => {
    activeTab.current.click();

    if (pageState === "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, index) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: index * 0.1 }}
                      key={index}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author?.personal_info || {}}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No blogs published" />
              )}
              <LoadMoreDataBtn
                state={blogs}
                fetchDataFun={
                  pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory
                }
              />
            </>
            {trendingBlogs === null ? (
              <Loader />
            ) : trendingBlogs ? (
              trendingBlogs.map((blog, index) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: index * 0.1 }}
                    key={index}
                  >
                    <MinimalBlogPost blog={blog} index={index} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No trending blogs" />
            )}
          </InPageNavigation>
        </div>
        {/* filters and trending blogs */}

        <div className="min-ww-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>

              <div className="flex flex-wrap gap-3">
                {categories.map((category, index) => {
                  return (
                    <button
                      onClick={loadBlogCategory}
                      className={
                        "tag " +
                        (pageState === category ? "bg-black text-white" : "")
                      }
                      key={index}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {trendingBlogs === null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, index) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: index * 0.1 }}
                      key={index}
                    >
                      <MinimalBlogPost blog={blog} index={index} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No trending blogs" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
