import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  container: {
    padding: '16px 18px',
  },

  formControl: {
    margin: theme.spacing(1, 0, 2),
    minWidth: 140,
  },

  loading: {
    height: '420px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  list: {
    height: 'calc(100vh - 390px)',
    minHeight: '350px',
    overflowY: 'auto',
    marginTop: '10px',
    paddingRight: '6px',
  },
}));
