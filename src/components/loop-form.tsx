import { makeStyles, TextField, Typography, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState } from 'react';
import { successMsg } from '../util/alerts';

interface LoopFormProps {
  fleets: string[];
  requestLoop(
    fleetName: string,
    numLoops: number,
    startLocationPoint: string,
    endLocationPoint: string,
  ): void;
  listOfPlaces: string[];
}

export const LoopForm = (props: LoopFormProps) => {
  const { requestLoop, fleets, listOfPlaces } = props;
  const classes = useStyles();

  const [targetFleetName, setTargetFleetName] = useState(fleets.length >= 1 ? fleets[0] : '');
  const [numLoops, setNumLoops] = useState(0);
  const [startLocation, setStartLocation] = useState(
    listOfPlaces.length >= 2 ? listOfPlaces[0] : '',
  );
  const [finishLocation, setFinishLocation] = useState(
    listOfPlaces.length >= 2 ? listOfPlaces[1] : '',
  );

  // Error states
  const [targetFleetNameError, setTargetFleetNameError] = useState('');
  const [numLoopsError, setNumLoopsError] = useState('');
  const [startLocationError, setStartLocationError] = useState('');
  const [finishLocationError, setFinishLocationError] = useState('');

  const cleanUpForm = () => {
    setTargetFleetName('');
    setNumLoops(0);
    setStartLocation(listOfPlaces.length >= 2 ? listOfPlaces[0] : '');
    setFinishLocation(listOfPlaces.length >= 2 ? listOfPlaces[1] : '');
    cleanUpError();
  };

  const cleanUpError = () => {
    setTargetFleetNameError('');
    setNumLoopsError('');
    setStartLocationError('');
    setFinishLocationError('');
  };

  const handleRequestLoop = (event: any) => {
    event.preventDefault();
    if (isFormValid()) {
      requestLoop(targetFleetName, numLoops, startLocation, finishLocation);
      successMsg('Success');
      cleanUpForm();
    }
  };

  const isFormValid = () => {
    let isValid = true;
    cleanUpError();
    if (targetFleetName === '') {
      setTargetFleetNameError('Fleet name cannot be empty');
      isValid = false;
    }
    if (numLoops === 0 || numLoops < 0) {
      setNumLoopsError('Loops can only be > 0');
      isValid = false;
    }
    if (startLocation === finishLocation) {
      setStartLocationError('Start Location cannot be equal to finish Location');
      setFinishLocationError('Start Location cannot be equal to finish Location');
      isValid = false;
    }

    if (!startLocation) {
      setStartLocationError('Location cannot be empty');
      isValid = false;
    }
    if (!finishLocation) {
      setFinishLocationError('Location cannot be empty');
      isValid = false;
    }

    return isValid;
  };

  return (
    <form className={classes.form} onSubmit={handleRequestLoop}>
      <Typography variant="h6" className={classes.title}>
        Loop Requests
      </Typography>
      <div className={classes.divForm}>
        <Autocomplete
          getOptionLabel={option => option}
          onChange={(e, value) => setTargetFleetName(value || '')}
          options={fleets}
          renderInput={params => (
            <TextField {...params} label="Choose Target Fleet" variant="outlined" />
          )}
          value={!!targetFleetName ? targetFleetName : null}
        />
        {targetFleetNameError && (
          <p id="targetFleetNameError" className={classes.error}>
            {targetFleetNameError}
          </p>
        )}
      </div>
      <div className={classes.divForm}>
        <TextField
          name="numLoops"
          onChange={e => {
            setNumLoops(!!e.target.value ? parseInt(e.target.value) : 0);
          }}
          placeholder="Number of loops"
          type="number"
          value={numLoops || ''}
          className={classes.input}
          label="Number of loops"
          variant="outlined"
          error={!!numLoopsError}
        />
        {numLoopsError && (
          <p id="numLoopsError" className={classes.error}>
            {numLoopsError}
          </p>
        )}
      </div>

      <div className={classes.divForm}>
        <Autocomplete
          getOptionLabel={option => option}
          onChange={(e, value) => setStartLocation(value || '')}
          options={listOfPlaces}
          renderInput={params => (
            <TextField {...params} label="Pick Start Location" variant="outlined" />
          )}
          value={!!startLocation ? startLocation : null}
        />
        {startLocationError && (
          <p id="startLocationError" className={classes.error}>
            {startLocationError}
          </p>
        )}
      </div>

      <div className={classes.divForm}>
        <Autocomplete
          getOptionLabel={option => option}
          onChange={(e, value) => setFinishLocation(value || '')}
          options={listOfPlaces}
          renderInput={params => (
            <TextField {...params} label="Pick Finish Location" variant="outlined" />
          )}
          value={!!finishLocation ? finishLocation : null}
        />
        {finishLocationError && (
          <p id="finishLocationError" className={classes.error}>
            {finishLocationError}
          </p>
        )}
      </div>

      <div className={classes.buttonContainer}>
        <Button variant="contained" color="primary" type="submit" className={classes.button}>
          {'Request'}
        </Button>
      </div>
    </form>
  );
};

const useStyles = makeStyles(theme => ({
  form: {
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    margin: 'auto',
    padding: '0.5rem',
  },
  divForm: {
    padding: '0.5rem',
    width: '95%',
    margin: 'auto',
  },
  error: {
    color: theme.palette.error.main,
  },
  input: {
    width: '100%',
  },
  button: {
    width: '95%',
  },
  buttonContainer: {
    paddingTop: '0.5rem',
    paddingLeft: '0.5rem',
    width: '100%',
  },
}));
