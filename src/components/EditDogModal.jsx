import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

export default function EditDogModal({ dog, onClose, onSave }) {
  const [editedDog, setEditedDog] = useState(dog);

  // Update state when the dog prop changes
  useEffect(() => {
    setEditedDog(dog);
  }, [dog]);

  const handleInputChange = (e) => {
    setEditedDog({ ...editedDog, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(dog.id, editedDog);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Dog</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="dog_name"
          label="Dog Name"
          type="text"
          fullWidth
          value={editedDog.dog_name}
          onChange={handleInputChange}
        />

        <TextField
          margin="dense"
          name="dog_breed"
          label="Dog Breed"
          type="text"
          fullwidth
          value={editedDog.dog_breed}
          onChange={handleInputChange}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="ideal-weight-label">Ideal Weight</InputLabel>
          <Select
            labelId="ideal-weight-label"
            name="ideal_weight"
            value={editedDog.ideal_weight}
            label="Ideal Weight"
            onChange={handleInputChange}
          >
            {Array.from({ length: 500 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel id="activity-level-label">Activity Level</InputLabel>
          <Select
            labelId="activity-level-label"
            name="activity_level"
            value={editedDog.activity_level}
            label="Activity Level"
            onChange={handleInputChange}
          >
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Somewhat Active">Somewhat Active</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Very Active">Very Active</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel id="neutered-label">Fixed</InputLabel>
          <Select
            labelId="neutered-label"
            name="neutered"
            value={editedDog.neutered ? "true" : "false"}
            label="Neutered"
            onChange={(e) => {
              setEditedDog({ ...editedDog, neutered: e.target.value === "true" });
            }}
          >
            <MenuItem value='true'>Yes</MenuItem>
            <MenuItem value='false'>No</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          name="allergies"
          label="Allergies"
          type="text"
          fullwidth
          value={editedDog.allergies}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
