import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, Image, Text, Grid, GridItem, Stack, Checkbox, CheckboxGroup, useBreakpointValue, useToast, Input, NumberInput, NumberInputField, Select } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useInView } from 'react-intersection-observer';

const checkAuthentication = async () => {
  try {
    const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/search', {
      method: 'GET',
      credentials: 'include', // This ensures cookies are included with the request
    });

    if (response.ok) {
      return true; // User is authenticated
    } else {
      return false; // User is not authenticated
    }
  } catch (error) {
    return false; // Error occurred, assume not authenticated
  }
};

const fetcher = async (url) => {
  const response = await fetch(url, {
    credentials: 'include',
  });
  const data = await response.json();
  return data;
};

const fetchDogDetails = async (ids) => {
  const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(ids),
  });
  const dogs = await response.json();
  return dogs;
};

const ProductSearch = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const gridTemplateColumns = useBreakpointValue({ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' });
  const productGridTemplateColumns = useBreakpointValue({ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' });

  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [sortField, setSortField] = useState('breed');
  const [sortOrder, setSortOrder] = useState('asc');
  const [zipCodes, setZipCodes] = useState([]);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [size, setSize] = useState(25);
  const [from, setFrom] = useState(null);
  const [dogIds, setDogIds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  const { data: breeds } = useSWR('https://frontend-take-home-service.fetch.com/dogs/breeds', fetcher);

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 1.0,
  });

  const fetchDogs = async (fromCursor) => {
    const url = new URL('https://frontend-take-home-service.fetch.com/dogs/search');
    if (selectedBreeds.length) url.searchParams.append('breeds', selectedBreeds.join(','));
    if (zipCodes.length) url.searchParams.append('zipCodes', zipCodes.join(','));
    if (ageMin) url.searchParams.append('ageMin', ageMin);
    if (ageMax) url.searchParams.append('ageMax', ageMax);
    url.searchParams.append('size', size);
    if (fromCursor) url.searchParams.append('from', fromCursor);
    url.searchParams.append('sort', `${sortField}:${sortOrder}`);

    const data = await fetcher(url.toString());
    return data;
  };

  const loadMoreDogs = async () => {
    if (nextPageUrl) {
      const data = await fetchDogs(nextPageUrl);
      const moreDogDetails = await fetchDogDetails(data.resultIds);
      setDogIds((prev) => [...prev, ...data.resultIds]);
      setDogs((prev) => [...prev, ...moreDogDetails]);
      setNextPageUrl(data.next);
    }
  };

  useEffect(() => {
    if (inView) {
      loadMoreDogs();
    }
  }, [inView]);

  useEffect(() => {
    const authenticate = async () => {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        navigate('/login');
      }
    };
    authenticate();
  }, [navigate]);

  useEffect(() => {
    const fetchInitialDogs = async () => {
      const data = await fetchDogs(from);
      const initialDogDetails = await fetchDogDetails(data.resultIds);
      setDogIds(data.resultIds);
      setDogs(initialDogDetails);
      setNextPageUrl(data.next);
    };
    fetchInitialDogs();
  }, [selectedBreeds, sortField, sortOrder, zipCodes, ageMin, ageMax, size, from]);

  const handleLogout = async () => {
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: 'Logged out successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        toast({
          title: 'Logout failed',
          description: 'An error occurred while logging out',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (!dogs || !breeds) {
    return <div>Loading...</div>;
  }

  return (
    <Box minH="100vh" p={5} w={'100%'}>
      <Flex justify="flex-end" p={4} bg="white" shadow="md" w={'100%'}>
        <Button onClick={handleLogout} colorScheme="red">
          Logout
        </Button>
      </Flex>
      <Flex>
        <Box w={{ base: '100%', md: '20%' }} p={5} bg="gray.100" borderRadius="md" shadow="md">
          <Stack spacing={4} mb={5}>
            <CheckboxGroup colorScheme="green" value={selectedBreeds} onChange={(value) => setSelectedBreeds(value)}>
              {breeds && breeds.map((breed) => (
                <Checkbox key={breed} value={breed}>
                  {breed}
                </Checkbox>
              ))}
            </CheckboxGroup>
            <Input placeholder="Enter zip codes" value={zipCodes} onChange={(e) => setZipCodes(e.target.value.split(','))} />
            <NumberInput placeholder="Min Age" value={ageMin} onChange={(valueString) => setAgeMin(valueString)}>
              <NumberInputField />
            </NumberInput>
            <NumberInput placeholder="Max Age" value={ageMax} onChange={(valueString) => setAgeMax(valueString)}>
              <NumberInputField />
            </NumberInput>
            <Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
              <option value="breed">Sort by Breed</option>
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
            </Select>
            <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Sort Ascending</option>
              <option value="desc">Sort Descending</option>
            </Select>
            <NumberInput value={size} onChange={(valueString) => setSize(valueString)}>
              <NumberInputField />
            </NumberInput>
          </Stack>
        </Box>
        <Box flex={1} p={5}>
          <Grid templateColumns={productGridTemplateColumns} gap={6}>
            {dogs && dogs.map((dog, index) => (
              <GridItem
                key={dog.id}
                ref={dogs.length === index + 1 ? ref : null}
                bg="white"
                p={5}
                shadow="md"
                rounded="md"
              >
                <Image src={dog.img} alt={dog.name} />
                <Text mt={2} fontWeight="bold">{dog.name}</Text>
                <Text>Breed: {dog.breed}</Text>
                <Text>Age: {dog.age}</Text>
                <Text>Zip Code: {dog.zip_code}</Text>
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductSearch;
