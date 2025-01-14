import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import {
  collection, getFirestore, query, limit, onSnapshot
} from 'firebase/firestore';
import {
  AppBar, Badge, Box, IconButton, Toolbar, Menu, Typography, Button, Drawer, Divider
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { setUser } from 'src/actions/user';
import { isChecked } from 'src/helpers';
import { orderBy as _orderBy } from 'lodash';
import LogoIcon from '../logo/LogoIcon';
import CartDropdown from './CartDropdown';
import MessageDropdown from './MessageDropdown';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import CustomTextField from '../../../components/forms/custom-elements/CustomTextField';
import UserAvatar from '../user/UserAvatar';

const Header = ({
  sx, customClass, toggleSidebar, toggleMobileSidebar
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let unsubscribe = null;
    if (user && user.id) {
      const db = getFirestore();
      const q = query(collection(db, `user/notification/${user.id}`), limit(100));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const sortedData = _orderBy(data, 'sndDate', 'desc');
        setNotifications(sortedData);
      });
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const unReadTotal = notifications.filter((item) => !isChecked(item.readFlag)).length;

  const logout = () => {
    dispatch(setUser(null));
    localStorage.removeItem('user');
    navigate('/login');
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // 2
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // 4
  const [anchorEl4, setAnchorEl4] = React.useState(null);

  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  // drawer
  const [showDrawer, setShowDrawer] = useState(false);

  const handleDrawerClose = () => {
    setShowDrawer(false);
  };

  // drawer top
  const [showDrawer2, setShowDrawer2] = useState(false);

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };

  return (
    <AppBar sx={sx} elevation={0} className={customClass}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          size="large"
          sx={{
            display: {
              lg: 'flex',
              xs: 'none',
            },
          }}
        >
          <FeatherIcon icon="menu" />
        </IconButton>

        <IconButton
          size="large"
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'flex',
            },
          }}
        >
          <FeatherIcon icon="menu" width="20" height="20" />
        </IconButton>
        <Box sx={{ ml: 1, mt: 1, display: { xs: 'inline-flex', lg: 'none' } }}>
          <LogoIcon sx={{ width: '70px' }} />
        </Box>
        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        {/* <IconButton
          aria-label="show 4 new mails"
          color="inherit"
          aria-controls="search-menu"
          aria-haspopup="true"
          onClick={() => setShowDrawer2(true)}
          size="large"
        >
          <FeatherIcon icon="search" width="20" height="20" />
        </IconButton> */}
        <Drawer
          anchor="top"
          open={showDrawer2}
          onClose={() => setShowDrawer2(false)}
          sx={{
            '& .MuiDrawer-paper': {
              padding: '15px 30px',
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <CustomTextField
              id="tb-search"
              size="small"
              placeholder="Search here"
              fullWidth
              inputProps={{ 'aria-label': 'Search here' }}
            />
            <Box
              sx={{
                ml: 'auto',
              }}
            >
              <IconButton
                color="inherit"
                sx={{
                  color: (theme) => theme.palette.grey.A200,
                }}
                onClick={handleDrawerClose2}
              >
                <FeatherIcon icon="x-circle" />
              </IconButton>
            </Box>
          </Box>
        </Drawer>
        {/* ------------ End Menu icon ------------- */}

        <Box flexGrow={1} />
        {/* ------------------------------------------- */}
        {/* Ecommerce Dropdown */}
        {/* ------------------------------------------- */}
        {/* <IconButton size="large" color="inherit" onClick={() => setShowDrawer(true)}>
          <FeatherIcon icon="shopping-cart" width="20" height="20" />
        </IconButton> */}
        {/* <Drawer
          anchor="right"
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: {
                xs: '100%',
                sm: '395px',
              },
              padding: '30px',
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h4" fontWeight="500">
              Shopping Cart
            </Typography>
            <Box
              sx={{
                ml: 'auto',
              }}
            >
              <IconButton
                color="inherit"
                sx={{
                  color: (theme) => theme.palette.grey.A200,
                }}
                onClick={handleDrawerClose}
              >
                <FeatherIcon icon="x-circle" />
              </IconButton>
            </Box>
          </Box>
          component
          <CartDropdown />
        </Drawer> */}
        {/* ------------------------------------------- */}
        {/* End Ecommerce Dropdown */}
        {/* ------------------------------------------- */}
        {/* ------------------------------------------- */}
        {/* Messages Dropdown */}
        {/* ------------------------------------------- */}
        {/* <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          onClick={handleClick2}
        >
          <Badge variant="dot" color="primary">
            <FeatherIcon icon="message-square" width="20" height="20" />
          </Badge>
        </IconButton> */}
        {/* <Menu
          id="msgs-menu"
          anchorEl={anchorEl2}
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          sx={{
            '& .MuiMenu-paper': {
              width: '385px',
              right: 0,
              top: '70px !important',
            },
            '& .MuiList-padding': {
              p: '30px',
            },
          }}
        >
          <Box
            sx={{
              mb: 1,
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h4" fontWeight="500">
                Messages
              </Typography>
              <Box
                sx={{
                  ml: 2,
                }}
              >
                <Chip
                  size="small"
                  label="5 new"
                  sx={{
                    borderRadius: '6px',
                    pl: '5px',
                    pr: '5px',
                    backgroundColor: (theme) => theme.palette.secondary.main,
                    color: '#fff',
                  }}
                />
              </Box>
            </Box>
          </Box>
          <MessageDropdown />

          <Button
            sx={{
              mt: 2,
              display: 'block',
              width: '100%',
            }}
            variant="contained"
            color="primary"
            onClick={handleClose2}
          >
            <Link
              to="/email"
              style={{
                color: '#fff',
                width: '100%',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              See all messages
            </Link>
          </Button>
        </Menu> */}
        {/* ------------------------------------------- */}
        {/* End Messages Dropdown */}
        {/* ------------------------------------------- */}
        {/* ------------------------------------------- */}
        {/* Notifications Dropdown */}
        {/* ------------------------------------------- */}
        <IconButton
          size="large"
          aria-label="menu"
          color="inherit"
          aria-controls="notification-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Badge badgeContent={unReadTotal || 0} color="secondary">
            <FeatherIcon icon="bell" width="20" height="20" />
          </Badge>
        </IconButton>
        <Menu
          id="notification-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          sx={{
            '& .MuiMenu-paper': {
              width: '385px',
              maxHeight: '500px',
              overflowY: 'auto',
              overflowX: 'hidden',
              right: 0,
              top: '70px !important',
            },
            '& .MuiList-padding': {
              p: '18px !important',
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h4" fontWeight="500">
              Thông báo
            </Typography>
          </Box>
          <Divider sx={{ mt: 1 }} />
          <NotificationDropdown notifications={notifications} setNotifications={setNotifications} />
          {/* <Button
            sx={{
              mt: 2,
              display: 'block',
              width: '100%',
            }}
            variant="contained"
            color="primary"
            onClick={handleClose}
          >
            <Link
              to="/email"
              style={{
                color: '#fff',
                width: '100%',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              See all notifications
            </Link>
          </Button> */}
        </Menu>
        {/* ------------------------------------------- */}
        {/* End Notifications Dropdown */}
        {/* ------------------------------------------- */}

        <Box
          sx={{
            width: '1px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: '25px',
            ml: 1,
            mr: 1,
          }}
        />
        {/* ------------------------------------------- */}
        {/* Profile Dropdown */}
        {/* ------------------------------------------- */}
        <Button
          aria-label="menu"
          color="inherit"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleClick4}
        >
          <Box display="flex" alignItems="center">
            <UserAvatar user={user} />
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'flex',
                },
                alignItems: 'center',
              }}
            >
              <Typography color="textSecondary" variant="h5" fontWeight="400" sx={{ ml: 1 }}>
                Hi,
              </Typography>
              <Typography
                variant="h5"
                color="textSecondary"
                fontWeight="500"
                sx={{
                  ml: 1,
                }}
              >
                { user ? user.username : '' }
              </Typography>
              <FeatherIcon icon="chevron-down" width="20" height="20" />
            </Box>
          </Box>
        </Button>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl4}
          keepMounted
          open={Boolean(anchorEl4)}
          onClose={handleClose4}
          sx={{
            '& .MuiMenu-paper': {
              width: '385px',
              right: 0,
              top: '70px !important',
            },
            '& .MuiList-padding': {
              p: '30px',
            },
          }}
        >
          <Box
            sx={{
              mb: 1,
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h4" fontWeight="500">
                User Profile
              </Typography>
            </Box>
          </Box>

          <ProfileDropdown user={user} />
          <Link
            style={{
              textDecoration: 'none',
            }}
            to="/auth/login"
          >
            <Button
              sx={{
                mt: 2,
                display: 'block',
                width: '100%',
              }}
              variant="contained"
              color="primary"
              onClick={logout}
            >
              Logout
            </Button>
          </Link>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  customClass: PropTypes.string,
  toggleSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;
