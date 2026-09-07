import { NextResponse } from "next/server";
import mockData from "@/data/mockData.json";
import type { GoogleReviewsResponse, Review } from "@/types";

interface GooglePlaceReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (apiKey && placeId) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === "OK" && data.result) {
        const reviews: Review[] = (data.result.reviews ?? []).map(
          (r: GooglePlaceReview, i: number) => ({
            id: `g-${i}`,
            author: r.author_name,
            rating: r.rating,
            comment: r.text,
            relativeDate: r.relative_time_description,
          })
        );
        const payload: GoogleReviewsResponse = {
          source: "google",
          rating: data.result.rating ?? 0,
          totalReviews: data.result.user_ratings_total ?? 0,
          reviews,
        };
        return NextResponse.json(payload);
      }
    } catch {
      // Cae al fallback de muestra si la API de Google falla.
    }
  }

  const fallback: GoogleReviewsResponse = {
    source: "mock",
    rating: mockData.storeInfo.rating,
    totalReviews: mockData.storeInfo.totalReviews,
    reviews: mockData.storeInfo.reviews,
  };
  return NextResponse.json(fallback);
}
