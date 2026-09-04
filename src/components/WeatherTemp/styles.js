import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  card: {
    marginBottom: '18px',
    borderRadius: '12px',
  },

  content: {
    padding: '16px !important',
  },

  main: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },

  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& .weather-icon': {
      fontSize: '38px',
    },
  },

  temperature: {
    fontWeight: 600,
  },

  details: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '10px',
  },
}));
