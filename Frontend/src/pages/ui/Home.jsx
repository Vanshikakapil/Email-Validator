import CustomerReviews from "../../components/Home/CustomerReviews";
import Hero from "../../components/Home/Hero";
import TopFeatures from "../../components/Home/TopFeatures";
import DetailsSection from "../../components/Home/DetailsSection";

const Home = () => {
  return (
    <div className="bg-white text-gray-900">
    <Hero/>
    <TopFeatures/>
    <CustomerReviews/>
    <DetailsSection/>
    </div>
  );
};

export default Home;


