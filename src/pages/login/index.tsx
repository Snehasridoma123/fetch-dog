import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Text,
  Divider,
  Link,
  Avatar,
  useToast,
  Center,
  Heading,
} from "@chakra-ui/react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigator = useNavigate();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
          credentials: "include",
        }
      );

      if (response.ok) {
        toast({
          title: "Login successful",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigator("/");
      } else {
        const errorData = await response.json();
        toast({
          title: "Login failed",
          description: "Not able to login pelase try again",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Not able to login pelase try again",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Center>
        <Box>
          <Heading size={"xl"} color={"blueviolet"}>
            Here at Fetch, we love dogs, and we hope you do too! Our mission is
            to connect dog lovers with their perfect canine companions.
          </Heading>
        </Box>
      </Center>
      <Flex h="100vh" align="center" justify="center">
        <Box bg="white" p={8} rounded="lg" shadow="lg" w="full" maxW="md">
          <Stack spacing={4}>
            <Text fontSize="2xl" textAlign="center">
              LOGIN
            </Text>
            <Text fontSize="md" textAlign="center">
              Log in to access our wide range of features designed to help you
              find, care for, and enjoy time with your furry friends.
            </Text>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="purple" size="lg" onClick={handleLogin}>
              Login Now
            </Button>
            <Divider />
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;
