import React from "react";
import {
  Box,
  Stack,
  Checkbox,
  CheckboxGroup,
  Input,
  NumberInput,
  NumberInputField,
  Select,
} from "@chakra-ui/react";

const FilterPanel = ({
  breeds,
  selectedBreeds,
  setSelectedBreeds,
  zipCodes,
  setZipCodes,
  ageMin,
  setAgeMin,
  ageMax,
  setAgeMax,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  size,
  setSize,
}) => {
  return (
    <Box
      w={{ base: "100%", md: "20%" }}
      p={5}
      bg="gray.100"
      borderRadius="md"
      shadow="md"
    >
      <Stack spacing={4} mb={5}>
        <CheckboxGroup
          colorScheme="green"
          value={selectedBreeds}
          onChange={(value) => setSelectedBreeds(value)}
        >
          {breeds &&
            breeds.map((breed) => (
              <Checkbox key={breed} value={breed}>
                {breed}
              </Checkbox>
            ))}
        </CheckboxGroup>
        <Input
          placeholder="Enter zip codes"
          value={zipCodes}
          onChange={(e) => setZipCodes(e.target.value.split(","))}
        />
        <NumberInput
          placeholder="Min Age"
          value={ageMin}
          onChange={(valueString) => setAgeMin(valueString)}
        >
          <NumberInputField />
        </NumberInput>
        <NumberInput
          placeholder="Max Age"
          value={ageMax}
          onChange={(valueString) => setAgeMax(valueString)}
        >
          <NumberInputField />
        </NumberInput>
        <Select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="breed">Sort by Breed</option>
          <option value="name">Sort by Name</option>
          <option value="age">Sort by Age</option>
        </Select>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Sort Ascending</option>
          <option value="desc">Sort Descending</option>
        </Select>
        <NumberInput
          value={size}
          onChange={(valueString) => setSize(valueString)}
        >
          <NumberInputField />
        </NumberInput>
      </Stack>
    </Box>
  );
};

export default FilterPanel;
