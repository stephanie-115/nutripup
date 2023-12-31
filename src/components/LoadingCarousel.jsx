import { Typography } from "@mui/material";
import React from "react";
import Slider from "react-slick";

export default function LoadingCarousel({ isCreatingRecipe }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <div>
      {isCreatingRecipe && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Typography
            variant="h4"
            style={{
              textAlign: "center",
              marginTop: "200px",
              color: "#f4e9cd",
            }}
          >
            Please wait while our canine chefs fetch your recipe!
          </Typography>
          <Slider {...settings}>
            <div>
              <img
                src="https://hips.hearstapps.com/delish/assets/cm/15/10/54f95e062c846_-_dog-chefs-hat-6.jpg"
                alt="Dog Chef 1"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://t3.ftcdn.net/jpg/05/76/48/96/360_F_576489682_tEqAv3EeFkEnRl6n24uVT0S3Ah5AmkMW.jpg"
                alt="Dog Chef 2"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://i5.walmartimages.com/seo/Pet-Krewe-Top-Chef-Uniform-Dog-Costume-Fits-Dogs-Size-Small-Dogs_18f1a6e6-3dac-4e4b-b9ce-c17d340c2bd5.0eb7971f9674e543b6bc07a12a56ab76.jpeg"
                alt="Dog Chef 3"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://img.freepik.com/premium-photo/70s-style-puppy-dog-dressed-chef-s-outfit_739548-5292.jpg"
                alt="Dog Chef 4"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://i.etsystatic.com/17669446/r/il/1496df/4026726658/il_fullxfull.4026726658_tqsi.jpg"
                alt="Dog Chef 5"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://www.simplemost.com/wp-content/uploads/2023/05/AdobeStock_566695078-e1684503314689.jpeg"
                alt="Dog Chef 6"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://www.dogster.com/wp-content/uploads/2023/02/GettyImages-1368293491-scaled.jpg"
                alt="Dog Chef 7"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://i.pinimg.com/originals/58/3e/7c/583e7c79bcd1d737f169f76c37bccb87.jpg"
                alt="Dog Chef 8"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://i.ytimg.com/vi/dvy-fqyYSqU/maxresdefault.jpg"
                alt="Dog Chef 9"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://cdn.shopify.com/s/files/1/0593/5408/7620/files/dachshund-steak-grilling.jpg"
                alt="Dog Chef 10"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://image.petmd.com/files/styles/978x550/public/homemade-dog-food.jpg"
                alt="Dog Chef 11"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://www.rover.com/blog/wp-content/uploads/2017/08/time-to-make-the-woofles.jpg"
                alt="Dog Chef 12"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://i1.wp.com/res.cloudinary.com/kohepets/image/upload/v1527318782/Chef-Dog-Cooking_kj6dai.jpg?fit=512%2C384&ssl=1"
                alt="Dog Chef 13"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://steamuserimages-a.akamaihd.net/ugc/947339560632715025/E3B0B95BB0FD7CE14B45CCBA9839482FDE46925B/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false"
                alt="Dog Chef 14"
                className="pup-image"
              />
            </div>
            <div>
              <img
                src="https://i.redd.it/0aupufs2epl11.jpg"
                alt="Dog Chef 15"
                className="pup-image"
              />
            </div>
          </Slider>
        </div>
      )}
    </div>
  );
}
