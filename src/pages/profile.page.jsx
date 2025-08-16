import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import InPageNavigation from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import PageNotFound from "./404.page";
import FollowButton from "../components/follow-button.component";
import { config } from "../config/environment.js";

export const profileDataStucture = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: "",
};

const ProfilePage = () => {
  let { id: profileId } = useParams();

  let [profile, setProfile] = useState(profileDataStucture);
  let [loading, setLoading] = useState(true);
  let [blogs, setBlogs] = useState(null);
  let [profileLoaded, setProfileLoaded] = useState();

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  const fetchProfile = async () => {
    axios
      .post(config.serverDomain + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
        if(user!==null){
          setProfile(user);
        }
        setProfileLoaded(profileId);
        getBlogs({ user_id: user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  };

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id === undefined ? blogs.user_id : user_id;

    axios
      .post(config.serverDomain + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formattedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-count-blogs",
          data_to_send: {
            author: user_id,
          },
        });

        formattedData.user_id = user_id;

        setBlogs(formattedData);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
      });
  };

  useEffect(() => {
    if (profileLoaded !== profileId) {
      setBlogs(null);
    }
    if (blogs === null) {
      resetState();
      fetchProfile();
    }
  }, [profileId, blogs]);

  const resetState = () => {
    setProfile(profileDataStucture);
    setLoading(true);
    setProfileLoaded("");
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profile_username.length ? (
        <section className="min-h-screen bg-white">
          {/* Header Banner */}
          <div className="w-full bg-gradient-to-r from-grey/20 to-grey/10 border-b border-grey/20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                {/* Profile Image */}
                <div className="relative">
            <img
              src={profile_img}
                    className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 bg-grey rounded-full border-4 border-white shadow-lg object-cover"
                    alt={fullname}
                  />
                  {profileId === username && (
                    <div className="absolute -bottom-2 -right-2 bg-black text-white rounded-full p-2 shadow-lg">
                      <i className="fi fi-rr-camera text-sm"></i>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2 leading-tight">
                    {fullname}
                  </h1>
                  <p className="text-lg sm:text-xl text-dark-grey mb-4">@{profile_username}</p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-8 mb-6">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-black">{total_posts.toLocaleString()}</div>
                      <div className="text-sm text-dark-grey">Blogs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-black">{total_reads.toLocaleString()}</div>
                      <div className="text-sm text-dark-grey">Reads</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              {profileId === username ? (
                      <>
                <Link
                  to="/settings/edit-profile"
                          className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-dark-grey transition-colors duration-200"
                >
                  Edit Profile
                </Link>
                        <Link
                          to="/dashboard/blogs"
                          className="px-6 py-2 border border-black text-black rounded-full font-medium hover:bg-black hover:text-white transition-all duration-200"
                        >
                          Manage Blogs
                        </Link>
                      </>
              ) : (
                <FollowButton 
                  authorId={profile._id} 
                  authorUsername={profile.personal_info.username} 
                />
              )}
                  </div>
                </div>
            </div>

              {/* Bio Section */}
              {bio && (
                <div className="mt-8 max-w-3xl">
                  <p className="text-lg text-dark-grey leading-relaxed">{bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <InPageNavigation
              routes={["Published Blogs", "About"]}
              defaultHidden={["About"]}
            >
              <div className="space-y-6">
                {blogs === null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  <div className="grid gap-6">
                    {blogs.results.map((blog, index) => (
                      <AnimationWrapper
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        key={index}
                      >
                        <div className="bg-white rounded-lg border border-grey/20 hover:border-grey/40 transition-all duration-200 hover:shadow-md">
                        <BlogPostCard
                          content={blog}
                          author={blog.author.personal_info}
                        />
                        </div>
                      </AnimationWrapper>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-grey/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fi fi-rr-document text-3xl text-dark-grey"></i>
                    </div>
                    <h3 className="text-xl font-medium text-black mb-2">No blogs published yet</h3>
                    <p className="text-dark-grey mb-6">
                      {profileId === username 
                        ? "Start writing your first blog to share your thoughts with the world." 
                        : `${fullname} hasn't published any blogs yet.`
                      }
                    </p>
                    {profileId === username && (
                      <Link
                        to="/editor"
                        className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-dark-grey transition-colors duration-200 inline-flex items-center gap-2"
                      >
                        <i className="fi fi-rr-edit"></i>
                        Write your first blog
                      </Link>
                    )}
                  </div>
                )}
                <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} />
              </div>
              
              {/* About Tab Content */}
              <div className="max-w-3xl">
              <AboutUser
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
              />
              </div>
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
