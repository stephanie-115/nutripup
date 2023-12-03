import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const CustomQuestion = styled(Typography)({
  color: "#468189",
  fontFamily: "Segoe UI, Tahoma, Geneva, Verdana",
});

const CustomAnswer = styled(Typography)({
  color: "#9dbebb",
  backgroundColor: "#9dbebb",
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
  backgroundColor: "var(--color-tertiary)",
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  borderRadius: "15px !important",
}));

export default function Contact() {
  const [expanded, setExpanded] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    fetch(`http://localhost:8080/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div>
      <h2>Contact Us:</h2>
      <p>
        Have queries, suggestions, or just want to send some puppy love our way?
        We’re all ears (just like your pup) for anything you have to say.
      </p>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <CustomQuestion>Contact Us Here!</CustomQuestion>
        </AccordionSummary>
        <AccordionDetails>
          <CustomAnswer>
            <form
              className="contact-us-form"
              id="contactUsForm"
              onSubmit={handleSubmit}
            >
              <div className="input-row">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email"
                  required
                />
              </div>
              <textarea
                id="message"
                name="message"
                placeholder="Your message"
                required
              ></textarea>
              <button type="submit">Send</button>
            </form>
          </CustomAnswer>
        </AccordionDetails>
      </Accordion>
      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">
          {"Message Sent Successfully!"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleModalClose}
            style={{ color: "var(--color-dark)" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
