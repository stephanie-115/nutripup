import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Carousel.css";

export default function PuppyPortal() {
  console.log("rendering...");
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1615751072497-5f5169febe17?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGRvZ3xlbnwwfHwwfHx8MA%3D%3D",
    "https://www.onegreenplanet.org/wp-content/uploads/2016/08/bulldog.jpg",
    "https://worldanimalfoundation.org/wp-content/uploads/2023/09/cutest-dog-breed-1024x662.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/small-dogs-pug-1563779089.jpg",
    "https://images.wsj.net/im-390524/portrait?pixel_ratio=2",
    "https://hips.hearstapps.com/hmg-prod/images/cutest-dog-breeds-retrievers-64356ac6e2242.jpg?crop=1.00xw:0.835xh;0,0.109xh&resize=980:*", 'https://dogsbestlife.com/wp-content/uploads/2022/06/cutest-dog-breeds-scaled-e1655990275393.jpeg', 'https://cdn.akc.org/content/article-body-image/cavkingcharlessmalldogs.jpg', 'https://ghk.h-cdn.co/assets/16/08/2560x3840/gettyimages-464163411.jpg', 'https://cdn.i-scmp.com/sites/default/files/d8/images/canvas/2022/04/11/05ce33c1-0fbe-45de-a94f-ae93a078755c_955c6d52.jpg', 'https://www.owu.edu/files/pages/sm_puppy-dog.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
    console.log("After updating currentImage:", currentImage);
  }, [images]);

  return (
    <>
      <div className="puppy-container">
        <div className="carousel-container">
          <div className="carousel">
            <div className="image-container">
              {" "}
              {/* Add this */}
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Puppy${index + 1}`}
                  className={`pup-image ${
                    index === currentImage ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}
