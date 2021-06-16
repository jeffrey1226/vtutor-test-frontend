import React, { useState, useEffect } from 'react';
import {
  LinearProgress,
  IconButton,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from '../lib/axios';
import UserForm from '../components/UserForm';
import ConfirmModal from '../components/ConfirmModal';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 50,
    width: '90%',
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 16
  },
  table: {
    minWidth: 650,
  },
}));

const Users = () => {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, selectUser] = useState(null);
  const [openUserForm, setOpenUserForm] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const downloadUsers = async () => {
    setLoading(true);
    let URL = `/${process.env.REACT_APP_STAGE}/user`;
    try {
      const response = await axios.get(URL);
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    downloadUsers();
  }, []);

  const onAddData = () => {
    selectUser(null);
    setOpenUserForm(true);
  };

  const onUserDetail = (user) => {
    selectUser(user);
    setOpenUserForm(true);
  }

  const onConfirmDeleteUser = (user) => {
    selectUser(user);
    setOpenDeleteModal(true);
  };

  const handleCloseAllModal = () => {
    setOpenUserForm(false);
    setOpenDeleteModal(false);
    selectUser(null);
  };

  const onCloseUserForm = async (result) => {
    handleCloseAllModal();
    if (result) {
      await downloadUsers();
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    let URL = `/${process.env.REACT_APP_STAGE}/user/${selectedUser.id}`;
    try {
      const response = await axios.delete(URL);
      if (response.status === 200) {
        await downloadUsers();
      }
    } catch (err) {
      console.error(err);
    }
    handleCloseAllModal();
    setLoading(false);
  };

  const handleLoading = (loading) => {
    setLoading(loading);
  }

  const getDateDifference = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    const diffMin = Math.floor(diff / 60);
    if (diffMin < 60) {
      return `Created ${diffMin < 0 ? 0 : diffMin} minutes ago`;
    }
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 60) {
      return `Created ${diffHour} hours ago`;
    }
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) {
      return `Created ${diffDay} days ago`;
    }
    const diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) {
      return `Created ${diffMonth} months ago`;
    }
    const diffYear = Math.floor(diffMonth / 12);
    return `Created ${diffYear} years ago`;
  }

  return (
    <div>
      {isLoading && <LinearProgress />}
      <div className={classes.container}>
        <Box
          className={classes.top}
        >
          <Button
            color="primary"
            variant="contained"
            endIcon={<AddIcon />}
            onClick={onAddData}
          >
            Add
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username/Email</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    {user.username}
                    <br />
                    {user.email}
                  </TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{getDateDifference(user.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => onUserDetail(user)}
                    >
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => onConfirmDeleteUser(user)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <UserForm
        user={selectedUser}
        open={openUserForm}
        onLoading={handleLoading}
        onClose={onCloseUserForm}
      />
      <ConfirmModal
        open={openDeleteModal}
        confirmMessage={
          selectedUser
            ? `Are you sure you want to delete the user - ${selectedUser.username}?`
            : ''
        }
        onConfirm={handleDeleteUser}
        onClose={handleCloseAllModal}
      />
    </div>
  );
}

export default Users;
