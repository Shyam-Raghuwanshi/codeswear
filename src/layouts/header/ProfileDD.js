import React, { useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import userimg from "../../../assets/images/users/user2.jpg";
import jsonwebtoken from 'jsonwebtoken'
import { useRouter } from 'next/router'
import {
  Box,
  Menu,
  Typography,
  Link,
  ListItemButton,
  List,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
const ProfileDD = () => {
  const router = useRouter()
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const [username, setUsername] = React.useState('')
  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };
  useEffect(() => {
    setName()
  }, [])

  const setName = () => {
    const token = localStorage.getItem("token")
    if (token) {
      try{
      const userNameFromToken = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
      setUsername(userNameFromToken.name)
      }
      catch{
        router.push("/")
      }
    }
  }

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const userEmailFromToken = jsonwebtoken.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY)
      const body = { email: userEmailFromToken.email, mode: false }
      await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateSellerMode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      router.push('/')
    }
  }

  return (
    <>
      <Button
        aria-label="menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick4}
      >
        <Box display="flex" alignItems="center">
          <Image
            src={userimg}
            alt={userimg}
            width="30"
            height="30"
            className="roundedCircle"
          />
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
            }}
          >
            <Typography
              color="textSecondary"
              variant="h5"
              fontWeight="400"
              sx={{ ml: 1 }}
            >
              Hi,
            </Typography>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                ml: 1,
              }}
            >
              {username}
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
          "& .MuiMenu-paper": {
            width: "385px",
          },
        }}
      >
        <Box>
          <Box p={2} pt={0}>
            <List
              component="nav"
              aria-label="secondary mailbox folder"
              onClick={handleClose4}
            >
              <ListItemButton>
                <ListItemText primary="Edit Profile" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Account" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Change Password" />
              </ListItemButton>
            </List>
          </Box>
          <Divider />
          <Box p={2}>
            <Link to="/">
              <div onClick={handleLogout} className="font-extrabold cursor-pointer text-center" variant="contained" color="primary">
                Logout from Admin
              </div>
            </Link>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileDD;
