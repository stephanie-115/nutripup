import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export default function PuppyPortal() {
  const navigate = useNavigate();
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const images = [
    "https://images.unsplash.com/photo-1615751072497-5f5169febe17?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGRvZ3xlbnwwfHwwfHx8MA%3D%3D",
    "https://www.onegreenplanet.org/wp-content/uploads/2016/08/bulldog.jpg",
    "https://worldanimalfoundation.org/wp-content/uploads/2023/09/cutest-dog-breed-1024x662.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/small-dogs-pug-1563779089.jpg",
    "https://images.wsj.net/im-390524/portrait?pixel_ratio=2",
    "https://hips.hearstapps.com/hmg-prod/images/cutest-dog-breeds-retrievers-64356ac6e2242.jpg?crop=1.00xw:0.835xh;0,0.109xh&resize=980:*", 'https://dogsbestlife.com/wp-content/uploads/2022/06/cutest-dog-breeds-scaled-e1655990275393.jpeg', 'https://cdn.akc.org/content/article-body-image/cavkingcharlessmalldogs.jpg', 'https://ghk.h-cdn.co/assets/16/08/2560x3840/gettyimages-464163411.jpg', 'https://cdn.i-scmp.com/sites/default/files/d8/images/canvas/2022/04/11/05ce33c1-0fbe-45de-a94f-ae93a078755c_955c6d52.jpg', 'https://imgs.search.brave.com/P--gU5hh87kdt0Ni6TvAPX-PAlwfjXGK2vY5Tngyqvc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9lbi5i/Y2RuLmJpei9JbWFn/ZXMvMjAxOC82LzYv/NGE2ODk4NGMtOGFh/Zi00NmEyLWI2ZWMt/NjA2NzdlNjg5MzE4/LmpwZw', 'https://imgs.search.brave.com/f6SyUUWCD40LDHRCujx17p4JvX_jywX1RpmMBqq0UUI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzA1LzgzLzQ2/LzM2MF9GXzYwNTgz/NDYyMF9rYklIamhF/VmV5ZUt0aFhoSkE4/azBLQmFDQ2F0TFNy/cC5qcGc'
  ];

  return (
    <>
 <div className="puppy-container">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Puppy ${index + 1}`} className="pup-image" />
            </div>
          ))}
        </Slider>
      </div>
      <div className="button-container">
      <button
        onClick={() => navigate("/puppy-portal/add")}
        className="navbar-button"
      >
        Add New Pup
      </button>
      <button
        onClick={() => navigate("/puppy-portal/view")}
        className="navbar-button"
      >
        View Your Pups
      </button>
      </div>
    </>
  );
}
