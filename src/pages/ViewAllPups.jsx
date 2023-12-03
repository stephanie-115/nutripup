import React, { useState, useEffect } from "react";
import IntroDogCard from "../components/IntroDogCard";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function ViewAllPups() {
  const [dogs, setDogs] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchDogs = async () => {
    try {
      const response = await fetch("/user/all-dogs", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      const data = await response.json();
      setDogs(data.dogs);
    } catch (error) {
      console.error("Error fetching dog data:", error);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const handleDelete = async (dogId) => {
    try {
      const response = await fetch(`/dog/delete/${dogId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      // Refresh the dogs list after deletion
      fetchDogs();
      setOpen(true);
    } catch (error) {
      console.error("Error deleting dog:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  return (
    <div>
      <h1>Puppy Portal</h1>
      <div className="dogs-intro-container">
        {dogs.length > 0 ? (
          dogs.map((dog) => (
            <IntroDogCard key={dog.id} dog={dog} onDelete={handleDelete} />
          ))
        ) : (
          <p>You don't have any pups yet! 🥺</p>
        )}
      </div>

      {/* Success Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">
          {"Dog Deleted Successfully!"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: 'var(--color-dark)' }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
