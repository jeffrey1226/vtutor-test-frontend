import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  FormHelperText,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { UserRole } from '../constants';
import axios from '../lib/axios';

const UserForm = (props) => {
  const { user, open, onLoading, onClose } = props;

  const [updated, setUpdated] = useState(false);

  const handleChangeRole = async (e) => {
    if (user) {
      await updateUser({ role: e.target.value });
    }
  };

  const createUser = async (values) => {
    onLoading(true)

    let URL = `/${process.env.REACT_APP_STAGE}/user`;
    let response = null;
    try {
      response = await axios.post(URL, values);
    } catch (err) {
      response = { status: 500, message: 'Something went wrong' };
      if (err.response && err.response.data && err.response.data.error) {
        response = err.response.data.error;
      }
    }

    onLoading(false);
    return response;
  };

  const updateUser = async (values) => {
    onLoading(true);

    let URL = `/${process.env.REACT_APP_STAGE}/user/${user.id}`;
    let response = null;
    try {
      response = await axios.put(URL, values);
      setUpdated(true);
    } catch (err) {
      response = { status: 500, message: 'Something went wrong' };
      if (err.response && err.response.data && err.response.data.error) {
        response = err.response.data.error;
      }
    }
    onLoading(false);

    return response;
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
    >
      <Box
        style={{
          alignItems: 'center',
          display: 'flex',
          padding: 16,
        }}
      >
        <Typography
          color="textPrimary"
          variant="h5"
        >
          {`${user ? 'Modify' : 'Create'} User`}
        </Typography>
        <Box style={{ flexGrow: 1 }} />
        <IconButton onClick={() => onClose(updated)}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box style={{ padding: 16 }}>
        <Formik
          enableReinitialize
          initialValues={{
            id: user?.id || '',
            username: user?.username || '',
            full_name: user?.full_name || '',
            email: user?.email || '',
            password: user?.password || '',
            role: user?.role || UserRole.STUDENT,
            submit: null
          }}
          validationSchema={
            Yup
              .object()
              .shape({
                username: Yup
                  .string()
                  .max(255)
                  .required('Username is required'),
                full_name: Yup
                  .string()
                  .max(255)
                  .required('Full name is required'),
                email: Yup
                  .string()
                  .email('Must be a valid email')
                  .max(255)
                  .required('Email is required'),
                password: Yup
                  .string()
                  .max(255)
                  .required('Password is required'),
              })
          }
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            delete values.submit;

            let response;
            if (user) {
              response = await updateUser(values);
            } else {
              response = await createUser(values);
            }
            setSubmitting(false);
            if (response.status === 200) {
              resetForm();
              setStatus({ success: true });
              onClose(true);
            } else {
              setStatus({ success: false });
              setErrors({ submit: response.message || 'Something went wrong' });
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <Box style={{ marginTop: 12 }}>
                <FormControl
                  fullWidth
                  variant="standard"
                >
                  <InputLabel>Select User Role</InputLabel>
                  <Select
                    error={Boolean(touched.role && errors.role)}
                    defaultValue={values.role}
                    name="role"
                    onChange={(e) => {
                      handleChange(e);
                      handleChangeRole(e);
                    }}
                  >
                    {
                      Object.entries(UserRole).map((role) => (
                        <MenuItem
                          key={role[0]}
                          value={role[0]}
                        >
                          {role[0]}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Box>
              <Box style={{ marginTop: 12 }}>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Username"
                  name="username"
                  required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  defaultValue={values.username}
                  variant="standard"
                  disabled={user && true}
                />
              </Box>
              <Box style={{ marginTop: 12 }}>
                <TextField
                  error={Boolean(touched.full_name && errors.full_name)}
                  fullWidth
                  helperText={touched.full_name && errors.full_name}
                  label="Full Name"
                  name="full_name"
                  required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  defaultValue={values.full_name}
                  variant="standard"
                />
              </Box>
              <Box style={{ marginTop: 12 }}>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  type="email"
                  defaultValue={values.email}
                  variant="standard"
                />
              </Box>
              <Box style={{ marginTop: 12 }}>
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  name="password"
                  required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  defaultValue={values.password}
                  variant="standard"
                />
              </Box>
              {errors.submit && (
                <Box style={{ marginTop: 12 }}>
                  <FormHelperText error>
                    {errors.submit}
                  </FormHelperText>
                </Box>
              )}
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: 12
                }}
              >
                <Button
                  color="primary"
                  disabled={isSubmitting || (!values.username || !values.full_name || !values.email || !values.password)}
                  type="submit"
                  variant="contained"
                >
                  Save
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Dialog>
  );
}

export default UserForm;
