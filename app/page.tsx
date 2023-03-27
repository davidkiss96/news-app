import { categories } from "@/constants";
import fetchNews from "@/lib/fetchNews";
import NewsList from "./NewsList";
import response from "../response.json";

const Homepage = async () => {
  const news: NewsResponse = response;

  console.log(news);

  return (
    <div>
      <NewsList news={news} />
    </div>
  );
};

export default Homepage;
