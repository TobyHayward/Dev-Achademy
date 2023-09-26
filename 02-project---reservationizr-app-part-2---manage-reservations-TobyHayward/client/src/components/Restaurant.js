import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { useAuth0 } from '@auth0/auth0-react';

// import CreateReservation from './CreateReservation';
import './Restaurant.css';

const RestaurantDisplay = ({ image, name, description }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [partySize, setPartySize] = useState(Number);
  const [date, setStartDate] = useState(new Date());
  const { getAccessTokenSilently } = useAuth0();
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const handleSubmit = async (event) => {
    const accessToken = await getAccessTokenSilently();
    event.preventDefault();
    setIsLoading(true);

    const restaurantName = name;
    const reservation = {
      partySize,
      date,
      restaurantName,
    };

    const response = await fetch('http://localhost:5001/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      console.log(response);
      setIsError(true);
      setErrorStatus(response.status);
    } else {
      setIsLoading(false);
      navigate('/reservations');
    }
  };

  if (isError) {
    return (
      <>
        <p className='no-restaurants'>
          Error creating a restaurant (error status {errorStatus})
        </p>
        <Link to='/' className='button'>
          Return to restaurants
        </Link>
      </>
    );
  }

  return (
    <div className='restaurantDisplay'>
      <div className='restaurantDisplayItems'>
        <img src={image} alt={name} />
        <div>
          <h2 className='resturantName'>{name}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className='formGrid'>
        <h3 className='resturantName'>Reserve {name}</h3>
        <form onSubmit={handleSubmit}>
          <p>
            <label className='label' htmlFor='partySize'>
              Number of Guests
            </label>
            <input
              type='text'
              id='partySize'
              className='form-input'
              value={partySize}
              onChange={(event) => {
                setPartySize(event.target.value);
              }}
              required
            />
          </p>
          <label htmlFor='date'>Date</label>
          <DatePicker
            id='date'
            selected={date}
            onChange={(date) => setStartDate(date)}
            dateFormat='Pp'
            showTimeSelect
            timeFormat='p'
          />

          <button
            className='submit-btn'
            disabled={isLoading}
            onSubmit={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUrl = `http://localhost:5001/restaurants/${id}`;
        const response = await fetch(fetchUrl);

        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.json();
        setRestaurant(result);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <RestaurantDisplay
        key={restaurant.id}
        name={restaurant.name}
        description={restaurant.description}
        image={restaurant.image}
        id={restaurant.id}
      />
    </>
  );
};

export default Restaurant;
