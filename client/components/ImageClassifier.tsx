import React, { ChangeEvent, FC, useState } from "react";
import { Grid, Card, CardContent, CardHeader, Button, CircularProgress, Box } from '@mui/material';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { withSnackbar } from 'notistack';
import { EnqueueSnackbar } from "../utils/Types";
import { sendAPIRequest } from '../utils/Helpers';
import { HttpMethod, HttpStatus } from '../utils/Types';

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      minWidth: "100%"
    }
  })
);

interface Props {
  readonly enqueueSnackbar: EnqueueSnackbar;
}

const ImageClassifier: FC<Props> = (props: Props): JSX.Element => {  
  const classes = useStyles();
  const { enqueueSnackbar } = props;
  const [file, setFile] = useState<File>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [classificationResult, setClassificationResult] = useState<string>();

  const uploadImage = () => {
    const form = new FormData();
    form.append('image', file);
    const headers = { 'Content-Type': "multipart/form-data" };
    setIsUploading(true);
    sendAPIRequest<string>('/api/vision', HttpMethod.POST, HttpStatus.OK, headers, form)
      .then(data => setClassificationResult(data))
      .catch(error => enqueueSnackbar(error.toString(), { variant: 'error' }))
      .finally(() => setIsUploading(false));
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files[0])  
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        title={"Image classifier"}
        subheader="Using Tensorflow's pretrained DenseNet-121 model."
      />
      <CardContent>
        <Grid container alignItems="center" justifyContent="center" spacing={3}>
          <Grid item xs>          
            <label htmlFor="image-classifier-upload-photo">
              <input
                id="image-classifier-upload-photo"
                name="image-classifier-upload-photo"
                type="file"
                accept="image/png, image/jpeg"
                onChange={onFileChange}
              />
            </label>
          </Grid>
          <Grid item xs>
            <Button 
              variant="contained" 
              endIcon={isUploading ? <CircularProgress size={14} /> : <UploadFileIcon />} 
              onClick={uploadImage} 
              disabled={!file || isUploading}
            >
            Upload
            </Button>
          </Grid>
          <Grid item xs>
            <Box component="div" sx={{ whiteSpace: 'normal', overflow: 'auto' }}>
              { JSON.stringify(classificationResult) }
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
  
export default withSnackbar(ImageClassifier);