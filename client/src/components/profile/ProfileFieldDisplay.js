import TextField from '@mui/material/TextField'

const ProfileFieldDisplay = (props) => {
  return <TextField
            focused 
            color="warning" 
            sx={{ width: '60%' }}
            error={props.error} 
            helperText={props.helperText}
            name={props.name}
            label={props.label} 
            value={props.value} 
            onChange={props.onChange}
            inputProps={{ 
              type: props.type,
              style: {color: 'white'}, 
              disabled: props.disableInput}}  />
}

export default ProfileFieldDisplay;