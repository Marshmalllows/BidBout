import Header from "../Components/Header.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.tsx";
import Button from "../Components/Button.tsx";
import TextArea from "../Components/TextArea.tsx";
import { Loader } from "../Components/Loader.tsx"; // Імпорт спінера

type Review = {
  id: number;
  reviewerId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type SellerProfile = {
  id: number;
  name: string;
  averageRating: number;
  reviewsCount: number;
  reviews: Review[];
};

function SellerReviewsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosClient = useAxios(!!user);

  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState<number | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const res = await axiosClient.get(`/reviews/user/${id}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  }, [id, axiosClient]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async () => {
    try {
      if (isEditing && editReviewId) {
        await axiosClient.put(`/reviews/${editReviewId}`, { rating, comment });
      } else {
        await axiosClient.post("/reviews", {
          targetUserId: Number(id),
          rating,
          comment,
        });
      }
      setRating(5);
      setComment("");
      setIsEditing(false);
      setEditReviewId(null);
      void fetchReviews();
    } catch (err) {
      console.error(err);
      alert("Error saving review. You can only leave one review per seller.");
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Delete this review?")) return;
    try {
      await axiosClient.delete(`/reviews/${reviewId}`);
      void fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (review: Review) => {
    setRating(review.rating);
    setComment(review.comment || "");
    setIsEditing(true);
    setEditReviewId(review.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center h-screen items-center bg-white">
        <Loader />
      </div>
    );
  }

  if (!profile) {
    return <div className="flex justify-center mt-20">User not found</div>;
  }

  const myExistingReview = profile.reviews.find(
    (r) => r.reviewerId === Number(user?.id),
  );
  const isMyProfile = user && Number(user.id) === Number(id);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Header />

      <div className="max-w-[1100px] w-full mx-auto my-6 px-4 md:px-24">
        <div className="flex items-center justify-between">
          <h1 className="yeseva text-3xl mb-1">{profile.name}</h1>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-xl">★</span>
            <span className="noto font-bold text-lg">
              {profile.averageRating}
            </span>
            <span className="noto text-gray-500 text-sm">
              ({profile.reviewsCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 w-full flex-1 pb-10">
        <div className="max-w-[1100px] w-full mx-auto py-6 px-4 md:px-24">
          {user && !isMyProfile && (
            <div className="bg-white border border-gray-300 p-6 rounded-sm mb-8 shadow-sm">
              <h3 className="yeseva text-xl mb-4">
                {isEditing
                  ? "Edit your review"
                  : myExistingReview
                    ? "You reviewed this seller"
                    : "Leave a review"}
              </h3>

              {!myExistingReview || isEditing ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="noto">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <TextArea
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    customClasses="bg-gray-50 min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => void handleSubmit()}
                      variant="secondary"
                    >
                      {isEditing ? "Update Review" : "Post Review"}
                    </Button>
                    {isEditing && (
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setRating(5);
                          setComment("");
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 items-center">
                  <p className="noto text-gray-600">
                    You have already left a review.
                  </p>
                  <button
                    onClick={() => startEdit(myExistingReview!)}
                    className="text-blue-600 underline text-sm hover:text-blue-800"
                  >
                    Edit my review
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h3 className="yeseva text-2xl mb-2">Recent Reviews</h3>
            {profile.reviews.length === 0 && (
              <p className="text-gray-500 italic">No reviews yet.</p>
            )}

            {profile.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border-b border-gray-200 py-4 px-6 rounded-sm shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold noto">
                      {review.reviewerName}
                    </span>
                    <div className="flex text-yellow-400 text-sm">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="noto text-gray-700 whitespace-pre-wrap">
                  {review.comment ? review.comment : "No comment"}
                </p>
                {user &&
                  review.reviewerId === Number(user.id) &&
                  !isEditing && (
                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 justify-end">
                      <button
                        onClick={() => startEdit(review)}
                        className="p-2 hover:bg-gray-100 rounded-xs transition-colors group"
                        title="Edit"
                      >
                        <img
                          src="/Icons/pencil.svg"
                          alt="Edit"
                          className="w-4 h-4 opacity-60 group-hover:opacity-100"
                        />
                      </button>
                      <button
                        onClick={() => void handleDelete(review.id)}
                        className="p-2 hover:bg-red-50 rounded-xs transition-colors group"
                        title="Delete"
                      >
                        <img
                          src="/Icons/trash.svg"
                          alt="Delete"
                          className="w-4 h-4 opacity-60 group-hover:opacity-100"
                        />
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerReviewsPage;
