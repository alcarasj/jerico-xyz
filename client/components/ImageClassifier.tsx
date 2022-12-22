import React, { ChangeEvent, FC, useState } from "react";
import { Grid, Card, CardContent, CardHeader, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { withSnackbar } from 'notistack';
import { EnqueueSnackbar } from "../utils/Types";
import { sendAPIRequest } from '../utils/Helpers';
import { HttpMethod, HttpStatus } from '../utils/Types';

interface Props {
  readonly enqueueSnackbar: EnqueueSnackbar;
}

const ImageClassifier: FC<Props> = (props: Props): JSX.Element => {  
  const { enqueueSnackbar } = props;
  const [file, setFile] = useState<File>(null);
  const [classificationResult, setClassificationResult] = useState<string>();

  const uploadImage = () => {
    const form = new FormData();
    form.append('image', file);
    const headers = { 'Content-Type': "multipart/form-data" };
    sendAPIRequest<string>('/api/vision', HttpMethod.POST, HttpStatus.OK, headers, form)
      .then(data => setClassificationResult(data))
      .catch(error => enqueueSnackbar(error.toString(), { variant: 'error' }));
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files[0])  
  };

  return (
    <Card>
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
            <Button variant="contained" endIcon={<UploadFileIcon />} onClick={uploadImage} disabled={!file}>
            Upload
            </Button>
          </Grid>
          <Grid item xs>
            { JSON.stringify(classificationResult) }
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
  
export default withSnackbar(ImageClassifier);