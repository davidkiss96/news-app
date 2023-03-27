import { gql } from "graphql-request";
import sortNewByImage from "./sortNewsByImage";

const fetchNews = async (category?: Category | string, keywords?: string, isDynamic?: boolean) => {
  // GraphQL query
  const query = gql`
    query MyQuery($access_key: String!, $categories: String!, $keywords: String) {
      myQuery(
        access_key: $access_key
        categories: $categories
        countries: "gb"
        sort: "published_desc"
        keywords: $keywords
      ) {
        data {
          author
          category
          country
          description
          image
          language
          published_at
          source
          title
          url
        }
        pagination {
          count
          limit
          offset
          total
        }
      }
    }
  `;
  // Fetch function with Next.js 13 caching...
  const res = await fetch("https://campibisenzio.stepzen.net/api/rafting-armadillo/__graphql", {
    method: "POST",
    cache: isDynamic ? "no-cache" : "default",
    next: isDynamic ? { revalidate: 0 } : { revalidate: 20 },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Apikey ${process.env.STEPZEN_API_KEY}`,
    },
    body: JSON.stringify({
      query: query,
      variables: {
        access_key: process.env.MEDIASTACK_API_KEY,
        categories: category,
        keywords: keywords,
      },
    }),
  });

  console.log("LOADING NEW DATA FROM API for category >>>", category, keywords);

  const newResponse = await res.json();

  // Sort function by images vs not images present
  const news = sortNewByImage(newResponse.data.myQuery);

  return news;
};

export default fetchNews;

// stepzen import curl http://api.mediastack.com/v1/news?access_key=127bf7402d59b4b0977c95d3fd16683a&sources=business,sports
// stepzen import curl "http://api.mediastack.com/v1/news?access_key=127bf7402d59b4b0977c95d3fd16683a&countries=us%2Cgb&limit=100&offset=0&sort=published_desc"
