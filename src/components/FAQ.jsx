import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const CustomQuestion = styled(Typography)({
  color: "#468189",
  fontFamily: "Segoe UI, Tahoma, Geneva, Verdana",
});

const CustomAnswer = styled(Typography)({
  color: "#f4e9cd",
  fontFamily: "Arial",
});

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid var(--color-light)`,
  borderRadius: "15px !important",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: "auto",
  },
  backgroundColor: "var(--color-light)",
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "var(--color-light)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  // borderRadius: '15px !important',
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  backgroundColor: "#468189",
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  borderRadius: "15px !important",
}));

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <h2>FAQs:</h2>
      <p>
        Got questions? We’ve got answers! Dive into our FAQ section to learn
        more about NutriPup, canine nutrition, and how to make the most of our
        app.
      </p>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <CustomQuestion>
            How does NutriPup determine my dog's nutritional needs?
          </CustomQuestion>
        </AccordionSummary>
        <AccordionDetails>
          <CustomAnswer>
            NutriPup uses a custom algorithm that takes into account your dog's
            weight, activity level, and health conditions. Based on your input,
            it calculates the ideal nutritional requirements for your dog.
          </CustomAnswer>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <CustomQuestion>
            Can NutriPup generate recipes for dogs with specific dietary
            restrictions?
          </CustomQuestion>
        </AccordionSummary>
        <AccordionDetails>
          <CustomAnswer>
            Yes, NutriPup can generate customized recipes using OpenAI's API,
            catering to specific dietary needs and restrictions your dog may
            have.
          </CustomAnswer>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <CustomQuestion>
            Is NutriPup suitable for all breeds and ages of dogs?
          </CustomQuestion>
        </AccordionSummary>
        <AccordionDetails>
          <CustomAnswer>
            NutriPup is designed to cater to the nutritional needs of dogs of
            all breeds and ages. However, we recommend consulting with your vet
            for puppies, senior dogs, or dogs with specific health issues.
          </CustomAnswer>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
