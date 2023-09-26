import './RestaurantList.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RestaurantDisplay = ({ id, image, name, description }) => {
  return (
    <div className='restaurantDisplay'>
      <img className='img ' src={image} alt={name} />
      <div className='restaurantDisplayItems'>
        <h2 className='resturantName'>{name}</h2>
        <p className='discriptions'>{description}</p>
        <Link className='reserveNowButton' to={'/restaurants/' + id}>
          Reserve Now
        </Link>
      </div>
    </div>
  );
};

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUrl = `http://localhost:5001/restaurants`;
        let response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        setRestaurants(result);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Restaurants</h1>
      <ul className='restaurantList'>
        {restaurants.map((restaurant) => {
          return (
            <li key={restaurant.id}>
              <RestaurantDisplay
                name={restaurant.name}
                description={restaurant.description}
                image={restaurant.image}
                id={restaurant.id}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RestaurantList;
